"use server";

import { revalidatePath } from "next/cache";
import { supabaseServer } from "../lib/supabase";
import { getCurrentUserId } from "../lib/session";
import { periodKey } from "../lib/monthlyDevotions";
import type { ServerResult } from "../lib/habitTypes";

/**
 * Monthly learning-module quizzes + communal leaderboard (task-48/49).
 * A knowledge/journey game for those walking together — never tied to prayer or
 * streaks. Two leaderboard modes for the same month:
 *   - "time"  DURING the month: ranked by minutes spent on the journey.
 *   - "quiz"  END OF MONTH (past periods): ranked by total correct answers.
 * Names shown are the user's chosen display name (or "Anonymous").
 */

const NOT_SIGNED_IN = "You're not signed in.";
const GENERIC = "Something went wrong. Please try again.";

export type LeaderboardMode = "time" | "quiz";
export type LeaderboardEntry = { name: string; value: number; you: boolean };
export type Leaderboard = {
  mode: LeaderboardMode;
  /** Unit label for the value, e.g. "min" or "pts". */
  unit: string;
  entries: LeaderboardEntry[];
  yourValue: number | null;
  yourRank: number | null;
};

/** Save one session's quiz result, keeping the user's best for that session. */
export async function submitSessionQuiz(
  period: string,
  sessionN: number,
  correct: number,
  total: number
): Promise<ServerResult> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return { success: false, error: NOT_SIGNED_IN };
    if (!/^\d{4}-\d{2}$/.test(period)) return { success: false, error: "Bad period." };
    const n = Math.max(1, Math.min(Number(sessionN) || 1, 50));
    const t = Math.max(1, Math.min(Number(total) || 1, 20));
    const c = Math.max(0, Math.min(Number(correct) || 0, t));

    const supabase = supabaseServer();
    const { data: existing } = await supabase
      .from("devotion_sessions")
      .select("correct")
      .eq("user_id", userId)
      .eq("period", period)
      .eq("session_n", n)
      .maybeSingle();

    const best = Math.max(c, (existing?.correct as number) ?? 0);
    const { error } = await supabase.from("devotion_sessions").upsert(
      { user_id: userId, period, session_n: n, correct: best, total: t, updated_at: new Date().toISOString() },
      { onConflict: "user_id,period,session_n" }
    );
    if (error) {
      console.error("submitSessionQuiz DB error:", error);
      return { success: false, error: GENERIC };
    }
    revalidatePath("/catholic-path/together");
    revalidatePath("/catholic-path/together/learn");
    return { success: true };
  } catch (err) {
    console.error("submitSessionQuiz exception:", err);
    return { success: false, error: GENERIC };
  }
}

/** Which session numbers the user has completed this period. */
export async function getCompletedSessions(period: string): Promise<number[]> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return [];
    const supabase = supabaseServer();
    const { data, error } = await supabase
      .from("devotion_sessions")
      .select("session_n")
      .eq("user_id", userId)
      .eq("period", period);
    if (error || !data) return [];
    return data.map((r) => r.session_n as number);
  } catch (err) {
    console.error("getCompletedSessions exception:", err);
    return [];
  }
}

export async function getLeaderboard(period: string): Promise<Leaderboard> {
  const mode: LeaderboardMode = period === periodKey() ? "time" : "quiz";
  const empty: Leaderboard = {
    mode,
    unit: mode === "time" ? "min" : "pts",
    entries: [],
    yourValue: null,
    yourRank: null,
  };
  try {
    const userId = await getCurrentUserId();
    const supabase = supabaseServer();

    // Build per-user totals depending on mode.
    const totals = new Map<string, number>();
    if (mode === "time") {
      const { data, error } = await supabase
        .from("devotion_time")
        .select("user_id, seconds")
        .eq("period", period);
      if (error || !data) return empty;
      for (const r of data) totals.set(r.user_id as string, Math.round(((r.seconds as number) ?? 0) / 60));
    } else {
      const { data, error } = await supabase
        .from("devotion_sessions")
        .select("user_id, correct")
        .eq("period", period);
      if (error || !data) return empty;
      for (const r of data) {
        const uid = r.user_id as string;
        totals.set(uid, (totals.get(uid) ?? 0) + ((r.correct as number) ?? 0));
      }
    }

    const ranked = Array.from(totals.entries())
      .map(([uid, value]) => ({ uid, value }))
      .filter((r) => r.value > 0)
      .sort((a, b) => b.value - a.value);

    const top = ranked.slice(0, 10);
    const nameMap = new Map<string, string>();
    if (top.length > 0) {
      const { data: profiles } = await supabase
        .from("user_profiles")
        .select("user_id, display_name")
        .in("user_id", top.map((r) => r.uid));
      for (const p of profiles ?? []) {
        const nm = (p.display_name as string | null)?.trim();
        if (nm) nameMap.set(p.user_id as string, nm);
      }
    }

    const entries: LeaderboardEntry[] = top.map((r) => ({
      name: nameMap.get(r.uid) ?? "Anonymous",
      value: r.value,
      you: !!userId && r.uid === userId,
    }));

    let yourValue: number | null = null;
    let yourRank: number | null = null;
    if (userId && totals.has(userId)) {
      yourValue = totals.get(userId)!;
      yourRank = ranked.findIndex((r) => r.uid === userId) + 1;
    }

    return { ...empty, entries, yourValue, yourRank };
  } catch (err) {
    console.error("getLeaderboard exception:", err);
    return empty;
  }
}
