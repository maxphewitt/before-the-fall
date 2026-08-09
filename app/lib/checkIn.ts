/**
 * Check-In — tiers, types, and every word of the returning-user welfare
 * check. Pure module (no "use server") so both server pages and client
 * components can import types and constants.
 *
 * DRAFT COPY — pending clinician review before public launch. No clinical
 * claims, no diagnosis; this is a welfare check and a doorway, not care.
 *
 * Design rules (Max + the 2026-07-28 Platform Audit note, non-negotiable):
 *  - NEVER shame-frame absence. No day counts shown to the user, ever.
 *    Warm: "It's been a little while. It's good to see you."
 *  - Contrition without shame: the "I fell" branch says a lapse is a page,
 *    not the book; invites honest naming in the PRIVATE encrypted journal;
 *    and gives sorrow a destination (Confession prep / Seven Sorrows for
 *    faith users, "tell one person" + tools for secular users). Everything
 *    is an offer, never homework.
 *  - Struggling/fell branches carry a quiet line that the crisis button
 *    and /tools are always there.
 */

export type CheckInTier = "none" | "gentle" | "full" | "welcome-back";

export type CheckInMood = "steady" | "wobbly" | "struggling" | "fell";

export const CHECK_IN_MOODS: readonly CheckInMood[] = [
  "steady",
  "wobbly",
  "struggling",
  "fell",
] as const;

export type CheckInNextStep = "tool-now" | "keep-habit" | "rest";

export const CHECK_IN_NEXT_STEPS: readonly CheckInNextStep[] = [
  "tool-now",
  "keep-habit",
  "rest",
] as const;

/**
 * Map days since the last active day to a check-in tier.
 *   none          < 3 days  — no check-in offered (normal rhythm)
 *   gentle        3–6 days  — a light "good to see you"
 *   full          7–29 days — the full welfare check
 *   welcome-back  30+ days  — the door-was-never-closed welcome
 */
export function getCheckInTier(daysAway: number): CheckInTier {
  if (daysAway < 3) return "none";
  if (daysAway < 7) return "gentle";
  if (daysAway < 30) return "full";
  return "welcome-back";
}

/* ── Script shapes ── */

export type CheckInSuggestion = {
  title: string;
  description: string;
  /** Omitted for non-navigational cards (e.g. "Tell one person you trust"). */
  href?: string;
};

export type CheckInBranch = {
  heading: string;
  body: string;
  /**
   * Only on the "fell" branch: the lapse-is-not-collapse framing shown as
   * its own step BEFORE the journal invitation.
   */
  lapsePreface?: { title: string; body: string };
  journalPrompt: string;
  journalPlaceholder: string;
  /** Shown on the steady branch instead of tool cards. */
  affirmation?: string;
  /**
   * Quiet safety line for the struggling/fell branches — the crisis
   * button and /tools are always there. Never alarmist, never clinical.
   */
  supportLine?: string;
  suggestions: CheckInSuggestion[];
};

export type CheckInScript = {
  greeting: { title: string; body: string };
  moodQuestion: { title: string; body: string };
  moodOptions: { value: CheckInMood; label: string; description: string }[];
  branches: Record<CheckInMood, CheckInBranch>;
  nextSteps: {
    value: CheckInNextStep;
    title: string;
    description: string;
    href?: string;
  }[];
  closing: { title: string; body: string };
};

/* ── The AI seam ── */

/**
 * FUTURE AI SEAT (Max's 2026-07-28 vision): the built-in AI progress
 * companion will replace this function — same inputs plus the user's
 * structured history (check_ins rows, habit data), personalized questions
 * out. Keep the interface stable: everything the check-in UI renders
 * (greeting, mood question + options, per-mood branch copy, next-step
 * choices, closing) comes from this single function and nowhere else, so
 * swapping the rule-based script for a generated one is a one-function
 * change. Callers must not hardcode check-in copy around it.
 *
 * Rule-based for now: tier + faith path + optional display name in, a
 * complete script out. `mood` is accepted (and currently unused) so the
 * AI version can tailor follow-ups mid-flow without a signature change.
 */
