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

export type ToolSessionPayload = {
  kind: "tool_session";
  version: "v1";
  toolSlug: string;
  toolName: string;
  completedAt: string;
  steps: ToolSessionStep[];
  summary?: string;
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
