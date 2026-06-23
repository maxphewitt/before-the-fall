/**
 * Pure types + constants for the journal domain. Lives outside the
 * "use server" file (app/actions/journal.ts) because Next.js Server
 * Actions modules can only export async functions — non-function
 * exports (types, consts) belong here.
 *
 * Client components import from here directly; server actions
 * re-import these into the action module without re-exporting.
 */

export type JournalType =
  | "daily"
  | "reflection"
  | "activity"
  | "note"
  | "intention";

export const JOURNAL_TYPES: readonly JournalType[] = [
  "daily",
  "reflection",
  "activity",
  "note",
  "intention",
] as const;

/**
 * Structured payload for `activity` entries created via the Self-Help
 * Tool Walker. Stored as JSON inside the encrypted body so it is not
 * persisted in plaintext anywhere, but is machine-readable when
 * decrypted server-side (for the future AI companion's progression
 * tracking).
 *
 * Plain-text `daily`, `reflection`, `note`, and `intention` entries
 * keep the text as-is in the encrypted body (no JSON wrapping) so the
 * existing UX of "just write something" is preserved.
 */
export type ToolSessionStep = {
  heading: string;
  prompt: string;
  userAnswer: string;
};

/**
 * Optional before/after self-rating attached to a tool session.
 *
 * This is a Subjective Units of Distress (SUDS)-style 0–10 self-report:
 * a personal self-monitoring signal that lets someone notice their own
 * change. It is NOT a clinical outcome measure and aggregate deltas are
 * NOT evidence the tool "works" (self-report before/after is prone to
 * demand effects). Copy shown to the user must frame it that way.
 *
 * `before` / `after` are integers 0–10 (0 = calm, 10 = overwhelmed).
 * Either may be omitted — the check is always skippable, because even a
 * single question can be too much in acute distress.
 */
export type ToolStateCheck = {
  scale: "charge-0-10";
  before?: number;
  after?: number;
};

/**
 * Acceptance-based outcome category for tools where reducing intensity is
 * NOT the goal (urge surfing). All three carry equal weight — a slip is a
 * logged act of showing up, never a failure or a streak-break. This framing
 * is grounded in the Abstinence Violation Effect literature.
 */
export type UrgeOutcome = "rode_it_out" | "stepped_away" | "acted_on_it";

export type ToolSessionPayload = {
  kind: "tool_session";
  version: "v1";
  toolSlug: string;
  toolName: string;
  completedAt: string;
  steps: ToolSessionStep[];
  summary?: string;
  /** Optional 0–10 before/after self-rating (see ToolStateCheck). */
  stateCheck?: ToolStateCheck;
  /**
   * Optional acceptance-based outcome (e.g. urge surfing). Stored as the
   * raw union value; the UI maps it to warm, equal-weight labels.
   */
  outcome?: UrgeOutcome;
  /**
   * Optional 0–100 coping self-efficacy ("how able do you feel to handle
   * urges like this?"). A rising-is-good signal drawn from situational-
   * confidence measures — never framed as a target to drop.
   */
  confidence?: number;
};

/**
 * Coarse, privacy-preserving local time-of-day bucket for a state check.
 * Computed on the device from the local clock so cross-tool insights
 * ("you tend to ground late at night") never require storing a precise
 * timestamp or location. Intentionally low-resolution.
 */
export type TimeOfDayBucket =
  | "early-morning" // 5–8
  | "morning" // 8–12
  | "afternoon" // 12–17
  | "evening" // 17–21
  | "night" // 21–24
  | "late-night"; // 0–5

export const TIME_OF_DAY_BUCKETS: readonly TimeOfDayBucket[] = [
  "early-morning",
  "morning",
  "afternoon",
  "evening",
  "night",
  "late-night",
] as const;

/** Compute the coarse local time-of-day bucket from a Date (default now). */
export function timeOfDayBucket(d: Date = new Date()): TimeOfDayBucket {
  const h = d.getHours();
  if (h < 5) return "late-night";
  if (h < 8) return "early-morning";
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  if (h < 21) return "evening";
  return "night";
}

/**
 * A single decrypted grounding/tool moment, shaped for the grove archive.
 * Words come from the encrypted journal payload; before/after come from
 * its stateCheck. Never includes anything not already in the user's own
 * entry.
 */
export type ToolMoment = {
  id: string;
  toolSlug: string;
  toolName: string;
  completedAt: string;
  /** Non-empty user answers, in step order. */
  words: string[];
  before?: number;
  after?: number;
  /** Acceptance-based outcome (urge surfing). */
  outcome?: UrgeOutcome;
  /** 0–100 coping confidence. */
  confidence?: number;
};

export type JournalEntry = {
  id: string;
  createdAt: string;
  updatedAt: string;
  journalType: JournalType;
  text: string;
  toolSession?: ToolSessionPayload;
};

export type JournalActionResult<T = void> =
  | (T extends void ? { success: true } : { success: true; data: T })
  | { success: false; error: string };
