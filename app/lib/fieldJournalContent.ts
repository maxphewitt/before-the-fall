/**
 * Field Journal — shared content + logic (pure TS, used by the client
 * flow and the server actions).
 *
 * Principles baked in (from the spec + the verified evidence base, see
 * docs/FIELD-JOURNAL-RESEARCH.md):
 *  - Honesty over outcome: XP is constant across outcomes (anti-shame).
 *  - Forgiving streak: counts days you showed up; a slip keeps it; a
 *    missed day spends a freeze before resetting.
 *  - Non-shaming: "gave in" is calm slate, never alarm-red.
 *  - Severity flags a human; it never makes a clinical call or alarms.
 *    WARNING: thresholds are placeholders pending clinician + legal sign-off.
 */

export const XP_PER_LOG = 10;
export const ENDOWED_XP = 30; // endowed-progress head start (never start at 0)
export const STREAK_FREEZES = 2;

export const RANKS = [
  { name: "Keeping watch", at: 0 },
  { name: "Steady hand", at: 300 },
  { name: "Well-worn path", at: 1000 },
  { name: "Quiet strength", at: 2200 },
] as const;

export function rankFor(xp: number): {
  name: string;
  next: string | null;
  toNext: number;
  pct: number;
} {
  let i = 0;
  RANKS.forEach((r, idx) => {
    if (xp >= r.at) i = idx;
  });
  const rank = RANKS[i];
  const next = RANKS[i + 1] ?? null;
  const pct = next ? Math.min(100, ((xp - rank.at) / (next.at - rank.at)) * 100) : 100;
  return {
    name: rank.name,
    next: next ? next.name : null,
    toNext: next ? next.at - xp : 0,
    pct: Math.round(pct),
  };
}

/** Trigger contexts (built-ins). Custom situations are stored per-user. */
export const CONTEXTS: Record<string, string> = {
  home_alone: "Home, alone",
  scrolling: "Scrolling",
  late_night: "Late night",
  boredom: "Restless / bored",
  work_stress: "Stress",
  fatigue: "Worn down",
  after_conflict: "After conflict",
  social: "Around others",
};

export type Outcome = "surfed" | "left_scene" | "gave_in";

/** Outcome cards. "gave_in" is neutral slate — never alarm-red. */
export const OUTCOMES: Record<Outcome, { label: string; sub: string; tone: "surf" | "left" | "slip" }> = {
  surfed: { label: "Stood firm", sub: "rode the urge out", tone: "surf" },
  left_scene: { label: "Stepped away", sub: "changed my situation", tone: "left" },
  gave_in: { label: "Gave in", sub: "and naming it is the work", tone: "slip" },
};

export const HALT_STATES = ["Hungry", "Angry", "Anxious", "Lonely", "Tired", "Restless", "Steady"] as const;

export function contextLabel(key: string, custom: Record<string, string> = {}): string {
  return CONTEXTS[key] ?? custom[key] ?? key;
}

/**
 * Severity. The model/heuristic flags; a human decides. `flag` adds a
 * calm line + a warm support card; `urgent` routes more firmly to the
 * crisis flow. Never alarms, never names self-harm methods.
 * WARNING: Placeholder thresholds — clinician + lawyer must confirm.
 */
const DISTRESS = /(can'?t go on|end it|hopeless|no point|hurt myself|kill myself|worthless|give up on)/i;
export function severity(
  input: { intensity: number; outcome: Outcome; detail?: string },
  priorHighCount = 0
): { flag: boolean; urgent: boolean } {
  const veryHigh = input.intensity >= 9;
  const highSlip = input.outcome === "gave_in" && input.intensity >= 8;
  const distress = DISTRESS.test(input.detail ?? "");
  return {
    flag: veryHigh || highSlip || distress,
    urgent: distress || (veryHigh && priorHighCount >= 1),
  };
}

export type Recommendation = {
  title: string;
  body: string;
  plan: string | null;
  cta: { label: string; href: string };
};

/**
 * One entry → one concrete next move. After a context recurs 3+ times,
 * auto-fills an if-then plan (implementation intentions — Gollwitzer &
 * Sheeran 2006).
 */
export function recommend(
  input: { context: string; intensity: number; outcome: Outcome; detail?: string },
  contextCount: number,
  label: string
): Recommendation {
  const high = input.intensity >= 7;
  if (input.outcome === "surfed") {
    return {
      title: "Remembered: what worked",
      body: input.detail
        ? `“${input.detail}” — that's going into your playbook. The weekly review ranks what helps you most.`
        : "What you just did goes into your playbook.",
      plan: null,
      cta: { label: "Back to journal", href: "/field-journal" },
    };
  }
  if (input.outcome === "gave_in" && high) {
    return {
      title: "Ride It Out — for next time",
      body: "Urges crest and fall like a wave, usually within twenty to thirty minutes. Ride It Out walks you through the peak.",
      plan:
        contextCount >= 3
          ? `When I'm “${label}” and it climbs past 6, then I open Ride It Out before I decide anything.`
          : null,
      cta: { label: "Open Ride It Out", href: "/tools/urge-surfing/start" },
    };
  }
  return {
    title: "A small thing, well done",
    body: `That's ${contextCount} ${contextCount === 1 ? "entry" : "entries"} from “${label}”. You're building a real map of this corner of your life.`,
    plan:
      contextCount >= 3
        ? `When I find myself “${label}”, then I write it down first, decide second.`
        : null,
    cta: { label: "Back to journal", href: "/field-journal" },
  };
}
