"use server";

import { revalidatePath } from "next/cache";
import { supabaseServer } from "../lib/supabase";
import { getCurrentUserId } from "../lib/session";
import { encryptJournalText, decryptJournalText } from "../lib/journalCrypto";
import type { ServerResult } from "../lib/habitTypes";
import {
  diffDaysISO,
  todayISOFrom,
  type FastingSeason,
  type SeasonKind,
} from "../lib/fastingSeasons";

/**
 * Fasting Seasons server actions (task-55).
 *
 * PRIVACY: the season title — what the person is fasting from — is as
 * sensitive as journal text ("lust", "drinking", names of things they've
 * never said out loud). It is encrypted with the journal's AES-256-GCM
 * key and NEVER stored or logged in plaintext. Keep it that way.
 *
 * MERCY: markFastingDay only ever upserts a day's status. Nothing here
 * resets anything — "strict" display logic lives entirely in the view
 * layer (lib/fastingSeasons.ts seasonCurrentRun).
 */

const NOT_SIGNED_IN = "You're not signed in.";
const GENERIC = "Something went wrong. Please try again.";
const MAX_ACTIVE_SEASONS = 5;
const MAX_SEASON_DAYS = 366;
const VALID_KINDS: SeasonKind[] = ["lent", "st-michaels-lent", "advent", "custom"];
const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;

export async function createFastingSeason(input: {
  kind: SeasonKind;
  title: string;
  startDate: string;
  endDate: string;
  strict?: boolean;
}): Promise<ServerResult<{ id: string }>> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return { success: false, error: NOT_SIGNED_IN };

    const title = (input.title ?? "").trim();
    if (title.length === 0) {
      return { success: false, error: "Name what you're setting down first." };
    }
    if (title.length > 120) {
      return { success: false, error: "Keep the name under 120 characters — the fuller story belongs in your journal." };
    }
    if (!VALID_KINDS.includes(input.kind)) {
      return { success: false, error: "Unknown season type." };
    }
    if (!ISO_DAY.test(input.startDate) || !ISO_DAY.test(input.endDate)) {
      return { success: false, error: "Those dates don't look right." };
    }
    const len = diffDaysISO(input.startDate, input.endDate) + 1;
    if (len < 1 || len > MAX_SEASON_DAYS) {
      return { success: false, error: "A season runs from 1 day to a year." };
    }
    // Strict current-run display is a custom-season election only (Max's
    // rule) — liturgical seasons are always gentle.
    const strict = input.kind === "custom" ? !!input.strict : false;

    const supabase = supabaseServer();
    const { count, error: countError } = await supabase
      .from("fasting_seasons")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .is("ended_at", null)
      .gte("end_date", todayISOFrom(new Date()));
    if (countError) {
      console.error("createFastingSeason count error:", countError);
      return { success: false, error: GENERIC };
    }
    if ((count ?? 0) >= MAX_ACTIVE_SEASONS) {
      return {
        success: false,
        error: "Five seasons at once is the limit — finish or end one before starting another.",
      };
    }

    const enc = encryptJournalText(title);
    const { data, error } = await supabase
      .from("fasting_seasons")
      .insert({
        user_id: userId,
        kind: input.kind,
        title_ciphertext: enc.ciphertext,
        title_iv: enc.iv,
        title_auth_tag: enc.authTag,
        start_date: input.startDate,
        end_date: input.endDate,
        strict,
      })
      .select("id")
      .single();

    if (error || !data) {
      console.error("createFastingSeason DB error:", error);
      return { success: false, error: GENERIC };
    }
    revalidatePath("/home");
    revalidatePath("/seasons");
    return { success: true, data: { id: data.id as string } };
  } catch (err) {
    console.error("createFastingSeason exception:", err);
    return { success: false, error: GENERIC };
  }
}

/**
 * Live seasons (not ended, not more than 7 days past their end so a
 * just-finished season can still show its closing card), newest first,
 * with all day marks. Titles decrypted here, server-side only.
 */
