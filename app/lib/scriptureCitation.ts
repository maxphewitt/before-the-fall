/**
 * Resolves a Scripture citation string ("Luke 1:68-79", "Psalm 91:1-6")
 * into actual verse text from our self-hosted Douay-Rheims (bible.ts).
 * Built for Liturgy of the Hours (2026-08-04) — every psalm, canticle,
 * and short reading in the Hours is specified as a citation in
 * lib/liturgyOfHours.ts and expanded to real text here, at request
 * time, so we never hand-transcribe Scripture (zero risk of a typo
 * drifting from the source) and never touch copyrighted translations.
 *
 * Self-contained on purpose — doesn't import from bibleLink.ts, so that
 * file (Continue-in-the-Bible linking) stays exactly as it was.
 *
 * Limitations (same as any citation parser over free-text refs):
 *   - Citations that cross a chapter boundary aren't split.
 *   - Half-verse letter suffixes ("34a") render as the whole verse.
 */

import { BIBLE_BOOKS, getChapter, getBookChapterCount, type BibleBook } from "./bible";

const BOOK_ALIASES: Record<string, string> = {
  psalm: "psalms",
  "song of songs": "song-of-solomon",
};

type Candidate = { key: string; slug: string };

const CANDIDATES: Candidate[] = [
  ...BIBLE_BOOKS.map((b) => ({ key: b.name.toLowerCase(), slug: b.slug })),
  ...Object.entries(BOOK_ALIASES).map(([key, slug]) => ({ key, slug })),
].sort((a, b) => b.key.length - a.key.length);

type VerseGroup = { start: number; end: number };

function matchBookAndChapter(
  citation: string
): { book: BibleBook; chapter: number; rest: string } | null {
  const text = citation.trim();
  const lower = text.toLowerCase();
  const match = CANDIDATES.find((c) => lower.startsWith(`${c.key} `));
  if (!match) return null;
  const book = BIBLE_BOOKS.find((b) => b.slug === match.slug);
  if (!book) return null;

  const afterBook = text.slice(match.key.length);
  const chapterMatch = afterBook.match(/^\s*(\d+)/);
  if (!chapterMatch) return null;
  const chapter = parseInt(chapterMatch[1], 10);
  if (!Number.isFinite(chapter) || chapter < 1 || chapter > getBookChapterCount(book)) {
    return null;
  }
  return { book, chapter, rest: afterBook.slice(chapterMatch[0].length) };
}

function parseVerseGroups(rest: string): VerseGroup[] | null {
  let s = rest.trim();
  if (s.startsWith(":")) s = s.slice(1);
  if (!s) return null;

  const groups: VerseGroup[] = [];
  for (const rawPart of s.split(",")) {
    const part = rawPart.trim();
    if (!part) continue;
    if (part.includes(":")) return null; // cross-chapter — unsupported
    const range = part.match(/^(\d+)\s*[a-z]?\s*-\s*(\d+)\s*[a-z]?$/i);
    if (range) {
      groups.push({ start: parseInt(range[1], 10), end: parseInt(range[2], 10) });
      continue;
    }
    const single = part.match(/^(\d+)\s*[a-z]?$/i);
    if (single) {
      const n = parseInt(single[1], 10);
      groups.push({ start: n, end: n });
      continue;
    }
    return null;
  }
  return groups.length > 0 ? groups : null;
}

export type ResolvedCitation = {
  book: BibleBook;
  chapter: number;
  verses: { number: string; text: string }[];
  /** Verses joined into one block, for display contexts that don't need
   *  per-verse numbering (e.g. a short responsory line). */
  text: string;
};

export async function resolveCitationVerses(
  citation: string
): Promise<ResolvedCitation | null> {
  const match = matchBookAndChapter(citation);
  if (!match) return null;

  const groups = parseVerseGroups(match.rest);
  if (!groups) return null;

  const chapterVerses = await getChapter(match.book, match.chapter);
  if (!chapterVerses) return null;

  const verses: { number: string; text: string }[] = [];
  for (const g of groups) {
    for (const cv of chapterVerses) {
      if (cv.verse >= g.start && cv.verse <= g.end) {
        verses.push({ number: String(cv.verse), text: cv.text });
      }
    }
  }
  if (verses.length === 0) return null;

  return {
    book: match.book,
    chapter: match.chapter,
    verses,
    text: verses.map((v) => v.text).join(" "),
  };
}
