"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";
import {
  addHighlight,
  listBibleNotes,
  listHighlights,
  removeHighlight,
  saveBibleNote,
  saveBiblePosition,
  searchBible,
} from "../../../../../actions/bibleReader";
import type {
  BibleHighlight,
  BibleNoteListItem,
  BibleSearchResult,
  HighlightColor,
  ReaderBookMeta,
} from "../../../../../lib/bibleReaderTypes";

/**
 * BibleReader — the scrolling Douay-Rheims reader (Task #53).
 *
 * MOBILE: the chapter reads like a feed. A sentinel below the text
 * triggers infinite append of the next chapter — across book boundaries
 * in canonical order, skipping books without local text. Chapter JSON is
 * fetched client-side from /bible/dra/<slug>.json (static public files),
 * cached one fetch per BOOK in a ref. An IntersectionObserver over the
 * chapter sections keeps the URL canonical via history.replaceState and
 * debounce-saves the reading position.
 *
 * DESKTOP (md:+): a floating "Next chapter" button and the Space bar
 * scroll to the next chapter section (loading it first if needed).
 *
 * HIGHLIGHTS — selection→offset mapping: every verse renders its text in
 * a span[data-vtext] (the gold superscript verse number sits OUTSIDE that
 * span so it never shifts offsets). On selection end we find each
 * data-vtext span the selection intersects and measure plain-text
 * offsets with the cloneRange technique: selectNodeContents(span), then
 * setEnd(boundary) and take toString().length. Because the measurement
 * is over the range's plain text, nested <mark> elements from earlier
 * highlights cannot corrupt the offsets. A selection spanning verses is
 * split into one row per verse. Rendering paints TWO per-character
 * layers: the four colors resolve as "later wins" among themselves,
 * while 'bold' is an independent boolean layer that stacks on top — so
 * a passage can be colored, bold, or both. Adjacent same-color ranges
 * read as one highlight.
 *
 * Both highlight flows work: arm a color first and then select, or
 * select first and then tap a color in the palette (select-then-choose).
 */

type Verse = { verse: number; text: string };
type Section = {
  bookSlug: string;
  bookName: string;
  chapter: number;
  verses: Verse[];
};
type LocalBookJson = { name: string; chapters: string[][] };

type ParsedReference = {
  slug: string;
  name: string;
  chapter?: number;
  verse?: number;
};

type HighlightPopover = {
  /** Color-layer row under the tap, if any. */
  colorId: string | null;
  /** Bold-layer row under the tap, if any. */
  boldId: string | null;
  refLabel: string;
  x: number;
  y: number;
};

type Composer = {
  title: string;
  body: string;
  saving: boolean;
  error: string | null;
};

type Panel = null | "search" | "notes" | "books";

type Props = {
  initialBookSlug: string;
  initialBookName: string;
  initialChapter: number;
  initialVerses: Verse[];
  initialHighlights: BibleHighlight[];
  books: ReaderBookMeta[];
};

/* ── Pure helpers ── */

const keyOf = (bookSlug: string, chapter: number) => `${bookSlug}/${chapter}`;

/** Next chapter in canonical order; next available book past a book's end. */
function nextTarget(
  books: ReaderBookMeta[],
  slug: string,
  chapter: number
): { slug: string; chapter: number } | null {
  const idx = books.findIndex((b) => b.slug === slug);
  if (idx === -1) return null;
  if (chapter < books[idx].chapters) return { slug, chapter: chapter + 1 };
  for (let i = idx + 1; i < books.length; i++) {
    if (books[i].available) return { slug: books[i].slug, chapter: 1 };
  }
  return null;
}

/** Lowercase, strip dots/spaces/hyphens: "1 Kings" → "1kings". */
function normalizeBookKey(s: string): string {
  return s.toLowerCase().replace(/[.\s-]/g, "");
}

/** Common abbreviations → canonical slugs (keys pre-normalized). */
const BOOK_ABBREVIATIONS: Record<string, string> = {
  gen: "genesis", gn: "genesis",
  ex: "exodus", exo: "exodus", exod: "exodus",
  lev: "leviticus", lv: "leviticus",
  num: "numbers", nm: "numbers",
  deut: "deuteronomy", dt: "deuteronomy",
  josh: "joshua", jos: "joshua",
  judg: "judges", jgs: "judges", jdg: "judges",
  ru: "ruth", rut: "ruth",
  "1sam": "1-samuel", "1sm": "1-samuel", "1sa": "1-samuel",
  "2sam": "2-samuel", "2sm": "2-samuel", "2sa": "2-samuel",
  "1kgs": "1-kings", "1ki": "1-kings", "1kin": "1-kings",
  "2kgs": "2-kings", "2ki": "2-kings", "2kin": "2-kings",
  "1chr": "1-chronicles", "1ch": "1-chronicles", "1chron": "1-chronicles",
  "2chr": "2-chronicles", "2ch": "2-chronicles", "2chron": "2-chronicles",
  ezr: "ezra",
  neh: "nehemiah", ne: "nehemiah",
  tob: "tobit", tb: "tobit",
  jdt: "judith", jth: "judith",
  est: "esther", esth: "esther",
  "1macc": "1-maccabees", "1mac": "1-maccabees", "1mc": "1-maccabees", "1ma": "1-maccabees",
  "2macc": "2-maccabees", "2mac": "2-maccabees", "2mc": "2-maccabees", "2ma": "2-maccabees",
  jb: "job",
  ps: "psalms", psa: "psalms", pss: "psalms", psalm: "psalms",
  prov: "proverbs", prv: "proverbs", pr: "proverbs",
  eccl: "ecclesiastes", ecc: "ecclesiastes", qoh: "ecclesiastes",
  song: "song-of-solomon", sg: "song-of-solomon", sos: "song-of-solomon",
  cant: "song-of-solomon", canticles: "song-of-solomon",
  wis: "wisdom", ws: "wisdom", wisd: "wisdom",
  sir: "sirach", ecclus: "sirach",
  isa: "isaiah", is: "isaiah",
  jer: "jeremiah", jr: "jeremiah",
  lam: "lamentations", lm: "lamentations",
  bar: "baruch",
  ezek: "ezekiel", eze: "ezekiel", ez: "ezekiel",
  dan: "daniel", dn: "daniel", da: "daniel",
  hos: "hosea", ho: "hosea",
  jl: "joel", joe: "joel",
  am: "amos", amo: "amos",
  ob: "obadiah", obad: "obadiah", oba: "obadiah",
  jon: "jonah", jnh: "jonah",
  mic: "micah", mi: "micah",
  nah: "nahum", na: "nahum",
  hab: "habakkuk", hb: "habakkuk",
  zeph: "zephaniah", zep: "zephaniah", zp: "zephaniah",
  hag: "haggai", hg: "haggai",
  zech: "zechariah", zec: "zechariah", zc: "zechariah",
  mal: "malachi", ml: "malachi",
  mt: "matthew", matt: "matthew",
  mk: "mark", mrk: "mark",
  lk: "luke", luk: "luke",
  jn: "john", jhn: "john",
  ac: "acts", act: "acts",
  rom: "romans", rm: "romans", ro: "romans",
  "1cor": "1-corinthians", "1co": "1-corinthians",
  "2cor": "2-corinthians", "2co": "2-corinthians",
  gal: "galatians", ga: "galatians",
  eph: "ephesians",
  phil: "philippians", php: "philippians", philip: "philippians",
  col: "colossians",
  "1thess": "1-thessalonians", "1thes": "1-thessalonians", "1th": "1-thessalonians",
  "2thess": "2-thessalonians", "2thes": "2-thessalonians", "2th": "2-thessalonians",
  "1tim": "1-timothy", "1tm": "1-timothy", "1ti": "1-timothy",
  "2tim": "2-timothy", "2tm": "2-timothy", "2ti": "2-timothy",
  tit: "titus",
  phlm: "philemon", phm: "philemon", philem: "philemon",
  heb: "hebrews",
  jas: "james", jam: "james", jm: "james",
  "1pet": "1-peter", "1pt": "1-peter", "1pe": "1-peter",
  "2pet": "2-peter", "2pt": "2-peter", "2pe": "2-peter",
  "1jn": "1-john", "1jo": "1-john", "1joh": "1-john",
  "2jn": "2-john", "2jo": "2-john", "2joh": "2-john",
  "3jn": "3-john", "3jo": "3-john", "3joh": "3-john",
  jude: "jude", jud: "jude",
  rev: "revelation", rv: "revelation", apoc: "revelation", apc: "revelation",
};

