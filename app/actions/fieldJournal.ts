"use server";

import { supabaseServer } from "../lib/supabase";
import { getCurrentUserId } from "../lib/session";
import { getCurrentAdminId } from "../lib/adminSession";
import { recordHabitCompletion } from "./habits";
import { recordStateCheck } from "./stateChecks";
import type { TimeOfDayBucket } from "../lib/journalTypes";
import {
  XP_PER_LOG,
  ENDOWED_XP,
  STREAK_FREEZES,
  rankFor,
  severity,
  type Outcome,
} from "../lib/fieldJournalContent";

/** Coarse local time-of-day bucket from a 0–23 hour (privacy-preserving). */
function timeOfDayFromHour(h: number): TimeOfDayBucket {
  if (h < 5) return "late-night";
  if (h < 8) return "early-morning";
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  if (h < 21) return "evening";
  return "night";
}

/**
 * Field Journal data layer. XP, the forgiving streak, and severity are
 * computed here in TS (the app uses no DB triggers). Service-role only.
 * Backed by scripts/task-36-field-journal.sql.
 */

export type LogUrgeInput = {
  context: string;
  intensity: number;
  outcome: Outcome;
  localDate: string; // YYYY-MM-DD (user-local)
  localHour: number;
  localDow: number;
  detail?: string;
  haltState?: string;
  copingSkill?: string;
  note?: string;
};

export type LogUrgeResult =
  | {
      success: true;
      xpAwarded: number;
      totalXp: number;
      currentStreak: number;
      contextCount: number;
      severity: { flag: boolean; urgent: boolean };
    }
  | { success: false; error: string };

function daysBetween(fromIso: string, toIso: string): number {
  const a = Date.parse(fromIso + "T00:00:00Z");
  const b = Date.parse(toIso + "T00:00:00Z");
  if (isNaN(a) || isNaN(b)) return 99;
  return Math.round((b - a) / 86400000);
}

