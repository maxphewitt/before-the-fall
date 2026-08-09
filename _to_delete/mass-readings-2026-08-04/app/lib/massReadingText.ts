/**
 * Turns a Mass reading citation ("Jeremiah 30:1-2, 12-15, 18-22") into
 * actual verse text from our self-hosted Douay-Rheims (public/bible/dra/
 * via bible.ts's getChapter()). We only ever store CITATIONS on disk
 * (see lib/lectionary.ts) — never the copyrighted NABRE text proclaimed
 * at Mass — and render everything from our own public-domain DR text,
 * same as Daily Scripture and the Bible reader.
 *
 * Reuses matchBookAndChapter() from bibleLink.ts for the "which book,
 * which chapter" half, then parses whatever verse-range text follows.
 *
 * Known limitations (acceptable for v1, degrade to null so callers can
 * fall back to the chapter-link / USCCB link instead of crashing):
 *   - Citations that cross a chapter boundary (e.g. "Isaiah 8:23-9:3")
 *     aren't split — the second chapter reference makes parsing bail.
 *   - Half-verse letter suffixes ("34a", "37b") aren't representable in
 *     our verse-per-line text — we render the whole verse.
 */

import { getChapter, type BibleBook } from "./bible";
import { matchBookAndChapter } from "./bibleLink";

export type ResolvedReading = {
  book: BibleBook;
  chapter: number;
  verses: { number: string; text: string }[];
};

type VerseGroup = { start: number; end: number };

/**
 * Parses the verse-range portion of a citation (everything after the
 * chapter number, e.g. ":1-2, 12-15, 18-22" or ":16-18, 19-21, 29, 22-23").
 * Groups are kept in the order listed (psalm citations intentionally
 * jump around for the sung response pattern) rather than sorted.
 * Returns null if any comma-separated part doesn't parse as a plain
 * verse or verse range — safer to bail than guess.
 */
function parseVerseGroups(rest: string): VerseGroup[] | null {
  let s = rest.trim();
  if (s.startsWith(":")) s = s.slice(1);
  if (!s) return null;

  const groups: VerseGroup[] = [];
  for (const rawPart of s.split(",")) {
    const part = rawPart.trim();
    if (!part) continue;
    // A second ":" means a chapter reference crept in (cross-chapter
    // citation) — unsupported, bail rather than misread it.
    if (part.includes(":")) return null;

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

export async function resolveMassReadingVerses(
  citation: string
): Promise<ResolvedReading | null> {
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

  return { book: match.book, chapter: match.chapter, verses };
}
