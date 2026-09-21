/**
 * Fasting Seasons (2026-08-11) — the day-X-of-Y fasting/abstinence tracker.
 * Max's spec: multiple simultaneous seasons; liturgical elects (Lent,
 * St. Michael's Lent, Advent) plus fully custom seasons (1–365 days,
 * e.g. total abstinence commitments); secular mirror uses discipline
 * challenges (75-day / 30-day / custom) with zero religious framing.
 *
 * MERCY RULES (locked with Max, 2026-08-11 — protect these):
 *   - The season NEVER resets. Falls happen; the journey keeps going.
 *     A stumbled day is marked red (kept days gold) and the calendar
 *     marches on. Nothing in the DATA ever resets.
 *   - "Strict" mode — the visible current-run counter restarting after
 *     a stumble — exists ONLY for custom seasons, only by explicit user
 *     election at setup, and is computed at display time. Copy around it
 *     must frame it as a discerned choice, never a punishment. (Pending
 *     clinician review like everything else.)
 *   - Daily mechanic is one honest tap: kept / stumbled. Unmarked days
 *     stay unmarked — no debt, no back-fill nagging.
 *
 * Dates are YYYY-MM-DD strings throughout (house style — see
 * liturgicalCalendar.ts). "Today" is computed by the server and passed
 * down, so client components never call Date.now() in render (eslint
 * react-hooks/purity).
 *
 * WHAT'S SENSITIVE: the season title (what the person is fasting from).
 * It is encrypted at rest via journalCrypto in actions/fastingSeasons.ts
 * — this pure module never sees crypto.
 */

import { getMovableFeasts } from "./liturgicalCalendar";

export type SeasonKind = "lent" | "st-michaels-lent" | "advent" | "custom";

export type FastingSeason = {
  id: string;
  kind: SeasonKind;
  /** Decrypted "what I'm offering / fasting from". */
  title: string;
  startDate: string; // YYYY-MM-DD inclusive
  endDate: string; // YYYY-MM-DD inclusive
  strict: boolean;
  /** day (YYYY-MM-DD) → status, for every day the user has marked. */
  days: Record<string, "kept" | "stumbled">;
};

/* ────────────────────────────────────────────────────────────────────
   Date helpers (string-based, UTC-free — same approach as the rest of
   the app's day logic)
   ──────────────────────────────────────────────────────────────────── */

