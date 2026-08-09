/**
 * Lean daily-recommendation engine (2026-07-06).
 *
 * Turns "what the user is struggling with" (their onboarding populations,
 * plus any extra topics they choose) into a SPECIFIC piece of content for
 * the day — a named Scripture passage, a named prayer, and today's Rosary
 * mystery — so the daily habits are personal ("Pray the Sorrowful
 * Mysteries", "Psalm 23") and deep-link straight to the content instead of
 * a hub.
 *
 * Deliberately simple: theme/tag intersection + a per-day deterministic
 * pick (stable on refresh, rotates daily). No ML, no scoring model.
 */

import { PASSAGES, type ScriptureTheme } from "./scripture";
import { PRAYERS } from "./prayers";
import { MYSTERIES, todaysMysterySlug } from "./rosary";
import type { PopulationSlug } from "./habits";

export type ContentRec = { id: string; title: string; href: string };
export type RosaryRec = { slug: string; adjective: string; href: string };

/** Struggle → Scripture themes that tend to meet it. */
const POP_THEMES: Record<PopulationSlug, ScriptureTheme[]> = {
  "sexual-compulsion": ["mercy", "conversion", "surrender"],
  "dv-survivor": ["comfort", "healing", "trust"],
  "dv-perpetrator": ["conversion", "mercy"],
  substance: ["mercy", "conversion", "trust"],
  "self-harm-si": ["comfort", "mercy", "hope"],
  "depression-anxiety": ["trust", "comfort", "hope"],
  "general-distress": ["comfort", "trust"],
};

/** Struggle → prayer tags that tend to meet it. */
const POP_PRAYER_TAGS: Record<PopulationSlug, string[]> = {
  "sexual-compulsion": ["temptation", "urge", "mercy", "shame"],
  "dv-survivor": ["fear", "protection", "comfort"],
  "dv-perpetrator": ["contrition", "temptation", "mercy"],
  substance: ["temptation", "urge", "mercy"],
  "self-harm-si": ["fear", "mercy", "protection"],
  "depression-anxiety": ["anxiety", "fear", "peace", "trust"],
  "general-distress": ["peace", "fear", "trust"],
};

const FALLBACK_THEMES: ScriptureTheme[] = ["comfort", "trust", "hope"];
const FALLBACK_TAGS = ["peace", "trust", "mercy"];

/** All themes a user can browse/choose from (for the customize screen). */
export const ALL_THEMES: ScriptureTheme[] = [
  "comfort", "trust", "hope", "mercy", "surrender",
  "healing", "conversion", "discernment", "suffering", "thanksgiving",
];

export function scriptureThemesFor(
  populations: PopulationSlug[],
  extra: ScriptureTheme[] = []
): ScriptureTheme[] {
  const set = new Set<ScriptureTheme>(extra);
  for (const p of populations) for (const t of POP_THEMES[p] ?? []) set.add(t);
  if (set.size === 0) FALLBACK_THEMES.forEach((t) => set.add(t));
  return Array.from(set);
}

export function prayerTagsFor(populations: PopulationSlug[]): string[] {
  const set = new Set<string>();
  for (const p of populations) for (const t of POP_PRAYER_TAGS[p] ?? []) set.add(t);
  if (set.size === 0) FALLBACK_TAGS.forEach((t) => set.add(t));
  return Array.from(set);
}

/** Stable seed for "today" so a pick doesn't change on refresh but rotates daily. */
export function daySeed(d: Date = new Date()): number {
  return d.getFullYear() * 372 + d.getMonth() * 31 + d.getDate();
}

function pick<T>(arr: T[], seed: number): T | null {
  return arr.length ? arr[seed % arr.length] : null;
}

export function recommendScripture(
  themes: ScriptureTheme[],
  seed: number
): ContentRec | null {
  const matches = PASSAGES.filter((p) => p.themes.some((t) => themes.includes(t)));
  const pool = matches.length > 0 ? matches : PASSAGES;
  const p = pick(pool, seed);
  return p ? { id: p.id, title: p.title, href: `/catholic-path/scripture/${p.id}` } : null;
}

export function recommendPrayer(tags: string[], seed: number): ContentRec | null {
  const matches = PRAYERS.filter((pr) => pr.tags.some((t) => tags.includes(t)));
  const pool = matches.length > 0 ? matches : PRAYERS;
  const pr = pick(pool, seed + 1); // +1 so prayer and scripture don't lock-step
  return pr ? { id: pr.id, title: pr.title, href: `/catholic-path/prayers/${pr.id}` } : null;
}

export function recommendRosary(): RosaryRec {
  const slug = todaysMysterySlug();
  const m = MYSTERIES.find((x) => x.slug === slug);
  const adjective = slug.charAt(0).toUpperCase() + slug.slice(1);
  return {
    slug,
    adjective: m ? adjective : adjective,
    href: `/catholic-path/rosary/${slug}`,
  };
}
