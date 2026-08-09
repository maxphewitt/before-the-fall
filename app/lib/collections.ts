/**
 * "For where you are" collections (2026-07-28) — curated bundles for a
 * specific state (anxiety, grief, stillness, sleep), assembling what the
 * app already has: clinical tools for both paths, Scripture + prayers for
 * faith users, wisdom readings for secular users. Content, not code, is
 * the point — expand freely.
 *
 * 2026-08-03: the per-passage "Food for thought" notes moved into the
 * Scripture dataset itself (`ScripturePassage.deeper`), shown after the
 * guided reading instead of on the collection page.
 */

import type { ScriptureTheme } from "./scripture";
import type { WisdomTheme } from "./wisdom";

export type CollectionTool = { slug: string; label: string; blurb: string };

export type CollectionPassage = {
  /** A passage id from scripture.ts. */
  id: string;
};

export type Collection = {
  slug: string;
  title: string;
  tagline: string;
  /** Short pastoral intro shown under the title. */
  intro: string;
  tools: CollectionTool[];
  /**
   * Faith track: explicitly curated passages. Curated per state so no
   * two collections surface the same set of passages. Commentary lives
   * on the passages themselves (`ScripturePassage.deeper`).
   */
  passages: CollectionPassage[];
  /** Faith track fallback: used only if the curated list resolves empty. */
  scriptureThemes: ScriptureTheme[];
  /** Secular track: readings with these themes are surfaced. */
  wisdomThemes: WisdomTheme[];
};

export const COLLECTIONS: Collection[] = [
  {
    slug: "anxiety",
    title: "Anxiety",
    tagline: "For the racing mind",
    intro:
      "When the mind runs ahead of you, start with the body — slow the breath first, then give the thoughts somewhere to go.",
    tools: [
      { slug: "box-breathing", label: "Box Breathing", blurb: "Four sides, four counts — the fastest way down." },
      { slug: "grounding", label: "5-4-3-2-1 Grounding", blurb: "Come back to the room through the senses." },
      { slug: "thought-record", label: "Thought Record", blurb: "Look at the thought instead of from it." },
    ],
    passages: [
      { id: "lilies-of-the-field" },
      { id: "philippians-4-peace" },
      { id: "cast-your-cares-1-peter" },
      { id: "be-not-afraid-isaiah" },
    ],
    scriptureThemes: ["comfort", "trust"],
    wisdomThemes: ["anxiety", "stillness"],
  },
  {
    slug: "grief",
    title: "Grief",
    tagline: "For the heavy heart",
    intro:
      "Grief is love continuing to speak. Nothing here rushes you — these are companions for carrying it, not fixes.",
    tools: [
      { slug: "grounding", label: "5-4-3-2-1 Grounding", blurb: "For the waves that arrive without warning." },
      { slug: "thought-record", label: "Thought Record", blurb: "For the thoughts grief brings with it." },
    ],
    passages: [
      { id: "psalm-34-brokenhearted" },
      { id: "psalm-147-broken-heart" },
      { id: "beatitudes" },
      { id: "all-things-work-for-good" },
    ],
    scriptureThemes: ["comfort", "suffering", "hope"],
    wisdomThemes: ["grief", "hope"],
  },
  {
    slug: "stillness",
    title: "Stillness",
    tagline: "For the noise inside",
    intro:
      "Stillness is a skill, not a mood — a retreat you can reach from anywhere, two minutes at a time.",
    tools: [
      { slug: "box-breathing", label: "Box Breathing", blurb: "A rhythm the mind can rest in." },
      { slug: "grounding", label: "5-4-3-2-1 Grounding", blurb: "Anchor in what is actually here." },
    ],
    passages: [
      { id: "be-still-psalm-46" },
      { id: "elijah-gentle-air" },
      { id: "john-14-27" },
    ],
    scriptureThemes: ["trust", "surrender"],
    wisdomThemes: ["stillness"],
  },
  {
    slug: "sleep",
    title: "Sleep",
    tagline: "For the long nights",
    intro:
      "The night has a way of making everything louder. These are for the hour when you can't put the day down.",
    tools: [
      { slug: "box-breathing", label: "Box Breathing", blurb: "Slow everything down before bed." },
      { slug: "tipp", label: "TIPP", blurb: "For when the body won't settle." },
    ],
    passages: [
      { id: "psalm-23" },
      { id: "matt-11-28" },
      { id: "into-thy-hands" },
      { id: "lamentations-new-every-morning" },
    ],
    scriptureThemes: ["comfort", "trust"],
    wisdomThemes: ["stillness", "anxiety"],
  },
];

export function getCollectionBySlug(slug: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.slug === slug);
}