export async function logUrge(input: LogUrgeInput): Promise<LogUrgeResult> {
  const userId = await getCurrentUserId();
  if (!userId) return { success: false, error: "Not signed in." };

  try {
    const supabase = supabaseServer();

    // prior high-intensity count (for severity 'urgent')
    const { count: priorHigh } = await supabase
      .from("urge_logs")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("intensity", 9);

    const sev = severity(
      { intensity: input.intensity, outcome: input.outcome, detail: input.detail },
      priorHigh ?? 0
    );

    const { error: insErr } = await supabase.from("urge_logs").insert({
      user_id: userId,
      context: input.context,
      intensity: input.intensity,
      outcome: input.outcome,
      local_hour: input.localHour,
      local_dow: input.localDow,
      detail: input.detail || null,
      halt_state: input.haltState || null,
      coping_skill: input.copingSkill || null,
      note: input.note || null,
      severity_flag: sev.flag,
      needs_review: sev.urgent,
      xp_awarded: XP_PER_LOG,
    });
    if (insErr) {
      console.error("logUrge insert error:", insErr);
      return { success: false, error: "Could not save this entry." };
    }

    // Logging an urge completes the mandatory Field Journal habit for today.
    await recordHabitCompletion({ userId, habitSlug: "field-journal" });

    // Best-effort: emit the urge intensity as a shared StateCheck "charge"
    // (before-only — a field log is a point-in-time note, not a before/after
    // intervention) so it joins the cross-tool "what helps you, when" read.
    await recordStateCheck({
      toolSlug: "field-journal",
      before: input.intensity,
      after: null,
      timeOfDay: timeOfDayFromHour(input.localHour),
    });

    // how many entries from this context (for the recommend() if-then plan)
    const { count: ctxCount } = await supabase
      .from("urge_logs")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("context", input.context);

    // profile + forgiving streak + honesty XP
    const { data: prof } = await supabase
      .from("field_profile")
      .select("total_xp, current_streak, longest_streak, last_log_date, streak_freezes")
      .eq("user_id", userId)
      .maybeSingle();

    const baseXp = prof?.total_xp ?? ENDOWED_XP;
    const prevStreak = prof?.current_streak ?? 0;
    const prevLongest = prof?.longest_streak ?? 0;
    const freezes = prof?.streak_freezes ?? STREAK_FREEZES;
    const last = prof?.last_log_date as string | null | undefined;

    let streak = prevStreak;
    let newFreezes = freezes;
    if (!last) {
      streak = 1;
    } else {
      const gap = daysBetween(last, input.localDate);
      if (gap <= 0) streak = prevStreak; // already logged today
      else if (gap === 1) streak = prevStreak + 1;
      else if (gap === 2 && freezes > 0) {
        streak = prevStreak + 1;
        newFreezes = freezes - 1;
      } else streak = 1;
    }

    const totalXp = baseXp + XP_PER_LOG;
    const longest = Math.max(prevLongest, streak);

    const { error: upErr } = await supabase.from("field_profile").upsert(
      {
        user_id: userId,
        total_xp: totalXp,
        current_streak: streak,
        longest_streak: longest,
        last_log_date: input.localDate,
        streak_freezes: newFreezes,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );
    if (upErr) console.error("logUrge profile upsert error:", upErr);

    return {
      success: true,
      xpAwarded: XP_PER_LOG,
      totalXp,
      currentStreak: streak,
      contextCount: ctxCount ?? 1,
      severity: sev,
    };
  } catch (err) {
    console.error("logUrge exception:", err);
    return { success: false, error: "Could not save this entry." };
  }
}

export type RecentLog = {
  context: string;
  intensity: number;
  outcome: Outcome;
  detail: string | null;
  loggedAt: string;
};

export type FieldHome = {
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
  rank: ReturnType<typeof rankFor>;
  recent: RecentLog[];
  situations: string[];
};

export async function getFieldHome(): Promise<FieldHome | null> {
  const userId = await getCurrentUserId();
  if (!userId) return null;
  try {
    const supabase = supabaseServer();
    const [{ data: prof }, { data: recent }, { data: sits }] = await Promise.all([
      supabase
        .from("field_profile")
        .select("total_xp, current_streak, longest_streak")
        .eq("user_id", userId)
        .maybeSingle(),
      supabase
        .from("urge_logs")
        .select("context, intensity, outcome, detail, logged_at")
        .eq("user_id", userId)
        .order("logged_at", { ascending: false })
        .limit(5),
      supabase
        .from("user_situations")
        .select("label")
        .eq("user_id", userId)
        .order("created_at", { ascending: true }),
    ]);

    const totalXp = prof?.total_xp ?? ENDOWED_XP;
    return {
      totalXp,
      currentStreak: prof?.current_streak ?? 0,
      longestStreak: prof?.longest_streak ?? 0,
      rank: rankFor(totalXp),
      recent: (recent ?? []).map((r) => ({
        context: r.context as string,
        intensity: r.intensity as number,
        outcome: r.outcome as Outcome,
        detail: (r.detail as string | null) ?? null,
        loggedAt: r.logged_at as string,
      })),
      situations: (sits ?? []).map((s) => s.label as string),
    };
  } catch (err) {
    console.error("getFieldHome exception:", err);
    return null;
  }
}

/* ─── Weekly Examen review ─── */
export type WeeklyDebrief = {
  totalLogs: number;
  surfRatePct: number;
  mostTestedHour: number | null;
  topContexts: { context: string; logs: number; surfRatePct: number }[];
  helping: string[]; // sentences written on wins
  catchingContext: string | null;
  intensityTrend: { day: string; avg: number }[];
};

export async function getWeeklyDebrief(days = 7): Promise<WeeklyDebrief | null> {
  const userId = await getCurrentUserId();
  if (!userId) return null;
  try {
    const supabase = supabaseServer();
    const since = new Date(Date.now() - days * 86400000).toISOString();
    const { data, error } = await supabase
      .from("urge_logs")
      .select("context, intensity, outcome, detail, local_hour, logged_at")
      .eq("user_id", userId)
      .gte("logged_at", since)
      .order("logged_at", { ascending: true });
    if (error || !data) return null;

    const n = data.length;
    const won = (o: string) => o === "surfed" || o === "left_scene";
    const surfRatePct = n ? Math.round((data.filter((d) => won(d.outcome)).length / n) * 100) : 0;

    // most tested hour
    const hourCounts: Record<number, number> = {};
    data.forEach((d) => {
      hourCounts[d.local_hour] = (hourCounts[d.local_hour] ?? 0) + 1;
    });
    const mostTestedHour =
      Object.keys(hourCounts).length === 0
        ? null
        : Number(Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0][0]);

    // contexts
    const ctx: Record<string, { logs: number; wins: number }> = {};
    data.forEach((d) => {
      ctx[d.context] = ctx[d.context] ?? { logs: 0, wins: 0 };
      ctx[d.context].logs++;
      if (won(d.outcome)) ctx[d.context].wins++;
    });
    const topContexts = Object.entries(ctx)
      .map(([context, v]) => ({
        context,
        logs: v.logs,
        surfRatePct: v.logs ? Math.round((v.wins / v.logs) * 100) : 0,
      }))
      .sort((a, b) => b.logs - a.logs)
      .slice(0, 5);

    const helping = data
      .filter((d) => won(d.outcome) && d.detail)
      .slice(-3)
      .map((d) => d.detail as string);

    const caught = Object.entries(ctx)
      .map(([context, v]) => ({ context, slips: v.logs - v.wins }))
      .sort((a, b) => b.slips - a.slips);
    const catchingContext = caught.length && caught[0].slips > 0 ? caught[0].context : null;

    // intensity trend by day
    const byDay: Record<string, { sum: number; n: number }> = {};
    data.forEach((d) => {
      const day = (d.logged_at as string).slice(0, 10);
      byDay[day] = byDay[day] ?? { sum: 0, n: 0 };
      byDay[day].sum += d.intensity;
      byDay[day].n++;
    });
    const intensityTrend = Object.entries(byDay).map(([day, v]) => ({
      day,
      avg: Math.round((v.sum / v.n) * 10) / 10,
    }));

    return { totalLogs: n, surfRatePct, mostTestedHour, topContexts, helping, catchingContext, intensityTrend };
  } catch (err) {
    console.error("getWeeklyDebrief exception:", err);
    return null;
  }
}

