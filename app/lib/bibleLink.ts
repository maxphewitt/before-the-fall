/**
 * bibleLinkForCitation (2026-08-03) — turns a Scripture citation string
 * (e.g. "Psalm 23 (Vulgate 22):1–6") into a link target inside the
 * full-Bible reader at /catholic-path/bible/<slug>/<chapter>.
 *
 * Server-only: imports bible.ts, which reads the self-hosted DR text
 * from disk. Call it in server components and pass the result down.
 *
 * Parsing rules:
 *   - The leading book name is matched against BIBLE_BOOKS names
 *     (longest name first, so "1 Kings" and "Song of Solomon" resolve
 *     before shorter accidental prefixes), plus a few citation-style
 *     aliases ("Psalm" singular, "Canticle of Canticles", etc.).
 *   - The chapter is the first number after the book name.
 *   - IMPORTANT: if the citation carries "(Vulgate N)", N wins — our
 *     self-hosted text is Douay-Rheims, so Psalms live under their
 *     Vulgate numbers.
 *   - Returns null when parsing fails, so callers can simply hide the
 *     link.
 */

import { BIBLE_BOOKS, getBookChapterCount } from "./bible";

export type BibleLink = {
  slug: string;
  chapter: number;
  /** Human label, e.g. "Psalms 22". */
  label: string;
};

/** Citation spellings that differ from the BIBLE_BOOKS canonical name. */
const BOOK_ALIASES: Record<string, string> = {
  psalm: "psalms",
  "song of songs": "song-of-solomon",
  "canticle of canticles": "song-of-solomon",
  canticles: "song-of-solomon",
  ecclesiasticus: "sirach",
  apocalypse: "revelation",
};

type Candidate = { key: string; slug: string };

/** All matchable names, lowercased, longest first. Built once. */
const CANDIDATES: Candidate[] = [
  ...BIBLE_BOOKS.map((b) => ({ key: b.name.toLowerCase(), slug: b.slug })),
  ...Object.entries(BOOK_ALIASES).map(([key, slug]) => ({ key, slug })),
].sort((a, b) => b.key.length - a.key.length);

export function bibleLinkForCitation(citation: string): BibleLink | null {
  const text = citation.trim();
  const lower = text.toLowerCase();

  const match = CANDIDATES.find((c) => lower.startsWith(`${c.key} `));
  if (!match) return null;
  const book = BIBLE_BOOKS.find((b) => b.slug === match.slug);
  if (!book) return null;

  // Chapter = first number after the book name…
  const rest = text.slice(match.key.length);
  const chapterMatch = rest.match(/^\s*(\d+)/);
  if (!chapterMatch) return null;
  let chapter = parseInt(chapterMatch[1], 10);

  // …unless a Vulgate number is given — the DR text uses Vulgate
  // numbering (relevant for the Psalms).
  const vulgate = text.match(/\(\s*Vulgate\s+(\d+)\s*\)/i);
  if (vulgate) chapter = parseInt(vulgate[1], 10);

  // Real chapter count (local DR text when present — e.g. Daniel 14).
  if (!Number.isFinite(chapter) || chapter < 1 || chapter > getBookChapterCount(book)) {
    return null;
  }

  return { slug: book.slug, chapter, label: `${book.name} ${chapter}` };
}
