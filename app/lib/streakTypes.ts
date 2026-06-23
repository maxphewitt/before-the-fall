/**
 * Pure types for the streak/momentum signal. Lives outside the
 * "use server" action module (app/actions/streaks.ts), which may only
 * export async functions.
 */

export type DisplayStreakKind =
  | "new-best-day"
  | "best-week"
  | "daily-streak"
  | "comeback"
  | "start";

export type DisplayStreak = {
  kind: DisplayStreakKind;
  value: number;
  /** Short chip label, e.g. "5-day streak". */
  label: string;
  /** One-line context under the chip. */
  sublabel: string;
};
