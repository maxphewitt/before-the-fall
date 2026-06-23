"use server";

import { supabaseServer } from "../lib/supabase";
import { getCurrentUserId } from "../lib/session";
import type { UrgeOutcome } from "../lib/journalTypes";

/**
 * Ride It Out (Urge Surfing) data layer.
 *
 * The user's words (triggers, reflections, notes) are saved as a journal
 * entry by createToolSession. This module stores only the lightweight
 * per-session facts that build cross-session confidence — how long they
 * stayed, which path, how much they engaged, plus two acceptance-based
 * signals: a 0–100 coping-confidence rating (rising-is-good self-efficacy)
 * and a neutral, equal-weight outcome (rode it out / stepped away / acted
 * on it). NO urge-intensity score, ever — intensity reduction is not the
 * goal of an acceptance technique, and a recurring intensity log becomes a
 * shame counter. Best-effort: degrades to null/failure if the table isn't
 * there yet (scripts/task-35, task-39).
 */

export type UrgePath = "catholic" | "secular";

export type SaveUrgeSurfInput = {
  durationSeconds: number;
  path: UrgePath;
  triggerCount: number;
  reflectionCount: number;
  /** 0–100 coping self-efficacy, or null if skipped. */
  copingConfidence?: number | null;
  /** Neutral outcome category, or null if skipped. */
  outcome?: UrgeOutcome | null;
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
    const confidence =
      input.copingConfidence === null || input.copingConfidence === undefined
        ? null
        : Math.max(0, Math.min(100, Math.round(input.copingConfidence)));

    const supabase = supabaseServer();
    const { error } = await supabase.from("urge_surf_sessions").insert({
      user_id: userId,
      started_at: startedAt.toISOString(),
      ended_at: endedAt.toISOString(),
      duration_seconds: dur,
      path: input.path,
      trigger_count: Math.max(0, Math.round(input.triggerCount)),
      reflection_count: Math.max(0, Math.round(input.reflectionCount)),
      coping_confidence: confidence,
      outcome: input.outcome ?? null,
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
  /** Most recent coping-confidence rating, if any. Rising is good. */
  latestConfidence: number | null;
  /** Earliest coping-confidence rating, for a simple "then vs now" read. */
  firstConfidence: number | null;
  /** How many sessions carried a confidence rating. */
  confidencePoints: number;
};

export async function getUrgeSurfStats(): Promise<UrgeSurfStats | null> {
  const userId = await getCurrentUserId();
  if (!userId) return null;

  try {
    const supabase = supabaseServer();
    const { data, error } = await supabase
      .from("urge_surf_sessions")
      .select("duration_seconds, coping_confidence, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (error || !data) {
      console.error("getUrgeSurfStats error:", error);
      return null;
    }

    const durations = data.map((d) => (d.duration_seconds as number) ?? 0);
    const confidences = data
      .map((d) => d.coping_confidence as number | null)
      .filter((c): c is number => c !== null && c !== undefined);

    return {
      wavesRidden: durations.length,
      totalSecondsStayed: durations.reduce((a, b) => a + b, 0),
      longestStaySeconds: durations.length ? Math.max(...durations) : 0,
      latestConfidence: confidences.length
        ? confidences[confidences.length - 1]
        : null,
      firstConfidence: confidences.length ? confidences[0] : null,
      confidencePoints: confidences.length,
    };
  } catch (err) {
    console.error("getUrgeSurfStats exception:", err);
    return null;
  }
}