export async function listFastingSeasons(): Promise<ServerResult<FastingSeason[]>> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return { success: false, error: NOT_SIGNED_IN };

    const supabase = supabaseServer();
    const cutoff = todayISOFrom(new Date());
    const { data, error } = await supabase
      .from("fasting_seasons")
      .select("id, kind, title_ciphertext, title_iv, title_auth_tag, start_date, end_date, strict")
      .eq("user_id", userId)
      .is("ended_at", null)
      .gte("end_date", addDaysStr(cutoff, -7))
      .order("created_at", { ascending: false });

    if (error) {
      console.error("listFastingSeasons DB error:", error);
      return { success: false, error: GENERIC };
    }
    const rows = data ?? [];
    if (rows.length === 0) return { success: true, data: [] };

    const ids = rows.map((r) => r.id as string);
    const { data: dayRows, error: daysError } = await supabase
      .from("fasting_season_days")
      .select("season_id, day, status")
      .in("season_id", ids);
    if (daysError) {
      console.error("listFastingSeasons days error:", daysError);
      return { success: false, error: GENERIC };
    }

    const daysBySeason = new Map<string, Record<string, "kept" | "stumbled">>();
    for (const d of dayRows ?? []) {
      const m = daysBySeason.get(d.season_id as string) ?? {};
      m[d.day as string] = d.status as "kept" | "stumbled";
      daysBySeason.set(d.season_id as string, m);
    }

    const seasons: FastingSeason[] = [];
    for (const r of rows) {
      let title: string;
      try {
        title = decryptJournalText({
          ciphertext: r.title_ciphertext as string,
          iv: r.title_iv as string,
          authTag: r.title_auth_tag as string,
        });
      } catch (e) {
        console.error("listFastingSeasons decrypt failure for season", r.id, e);
        continue; // corrupt row — skip rather than crash the page
      }
      seasons.push({
        id: r.id as string,
        kind: r.kind as SeasonKind,
        title,
        startDate: r.start_date as string,
        endDate: r.end_date as string,
        strict: !!r.strict,
        days: daysBySeason.get(r.id as string) ?? {},
      });
    }
    return { success: true, data: seasons };
  } catch (err) {
    console.error("listFastingSeasons exception:", err);
    return { success: false, error: GENERIC };
  }
}

export async function markFastingDay(
  seasonId: string,
  dayISO: string,
  status: "kept" | "stumbled"
): Promise<ServerResult> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return { success: false, error: NOT_SIGNED_IN };
    if (!ISO_DAY.test(dayISO) || (status !== "kept" && status !== "stumbled")) {
      return { success: false, error: GENERIC };
    }

    const supabase = supabaseServer();
    // Ownership + bounds check (service role bypasses RLS — authorize here).
    const { data: season, error: seasonError } = await supabase
      .from("fasting_seasons")
      .select("id, user_id, start_date, end_date, ended_at")
      .eq("id", seasonId)
      .single();
    if (seasonError || !season || season.user_id !== userId || season.ended_at) {
      return { success: false, error: GENERIC };
    }
    const today = todayISOFrom(new Date());
    if (dayISO < (season.start_date as string) || dayISO > (season.end_date as string) || dayISO > today) {
      return { success: false, error: "That day isn't part of this season." };
    }

    const { error } = await supabase
      .from("fasting_season_days")
      .upsert(
        { season_id: seasonId, day: dayISO, status },
        { onConflict: "season_id,day" }
      );
    if (error) {
      console.error("markFastingDay DB error:", error);
      return { success: false, error: GENERIC };
    }
    revalidatePath("/home");
    revalidatePath("/seasons");
    return { success: true };
  } catch (err) {
    console.error("markFastingDay exception:", err);
    return { success: false, error: GENERIC };
  }
}

/** End a season early. The record keeps everything marked so far. */
export async function endFastingSeason(seasonId: string): Promise<ServerResult> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return { success: false, error: NOT_SIGNED_IN };

    const supabase = supabaseServer();
    const { error } = await supabase
      .from("fasting_seasons")
      .update({ ended_at: new Date().toISOString() })
      .eq("id", seasonId)
      .eq("user_id", userId);
    if (error) {
      console.error("endFastingSeason DB error:", error);
      return { success: false, error: GENERIC };
    }
    revalidatePath("/home");
    revalidatePath("/seasons");
    return { success: true };
  } catch (err) {
    console.error("endFastingSeason exception:", err);
    return { success: false, error: GENERIC };
  }
}

/** Local date-string helper (kept private to avoid importing client lib utils
 *  into the server bundle twice — mirrors lib/fastingSeasons.addDaysISO). */
function addDaysStr(iso: string, days: number): string {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