/* ─── Care-team review (admin) ─── */
export type ReviewRow = {
  id: string;
  context: string;
  intensity: number;
  outcome: string;
  detail: string | null;
  loggedAt: string;
};

export async function getFieldReviewQueue(): Promise<ReviewRow[]> {
  const adminId = await getCurrentAdminId();
  if (!adminId) return [];
  try {
    const supabase = supabaseServer();
    const { data } = await supabase
      .from("urge_logs")
      .select("id, context, intensity, outcome, detail, logged_at")
      .eq("needs_review", true)
      .order("logged_at", { ascending: true });
    return (data ?? []).map((r) => ({
      id: r.id as string,
      context: r.context as string,
      intensity: r.intensity as number,
      outcome: r.outcome as string,
      detail: (r.detail as string | null) ?? null,
      loggedAt: r.logged_at as string,
    }));
  } catch (err) {
    console.error("getFieldReviewQueue exception:", err);
    return [];
  }
}

export async function markUrgeReviewed(id: string): Promise<{ ok: boolean }> {
  const adminId = await getCurrentAdminId();
  if (!adminId) return { ok: false };
  try {
    const supabase = supabaseServer();
    await supabase.from("urge_logs").update({ needs_review: false }).eq("id", id);
    return { ok: true };
  } catch (err) {
    console.error("markUrgeReviewed exception:", err);
    return { ok: false };
  }
}

export async function addSituation(label: string): Promise<{ ok: boolean; label: string }> {
  const userId = await getCurrentUserId();
  const clean = label.trim().slice(0, 60);
  if (!userId || !clean) return { ok: false, label: clean };
  try {
    const supabase = supabaseServer();
    await supabase
      .from("user_situations")
      .upsert({ user_id: userId, label: clean }, { onConflict: "user_id,label" });
    return { ok: true, label: clean };
  } catch (err) {
    console.error("addSituation exception:", err);
    return { ok: false, label: clean };
  }
}
