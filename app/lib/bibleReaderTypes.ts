/**
 * Pure types + constants for the Bible reader (Task #53). Lives outside
 * the "use server" file (app/actions/bibleReader.ts) because Next.js
 * Server Actions modules can only export async functions — non-function
 * exports (types, consts) belong here. Client components import from
 * here directly.
 */

/**
 * Highlight palette. The four colors render as translucent backgrounds
 * behind the scripture text; 'bold' is a style, not a color — it renders
 * the highlighted range as font-bold text with no background.
 */
export type HighlightColor = "gold" | "sky" | "rose" | "green" | "bold";

export const HIGHLIGHT_COLORS: readonly HighlightColor[] = [
  "gold",
  "sky",
  "rose",
  "green",
  "bold",
] as const;

/**
 * One highlighted character range within a single verse. Selections that
 * span verses are split into one row per verse before persisting.
 * Offsets are plain-text character offsets within the verse text itself
 * (the superscript verse number is excluded — it lives outside the
 * offset-bearing span in the DOM).
 */
export type BibleHighlight = {
  id: string;
  bookSlug: string;
  chapter: number;
  verse: number;
  startOff: number;
  endOff: number;
  color: HighlightColor;
};

/** Where the user left off reading. */
export type BiblePosition = {
  bookSlug: string;
  chapter: number;
};

/** One keyword-search hit, shaped for the search overlay's result list. */
export type BibleSearchResult = {
  bookSlug: string;
  bookName: string;
  chapter: number;
  verse: number;
  snippet: string;
};

/**
 * A Bible note as listed in the reader's notes panel. Notes are stored
 * in the encrypted journal as journal_type='note' entries whose first
 * line is "Bible — «title»" (see BIBLE_NOTE_PREFIX and the decision
 * note in app/actions/bibleReader.ts); title/body here are the
 * already-split, decrypted pieces.
 */
export type BibleNoteListItem = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
};

/**
 * First-line marker that identifies a journal 'note' entry as a Bible
 * note. journal_entries.journal_type has a DB CHECK constraint locked to
 * the existing five types (scripts/task-22-journal-types.sql), so we
 * reuse 'note' + this title prefix instead of extending the union.
 */
export const BIBLE_NOTE_PREFIX = "Bible — ";

/**
 * Slim per-book metadata the reader client needs for infinite pagination
 * across book boundaries and for reference parsing. `chapters` is the
 * real (local-text) chapter count from getBookChapterCount().
 */
export type ReaderBookMeta = {
  slug: string;
  name: string;
  chapters: number;
  available: boolean;
};