/**
 * Parse "1 Kings 2:3" / "gen 1" / "john 3:16" style references. Fuzzy
 * book matching: abbreviation map first, then exact / prefix / substring
 * against canonical names (canonical order breaks ties). Chapter is
 * clamped to the book; the verse is dropped if the chapter had to be
 * clamped. Returns null when the text doesn't look like a reference —
 * the caller then falls back to keyword search.
 */
function parseReference(
  raw: string,
  books: ReaderBookMeta[]
): ParsedReference | null {
  const cleaned = raw.trim().toLowerCase();
  if (cleaned.length < 2) return null;
  const m = cleaned.match(
    /^([1-3]?\s*[a-z][a-z\s.-]*?)\s*(?:(\d{1,3})(?:\s*[:.]\s*(\d{1,3}))?)?$/
  );
  if (!m) return null;
  const key = normalizeBookKey(m[1]);
  if (key.length < 2) return null;
  const chapterNum = m[2] ? parseInt(m[2], 10) : undefined;
  const verseNum = m[3] ? parseInt(m[3], 10) : undefined;

  let meta: ReaderBookMeta | undefined;
  const abbrevSlug = BOOK_ABBREVIATIONS[key];
  if (abbrevSlug) meta = books.find((b) => b.slug === abbrevSlug);
  if (!meta) meta = books.find((b) => normalizeBookKey(b.name) === key);
  if (!meta) meta = books.find((b) => normalizeBookKey(b.name).startsWith(key));
  if (!meta) meta = books.find((b) => normalizeBookKey(b.name).includes(key));
  if (!meta || !meta.available) return null;

  let chapter = chapterNum;
  let verse = verseNum;
  if (chapter !== undefined) {
    if (chapter < 1) return null;
    if (chapter > meta.chapters) {
      chapter = meta.chapters;
      verse = undefined;
    }
  } else {
    verse = undefined;
  }
  return { slug: meta.slug, name: meta.name, chapter, verse };
}

/* ── Highlight rendering ── */

const MARK_CLASSES: Record<HighlightColor, string> = {
  gold: "bg-btf-gold/25 text-inherit rounded-[2px] cursor-pointer",
  sky: "bg-sky-400/25 text-inherit rounded-[2px] cursor-pointer",
  rose: "bg-rose-400/30 text-inherit rounded-[2px] cursor-pointer",
  green: "bg-emerald-400/25 text-inherit rounded-[2px] cursor-pointer",
  bold: "bg-transparent text-white font-bold cursor-pointer",
};

const SWATCH_CLASSES: Record<Exclude<HighlightColor, "bold">, string> = {
  gold: "bg-btf-gold/80",
  sky: "bg-sky-400/80",
  rose: "bg-rose-400/80",
  green: "bg-emerald-400/80",
};

/**
 * Split one verse's text into plain/marked segments. TWO independent
 * per-character layers are painted in span order (created ascending):
 * the color layer, where overlapping COLOR ranges resolve as "later
 * wins", and the bold layer, where any 'bold' span covering a character
 * bolds it. Bold therefore stacks on top of color instead of replacing
 * it. The text is segmented wherever either layer changes; adjacent
 * ranges of the same color simply read as one continuous highlight.
 */
function renderVerseSegments(
  text: string,
  spans: BibleHighlight[],
  onMarkTap: (
    e: ReactMouseEvent<HTMLElement>,
    color: BibleHighlight | null,
    bold: BibleHighlight | null
  ) => void
): ReactNode {
  if (spans.length === 0) return text;
  const colorOwner: (BibleHighlight | null)[] = new Array(text.length).fill(null);
  const boldOwner: (BibleHighlight | null)[] = new Array(text.length).fill(null);
  for (const s of spans) {
    const a = Math.max(0, Math.min(text.length, s.startOff));
    const b = Math.max(a, Math.min(text.length, s.endOff));
    const layer = s.color === "bold" ? boldOwner : colorOwner;
    for (let i = a; i < b; i++) layer[i] = s;
  }
  const out: ReactNode[] = [];
  let i = 0;
  while (i < text.length) {
    const color = colorOwner[i];
    const bold = boldOwner[i];
    let j = i + 1;
    while (j < text.length && colorOwner[j] === color && boldOwner[j] === bold) j++;
    const piece = text.slice(i, j);
    const primary = color ?? bold;
    if (!primary) {
      out.push(piece);
    } else {
      out.push(
        <mark
          key={`${primary.id}:${i}`}
          data-hlid={primary.id}
          className={
            color
              ? `${MARK_CLASSES[color.color]}${bold ? " font-bold" : ""}`
              : MARK_CLASSES.bold
          }
          onClick={(e) => onMarkTap(e, color, bold)}
        >
          {piece}
        </mark>
      );
    }
    i = j;
  }
  return out;
}

/* ── Inline SVG icons (no emojis, per house rules) ── */

const iconStroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const SearchIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" {...iconStroke}>
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const ListIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" {...iconStroke}>
    <path d="M4 6h16" />
    <path d="M4 12h16" />
    <path d="M4 18h16" />
  </svg>
);

const NotesIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" {...iconStroke}>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
);

const HighlighterIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" {...iconStroke}>
    <path d="m9 11-6 6v3h9l3-3" />
    <path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4Z" />
  </svg>
);

const BooksIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" {...iconStroke}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);

const CloseIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" {...iconStroke}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const DownIcon = (
  <svg width="15" height="15" viewBox="0 0 24 24" {...iconStroke} strokeWidth={2.2}>
    <path d="M12 5v14" />
    <path d="m19 12-7 7-7-7" />
  </svg>
);

const QuoteIcon = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2Z" />
    <path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2Z" />
  </svg>
);

const TrashIcon = (
  <svg width="15" height="15" viewBox="0 0 24 24" {...iconStroke}>
    <path d="M3 6h18" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
  </svg>
);

/* ── Component ── */

export default function BibleReader({
  initialBookSlug,
  initialBookName,
  initialChapter,
  initialVerses,
  initialHighlights,
  books,
}: Props) {
  const router = useRouter();
  const initialKey = keyOf(initialBookSlug, initialChapter);

  const [sections, setSections] = useState<Section[]>([
    {
      bookSlug: initialBookSlug,
      bookName: initialBookName,
      chapter: initialChapter,
      verses: initialVerses,
    },
  ]);
  const [highlightsByKey, setHighlightsByKey] = useState<
    Record<string, BibleHighlight[]>
  >({ [initialKey]: initialHighlights });
  const [currentKey, setCurrentKey] = useState(initialKey);
  const [loadingNext, setLoadingNext] = useState(false);
  const [atEnd, setAtEnd] = useState(false);

  const [panel, setPanel] = useState<Panel>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [armedColor, setArmedColor] = useState<HighlightColor | null>(null);
  const [popover, setPopover] = useState<HighlightPopover | null>(null);
  const [composer, setComposer] = useState<Composer | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<BibleSearchResult[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const [booksQuery, setBooksQuery] = useState("");
  const [navBookSlug, setNavBookSlug] = useState<string | null>(null);

  const [notes, setNotes] = useState<BibleNoteListItem[] | null>(null);
  const [notesLoading, setNotesLoading] = useState(false);
  const [notesError, setNotesError] = useState<string | null>(null);

  const contentRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const sectionEls = useRef(new Map<string, HTMLElement>());
  const bookCacheRef = useRef(new Map<string, LocalBookJson | null>());
  const loadingNextRef = useRef(false);
  const currentKeyRef = useRef(initialKey);
  const armedColorRef = useRef<HighlightColor | null>(null);
  const saveTimerRef = useRef<number | null>(null);
  const toastTimerRef = useRef<number | null>(null);
  const pendingScrollKeyRef = useRef<string | null>(null);
  /** Optimistic temp ids → server ids, so remove works mid-flight. */
  const tempIdMapRef = useRef(new Map<string, string>());

  const booksBySlug = useMemo(
    () => new Map(books.map((b) => [b.slug, b])),
    [books]
  );

  useEffect(() => {
    armedColorRef.current = armedColor;
  }, [armedColor]);

  // Clear pending timers on unmount.
  useEffect(
    () => () => {
      if (saveTimerRef.current !== null) window.clearTimeout(saveTimerRef.current);
      if (toastTimerRef.current !== null) window.clearTimeout(toastTimerRef.current);
    },
    []
  );

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimerRef.current !== null) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToast(null), 2600);
  }, []);

  const schedulePositionSave = useCallback((slug: string, chapter: number) => {
    if (saveTimerRef.current !== null) window.clearTimeout(saveTimerRef.current);
    saveTimerRef.current = window.setTimeout(() => {
      void saveBiblePosition(slug, chapter);
    }, 1200);
  }, []);

  /* ── Infinite chapter pagination ── */

  const fetchBookJson = useCallback(
    async (slug: string): Promise<LocalBookJson | null> => {
      const cache = bookCacheRef.current;
      if (cache.has(slug)) return cache.get(slug) ?? null;
      try {
        const res = await fetch(`/bible/dra/${slug}.json`);
        if (!res.ok) {
          cache.set(slug, null);
          return null;
        }
        const json = (await res.json()) as LocalBookJson;
        const valid = json && Array.isArray(json.chapters) && json.chapters.length > 0;
        cache.set(slug, valid ? json : null);
        return valid ? json : null;
      } catch {
        cache.set(slug, null);
        return null;
      }
    },
    []
  );

  const loadHighlightsFor = useCallback(
    async (bookSlug: string, chapter: number) => {
      const res = await listHighlights(bookSlug, chapter);
      if (res.success) {
        setHighlightsByKey((prev) => ({
          ...prev,
          [keyOf(bookSlug, chapter)]: res.data,
        }));
      }
    },
    []
  );

  /** Append the next chapter section; returns its key, or null at canon end. */
  const appendNext = useCallback(async (): Promise<string | null> => {
    if (loadingNextRef.current || atEnd) return null;
    loadingNextRef.current = true;
    setLoadingNext(true);
    try {
      const last = sections[sections.length - 1];
      let target = nextTarget(books, last.bookSlug, last.chapter);
      while (target) {
        const t = target;
        const json = await fetchBookJson(t.slug);
        const verseTexts = json?.chapters[t.chapter - 1];
        if (json && verseTexts && verseTexts.length > 0) {
          const meta = booksBySlug.get(t.slug);
          const section: Section = {
            bookSlug: t.slug,
            bookName: json.name || meta?.name || t.slug,
            chapter: t.chapter,
            verses: verseTexts.map((text, i) => ({ verse: i + 1, text })),
          };
          setSections((prev) => [...prev, section]);
          void loadHighlightsFor(section.bookSlug, section.chapter);
          return keyOf(section.bookSlug, section.chapter);
        }
        // No local JSON for this book (API-fallback-only) — skip past it.
        target = nextTarget(books, t.slug, Number.MAX_SAFE_INTEGER);
      }
      setAtEnd(true);
      return null;
    } finally {
      loadingNextRef.current = false;
      setLoadingNext(false);
    }
  }, [sections, books, booksBySlug, atEnd, fetchBookJson, loadHighlightsFor]);

  // Bottom sentinel: pre-load the next chapter well before it's reached.
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || atEnd) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) void appendNext();
      },
      { rootMargin: "700px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [appendNext, atEnd]);

  // Chapter-boundary observer: whichever section holds the mid-viewport
  // band is "current" — keep the URL canonical and debounce-save position.
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const key = (entry.target as HTMLElement).dataset.sectionKey;
          if (!key || key === currentKeyRef.current) continue;
          currentKeyRef.current = key;
          setCurrentKey(key);
          const slash = key.lastIndexOf("/");
          const slug = key.slice(0, slash);
          const chapter = parseInt(key.slice(slash + 1), 10);
          window.history.replaceState(null, "", `/catholic-path/bible/${slug}/${chapter}`);
          schedulePositionSave(slug, chapter);
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    for (const el of sectionEls.current.values()) obs.observe(el);
    return () => obs.disconnect();
  }, [sections, schedulePositionSave]);

  // After appendNext driven by the Next-chapter button/Space, scroll to
  // the freshly rendered section.
  useEffect(() => {
    const key = pendingScrollKeyRef.current;
    if (!key) return;
    const el = sectionEls.current.get(key);
    if (!el) return;
    pendingScrollKeyRef.current = null;
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - 68,
      behavior: "smooth",
    });
  }, [sections]);

  // Deep link: /book/chapter#v12 (from search results) scrolls to the verse.
  useEffect(() => {
    const m = window.location.hash.match(/^#v(\d+)$/);
    if (!m) return;
    const el = document.getElementById(`v${m[1]}`);
    if (!el) return;
    const t = window.setTimeout(() => {
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - 120,
        behavior: "smooth",
      });
    }, 80);
    return () => window.clearTimeout(t);
  }, []);

  /* ── Desktop advance (button + Space) ── */

  const advance = useCallback(async () => {
    const idx = sections.findIndex(
      (s) => keyOf(s.bookSlug, s.chapter) === currentKeyRef.current
    );
    const next = sections[idx + 1];
    if (next) {
      const el = sectionEls.current.get(keyOf(next.bookSlug, next.chapter));
      if (el) {
        window.scrollTo({
          top: el.getBoundingClientRect().top + window.scrollY - 68,
          behavior: "smooth",
        });
        return;
      }
    }
    const newKey = await appendNext();
    if (newKey) pendingScrollKeyRef.current = newKey;
  }, [sections, appendNext]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && panel === "books") {
        setPanel(null);
        return;
      }
      if (e.code !== "Space" || e.repeat) return;
      if (panel !== null || composer !== null) return;
      const t = e.target as HTMLElement | null;
      if (
        t &&
        (t.tagName === "INPUT" ||
          t.tagName === "TEXTAREA" ||
          t.tagName === "SELECT" ||
          t.isContentEditable)
      ) {
        return;
      }
      if (!window.matchMedia("(min-width: 768px)").matches) return;
      e.preventDefault();
      void advance();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [advance, panel, composer]);

  /* ── Highlights ── */

  const applySelection = useCallback(
    (color: HighlightColor) => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || sel.rangeCount === 0) return;
      const range = sel.getRangeAt(0);
      const root = contentRef.current;
      if (!root || !root.contains(range.commonAncestorContainer)) return;

      const verseEls = Array.from(
        root.querySelectorAll<HTMLElement>("[data-vtext]")
      ).filter((el) => range.intersectsNode(el));
      if (verseEls.length === 0) return;

      const created: { key: string; hl: BibleHighlight }[] = [];
      let firstRef: { bookName: string; chapter: number; verse: number } | null = null;

      for (const el of verseEls) {
        const verse = parseInt(el.dataset.vtext ?? "", 10);
        const bookSlug = el.dataset.vb ?? "";
        const chapter = parseInt(el.dataset.vc ?? "", 10);
        if (!bookSlug || !Number.isFinite(verse) || !Number.isFinite(chapter)) continue;
        const full = el.textContent ?? "";

        // cloneRange/selectNodeContents/toString().length offset mapping —
        // plain-text lengths, immune to nested <mark> splits.
        let startOff = 0;
        if (el.contains(range.startContainer)) {
          const pre = document.createRange();
          pre.selectNodeContents(el);
          pre.setEnd(range.startContainer, range.startOffset);
          startOff = pre.toString().length;
        }
        let endOff = full.length;
        if (el.contains(range.endContainer)) {
          const pre = document.createRange();
          pre.selectNodeContents(el);
          pre.setEnd(range.endContainer, range.endOffset);
          endOff = pre.toString().length;
        }
        startOff = Math.max(0, Math.min(full.length, startOff));
        endOff = Math.max(0, Math.min(full.length, endOff));
        if (endOff <= startOff) continue;

        const hl: BibleHighlight = {
          id: `temp-${crypto.randomUUID()}`,
          bookSlug,
          chapter,
          verse,
          startOff,
          endOff,
          color,
        };
        created.push({ key: keyOf(bookSlug, chapter), hl });
        if (!firstRef) {
          firstRef = {
            bookName: booksBySlug.get(bookSlug)?.name ?? bookSlug,
            chapter,
            verse,
          };
        }
      }
      if (created.length === 0) return;

      const rect = range.getBoundingClientRect();
      sel.removeAllRanges();

      // Optimistic render, then persist one row per verse.
      setHighlightsByKey((prev) => {
        const next = { ...prev };
        for (const { key, hl } of created) next[key] = [...(next[key] ?? []), hl];
        return next;
      });
      for (const { key, hl } of created) {
        void addHighlight({
          book: hl.bookSlug,
          chapter: hl.chapter,
          verse: hl.verse,
          startOff: hl.startOff,
          endOff: hl.endOff,
          color: hl.color,
        }).then((res) => {
          if (res.success) {
            tempIdMapRef.current.set(hl.id, res.data.id);
            setHighlightsByKey((prev) => ({
              ...prev,
              [key]: (prev[key] ?? []).map((h) =>
                h.id === hl.id ? { ...h, id: res.data.id } : h
              ),
            }));
          } else {
            setHighlightsByKey((prev) => ({
              ...prev,
              [key]: (prev[key] ?? []).filter((h) => h.id !== hl.id),
            }));
            showToast("That highlight couldn't be saved.");
          }
        });
      }

      // The quote-note affordance floats right above the new highlight.
      if (firstRef) {
        setPopover({
          colorId: color === "bold" ? null : created[0].hl.id,
          boldId: color === "bold" ? created[0].hl.id : null,
          refLabel: `${firstRef.bookName} ${firstRef.chapter}:${firstRef.verse}`,
          x: rect.left + rect.width / 2,
          y: rect.top,
        });
      }
    },
    [booksBySlug, showToast]
  );

  // Armed mode: apply on selection end anywhere in the scripture text.
  // Chrome (header, palette, popover, sheets) is marked data-reader-ui so
  // taps there never double-apply a lingering selection.
  useEffect(() => {
    function onPointerUp(e: PointerEvent) {
      const color = armedColorRef.current;
      if (!color) return;
      const t = e.target as HTMLElement | null;
      if (t && t.closest("[data-reader-ui]")) return;
      window.setTimeout(() => applySelection(color), 30);
    }
    document.addEventListener("pointerup", onPointerUp);
    return () => document.removeEventListener("pointerup", onPointerUp);
  }, [applySelection]);

  // The popover is viewport-anchored; scrolling would strand it.
  useEffect(() => {
    if (!popover) return;
    function onScroll() {
      setPopover(null);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [popover]);

  const armColor = useCallback(
    (c: HighlightColor) => {
      // Select-then-choose: an existing selection is highlighted at once.
      const sel = window.getSelection();
      if (sel && !sel.isCollapsed) applySelection(c);
      setArmedColor((prev) => (prev === c ? null : c));
    },
    [applySelection]
  );

  const onMarkTap = useCallback(
    (
      e: ReactMouseEvent<HTMLElement>,
      color: BibleHighlight | null,
      bold: BibleHighlight | null,
      bookName: string
    ) => {
      e.stopPropagation();
      const ref = color ?? bold;
      if (!ref) return;
      const rect = e.currentTarget.getBoundingClientRect();
      setPopover({
        colorId: color?.id ?? null,
        boldId: bold?.id ?? null,
        refLabel: `${bookName} ${ref.chapter}:${ref.verse}`,
        x: rect.left + rect.width / 2,
        y: rect.top,
      });
    },
    []
  );

  const handleRemoveHighlight = useCallback((id: string) => {
    const realId = tempIdMapRef.current.get(id) ?? id;
    setPopover(null);
    setHighlightsByKey((prev) => {
      const next: Record<string, BibleHighlight[]> = {};
      for (const [k, list] of Object.entries(prev)) {
        next[k] = list.filter((h) => h.id !== id && h.id !== realId);
      }
      return next;
    });
    if (!realId.startsWith("temp-")) void removeHighlight(realId);
  }, []);

  /* ── Notes ── */

  const openComposer = useCallback((refLabel: string) => {
    setPopover(null);
    setPanel(null);
    setComposer({ title: refLabel, body: "", saving: false, error: null });
  }, []);

  const handleSaveNote = useCallback(async () => {
    if (!composer || composer.saving) return;
    setComposer((c) => (c ? { ...c, saving: true, error: null } : c));
    const res = await saveBibleNote({ title: composer.title, body: composer.body });
    if (res.success) {
      setComposer(null);
      setNotes(null); // stale — refetch next time the panel opens
      showToast("Saved to your journal.");
    } else {
      setComposer((c) => (c ? { ...c, saving: false, error: res.error } : c));
    }
  }, [composer, showToast]);

  const openNotesPanel = useCallback(async () => {
    setPaletteOpen(false);
    setPopover(null);
    const opening = panel !== "notes";
    setPanel(opening ? "notes" : null);
    if (opening && notes === null && !notesLoading) {
      setNotesLoading(true);
      setNotesError(null);
      const res = await listBibleNotes();
      setNotesLoading(false);
      if (res.success) setNotes(res.data);
      else setNotesError(res.error);
    }
  }, [panel, notes, notesLoading]);

  /* ── Search ── */

  const parsedRef = useMemo(
    () => parseReference(searchQuery, books),
    [searchQuery, books]
  );

  const navigateToRef = useCallback(
    (ref: ParsedReference) => {
      setPanel(null);
      const chapter = ref.chapter ?? 1;
      const key = keyOf(ref.slug, chapter);
      // If the target chapter is already in the feed, scroll instead of a
      // full navigation (also covers "search for the chapter I'm in").
      const el = sectionEls.current.get(key);
      if (el) {
        // Verse anchors only exist on the server-rendered first section.
        if (ref.verse && key === initialKey) {
          const vEl = document.getElementById(`v${ref.verse}`);
          if (vEl) {
            window.scrollTo({
              top: vEl.getBoundingClientRect().top + window.scrollY - 120,
              behavior: "smooth",
            });
            return;
          }
        }
        window.scrollTo({
          top: el.getBoundingClientRect().top + window.scrollY - 68,
          behavior: "smooth",
        });
        return;
      }
      const hash = ref.verse ? `#v${ref.verse}` : "";
      router.push(`/catholic-path/bible/${ref.slug}/${chapter}${hash}`);
    },
    [router, initialKey]
  );

  const handleSearchSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (parsedRef) {
        navigateToRef(parsedRef);
        return;
      }
      const q = searchQuery.trim();
      if (q.length < 2 || searching) return;
      setSearching(true);
      setSearchError(null);
      const res = await searchBible(q);
      setSearching(false);
      if (res.success) {
        setSearchResults(res.data);
      } else {
        setSearchResults(null);
        setSearchError(res.error);
      }
    },
    [parsedRef, navigateToRef, searchQuery, searching]
  );

  /* ── Book navigator ── */

  // The books prop is BIBLE_BOOKS in canon order; Matthew opens the NT.
  const ntSlugs = useMemo(() => {
    const i = books.findIndex((b) => b.slug === "matthew");
    return new Set((i === -1 ? [] : books.slice(i)).map((b) => b.slug));
  }, [books]);

  const filteredBooks = useMemo(() => {
    const key = normalizeBookKey(booksQuery);
    if (!key) return books;
    const abbrevSlug = BOOK_ABBREVIATIONS[key];
    return books.filter(
      (b) => normalizeBookKey(b.name).includes(key) || b.slug === abbrevSlug
    );
  }, [books, booksQuery]);

  const navBook = navBookSlug ? booksBySlug.get(navBookSlug) ?? null : null;

  /* ── Render ── */

  const currentSection =
    sections.find((s) => keyOf(s.bookSlug, s.chapter) === currentKey) ?? sections[0];

  return (
    <main className="mx-auto w-full max-w-[480px] md:max-w-[600px] px-[18px] pb-24">
      {/* ── Header bar ── */}
      <header
        data-reader-ui
        className="sticky top-0 z-30 -mx-[18px] px-[18px] border-b border-white/[0.07] bg-[rgba(10,26,42,0.85)] backdrop-blur-md"
      >
        <div className="flex items-center gap-2 h-[52px]">
          <Link
            href="/catholic-path/bible"
            className="flex items-center gap-1.5 text-white/60 hover:text-white text-[11px] tracking-[0.18em] uppercase font-medium shrink-0"
          >
            {BooksIcon}
            Books
          </Link>
          <h1 className="flex-1 min-w-0 text-center font-serif text-[15px] text-white/90 truncate">
            {currentSection.bookName} {currentSection.chapter}
          </h1>
          <div className="flex items-center gap-0.5 shrink-0">
            <button
              type="button"
              aria-label="Browse books and chapters"
              onClick={() => {
                setPaletteOpen(false);
                setPopover(null);
                setBooksQuery("");
                setNavBookSlug(null);
                setPanel((p) => (p === "books" ? null : "books"));
              }}
              className={`p-2 rounded-full transition-colors ${
                panel === "books"
                  ? "text-btf-gold bg-white/[0.07]"
                  : "text-white/70 hover:text-white hover:bg-white/[0.06]"
              }`}
            >
              {ListIcon}
            </button>
            <button
              type="button"
              aria-label="Search the Bible"
              onClick={() => {
                setPaletteOpen(false);
                setPopover(null);
                setPanel((p) => (p === "search" ? null : "search"));
              }}
              className={`p-2 rounded-full transition-colors ${
                panel === "search"
                  ? "text-btf-gold bg-white/[0.07]"
                  : "text-white/70 hover:text-white hover:bg-white/[0.06]"
              }`}
            >
              {SearchIcon}
            </button>
            <button
              type="button"
              aria-label="Your Bible notes"
              onClick={() => void openNotesPanel()}
              className={`p-2 rounded-full transition-colors ${
                panel === "notes"
                  ? "text-btf-gold bg-white/[0.07]"
                  : "text-white/70 hover:text-white hover:bg-white/[0.06]"
              }`}
            >
              {NotesIcon}
            </button>
            <button
              type="button"
              aria-label="Highlighter"
              onClick={() => {
                setPanel(null);
                setPopover(null);
                setPaletteOpen((o) => {
                  if (o) setArmedColor(null);
                  return !o;
                });
              }}
              className={`p-2 rounded-full transition-colors ${
                paletteOpen || armedColor
                  ? "text-btf-gold bg-white/[0.07]"
                  : "text-white/70 hover:text-white hover:bg-white/[0.06]"
              }`}
            >
              {HighlighterIcon}
            </button>
          </div>
        </div>

        {/* ── Highlight palette ── */}
        {paletteOpen && (
          <div className="flex items-center gap-2.5 pb-3 pt-0.5">
            {(Object.keys(SWATCH_CLASSES) as Exclude<HighlightColor, "bold">[]).map(
              (c) => (
                <button
                  key={c}
                  type="button"
                  aria-label={`Highlight in ${c}`}
                  onClick={() => armColor(c)}
                  className={`h-[26px] w-[26px] rounded-full ${SWATCH_CLASSES[c]} ${
                    armedColor === c
                      ? "ring-2 ring-white/90 ring-offset-1 ring-offset-transparent"
                      : "border border-white/25"
                  }`}
                />
              )
            )}
            <button
              type="button"
              aria-label="Highlight as bold text"
              onClick={() => armColor("bold")}
              className={`h-[26px] px-2 rounded-full font-serif font-bold text-[13px] text-white bg-white/[0.08] ${
                armedColor === "bold"
                  ? "ring-2 ring-white/90"
                  : "border border-white/25"
              }`}
            >
              B
            </button>
            <span className="text-[11px] text-white/45 leading-tight">
              {armedColor
                ? "Now select the words you want to keep."
                : "Pick a color, then select text."}
            </span>
            {armedColor && (
              <button
                type="button"
                onClick={() => setArmedColor(null)}
                className="ml-auto text-[11px] text-btf-gold-light shrink-0"
              >
                Done
              </button>
            )}
          </div>
        )}
      </header>

      {/* ── Chapter feed ── */}
      <div ref={contentRef}>
        {initialChapter > 1 && (
          <div className="pt-4">
            <Link
              href={`/catholic-path/bible/${initialBookSlug}/${initialChapter - 1}`}
              className="text-[12px] text-white/50 hover:text-white"
            >
              ← Chapter {initialChapter - 1}
            </Link>
          </div>
        )}

        {sections.map((section, si) => {
          const key = keyOf(section.bookSlug, section.chapter);
          const spans = highlightsByKey[key] ?? [];
          return (
            <section
              key={key}
              data-section-key={key}
              ref={(el) => {
                if (el) sectionEls.current.set(key, el);
                else sectionEls.current.delete(key);
              }}
            >
              <div className={si === 0 ? "pt-6 pb-4" : "pt-10 pb-4"}>
                {section.chapter === 1 && (
                  <p className="text-[11px] tracking-[0.2em] uppercase text-btf-gold font-semibold">
                    {section.bookName}
                  </p>
                )}
                <h2 className="font-serif font-medium text-[26px] mt-1">
                  {section.bookName} {section.chapter}
                </h2>
                <p className="text-[11px] tracking-[0.14em] uppercase text-[#8aa0b0] mt-1">
                  Douay-Rheims · chapter {section.chapter} of{" "}
                  {booksBySlug.get(section.bookSlug)?.chapters ?? section.chapter}
                </p>
              </div>
              <div className="rounded-[20px] bg-white/[0.045] border border-white/[0.08] p-6">
                <p className="font-serif text-[17px] leading-[1.9] text-white/90">
                  {section.verses.map((v) => (
                    <span
                      key={v.verse}
                      data-verse={v.verse}
                      id={si === 0 ? `v${v.verse}` : undefined}
                    >
                      <sup className="text-[11px] text-btf-gold-light/80 font-sans mr-1 select-none">
                        {v.verse}
                      </sup>
                      <span
                        data-vtext={v.verse}
                        data-vb={section.bookSlug}
                        data-vc={section.chapter}
                      >
                        {renderVerseSegments(
                          v.text,
                          spans.filter((h) => h.verse === v.verse),
                          (e, color, bold) =>
                            onMarkTap(e, color, bold, section.bookName)
                        )}
                      </span>{" "}
                    </span>
                  ))}
                </p>
              </div>
            </section>
          );
        })}

        <div ref={sentinelRef} className="h-px" aria-hidden />
        <div className="py-10 text-center text-[12px] text-[#8aa0b0]">
          {atEnd
            ? "You've reached the end — Revelation closes the canon."
            : loadingNext
              ? "Loading the next chapter…"
              : ""}
        </div>
      </div>

      {/* ── Desktop: next chapter (Space) ── */}
      <button
        type="button"
        data-reader-ui
        onClick={() => void advance()}
        className="hidden md:flex fixed bottom-8 right-8 z-30 items-center gap-2 rounded-full pl-4 pr-3 py-3 font-semibold text-[13px] text-[#2a2008] bg-gradient-to-b from-btf-gold-light to-btf-gold shadow-lg shadow-black/30 hover:-translate-y-0.5 transition-transform"
      >
        {DownIcon}
        Next chapter
        <span className="text-[10px] font-medium opacity-70 border border-[#2a2008]/35 rounded px-1.5 py-0.5">
          Space
        </span>
      </button>

      {/* ── Highlight popover (quote-note + remove) ── */}
      {popover && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setPopover(null)}
            aria-hidden
          />
          <div
            data-reader-ui
            className="fixed z-50 -translate-x-1/2 -translate-y-full"
            style={{
              left: Math.min(Math.max(popover.x, 110), window.innerWidth - 110),
              top: Math.max(popover.y - 8, 64),
            }}
          >
            <div className="flex items-center gap-1 rounded-full bg-[#11263c] border border-white/15 shadow-lg shadow-black/40 px-1.5 py-1">
              <button
                type="button"
                onClick={() => openComposer(popover.refLabel)}
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] text-btf-gold-light hover:bg-white/[0.07]"
              >
                {QuoteIcon}
                Note
              </button>
              {popover.colorId && (
                <>
                  <span className="h-4 w-px bg-white/15" aria-hidden />
                  <button
                    type="button"
                    onClick={() => {
                      const id = popover.colorId;
                      if (id) handleRemoveHighlight(id);
                    }}
                    className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] text-white/70 hover:bg-white/[0.07]"
                  >
                    {TrashIcon}
                    {popover.boldId ? "Remove highlight" : "Remove"}
                  </button>
                </>
              )}
              {popover.boldId && (
                <>
                  <span className="h-4 w-px bg-white/15" aria-hidden />
                  <button
                    type="button"
                    onClick={() => {
                      const id = popover.boldId;
                      if (id) handleRemoveHighlight(id);
                    }}
                    className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] text-white/70 hover:bg-white/[0.07]"
                  >
                    {TrashIcon}
                    {popover.colorId ? "Remove bold" : "Remove"}
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}

      {/* ── Book navigator overlay ── */}
      {panel === "books" && (
        <div
          data-reader-ui
          className="fixed inset-0 z-40 bg-[rgba(6,14,24,0.94)] backdrop-blur-sm overflow-y-auto"
        >
          <div className="mx-auto w-full max-w-[480px] md:max-w-[600px] px-[18px] pt-5 pb-10">
            <div className="flex items-center gap-3">
              <input
                autoFocus
                type="text"
                value={booksQuery}
                onChange={(e) => {
                  setBooksQuery(e.target.value);
                  setNavBookSlug(null);
                }}
                placeholder="Find a book…"
                className="flex-1 min-w-0 rounded-full bg-white/[0.07] border border-white/15 focus:border-btf-gold/50 outline-none px-5 py-3 text-[15px] text-white placeholder:text-white/35"
              />
              <button
                type="button"
                aria-label="Close book navigator"
                onClick={() => setPanel(null)}
                className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/[0.06]"
              >
                {CloseIcon}
              </button>
            </div>

            {navBook ? (
              <div className="mt-5">
                <button
                  type="button"
                  onClick={() => setNavBookSlug(null)}
                  className="text-[12px] text-white/50 hover:text-white"
                >
                  ← All books
                </button>
                <h2 className="font-serif text-[22px] text-white/95 mt-2">
                  {navBook.name}
                </h2>
                <p className="text-[11px] tracking-[0.14em] uppercase text-[#8aa0b0] mt-1">
                  {navBook.chapters} {navBook.chapters === 1 ? "chapter" : "chapters"}
                </p>
                <div className="grid grid-cols-6 gap-2 mt-4">
                  {Array.from({ length: navBook.chapters }, (_, i) => i + 1).map(
                    (n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() =>
                          navigateToRef({
                            slug: navBook.slug,
                            name: navBook.name,
                            chapter: n,
                          })
                        }
                        className="rounded-xl bg-white/[0.055] border border-white/[0.09] hover:border-btf-gold/40 py-2.5 text-[14px] text-white/90 transition-colors"
                      >
                        {n}
                      </button>
                    )
                  )}
                </div>
              </div>
            ) : (
              <>
                {filteredBooks.length === 0 && (
                  <p className="mt-4 text-[13px] text-white/55">
                    No books match that — try a shorter name.
                  </p>
                )}
                {[
                  {
                    label: "Old Testament",
                    items: filteredBooks.filter((b) => !ntSlugs.has(b.slug)),
                  },
                  {
                    label: "New Testament",
                    items: filteredBooks.filter((b) => ntSlugs.has(b.slug)),
                  },
                ].map(
                  (t) =>
                    t.items.length > 0 && (
                      <section key={t.label} className="mt-6">
                        <p className="text-[11px] tracking-[0.2em] uppercase text-btf-gold font-semibold mb-3">
                          {t.label}
                        </p>
                        <ul className="grid grid-cols-2 gap-2">
                          {t.items.map((b) =>
                            b.available ? (
                              <li key={b.slug}>
                                <button
                                  type="button"
                                  onClick={() => setNavBookSlug(b.slug)}
                                  className="w-full text-left rounded-2xl bg-white/[0.055] border border-white/[0.09] hover:border-btf-gold/40 px-4 py-3 transition-colors"
                                >
                                  <span className="block text-[14px] text-white/90">
                                    {b.name}
                                  </span>
                                  <span className="block text-[11px] text-[#8aa0b0] font-light">
                                    {b.chapters}{" "}
                                    {b.chapters === 1 ? "chapter" : "chapters"}
                                  </span>
                                </button>
                              </li>
                            ) : (
                              <li key={b.slug}>
                                <div className="rounded-2xl bg-white/[0.025] border border-white/[0.05] px-4 py-3">
                                  <span className="block text-[14px] text-white/40">
                                    {b.name}
                                  </span>
                                  <span className="block text-[11px] text-white/30 font-light">
                                    Text coming soon
                                  </span>
                                </div>
                              </li>
                            )
                          )}
                        </ul>
                      </section>
                    )
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Search overlay ── */}
      {panel === "search" && (
        <div
          data-reader-ui
          className="fixed inset-0 z-40 bg-[rgba(6,14,24,0.94)] backdrop-blur-sm overflow-y-auto"
        >
          <div className="mx-auto w-full max-w-[480px] md:max-w-[600px] px-[18px] pt-5 pb-10">
            <div className="flex items-center gap-3">
              <form onSubmit={handleSearchSubmit} className="flex-1">
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSearchResults(null);
                    setSearchError(null);
                  }}
                  placeholder="Try “john 3:16” or “still small voice”"
                  className="w-full rounded-full bg-white/[0.07] border border-white/15 focus:border-btf-gold/50 outline-none px-5 py-3 text-[15px] text-white placeholder:text-white/35"
                />
              </form>
              <button
                type="button"
                aria-label="Close search"
                onClick={() => setPanel(null)}
                className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/[0.06]"
              >
                {CloseIcon}
              </button>
            </div>

            {parsedRef && (
              <button
                type="button"
                onClick={() => navigateToRef(parsedRef)}
                className="mt-4 w-full text-left rounded-2xl bg-btf-gold/[0.12] border border-btf-gold/35 hover:border-btf-gold/60 px-4 py-3 transition-colors"
              >
                <span className="block text-[11px] tracking-[0.18em] uppercase text-btf-gold font-semibold">
                  Go to
                </span>
                <span className="block font-serif text-[17px] text-white/95 mt-0.5">
                  {parsedRef.name}
                  {parsedRef.chapter ? ` ${parsedRef.chapter}` : ""}
                  {parsedRef.verse ? `:${parsedRef.verse}` : ""}
                </span>
              </button>
            )}

            {!parsedRef && searchQuery.trim().length >= 2 && searchResults === null && !searching && !searchError && (
              <p className="mt-4 text-[12px] text-white/45">
                Press Enter to search the whole text.
              </p>
            )}
            {searching && (
              <p className="mt-4 text-[13px] text-[#8aa0b0]">Searching all 73 books…</p>
            )}
            {searchError && (
              <p className="mt-4 text-[13px] text-rose-300/90">{searchError}</p>
            )}

            {searchResults && (
              <ul className="mt-4 space-y-2">
                {searchResults.length === 0 && (
                  <li className="text-[13px] text-white/55">
                    Nothing found for that — try a shorter phrase.
                  </li>
                )}
                {searchResults.map((r) => (
                  <li key={`${r.bookSlug}-${r.chapter}-${r.verse}`}>
                    <button
                      type="button"
                      onClick={() =>
                        navigateToRef({
                          slug: r.bookSlug,
                          name: r.bookName,
                          chapter: r.chapter,
                          verse: r.verse,
                        })
                      }
                      className="w-full text-left rounded-2xl bg-white/[0.055] border border-white/[0.09] hover:border-btf-gold/40 px-4 py-3 transition-colors"
                    >
                      <span className="block text-[11px] tracking-[0.14em] uppercase text-btf-gold-light/90 font-medium">
                        {r.bookName} {r.chapter}:{r.verse}
                      </span>
                      <span className="block font-serif text-[14px] text-white/80 leading-relaxed mt-1">
                        {r.snippet}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* ── Notes panel ── */}
      {panel === "notes" && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setPanel(null)}
            aria-hidden
          />
          <aside
            data-reader-ui
            className="fixed inset-y-0 right-0 z-50 w-full max-w-[380px] bg-[#0b1c2e] border-l border-white/10 overflow-y-auto"
          >
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <h2 className="font-serif text-[19px]">Your Bible notes</h2>
              <button
                type="button"
                aria-label="Close notes"
                onClick={() => setPanel(null)}
                className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/[0.06]"
              >
                {CloseIcon}
              </button>
            </div>
            <div className="px-5 pb-8">
              {notesLoading && (
                <p className="text-[13px] text-[#8aa0b0]">Opening your notes…</p>
              )}
              {notesError && (
                <p className="text-[13px] text-rose-300/90">{notesError}</p>
              )}
              {notes && notes.length === 0 && !notesLoading && (
                <p className="text-[13px] text-white/55 leading-relaxed">
                  Nothing here yet. Highlight a verse, then tap the quote mark
                  to write your first note.
                </p>
              )}
              {notes && notes.length > 0 && (
                <ul className="space-y-2">
                  {notes.map((n) => (
                    <li
                      key={n.id}
                      className="rounded-2xl bg-white/[0.055] border border-white/[0.09] px-4 py-3"
                    >
                      <p className="text-[13px] text-btf-gold-light/90 font-medium">
                        {n.title}
                      </p>
                      {n.body && (
                        <p className="text-[13px] text-white/75 leading-relaxed mt-1 line-clamp-4 whitespace-pre-line">
                          {n.body}
                        </p>
                      )}
                      <p className="text-[11px] text-[#8aa0b0] mt-2">
                        {new Date(n.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
              <Link
                href="/journal"
                className="block mt-5 text-center text-[12px] text-btf-gold-light hover:text-btf-gold-pale"
              >
                Open your full journal →
              </Link>
            </div>
          </aside>
        </>
      )}

      {/* ── Note composer ── */}
      {composer && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div
            className="absolute inset-0 bg-black/55"
            onClick={() => !composer.saving && setComposer(null)}
            aria-hidden
          />
          <div
            data-reader-ui
            className="relative w-full max-w-[480px] rounded-t-3xl md:rounded-3xl bg-[#0d2033] border border-white/12 p-5 pb-7 md:pb-5"
          >
            <p className="text-[11px] tracking-[0.2em] uppercase text-btf-gold font-semibold mb-3">
              Save a note
            </p>
            <input
              type="text"
              value={composer.title}
              onChange={(e) =>
                setComposer((c) => (c ? { ...c, title: e.target.value } : c))
              }
              placeholder="Title"
              className="w-full rounded-xl bg-white/[0.06] border border-white/15 focus:border-btf-gold/50 outline-none px-4 py-2.5 text-[14px] text-white placeholder:text-white/35"
            />
            <textarea
              value={composer.body}
              onChange={(e) =>
                setComposer((c) => (c ? { ...c, body: e.target.value } : c))
              }
              placeholder="What is this passage saying to you?"
              rows={5}
              className="mt-2.5 w-full rounded-xl bg-white/[0.06] border border-white/15 focus:border-btf-gold/50 outline-none px-4 py-3 text-[14px] text-white placeholder:text-white/35 resize-none"
            />
            {composer.error && (
              <p className="mt-2 text-[12px] text-rose-300/90">{composer.error}</p>
            )}
            <div className="flex items-center gap-3 mt-4">
              <button
                type="button"
                onClick={() => setComposer(null)}
                disabled={composer.saving}
                className="flex-1 rounded-full py-2.5 border border-white/15 text-[#cfe0ee] text-[13px] hover:border-white/30 transition-colors disabled:opacity-50"
              >
                Not now
              </button>
              <button
                type="button"
                onClick={() => void handleSaveNote()}
                disabled={composer.saving}
                className="flex-1 rounded-full py-2.5 font-semibold text-[13px] text-[#2a2008] bg-gradient-to-b from-btf-gold-light to-btf-gold hover:-translate-y-0.5 transition-transform disabled:opacity-60"
              >
                {composer.saving ? "Saving…" : "Save to journal"}
              </button>
            </div>
            <p className="mt-3 text-[11px] text-[#8aa0b0] leading-relaxed">
              Notes live in your encrypted journal — only you can read them.
            </p>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-50 rounded-full bg-[#11263c] border border-btf-gold/40 px-4 py-2 text-[13px] text-white/90 shadow-lg shadow-black/40">
          {toast}
        </div>
      )}
    </main>
  );
}
