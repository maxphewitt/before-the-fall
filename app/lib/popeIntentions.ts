/**
 * Pope's monthly prayer intentions.
 *
 * Source: https://popesprayerusa.net/popes-intentions/
 *
 * Each year, the Holy Father releases twelve intentions — one for each
 * month — calling Catholics worldwide to pray on a specific theme. The
 * traditional practice is to offer the opening of the Rosary (the first
 * Our Father, three Hail Marys, and Glory Be) for the current month's
 * intention.
 *
 * UPDATE CADENCE: check popesprayerusa.net at the start of each month to
 * confirm. Intentions sometimes get adjusted mid-year by the Vatican.
 * When new years are announced (typically late January), add the next
 * batch to INTENTIONS_BY_YEAR_MONTH.
 *
 * Future improvement: replace this static table with a daily cron that
 * fetches popesprayerusa.net + caches in the DB. For closed beta the
 * static table is plenty.
 */

export type PopeIntention = {
  // Short headline, all caps in source. We render in normal case.
  title: string;
  // The "Let us pray that ..." body.
  body: string;
  // Source URL for the month's reflection / Pope Video, if known.
  // Optional — UI links to popesprayerusa.net when null.
  source?: string;
};

/**
 * Lookup table: `${year}-${monthIndex0to11}` → intention.
 * Use getIntentionForDate() — don't read this directly.
 */
const INTENTIONS_BY_YEAR_MONTH: Record<string, PopeIntention> = {
  // ── 2026 (Pope Leo XIV) ─────────────────────────────────────────
  "2026-4": {
    title: "That everyone might have food",
    body: "Let us pray that everyone, from large producers to small consumers, be committed to avoid wasting food, and to ensure that everyone has access to quality food.",
  },
  "2026-5": {
    title: "For the values of sport",
    body: "Let us pray that sport be an instrument of peace, of encounter, and lead to dialogue among cultures and nations so that they promote values such as respect, solidarity, and personal growth.",
  },
  "2026-6": {
    title: "For respect for human life",
    body: "Let us pray for the respect and protection of human life in all its stages, recognizing it as a gift from God.",
  },
  "2026-7": {
    title: "For evangelization in the city",
    body: "Let us pray that in large cities often marked by anonymity and loneliness we find new ways to proclaim the Gospel, discovering creative paths to build community.",
  },
  "2026-8": {
    title: "For the care of water",
    body: "Let us pray for a just and sustainable management of water, a vital resource, so that everyone may have equal access to it.",
  },
  "2026-9": {
    title: "For mental health ministry",
    body: "Let us pray that the mental health ministry be established throughout the Church, helping to overcome the stigma and discrimination of persons with mental illnesses.",
  },
  "2026-10": {
    title: "For the proper use of wealth",
    body: "Let us pray for the proper use of wealth, that not succumbing to the temptation of selfishness, it may always be put at the service of the common good and the solidarity of those who have less.",
  },
  "2026-11": {
    title: "For single-parent families",
    body: "Let us pray for families experiencing the absence of a mother or father, that they may find support and accompaniment in the Church, and help and strength in the Faith during difficult times.",
  },
};

/**
 * Generic fallback used when a month's intention isn't in the table yet.
 * Visible signal to Max that he needs to update the data file. Renders
 * gracefully in the Rosary walker.
 */
const FALLBACK_INTENTION: PopeIntention = {
  title: "For the Holy Father's intentions",
  body: "Let us pray for the intentions entrusted to us this month by the Holy Father, and for all the works, joys, and sufferings of the world.",
};

/**
 * Get the Pope's intention for a given date.
 *
 * Pass a Date object. The intention is keyed by year + month (0-indexed).
 * If the table doesn't have an entry for that month, returns a generic
 * fallback instead of throwing — the Rosary walker should never break
 * because we forgot to update intentions.
 *
 * For timezone correctness: pass a Date that already reflects the
 * user's local time. (See app/lib/clientDate.ts helpers.)
 */
export function getIntentionForDate(date: Date): PopeIntention {
  const key = `${date.getFullYear()}-${date.getMonth()}`;
  return INTENTIONS_BY_YEAR_MONTH[key] ?? FALLBACK_INTENTION;
}

/**
 * Human-readable month + year label, e.g. "May 2026".
 * Used in the Rosary walker step header.
 */
export function formatIntentionPeriod(date: Date, locale?: string): string {
  return date.toLocaleDateString(locale, { month: "long", year: "numeric" });
}

export const POPE_INTENTIONS_SOURCE_URL =
  "https://popesprayerusa.net/popes-intentions/";
