/**
 * Pure types + pure functions for the habit tracker. Lives outside the
 * "use server" file (app/actions/habits.ts) because Next.js Server
 * Action modules can only export async functions.
 */

import type { HabitSlug } from "./habits";

export type ServerResult<T = void> =
  | (T extends void ? { success: true } : { success: true; data: T })
  | { success: false; error: string };

export type UserHabit = {
  id: string;
  habitSlug: HabitSlug;
  displayOrder: number;
};

export type TodayHabitState = {
  habit: UserHabit;
  /** ISO timestamp of the most recent completion today, if any. */
  completedAt: string | null;
};

export type TodaySummary = {
  habits: TodayHabitState[];
  /** Count of days in the current consecutive-day streak. */
  currentStreak: number;
  /** Longest consecutive-day streak ever. */
  longestStreak: number;
  /** Headline metric — # of times the user returned after a missed day. */
  timesCameBack: number;
  /** Days in the last 7 with at least one completion (for the week strip). */
  weekStrip: { date: string; completed: boolean }[];
};

export type JourneyDay = {
  date: string; // YYYY-MM-DD
  completions: number;
};

export function startOfDayISO(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/**
 * Pure streak math. Given a set of YYYY-MM-DD strings representing
 * days with at least one habit completion, compute:
 *   - currentStreak: consecutive days ending TODAY (0 if today not done)
 *   - longestStreak: longest consecutive run at any point
 *   - timesCameBack: number of transitions from a missed day to a
 *     completed day — the headline retention metric.
 *
 * Lives in a pure module so it can be unit-tested without DB access.
 */
export function computeStreaks(
  daysWithCompletion: Set<string>,
  today: Date
): { currentStreak: number; longestStreak: number; timesCameBack: number } {
  const sortedDays = Array.from(daysWithCompletion).sort();
  if (sortedDays.length === 0) {
    return { currentStreak: 0, longestStreak: 0, timesCameBack: 0 };
  }

  const start = new Date(sortedDays[0] + "T00:00:00Z");
  const end = new Date(today);
  end.setUTCHours(0, 0, 0, 0);

  let currentRun = 0;
  let longestRun = 0;
  let timesCameBack = 0;
  let prevCompleted = false;
  let hadPriorRun = false;

  for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    const iso = startOfDayISO(d);
    const done = daysWithCompletion.has(iso);
    if (done) {
      if (!prevCompleted && hadPriorRun) {
        timesCameBack += 1;
      }
      currentRun += 1;
      if (currentRun > longestRun) longestRun = currentRun;
    } else {
      if (currentRun > 0) hadPriorRun = true;
      currentRun = 0;
    }
    prevCompleted = done;
  }

  const todayISO = startOfDayISO(end);
  const currentStreak = daysWithCompletion.has(todayISO) ? currentRun : 0;

  return { currentStreak, longestStreak: longestRun, timesCameBack };
}
