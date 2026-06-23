"use server";

import { supabaseServer } from "../lib/supabase";
import { getCurrentUserId } from "../lib/session";
import type { TimeOfDayBucket } from "../lib/journalTypes";

/**
 * Shared before/after "charge" signal.
 *
 * Every self-help tool can emit an optional 0–10 self-rating (a SUDS-style
 * self-monitoring signal — NOT a clinical outcome measure). The user's
 * WORDS live encrypted in journal_entries; this module stores only the
 * low-sensitivity numbers so cross-tool insights can be computed without
 * decrypting anyone's journal.
 *
 * Best-effort throughout: if the table isn't there yet (scripts/task-38),
 * everything degrades to null/failure without ever breaking a tool flow.
 */

export type RecordStateCheckInput = {
  toolSlug: string;
  /** 0–10, or null/undefined if the user skipped it. */
  before?: number | null;
  after?: number | null;
  /** Coarse local time-of-day bucket, computed on the device. */
  timeOfDay?: TimeOfDayBucket | null;
  /** Journal entry this check belongs to, if one was saved. */
  sourceJournalId?: string | null;
};

function clampCharge(n: number | null | undefined): number | null {
  if (n === null || n === undefined || Number.isNaN(n)) return null;
  return Math.max(0, Math.min(10, Math.round(n)));
}

/**
 * Persist a before/after charge check. Returns void-ish; never throws.
 * Skips the write entirely if there is nothing numeric to record.
 */
export async function recordStateCheck(
  input: RecordStateCheckInput
): Promise<{ success: boolean }> {
  const userId = await getCurrentUserId();
  if (!userId) return { success: false };

  const before = clampCharge(input.before);
  const after = clampCharge(input.after);
  if (before === null && after === null) return { success: false };

  try {
    const supabase = supabaseServer();
    const { error } = await supabase.from("state_checks").insert({
      user_id: userId,
      tool_slug: input.toolSlug,
      source_journal_id: input.sourceJournalId ?? null,
      charge_before: before,
      charge_after: after,
      time_of_day: input.timeOfDay ?? null,
    });
    if (error) {
      console.error("recordStateCheck error:", error);
      return { success: false };
    }
    return { success: true };
  } catch (err) {
    console.error("recordStateCheck exception:", err);
    return { success: false };
  }
}

export type StateCheckRow = {
  toolSlug: string;
  before: number | null;
  after: number | null;
  timeOfDay: TimeOfDayBucket | null;
  createdAt: string;
};

/**
 * Per-user, strengths-based summary across all tools. Powers the grove
 * insight and the future recommendation layer. Returns null if there's
 * no data (or the table is missing).
 */
export type StateCheckSummary = {
  /** Total checks that had both a before and an after. */
  pairedCount: number;
  /** How many of those went down (charge after < before). */
  easedCount: number;
  /** Mean drop (before - after) over paired checks; 0 if none. */
  averageDrop: number;
  /** Tool slug with the largest average drop (>= 1 paired check). */
  bestTool: { toolSlug: string; averageDrop: number; count: number } | null;
  /** Time-of-day bucket the user reaches for tools most often. */
  mostCommonTime: { timeOfDay: TimeOfDayBucket; count: number } | null;
};

export async function getStateCheckSummary(
  toolSlug?: string
): Promise<StateCheckSummary | null> {
  const userId = await getCurrentUserId();
  if (!userId) return null;

  try {
    const supabase = supabaseServer();
    let query = supabase
      .from("state_checks")
      .select("tool_slug, charge_before, charge_after, time_of_day")
      .eq("user_id", userId);
    if (toolSlug) query = query.eq("tool_slug", toolSlug);

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      if (error) console.error("getStateCheckSummary error:", error);
      return null;
    }

    let pairedCount = 0;
    let easedCount = 0;
    let dropSum = 0;
    const byTool = new Map<string, { dropSum: number; count: number }>();
    const byTime = new Map<TimeOfDayBucket, number>();

    for (const row of data) {
      const before = row.charge_before as number | null;
      const after = row.charge_after as number | null;
      const time = row.time_of_day as TimeOfDayBucket | null;
      const slug = row.tool_slug as string;

      if (time) byTime.set(time, (byTime.get(time) ?? 0) + 1);

      if (before !== null && after !== null) {
        const drop = before - after;
        pairedCount += 1;
        dropSum += drop;
        if (drop > 0) easedCount += 1;
        const t = byTool.get(slug) ?? { dropSum: 0, count: 0 };
        t.dropSum += drop;
        t.count += 1;
        byTool.set(slug, t);
      }
    }

    let bestTool: StateCheckSummary["bestTool"] = null;
    for (const [slug, t] of byTool) {
      const avg = t.dropSum / t.count;
      if (!bestTool || avg > bestTool.averageDrop) {
        bestTool = { toolSlug: slug, averageDrop: avg, count: t.count };
      }
    }

    let mostCommonTime: StateCheckSummary["mostCommonTime"] = null;
    for (const [time, count] of byTime) {
      if (!mostCommonTime || count > mostCommonTime.count) {
        mostCommonTime = { timeOfDay: time, count };
      }
    }

    return {
      pairedCount,
      easedCount,
      averageDrop: pairedCount ? dropSum / pairedCount : 0,
      bestTool,
      mostCommonTime,
    };
  } catch (err) {
    console.error("getStateCheckSummary exception:", err);
    return null;
  }
}
