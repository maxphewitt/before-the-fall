"use server";

import { supabaseServer } from "../lib/supabase";
import { getCurrentUserId } from "../lib/session";
import { decryptJournalText } from "../lib/journalCrypto";
import { createEntry } from "./journal";
import type { ServerResult } from "../lib/habitTypes";
import {
  BIBLE_BOOKS,
  getBookBySlug,
  getBookChapterCount,
  getLocalBook,
} from "../lib/bible";
import {
  BIBLE_NOTE_PREFIX,
  HIGHLIGHT_COLORS,
  type BibleHighlight,
  type BibleNoteListItem,
  type BiblePosition,
  type BibleSearchResult,
  type HighlightColor,
} from "../lib/bibleReaderTypes";

/**
 * Bible reader actions (Task #53): resume position, per-verse highlights,
 * keyword search over the self-hosted Douay-Rheims JSON, and Bible notes.
 *
 * BIBLE NOTES — journal-type decision:
 * journal_entries.journal_type is locked by a DB CHECK constraint to the
 * five existing types (scripts/task-22-journal-types.sql), and the type
 * union in app/lib/journalTypes.ts feeds the picker UI and the habit
 * mapper. Extending it would require a schema migration plus touching
 * every consumer, so Bible notes REUSE journal_type='note' and mark
 * themselves with a first-line title prefix: "Bible — «title»\n\n«body»".
 * The journal has no separate title column — the reference title rides as
 * the first line of the encrypted body. listBibleNotes() filters 'note'
 * entries by that prefix after decryption (decryption already happens
 * server-side for every journal read, so this adds no new exposure).
 *
 * All tables here are service-role only (RLS on, no policies) — same
 * pattern as check_ins / community_enrollments.
 */

const NOT_SIGNED_IN = "You're not signed in.";
const GENERIC = "Something went wrong. Please try again.";

/* ── Resume position ── */

/** Where the user left off, or null for first-timers. */
export async function getBiblePosition(): Promise<BiblePosition | null> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return null;
    const supabase = supabaseServer();
    const { data, error } = await supabase
      .from("bible_positions")
      .select("book_slug, chapter")
      .eq("user_id", userId)
      .maybeSingle();
    if (error || !data) return null;
    const chapter = data.chapter as number;
    const bookSlug = data.book_slug as string;
    if (!getBookBySlug(bookSlug) || !Number.isFinite(chapter) || chapter < 1) {
      return null;
    }
    return { bookSlug, chapter };
  } catch (err) {
    console.error("getBiblePosition exception:", err);
    return null;
  }
}

/**
 * Upsert the user's reading position. Called from the chapter page shell
 * on render and (debounced client-side) as the reader scrolls across
 * chapter boundaries. Deliberately no revalidatePath — the position only
 * matters to the /read redirect, which is force-dynamic.
 */
export async function saveBiblePosition(
  bookSlug: string,
  chapter: number
): Promise<ServerResult> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return { success: false, error: NOT_SIGNED_IN };
    const book = getBookBySlug(bookSlug);
    const ch = Math.trunc(chapter);
    if (!book || !Number.isFinite(ch) || ch < 1 || ch > getBookChapterCount(book)) {
      return { success: false, error: "Invalid position." };
    }
    const supabase = supabaseServer();
    const { error } = await supabase.from("bible_positions").upsert(
      {
        user_id: userId,
        book_slug: book.slug,
        chapter: ch,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );
    if (error) {
      console.error("saveBiblePosition DB error:", error);
      return { success: false, error: GENERIC };
    }
    return { success: true };
  } catch (err) {
    console.error("saveBiblePosition exception:", err);
    return { success: false, error: GENERIC };
  }
}

/* ── Highlights ── */

/**
 * All of the user's highlights for one chapter, oldest first. The
 * ascending order matters: the renderer resolves overlapping ranges with
 * "later wins", i.e. later array entries paint over earlier ones.
 */
