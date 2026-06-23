"use server";

import { supabaseServer } from "../lib/supabase";
import { getCurrentUserId } from "../lib/session";

/**
 * Ride It Out (Urge Surfing) data layer.
 *
 * The user's words (triggers, reflections, notes) are saved as a journal
 * entry by createToolSession. This module stores only the lightweight
 * per-session facts that build cross-session confidence — how long they
 * stayed, which path, how much they engaged — and reflects them back as
 * "you've ridden out N urges; you've stayed a total of X." No intensity
 * score, no shame counter. Best-effort: degrades to null/failure if the
 * table isn't there yet (scripts/task-35).
 */

export type UrgePath = "catholic" | "secular";

export type SaveUrgeSurfInput = {
  durationSeconds: number;
  path: UrgePath;
  triggerCount: number;
  reflectionCount: number;
};

export type SaveResult = { success: true } | { success: false; error: string };

export async function saveUrgeSurfSession(
  input: SaveUrgeSurfInput
): Promise<SaveResult> {
  const userId = await getCurrentUserId();
  if (!userId) return { success: false, error: "Not signed in." };

  const endedAt = new Date();
  const dur = Math.max(0, Math.round(input.durationSeconds));
  const startedAt = new Date(endedAt.getTime() - dur * 1000);

  try {
    const supabase = supabaseServer();
    const { error } = await supabase.from("urge_surf_sessions").insert({
      user_id: userId,
      started_at: startedAt.toISOString(),
      ended_at: endedAt.toISOString(),
      duration_seconds: dur,
      path: input.path,
      trigger_count: Math.max(0, Math.round(input.triggerCount)),
      reflection_count: Math.max(0, Math.round(input.reflectionCount)),
    });
    if (error) {
      console.error("saveUrgeSurfSession error:", error);
      return { success: false, error: "Could not save this session." };
    }
    return { success: true };
  } catch (err) {
    console.error("saveUrgeSurfSession exception:", err);
    return { success: false, error: "Could not save this session." };
  }
}

export type UrgeSurfStats = {
  wavesRidden: number;
  totalSecondsStayed: number;
  longestStaySeconds: number;
};

export async function getUrgeSurfStats(): Promise<UrgeSurfStats | null> {
  const userId = await getCurrentUserId();
  if (!userId) return null;

  try {
    const supabase = supabaseServer();
    const { data, error } = await supabase
      .from("urge_surf_sessions")
      .select("duration_seconds")
      .eq("user_id", userId);

    if (error || !data) {
      console.error("getUrgeSurfStats error:", error);
      return null;
    }

    const durations = data.map((d) => (d.duration_seconds as number) ?? 0);
    return {
      wavesRidden: durations.length,
      totalSecondsStayed: durations.reduce((a, b) => a + b, 0),
      longestStaySeconds: durations.length ? Math.max(...durations) : 0,
    };
  } catch (err) {
    console.error("getUrgeSurfStats exception:", err);
    return null;
  }
}