export function getCheckInScript(ctx: {
  tier: CheckInTier;
  mood?: CheckInMood;
  secular: boolean;
  displayName?: string | null;
}): CheckInScript {
  const name = ctx.displayName?.trim();
  const seeYou = name ? `It's good to see you, ${name}.` : "It's good to see you.";

  let greeting: CheckInScript["greeting"];
  switch (ctx.tier) {
    case "gentle":
      greeting = {
        title: seeYou,
        body:
          "It's been a few days. Nothing is owed and nothing needs catching up — just take a minute to land before anything else.",
      };
      break;
    case "full":
      greeting = {
        title: seeYou,
        body:
          "It's been a little while. That's okay — this isn't attendance, it's a welfare check. Take a breath; we'll start exactly where you are.",
      };
      break;
    case "welcome-back":
      greeting = {
        title: name ? `Welcome back, ${name}.` : "Welcome back.",
        body:
          "It's really good to see you. The door was never closed, and nothing here kept score while you were away. Let's just see where you are today.",
      };
      break;
    default:
      greeting = {
        title: seeYou,
        body: "A quick check-in, any time you want one. Where are you today?",
      };
  }

  const moodQuestion = {
    title: "How are you, really?",
    body: "Not how you think you should be. Pick whichever is closest — there's no wrong answer here.",
  };

  const moodOptions: CheckInScript["moodOptions"] = [
    {
      value: "steady",
      label: "Steady",
      description: "Things are holding. Today feels workable.",
    },
    {
      value: "wobbly",
      label: "A little wobbly",
      description: "Mostly okay, but something feels off or fragile.",
    },
    {
      value: "struggling",
      label: "Struggling",
      description: "It's heavy right now, and it's taking real effort.",
    },
    {
      value: "fell",
      label: "I fell",
      description: "Something happened that you wish hadn't. You're safe to say it here.",
    },
  ];

  const supportLine =
    "If it's more than this page can hold, the crisis button at the bottom of the screen is always there, and the tools are open any hour.";

  const steadyingTools: CheckInSuggestion[] = [
    {
      title: "Box breathing",
      description: "Four slow sides of a square. About three minutes.",
      href: "/tools/box-breathing/start",
    },
    {
      title: "Grounding",
      description: "Come back to your senses, one at a time.",
      href: "/tools/grounding/start",
    },
  ];

  const fellSuggestions: CheckInSuggestion[] = ctx.secular
    ? [
        {
          title: "Tell one person you trust",
          description:
            "Shame shrinks when it's spoken. One honest sentence to one safe person is enough.",
        },
        {
          title: "Urge surfing",
          description: "Ride the next wave instead of fighting it.",
          href: "/tools/urge-surfing/start",
        },
        {
          title: "Thought record",
          description: "Check the story this moment is telling you.",
          href: "/tools/thought-record/start",
        },
      ]
    : [
        {
          title: "Seven Sorrows Rosary",
          description: "A quiet chaplet for sorrow that needs somewhere to go.",
          href: "/catholic-path/rosary/seven-sorrows",
        },
        {
          title: "Prepare for Confession",
          description: "When you're ready — mercy is a sacrament, not a mood.",
          href: "/catholic-path/prayers",
        },
      ];

  const branches: Record<CheckInMood, CheckInBranch> = {
    steady: {
      heading: "Steady is worth naming.",
      body:
        "When things are holding, it helps to notice why. Steadiness has ingredients — knowing yours means you can reach for them on harder days.",
      journalPrompt: "What's been helping?",
      journalPlaceholder:
        "A habit, a person, a small choice that's been working…",
      affirmation:
        "Keep doing the quiet things that got you here. They're working.",
      suggestions: [],
    },
    wobbly: {
      heading: "Wobbly is information, not failure.",
      body:
        "Catching a wobble early is a skill, and you just used it. A few steadying minutes now often do more than an hour of white-knuckling later.",
      journalPrompt: "If you want, name the wobble.",
      journalPlaceholder: "What feels off? Even a fragment is enough.",
      suggestions: steadyingTools,
    },
    struggling: {
      heading: "Thank you for saying it plainly.",
      body:
        "Struggling and showing up at the same time is not a contradiction — it's what showing up usually looks like. Let the next few minutes be lighter, not heavier.",
      journalPrompt: "What's the heaviest part right now?",
      journalPlaceholder:
        "You don't have to solve it — just set it down here.",
      supportLine,
      suggestions: steadyingTools,
    },
    fell: {
      heading: "Name it plainly — this is only for you.",
      body: ctx.secular
        ? "Your journal is encrypted; no one else will ever read it. Putting honest words to what happened — without softening it, and without flogging yourself — is how a page turns. If you want them, there are places for this to go next."
        : "Your journal is encrypted; no one else will ever read it. Putting honest words to what happened — without softening it, and without flogging yourself — is how a page turns. If you want it, sorrow has a destination here. These are offers, never homework.",
      lapsePreface: {
        title: "The fall is a page, not the book.",
        body:
          "A lapse is a moment, not a verdict. It doesn't erase what you've built, and it doesn't decide what happens next — the next hour does. Feeling sorrow about it is honest; carrying shame about it is a weight you were never meant to keep.",
      },
      journalPrompt: "What happened, in your own words?",
      journalPlaceholder:
        "Plain words are enough. This stays between you and this page.",
      supportLine,
      suggestions: fellSuggestions,
    },
  };

  const nextSteps: CheckInScript["nextSteps"] = [
    {
      value: "tool-now",
      title: "Do a three-minute tool now",
      description: "Box breathing — a small, real reset.",
      href: "/tools/box-breathing/start",
    },
    {
      value: "keep-habit",
      title: "Keep one small daily habit",
      description: "Add or keep just one thing in your day.",
      href: "/home",
    },
    {
      value: "rest",
      title: "Write nothing more — just rest",
      description: "Coming back was enough for today.",
    },
  ];

  const closing = {
    title: "However today went, you came back.",
    body:
      "That's the whole practice. See you tomorrow, or whenever you're next here — the door stays open.",
  };

  return { greeting, moodQuestion, moodOptions, branches, nextSteps, closing };
}

/**
 * The one-liner for the Home card that invites a returning user to
 * /check-in. Part of the same seam as getCheckInScript — the future AI
 * companion may personalize this too. Never mentions day counts.
 */
export function getCheckInInvite(tier: CheckInTier): {
  title: string;
  body: string;
} {
  switch (tier) {
    case "gentle":
      return {
        title: "It's been a few days — it's good to see you.",
        body: "A one-minute check-in, if you'd like: where are you today?",
      };
    case "full":
      return {
        title: "It's been a little while. It's good to see you.",
        body: "No catching up owed. Take a minute to land before anything else.",
      };
    case "welcome-back":
      return {
        title: "Welcome back. The door was never closed.",
        body: "Take a minute to arrive — a gentle check-in, nothing more.",
      };
    default:
      return {
        title: "It's good to see you.",
        body: "A quick check-in, any time you want one.",
      };
  }
}