export async function listHighlights(
  bookSlug: string,
  chapter: number
): Promise<ServerResult<BibleHighlight[]>> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return { success: false, error: NOT_SIGNED_IN };
    const supabase = supabaseServer();
    const { data, error } = await supabase
      .from("bible_highlights")
      .select("id, book_slug, chapter, verse, start_off, end_off, color")
      .eq("user_id", userId)
      .eq("book_slug", bookSlug)
      .eq("chapter", chapter)
      .order("created_at", { ascending: true });
    if (error) {
      console.error("listHighlights DB error:", error);
      return { success: false, error: GENERIC };
    }
    const highlights: BibleHighlight[] = (data ?? []).map((r) => ({
      id: r.id as string,
      bookSlug: r.book_slug as string,
      chapter: r.chapter as number,
      verse: r.verse as number,
      startOff: r.start_off as number,
      endOff: r.end_off as number,
      color: r.color as HighlightColor,
    }));
    return { success: true, data: highlights };
  } catch (err) {
    console.error("listHighlights exception:", err);
    return { success: false, error: GENERIC };
  }
}

/**
 * Persist one per-verse highlight range. The client splits multi-verse
 * selections into one call per verse. Only coordinates are stored —
 * never the scripture text itself.
 */
export async function addHighlight(input: {
  book: string;
  chapter: number;
  verse: number;
  startOff: number;
  endOff: number;
  color: HighlightColor;
}): Promise<ServerResult<{ id: string }>> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return { success: false, error: NOT_SIGNED_IN };
    const book = getBookBySlug(input.book);
    const chapter = Math.trunc(input.chapter);
    const verse = Math.trunc(input.verse);
    const startOff = Math.trunc(input.startOff);
    const endOff = Math.trunc(input.endOff);
    if (
      !book ||
      !Number.isFinite(chapter) || chapter < 1 ||
      !Number.isFinite(verse) || verse < 1 ||
      !Number.isFinite(startOff) || startOff < 0 ||
      !Number.isFinite(endOff) || endOff <= startOff ||
      !HIGHLIGHT_COLORS.includes(input.color)
    ) {
      return { success: false, error: "Invalid highlight." };
    }
    const supabase = supabaseServer();
    const { data, error } = await supabase
      .from("bible_highlights")
      .insert({
        user_id: userId,
        book_slug: book.slug,
        chapter,
        verse,
        start_off: startOff,
        end_off: endOff,
        color: input.color,
      })
      .select("id")
      .single();
    if (error || !data) {
      console.error("addHighlight DB error:", error);
      return { success: false, error: GENERIC };
    }
    return { success: true, data: { id: data.id as string } };
  } catch (err) {
    console.error("addHighlight exception:", err);
    return { success: false, error: GENERIC };
  }
}

/** Delete one highlight the user owns. */
export async function removeHighlight(id: string): Promise<ServerResult> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return { success: false, error: NOT_SIGNED_IN };
    const supabase = supabaseServer();
    const { error } = await supabase
      .from("bible_highlights")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);
    if (error) {
      console.error("removeHighlight DB error:", error);
      return { success: false, error: GENERIC };
    }
    return { success: true };
  } catch (err) {
    console.error("removeHighlight exception:", err);
    return { success: false, error: GENERIC };
  }
}

/* ── Bible notes (stored in the encrypted journal) ── */

/**
 * Save a note about a passage into the encrypted journal. The journal
 * has no title field, so the (user-editable) reference title becomes the
 * first line: "Bible — «title»\n\n«body»" — see the decision note at the
 * top of this file. Goes through createEntry so the note gets the same
 * encryption, safety scan, and habit credit as any other journal note.
 */
export async function saveBibleNote(input: {
  title: string;
  body: string;
}): Promise<ServerResult<{ id: string }>> {
  const title = (input.title ?? "").trim().replace(/\s+/g, " ");
  const body = (input.body ?? "").trim();
  if (body.length === 0) {
    return { success: false, error: "Write a line or two before saving." };
  }
  const plaintext = `${BIBLE_NOTE_PREFIX}${title || "Untitled"}\n\n${body}`;
  const res = await createEntry(plaintext, "note");
  if (!res.success) return { success: false, error: res.error };
  return { success: true, data: { id: res.data.id } };
}

/**
 * List the user's Bible notes, newest first: journal 'note' entries whose
 * decrypted first line carries the "Bible — " prefix. Slim shape only —
 * the full journal stays at /journal.
 */
export async function listBibleNotes(): Promise<
  ServerResult<BibleNoteListItem[]>
> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return { success: false, error: NOT_SIGNED_IN };
    const supabase = supabaseServer();
    const { data, error } = await supabase
      .from("journal_entries")
      .select("id, ciphertext, iv, auth_tag, created_at")
      .eq("user_id", userId)
      .eq("journal_type", "note")
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) {
      console.error("listBibleNotes DB error:", error);
      return { success: false, error: GENERIC };
    }
    const notes: BibleNoteListItem[] = [];
    for (const row of data ?? []) {
      try {
        const plaintext = decryptJournalText({
          ciphertext: row.ciphertext as string,
          iv: row.iv as string,
          authTag: row.auth_tag as string,
        });
        if (!plaintext.startsWith(BIBLE_NOTE_PREFIX)) continue;
        const newlineAt = plaintext.indexOf("\n");
        const firstLine = newlineAt === -1 ? plaintext : plaintext.slice(0, newlineAt);
        notes.push({
          id: row.id as string,
          title: firstLine.slice(BIBLE_NOTE_PREFIX.length).trim() || "Untitled",
          body: newlineAt === -1 ? "" : plaintext.slice(newlineAt + 1).trim(),
          createdAt: row.created_at as string,
        });
      } catch (err) {
        console.error("listBibleNotes decrypt error:", err);
        // Skip an unreadable row rather than failing the whole panel.
      }
    }
    return { success: true, data: notes };
  } catch (err) {
    console.error("listBibleNotes exception:", err);
    return { success: false, error: GENERIC };
  }
}

/* ── Keyword search ── */

const MAX_SEARCH_RESULTS = 30;

/**
 * Case-insensitive substring search across the local Douay-Rheims text
 * (all 73 books, ~35k verses — a linear scan finishes in well under
 * 100ms on the cached JSON). Verses are ranked by how many times the
 * query occurs in them, ties broken by canonical order. Books whose
 * local JSON hasn't been built are skipped.
 */
export async function searchBible(
  query: string
): Promise<ServerResult<BibleSearchResult[]>> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return { success: false, error: NOT_SIGNED_IN };
    const q = (query ?? "").trim().toLowerCase();
    if (q.length < 2) {
      return { success: false, error: "Type at least two characters." };
    }

    const hits: (BibleSearchResult & { matchCount: number })[] = [];
    for (const book of BIBLE_BOOKS) {
      const local = getLocalBook(book.slug);
      if (!local) continue;
      for (let c = 0; c < local.chapters.length; c++) {
        const verses = local.chapters[c];
        for (let v = 0; v < verses.length; v++) {
          const text = verses[v];
          const lower = text.toLowerCase();
          let idx = lower.indexOf(q);
          if (idx === -1) continue;
          let matchCount = 0;
          const firstIdx = idx;
          while (idx !== -1) {
            matchCount++;
            idx = lower.indexOf(q, idx + q.length);
          }
          hits.push({
            bookSlug: book.slug,
            bookName: local.name || book.name,
            chapter: c + 1,
            verse: v + 1,
            snippet: makeSnippet(text, firstIdx, q.length),
            matchCount,
          });
        }
      }
    }

    // Stable sort: match count desc, canonical order preserved for ties.
    hits.sort((a, b) => b.matchCount - a.matchCount);
    const results: BibleSearchResult[] = hits
      .slice(0, MAX_SEARCH_RESULTS)
      .map(({ bookSlug, bookName, chapter, verse, snippet }) => ({
        bookSlug,
        bookName,
        chapter,
        verse,
        snippet,
      }));
    return { success: true, data: results };
  } catch (err) {
    console.error("searchBible exception:", err);
    return { success: false, error: GENERIC };
  }
}

/** Trim a verse to a readable window around the first match. */
function makeSnippet(text: string, matchIdx: number, matchLen: number): string {
  const WINDOW_BEFORE = 40;
  const WINDOW_AFTER = 90;
  const start = Math.max(0, matchIdx - WINDOW_BEFORE);
  const end = Math.min(text.length, matchIdx + matchLen + WINDOW_AFTER);
  let snippet = text.slice(start, end).trim();
  if (start > 0) snippet = `…${snippet}`;
  if (end < text.length) snippet = `${snippet}…`;
  return snippet;
}
