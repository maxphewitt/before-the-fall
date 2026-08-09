"use server";

import { supabaseServer } from "../lib/supabase";
import { getCurrentUserId } from "../lib/session";
import type { ServerResult } from "../lib/habitTypes";
import { startHereSessionCount, type StartHereTrack } from "../lib/startHere";

/**
 * Start Here progress actions (task-54). Sequential unlock is derived
 * client-of-this-API: session n is playable when n = 1 or n-1 is in the
 * completed list. Completion is recorded when the walker's closing
 * screen fires — best-effort, never blocks the reading experience.
 */

const NOT_SIGNED_IN = "You're not signed in.";
const GENERIC = "Something went wrong. Please try again.";

export type StartHereCompletionRow = { track: StartHereTrack; sessionN: number };

/**
 * All completions for the user across BOTH tracks in one round trip.
 * Exists so callers that don't yet know the track (Home, the landing —
 * track depends on faith_role) can run this in parallel with the role
 * fetch instead of serially after it (perf plan item 6: kill waterfalls).
 */
export async function listStartHereCompletions(): Promise<
  ServerResult<StartHereCompletionRow[]>
> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return { success: false, error: NOT_SIGNED_IN };

    const supabase = supabaseServer();
    const { data, error } = await supabase
      .from("start_here_progress")
      .select("track, session_n")
      .eq("user_id", userId);

    if (error) {
      console.error("listStartHereCompletions DB error:", error);
      return { success: false, error: GENERIC };
    }
    return {
      success: true,
      data: (data ?? []).map((r) => ({
        track: r.track as StartHereTrack,
        sessionN: r.session_n as number,
      })),
    };
  } catch (err) {
    console.error("listStartHereCompletions exception:", err);
    return { success: false, error: GENERIC };
  }
}

export async function getStartHereCompleted(
  track: StartHereTrack
): Promise<ServerResult<number[]>> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return { success: false, error: NOT_SIGNED_IN };

    const supabase = supabaseServer();
    const { data, error } = await supabase
      .from("start_here_progress")
      .select("session_n")
      .eq("user_id", userId)
      .eq("track", track);

    if (error) {
      console.error("getStartHereCompleted DB error:", error);
      return { success: false, error: GENERIC };
    }
    return {
      success: true,
      data: (data ?? []).map((r) => r.session_n as number).sort((a, b) => a - b),
    };
  } catch (err) {
    console.error("getStartHereCompleted exception:", err);
    return { success: false, error: GENERIC };
  }
}

export async function completeStartHereSession(
  track: StartHereTrack,
  sessionN: number
): Promise<ServerResult> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return { success: false, error: NOT_SIGNED_IN };
    if (
      !Number.isInteger(sessionN) ||
      sessionN < 1 ||
      sessionN > startHereSessionCount(track)
    ) {
      return { success: false, error: "Unknown session." };
    }

    const supabase = supabaseServer();
    // Idempotent: re-completing a session (review) is a no-op.
    const { error } = await supabase
      .from("start_here_progress")
      .upsert(
        { user_id: userId, track, session_n: sessionN },
        { onConflict: "user_id,track,session_n", ignoreDuplicates: true }
      );

    if (error) {
      console.error("completeStartHereSession DB error:", error);
      return { success: false, error: GENERIC };
    }
    return { success: true };
  } catch (err) {
    console.error("completeStartHereSession exception:", err);
    return { success: false, error: GENERIC };
  }
}
