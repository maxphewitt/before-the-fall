"use server";

import { supabaseServer } from "../lib/supabase";
import { getCurrentUserId } from "../lib/session";

/**
 * Learning-module resume position + time-on-journey (task-49). Separate from
 * quiz scores (devotion_sessions) so the during-month leaderboard can rank by
 * time while the end-of-month leaderboard ranks by quiz score.
 */

const PERIOD_RE = /^\d{4}-\d{2}$/;
/** Cap per time flush so idle/gaming can't inflate the leaderboard. */
const MAX_FLUSH_SECONDS = 240;

export type DevotionPosition = { sessionN: number; page: number };

export async function getPosition(period: string): Promise<DevotionPosition | null> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return null;
    const supabase = supabaseServer();
    const { data, error } = await supabase
      .from("devotion_position")
      .select("session_n, page")
      .eq("user_id", userId)
      .eq("period", period)
      .maybeSingle();
    if (error || !data) return null;
    return { sessionN: (data.session_n as number) ?? 1, page: (data.page as number) ?? 0 };
  } catch (err) {
    console.error("getPosition exception:", err);
    return null;
  }
}

export async function savePosition(
  period: string,
  sessionN: number,
  page: number
): Promise<{ ok: boolean }> {
  try {
    const userId = await getCurrentUserId();
    if (!userId || !PERIOD_RE.test(period)) return { ok: false };
    const supabase = supabaseServer();
    await supabase.from("devotion_position").upsert(
      {
        user_id: userId,
        period,
        session_n: Math.max(1, Math.min(Number(sessionN) || 1, 50)),
        page: Math.max(0, Math.min(Number(page) || 0, 200)),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,period" }
    );
    return { ok: true };
  } catch (err) {
    console.error("savePosition exception:", err);
    return { ok: false };
  }
}

/** Add active reading time (seconds) to this period's journey total. Capped. */
export async function addTime(period: string, seconds: number): Promise<{ ok: boolean }> {
  try {
    const userId = await getCurrentUserId();
    if (!userId || !PERIOD_RE.test(period)) return { ok: false };
    const add = Math.max(0, Math.min(Math.floor(Number(seconds) || 0), MAX_FLUSH_SECONDS));
    if (add === 0) return { ok: true };
    const supabase = supabaseServer();
    const { data: existing } = await supabase
      .from("devotion_time")
      .select("seconds")
      .eq("user_id", userId)
      .eq("period", period)
      .maybeSingle();
    const next = ((existing?.seconds as number) ?? 0) + add;
    await supabase.from("devotion_time").upsert(
      { user_id: userId, period, seconds: next, updated_at: new Date().toISOString() },
      { onConflict: "user_id,period" }
    );
    return { ok: true };
  } catch (err) {
    console.error("addTime exception:", err);
    return { ok: false };
  }
}
