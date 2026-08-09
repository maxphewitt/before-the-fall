"use server";

import { revalidatePath } from "next/cache";
import { supabaseServer } from "../lib/supabase";
import { getCurrentUserId } from "../lib/session";
import type { ServerResult } from "../lib/habitTypes";
import {
  getCheckInTier,
  CHECK_IN_MOODS,
  CHECK_IN_NEXT_STEPS,
  type CheckInMood,
  type CheckInNextStep,
  type CheckInTier,
} from "../lib/checkIn";
import { createEntry } from "./journal";

/**
 * Check-In actions — the returning-user welfare check (/check-in).
 *
 * PRIVACY RULE (non-negotiable): raw journal text NEVER lands in the
 * check_ins table. Anything the user writes is saved through the existing
 * encrypted journal (createEntry); check_ins stores only structured
 * signals (days_away, mood, branch, next_step) for the future AI progress
 * companion. See scripts/task-52-check-ins.sql.
 *
 * days_away is an internal signal only — it is never rendered back to the
 * user as a count (no shame-framing of absence, per the 2026-07-28
 * Platform Audit).
 *
 * Draft flow pending clinician review.
 */

const NOT_SIGNED_IN = "You're not signed in.";
const GENERIC = "Something went wrong. Please try again.";

/** UTC calendar date (YYYY-MM-DD), matching user_daily_activity writes. */
function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Full days since the user's last active day BEFORE today.
 *
 * Source: user_daily_activity (one row per user per active day, written by
 * touchUserActivity on every authenticated page view — see
 * app/lib/session.ts). Today's row is excluded because the current request
 * has already fired the touch, so the most recent row < today is the last
 * day they were here before this return. No prior rows (brand-new user, or
 * pre-task-33 account with no history) → 0, which maps to tier "none".
 */
async function computeDaysAway(
  supabase: ReturnType<typeof supabaseServer>,
  userId: string
): Promise<number> {
  const today = todayUtc();
  const { data, error } = await supabase
    .from("user_daily_activity")
    .select("activity_date")
    .eq("user_id", userId)
    .lt("activity_date", today)
    .order("activity_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("computeDaysAway DB error:", error);
    return 0;
  }
  if (!data?.activity_date) return 0;

  const diffMs = Date.parse(today) - Date.parse(data.activity_date as string);
  return Math.max(0, Math.round(diffMs / 86_400_000));
}

export type CheckInStatus = {
  tier: CheckInTier;
  daysAway: number;
  alreadyCheckedInToday: boolean;
};

/**
 * Where does this user stand? Used by /home (show/hide the invite card)
 * and /check-in (pick the greeting tier). Tier "none" or an existing
 * check-in today means the Home card hides.
 */
export async function getCheckInStatus(): Promise<ServerResult<CheckInStatus>> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return { success: false, error: NOT_SIGNED_IN };

    const supabase = supabaseServer();
    const daysAway = await computeDaysAway(supabase, userId);

    // Most recent check-in row → have they already checked in today?
    // A read error here (e.g. migration not yet run) degrades to "not
    // checked in" rather than failing the whole status call.
    let alreadyCheckedInToday = false;
    const { data: last, error: lastError } = await supabase
      .from("check_ins")
      .select("created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (lastError) {
      console.error("getCheckInStatus check_ins read error:", lastError);
    } else if (last?.created_at) {
      alreadyCheckedInToday =
        (last.created_at as string).slice(0, 10) === todayUtc();
    }

    return {
      success: true,
      data: { tier: getCheckInTier(daysAway), daysAway, alreadyCheckedInToday },
    };
  } catch (err) {
    console.error("getCheckInStatus exception:", err);
    return { success: false, error: GENERIC };
  }
}

/**
 * Complete a check-in.
 *
 * If journalText is non-empty it is saved through the encrypted journal
 * as a 'reflection' entry (freeform text, and it counts toward the Field
 * Journal habit like any other reflection) — NEVER into check_ins. The
 * check_ins row stores only the structured signals, with days_away
 * recomputed server-side so the client can't set it.
 */
export async function submitCheckIn(input: {
  mood: CheckInMood;
  branch?: string;
  journalText?: string;
  nextStep?: string;
}): Promise<ServerResult> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return { success: false, error: NOT_SIGNED_IN };

    if (!CHECK_IN_MOODS.includes(input.mood)) {
      return { success: false, error: "Invalid check-in." };
    }

    // Structured signals only — short, allowlisted / sanitized values.
    const nextStep: CheckInNextStep | null = CHECK_IN_NEXT_STEPS.includes(
      input.nextStep as CheckInNextStep
    )
      ? (input.nextStep as CheckInNextStep)
      : null;
    const branch =
      typeof input.branch === "string" && /^[a-z:-]{1,40}$/.test(input.branch)
        ? input.branch
        : input.mood;

    // The user's words go to the encrypted journal, nowhere else. If the
    // journal save fails we stop here so their writing isn't lost silently.
    const journalText = (input.journalText ?? "").trim();
    let journalSaved = false;
    if (journalText.length > 0) {
      const journalRes = await createEntry(journalText, "reflection");
      if (!journalRes.success) {
        return { success: false, error: journalRes.error };
      }
      journalSaved = true;
    }

    const supabase = supabaseServer();
    const daysAway = await computeDaysAway(supabase, userId);

    const { error } = await supabase.from("check_ins").insert({
      user_id: userId,
      days_away: daysAway,
      mood: input.mood,
      branch,
      next_step: nextStep,
    });

    if (error) {
      console.error("submitCheckIn DB error:", error);
      // If their journal entry already saved, the human part of the
      // check-in succeeded — don't ask them to resubmit (which would
      // duplicate the entry) over a lost analytics row.
      if (!journalSaved) return { success: false, error: GENERIC };
    }

    revalidatePath("/home");
    return { success: true };
  } catch (err) {
    console.error("submitCheckIn exception:", err);
    return { success: false, error: GENERIC };
  }
}
