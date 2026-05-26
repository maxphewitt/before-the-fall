/**
 * Habit definitions for the Today tracker.
 *
 * Eleven possible habits in v1. Users get a pre-populated default set
 * based on the populations they selected at onboarding (plus the
 * Catholic Path habits if their faith_role is Catholic-warm). They
 * can edit the set at /today/edit any time.
 *
 * Completion is journal-derived, not navigation-derived:
 *   - Tool habits (stop, urge-surfing, etc.) complete when the
 *     corresponding ToolWalker closing screen calls
 *     recordHabitCompletion().
 *   - 'journal' completes on any createEntry where journal_type is
 *     NOT 'activity'.
 *   - 'prayer' completes when the PrayerWalker closing screen fires.
 *   - 'rosary' completes when the RosaryWalker mystery closes.
 *   - 'scripture' completes when the ScriptureWalker closing fires.
 */

import type { JournalType } from "./journalTypes";

export type HabitSlug =
  | "stop"
  | "urge-surfing"
  | "box-breathing"
  | "grounding"
  | "tipp"
  | "thought-record"
  | "journal"
  | "prayer"
  | "rosary"
  | "scripture";

export type HabitCategory = "tier-1" | "journal" | "catholic-path";

export type HabitDefinition = {
  slug: HabitSlug;
  label: string;
  /** One-line description shown on the row. */
  description: string;
  /** "Why this is recommended" — appears when a user expands the row. Cites the clinical or theological tradition. */
  why: string;
  /** Where Begin routes to. */
  beginHref: string;
  category: HabitCategory;
};

export const HABITS: Record<HabitSlug, HabitDefinition> = {
  stop: {
    slug: "stop",
    label: "STOP",
    description: "Half-second pause between urge and action.",
    why: "DBT crisis-survival skill (Linehan, 2014). The deliberate gap is the entire intervention; nothing else is asked.",
    beginHref: "/tools/stop/start",
    category: "tier-1",
  },
  "urge-surfing": {
    slug: "urge-surfing",
    label: "Urge Surfing",
    description: "Ride the wave instead of acting on it.",
    why: "Marlatt & Gordon (1985) — urges peak then fall within 20–30 min. Repeated practice reduces their frequency and intensity over time.",
    beginHref: "/tools/urge-surfing/start",
    category: "tier-1",
  },
  "box-breathing": {
    slug: "box-breathing",
    label: "Box Breathing",
    description: "Four counts in, four held, four out, four held.",
    why: "Slow paced breathing activates the parasympathetic nervous system, lowering heart rate within 90 seconds. Used in U.S. military performance training.",
    beginHref: "/tools/box-breathing/start",
    category: "tier-1",
  },
  grounding: {
    slug: "grounding",
    label: "5-4-3-2-1 Grounding",
    description: "Pull yourself back into the present, one sense at a time.",
    why: "Trauma-informed practice endorsed by the VA and SAMHSA. Sensory grounding interrupts dissociation and rumination loops.",
    beginHref: "/tools/grounding/start",
    category: "tier-1",
  },
  tipp: {
    slug: "tipp",
    label: "TIPP",
    description: "Physical reset when thinking-based tools feel impossible.",
    why: "DBT distress-tolerance skill (Linehan, 2014). Works on physiology before psychology — cold, exertion, breath, muscle release.",
    beginHref: "/tools/tipp/start",
    category: "tier-1",
  },
  "thought-record": {
    slug: "thought-record",
    label: "Thought Record",
    description: "Examine the thought instead of obeying it.",
    why: "Cognitive Behavioral Therapy (Beck, 1979). Forcing automatic thoughts to defend themselves against evidence is the core CBT mechanism.",
    beginHref: "/tools/thought-record/start",
    category: "tier-1",
  },
  journal: {
    slug: "journal",
    label: "Journal",
    description: "Write whatever you need to. Encrypted at rest.",
    why: "Expressive writing has 30+ years of research support for reducing depressive symptoms and improving immune function (Pennebaker). The act of naming the thing matters.",
    beginHref: "/journal/new",
    category: "journal",
  },
  prayer: {
    slug: "prayer",
    label: "Prayer",
    description: "Pray one prayer from the library, line by line.",
    why: "Two thousand years of Catholic tradition; specific traditional prayers for specific spiritual needs. Pair with sacramental life — this does not replace confession or the Eucharist.",
    beginHref: "/catholic-path/prayers",
    category: "catholic-path",
  },
  rosary: {
    slug: "rosary",
    label: "Rosary",
    description: "Today's mystery, with a walker that paces it.",
    why: "The Rosary's day-of-week schedule means there's always a 'today's mystery' — no decision fatigue. Praying it as a slow, repetitive act is the point.",
    beginHref: "/catholic-path/rosary",
    category: "catholic-path",
  },
  scripture: {
    slug: "scripture",
    label: "Daily Scripture",
    description: "One Gospel passage, read slowly.",
    why: "Lectio divina — the Church's centuries-old practice of slow scripture reading with reflection. Different from study; closer to listening.",
    beginHref: "/catholic-path/scripture",
    category: "catholic-path",
  },
};

