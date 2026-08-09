/**
 * Walk Together — community config (2026-07-06).
 *
 * A featured "community novena" rotates by the month so the whole app can
 * pray the same thing together, leaning into the Church's devotional calendar
 * (June = Sacred Heart, May/August = Immaculate Heart, etc.). Seasonal
 * challenges are longer campaigns that open in their season.
 *
 * Pure data + helpers; no DB. Communal, never competitive.
 */

import { getNovenaById, type Novena } from "./novenas";
import { currentMonthlyDevotion } from "./monthlyDevotions";

export type CommunityFeature = {
  novenaId: string;
  monthLabel: string; // e.g. "July — The Most Precious Blood of Jesus"
  blurb: string;
};

/**
 * The month's community novena, derived from the single source of truth for the
 * monthly theme (monthlyDevotions.ts) so the devotion, the Explore card, and this
 * novena never disagree. Each month's devotion carries a paired novena to pray
 * together; falls back to Surrender if one is somehow missing.
 */
export function currentCommunityFeature(date: Date = new Date()): {
  feature: CommunityFeature;
  novena: Novena;
} {
  const devotion = currentMonthlyDevotion(date);
  const novena =
    getNovenaById(devotion.novenaId ?? "surrender") ?? getNovenaById("surrender")!;
  const feature: CommunityFeature = {
    novenaId: novena.id,
    monthLabel: devotion.monthLabel,
    blurb: `In the spirit of ${devotion.title}, many are praying the ${novena.title} together this month.`,
  };
  return { feature, novena };
}

/* ── Seasonal challenges (Phase 3) ── */

export type Challenge = {
  id: string;
  title: string;
  summary: string;
  /** Content is drawn from this novena for now. */
  novenaId: string;
  /** Months (1-12) the challenge is "in season"; empty = always available. */
  activeMonths: number[];
  seasonLabel: string;
};

export const CHALLENGES: Challenge[] = [
  {
    id: "surrender-together",
    title: "Surrender Together",
    summary: "Nine days of letting go, prayed alongside others across the app. Join anytime.",
    novenaId: "surrender",
    activeMonths: [],
    seasonLabel: "Always open",
  },
  {
    id: "lenten-journey",
    title: "Lenten Journey",
    summary: "Walk toward the Cross with the Mother of Sorrows through the season of Lent.",
    novenaId: "our-lady-of-sorrows",
    activeMonths: [2, 3, 4],
    seasonLabel: "Opens in Lent",
  },
  {
    id: "advent-preparation",
    title: "Advent Preparation",
    summary: "Prepare your heart for Christmas with Mary through the weeks of Advent.",
    novenaId: "immaculate-heart",
    activeMonths: [12],
    seasonLabel: "Opens in Advent",
  },
  {
    id: "consecration",
    title: "33 Days to Mary",
    summary: "A longer journey of entrustment to God through Mary. Begin whenever you're ready.",
    novenaId: "immaculate-heart",
    activeMonths: [],
    seasonLabel: "Always open",
  },
];

export function challengeAvailable(c: Challenge, date: Date = new Date()): boolean {
  if (c.activeMonths.length === 0) return true;
  return c.activeMonths.includes(date.getMonth() + 1);
}
