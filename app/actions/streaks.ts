"use server";

import { getJourney, getTodaySummary } from "./habits";
import type { DisplayStreak } from "../lib/streakTypes";

/**
 * "One streak, the best one." The app can notice many kinds of momentum —
 * a daily streak, a personal-best day, a best week, the number of times
 * someone came back — but we only ever surface ONE at a time, so the
 * completion screen stays calm. Tapping the chip takes the person to the
 * grove (the full progress page).
 *
 * Everything here is framed as momentum/return, never as a chain that can
 * be "broken" — coming back is the win.
 */

export async function getDisplayStreak(): Promise<DisplayStreak | null> {
  try {
    const [summaryRes, journeyRes] = await Promise.all([
      getTodaySummary(),
      getJourney(90),
    ]);
    const summary = summaryRes.success ? summaryRes.data : null;
    const days = journeyRes.success
      ? [...journeyRes.data].sort((a, b) => a.date.localeCompare(b.date))
      : [];
    const comps = days.map((d) => d.completions);
    const n = comps.length;
    const today = n ? comps[n - 1] : 0;

    // 1. A personal-best single day, set today — the freshest, most worth celebrating.
    const prevMax = n > 1 ? Math.max(0, ...comps.slice(0, n - 1)) : 0;
    if (today > 0 && today > prevMax) {
      return {
        kind: "new-best-day",
        value: today,
        label: "New record",
        sublabel: `${today} in one day — the most you've done yet`,
      };
    }

    // 2. A best week (rolling 7-day total), if this week beats every prior week.
    if (n >= 7) {
      const windowSum = (end: number) =>
        comps.slice(end - 6, end + 1).reduce((a, b) => a + b, 0);
      const lastWeek = windowSum(n - 1);
      let priorMax = 0;
      for (let end = 6; end < n - 1; end++) {
        priorMax = Math.max(priorMax, windowSum(end));
      }
      if (lastWeek > 0 && lastWeek > priorMax) {
        return {
          kind: "best-week",
          value: lastWeek,
          label: "Best week yet",
          sublabel: `${lastWeek} this week — more than any week before`,
        };
      }
    }

    // 3. An active daily streak.
    const currentStreak = summary?.currentStreak ?? 0;
    if (currentStreak >= 2) {
      return {
        kind: "daily-streak",
        value: currentStreak,
        label: `${currentStreak}-day streak`,
        sublabel: "days in a row you showed up",
      };
    }

    // 4. Times they came back (retention-positive; rewards returning).
    const timesCameBack = summary?.timesCameBack ?? 0;
    if (timesCameBack > 0) {
      return {
        kind: "comeback",
        value: timesCameBack,
        label:
          timesCameBack === 1 ? "You came back" : `${timesCameBack} times back`,
        sublabel: "every return is the work",
      };
    }

    // 5. Just starting.
    return {
      kind: "start",
      value: 0,
      label: "You began",
      sublabel: "the first mark in your grove",
    };
  } catch (err) {
    console.error("getDisplayStreak exception:", err);
    return null;
  }
}