export const HABIT_SLUGS: HabitSlug[] = Object.keys(HABITS) as HabitSlug[];

/* ────────────────────────────────────────────────────────────────────
   Population → default habits mapping
   ──────────────────────────────────────────────────────────────────── */

/**
 * Population identifiers as stored in user_profiles.populations.
 * These match the existing onboarding multi-select.
 */
export type PopulationSlug =
  | "sexual-compulsion"
  | "dv-survivor"
  | "dv-perpetrator"
  | "substance"
  | "self-harm-si"
  | "depression-anxiety"
  | "general-distress";

const SECULAR_DEFAULTS: Record<PopulationSlug, HabitSlug[]> = {
  "sexual-compulsion": ["stop", "urge-surfing", "journal"],
  "dv-survivor": ["grounding", "tipp", "journal"],
  "dv-perpetrator": ["stop", "thought-record", "journal"],
  substance: ["urge-surfing", "thought-record", "journal"],
  "self-harm-si": ["tipp", "grounding", "box-breathing", "journal"],
  "depression-anxiety": ["thought-record", "grounding", "journal"],
  "general-distress": ["box-breathing", "journal"],
};

/**
 * Catholic-warm users get prayer + scripture added; sexual-compulsion
 * and substance get the rosary too because the Marian/contemplative
 * tradition pairs particularly well with compulsion work.
 */
const CATHOLIC_PATH_ADDITIONS: Record<PopulationSlug, HabitSlug[]> = {
  "sexual-compulsion": ["prayer", "rosary"],
  "dv-survivor": ["prayer"],
  "dv-perpetrator": ["prayer"],
  substance: ["prayer", "rosary"],
  "self-harm-si": ["prayer"],
  "depression-anxiety": ["prayer", "scripture"],
  "general-distress": ["prayer"],
};

/**
 * Pick the default habit list for a user based on their selected
 * populations and faith stance. Deduplicates across populations and
 * preserves a reasonable order.
 *
 * @param populations  the user's selected populations
 * @param catholicPath whether their faith_role qualifies for Catholic Path additions
 */
export function defaultHabitsForUser(
  populations: PopulationSlug[],
  catholicPath: boolean
): HabitSlug[] {
  const set = new Set<HabitSlug>();
  for (const p of populations) {
    const secular = SECULAR_DEFAULTS[p];
    if (secular) for (const h of secular) set.add(h);
    if (catholicPath) {
      const faith = CATHOLIC_PATH_ADDITIONS[p];
      if (faith) for (const h of faith) set.add(h);
    }
  }
  // Empty-input fallback so newly-created users always get something
  // workable.
  if (set.size === 0) {
    set.add("journal");
    set.add("box-breathing");
    if (catholicPath) set.add("prayer");
  }
  // Stable display order: tools first, journal middle, Catholic Path last.
  const order: Record<HabitCategory, number> = {
    "tier-1": 0,
    journal: 1,
    "catholic-path": 2,
  };
  return Array.from(set).sort(
    (a, b) => order[HABITS[a].category] - order[HABITS[b].category]
  );
}

/* ────────────────────────────────────────────────────────────────────
   Journal type → habit slug helper
   ──────────────────────────────────────────────────────────────────── */

/**
 * When createEntry succeeds with one of these journal types, record
 * a 'journal' habit completion. Activity entries (tool sessions) are
 * already recorded via createToolSession with their tool_slug.
 */
const JOURNAL_TYPES_THAT_COMPLETE_HABIT: ReadonlySet<JournalType> = new Set([
  "daily",
  "reflection",
  "note",
  "intention",
]);

export function journalTypeCompletesHabit(type: JournalType): boolean {
  return JOURNAL_TYPES_THAT_COMPLETE_HABIT.has(type);
}

/**
 * Map the population values stored in user_profiles.populations
 * (set by /onboard) to the habits PopulationSlug type.
 *
 * KNOWN LIMITATION: onboarding's `relationship_abuse` doesn't
 * distinguish DV survivor from DV perpetrator. v1 defaults to
 * `dv-survivor` because survivor defaults (grounding, TIPP) are the
 * safer baseline (less risk of pushing a perpetrator toward a tool
 * they'd misuse). Users self-identify by editing their habits at
 * /today/edit. Fix in v1.1 by adding a follow-up onboarding question.
 */
export function mapOnboardingPopulation(raw: string): PopulationSlug | null {
  switch (raw) {
    case "porn":
      return "sexual-compulsion";
    case "substance":
      return "substance";
    case "self_harm":
      return "self-harm-si";
    case "relationship_abuse":
      return "dv-survivor";
    case "depression_anxiety":
      return "depression-anxiety";
    case "other":
      return "general-distress";
    default:
      return null;
  }
}