export function addDaysISO(iso: string, days: number): string {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function diffDaysISO(fromISO: string, toISO: string): number {
  const a = new Date(fromISO + "T00:00:00").getTime();
  const b = new Date(toISO + "T00:00:00").getTime();
  return Math.round((b - a) / 86400000);
}

export function todayISOFrom(now: Date): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/* ────────────────────────────────────────────────────────────────────
   Season math
   ──────────────────────────────────────────────────────────────────── */

export function seasonTotalDays(s: Pick<FastingSeason, "startDate" | "endDate">): number {
  return diffDaysISO(s.startDate, s.endDate) + 1;
}

/** 1-based day number for `today`, clamped to [1, total]. 0 = not started. */
export function seasonDayNumber(
  s: Pick<FastingSeason, "startDate" | "endDate">,
  todayISO: string
): number {
  if (todayISO < s.startDate) return 0;
  const n = diffDaysISO(s.startDate, todayISO) + 1;
  return Math.min(n, seasonTotalDays(s));
}

export function seasonKeptCount(s: FastingSeason): number {
  return Object.values(s.days).filter((v) => v === "kept").length;
}

/**
 * Current unbroken run of kept days ending at the most recent marked day.
 * Only displayed for strict custom seasons (Max: "streak goes back to 0"
 * is a VIEW of the data, never a mutation of it). Unmarked days do not
 * break the run — only a marked stumble does (no missed-day debt).
 */
export function seasonCurrentRun(s: FastingSeason): number {
  const marked = Object.keys(s.days).sort();
  let run = 0;
  for (const day of marked) {
    if (s.days[day] === "kept") run += 1;
    else run = 0;
  }
  return run;
}

export function seasonIsFinished(
  s: Pick<FastingSeason, "endDate">,
  todayISO: string
): boolean {
  return todayISO > s.endDate;
}

/* ────────────────────────────────────────────────────────────────────
   Liturgical season windows (Catholic path)
   ──────────────────────────────────────────────────────────────────── */

export type SeasonTemplate = {
  kind: SeasonKind;
  label: string;
  blurb: string;
  /** Fixed liturgical window for a given year; null for custom. */
  windowForYear?: (year: number) => { start: string; end: string } | null;
};

export const LITURGICAL_TEMPLATES: SeasonTemplate[] = [
  {
    kind: "st-michaels-lent",
    label: "St. Michael's Lent",
    blurb:
      "The old Franciscan fast — forty days from the Assumption (August 15) to the feast of St. Michael (September 29). St. Francis kept it on La Verna; you keep it wherever you are.",
    windowForYear: (year) => ({ start: `${year}-08-15`, end: `${year}-09-29` }),
  },
  {
    kind: "lent",
    label: "Lent",
    blurb:
      "The Great Fast — Ash Wednesday through Holy Saturday. The whole Church, forty days, one direction: back to God.",
    windowForYear: (year) => {
      const feasts = getMovableFeasts(year);
      if (!feasts) return null;
      return { start: feasts.ashWednesday, end: addDaysISO(feasts.easter, -1) };
    },
  },
  {
    kind: "advent",
    label: "Advent",
    blurb:
      "The quieter fast of waiting — the First Sunday of Advent through Christmas Eve. Traditionally a season of penance too, not just calendars and candles.",
    windowForYear: (year) => {
      const feasts = getMovableFeasts(year);
      if (!feasts) return null;
      return { start: feasts.firstSundayOfAdvent, end: `${year}-12-24` };
    },
  },
];

export const CUSTOM_TEMPLATE: SeasonTemplate = {
  kind: "custom",
  label: "Your own season",
  blurb:
    "Choose your own length — one day to a year — and name what you're setting down. For a habit you're done with, an abstinence you're committing to, or a discipline you're building.",
};

/** Secular presets — all create kind='custom' seasons; no religious framing. */
export const SECULAR_PRESETS: { label: string; days: number; blurb: string }[] = [
  {
    label: "75-Day Discipline",
    days: 75,
    blurb:
      "Seventy-five days of holding one hard line you choose. Long enough to change who you are, short enough to see the end from the start.",
  },
  {
    label: "30-Day Reset",
    days: 30,
    blurb: "One month clean of the thing you name. The classic first proof that you can.",
  },
];

export type UpcomingSeason = {
  kind: SeasonKind;
  label: string;
  blurb: string;
  start: string;
  end: string;
  /** Days until start (0 = starts today, negative = already underway). */
  daysUntil: number;
};

/**
 * Liturgical seasons in their discernment window: starting within
 * `windowDays` days, or already underway but not yet over (joining
 * mid-season is allowed — earlier days simply stay unmarked).
 */
export function upcomingLiturgicalSeasons(
  todayISO: string,
  windowDays = 14
): UpcomingSeason[] {
  const year = parseInt(todayISO.slice(0, 4), 10);
  const out: UpcomingSeason[] = [];
  for (const t of LITURGICAL_TEMPLATES) {
    for (const y of [year, year + 1]) {
      const w = t.windowForYear?.(y);
      if (!w) continue;
      const daysUntil = diffDaysISO(todayISO, w.start);
      const stillRunning = todayISO <= w.end;
      if (stillRunning && daysUntil <= windowDays && diffDaysISO(todayISO, w.end) >= 0) {
        out.push({ kind: t.kind, label: t.label, blurb: t.blurb, start: w.start, end: w.end, daysUntil });
        break; // nearest occurrence only
      }
    }
  }
  return out.sort((a, b) => a.daysUntil - b.daysUntil);
}

export function templateForKind(kind: SeasonKind): SeasonTemplate {
  return LITURGICAL_TEMPLATES.find((t) => t.kind === kind) ?? CUSTOM_TEMPLATE;
}
