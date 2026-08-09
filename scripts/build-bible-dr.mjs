#!/usr/bin/env node
/**
 * build-bible-dr.mjs — build the self-hosted Douay-Rheims Bible.
 *
 * Downloads the complete Douay-Rheims Bible (Challoner revision, public
 * domain) from Project Gutenberg ebook #1581, parses it, and writes one
 * JSON file per book to public/bible/dra/<slug>.json with the shape:
 *
 *   { "name": "<modern display name>", "chapters": [ ["v1 text", ...], ... ] }
 *
 * The app (app/lib/bible.ts) prefers these files and falls back to
 * bible-api.com only when a book's JSON is absent.
 *
 * Usage (run from the repo root on a machine with internet access):
 *   node scripts/build-bible-dr.mjs                 # download + build
 *   node scripts/build-bible-dr.mjs --input pg.txt  # parse a local copy instead
 *   node scripts/build-bible-dr.mjs --out <dir>     # override output directory
 *   node scripts/build-bible-dr.mjs --force         # write books even when their
 *                                                   # chapter count is unexpected
 *
 * Source-format notes (verified against pg1581.txt, "most recently updated
 * September 23, 2023", 5.7 MB):
 *   - Book headers are ALL-CAPS lines ("THE BOOK OF GENESIS", ...). We do
 *     not rely on them; chapter headings are the authoritative marker.
 *   - Chapter headings look like "Genesis Chapter 1" / "1 Kings Chapter 3".
 *     The book-name prefix uses the DR's historical names (Josue, Tobias,
 *     1-4 Kings for Samuel+Kings, Paralipomenon, Esdras, Ecclesiasticus,
 *     Canticle of Canticles, Isaias, ... Apocalypse).
 *   - Verses are paragraphs starting "chapter:verse. text", wrapped across
 *     lines and separated by blank lines.
 *   - Book introductions, per-chapter summaries, and Challoner's commentary
 *     notes are paragraphs WITHOUT the leading chapter:verse pattern — all
 *     are skipped.
 *   - An "APPENDICES" section at the end contains 1610-spelling duplicates
 *     (3/4 Esdras, Prophecie of Abdias, Epistle of Ivde) — parsing stops
 *     there so nothing is double-counted.
 *
 * Known numbering quirks in the source (genuine Vulgate features, not
 * parse errors — verses are stored in file order, so the app displays
 * positional numbers for these four chapters):
 *   - Psalm 113 restarts at verse 1 partway through (Vulgate 113A/113B).
 *   - Psalm 115 is printed as verses 10-19, Psalm 147 as verses 12-20.
 *   - Proverbs 12 prints two different verses both numbered 12:12.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SOURCES = [
  "https://www.gutenberg.org/cache/epub/1581/pg1581.txt",
  "https://www.gutenberg.org/files/1581/1581-0.txt",
];

/**
 * Expected canon: [slug, modern display name, chapter count].
 * Duplicated from BIBLE_BOOKS in app/lib/bible.ts (keep in sync) — this
 * script is plain Node and cannot import the TypeScript module directly.
 */
const EXPECTED = [
  ["genesis", "Genesis", 50],
  ["exodus", "Exodus", 40],
  ["leviticus", "Leviticus", 27],
  ["numbers", "Numbers", 36],
  ["deuteronomy", "Deuteronomy", 34],
  ["joshua", "Joshua", 24],
  ["judges", "Judges", 21],
  ["ruth", "Ruth", 4],
  ["1-samuel", "1 Samuel", 31],
  ["2-samuel", "2 Samuel", 24],
  ["1-kings", "1 Kings", 22],
  ["2-kings", "2 Kings", 25],
  ["1-chronicles", "1 Chronicles", 29],
  ["2-chronicles", "2 Chronicles", 36],
  ["ezra", "Ezra", 10],
  ["nehemiah", "Nehemiah", 13],
  ["tobit", "Tobit", 14],
  ["judith", "Judith", 16],
  ["esther", "Esther", 10],
  ["1-maccabees", "1 Maccabees", 16],
  ["2-maccabees", "2 Maccabees", 15],
  ["job", "Job", 42],
  ["psalms", "Psalms", 150],
  ["proverbs", "Proverbs", 31],
  ["ecclesiastes", "Ecclesiastes", 12],
  ["song-of-solomon", "Song of Solomon", 8],
  ["wisdom", "Wisdom", 19],
  ["sirach", "Sirach", 51],
  ["isaiah", "Isaiah", 66],
  ["jeremiah", "Jeremiah", 52],
  ["lamentations", "Lamentations", 5],
  ["baruch", "Baruch", 6],
  ["ezekiel", "Ezekiel", 48],
  ["daniel", "Daniel", 12],
  ["hosea", "Hosea", 14],
  ["joel", "Joel", 3],
  ["amos", "Amos", 9],
  ["obadiah", "Obadiah", 1],
  ["jonah", "Jonah", 4],
  ["micah", "Micah", 7],
  ["nahum", "Nahum", 3],
  ["habakkuk", "Habakkuk", 3],
  ["zephaniah", "Zephaniah", 3],
  ["haggai", "Haggai", 2],
  ["zechariah", "Zechariah", 14],
  ["malachi", "Malachi", 4],
  ["matthew", "Matthew", 28],
  ["mark", "Mark", 16],
  ["luke", "Luke", 24],
  ["john", "John", 21],
  ["acts", "Acts", 28],
  ["romans", "Romans", 16],
  ["1-corinthians", "1 Corinthians", 16],
  ["2-corinthians", "2 Corinthians", 13],
  ["galatians", "Galatians", 6],
  ["ephesians", "Ephesians", 6],
  ["philippians", "Philippians", 4],
  ["colossians", "Colossians", 4],
  ["1-thessalonians", "1 Thessalonians", 5],
  ["2-thessalonians", "2 Thessalonians", 3],
  ["1-timothy", "1 Timothy", 6],
  ["2-timothy", "2 Timothy", 4],
  ["titus", "Titus", 3],
  ["philemon", "Philemon", 1],
  ["hebrews", "Hebrews", 13],
  ["james", "James", 5],
  ["1-peter", "1 Peter", 5],
  ["2-peter", "2 Peter", 3],
  ["1-john", "1 John", 5],
  ["2-john", "2 John", 1],
  ["3-john", "3 John", 1],
  ["jude", "Jude", 1],
  ["revelation", "Revelation", 22],
];

/**
 * Chapter counts where the DR text legitimately differs from the app
 * table: DR Esther includes the Greek additions as chapters 11-16, and
 * DR Daniel includes Susanna (13) and Bel and the Dragon (14). These are
 * reported as EXPECTED diffs and still written.
 */
const EXPECTED_DR_DIFFS = { esther: 16, daniel: 14 };

/**
 * Historical DR chapter-heading prefix -> app slug. All 73 prefixes
 * verified against the live pg1581.txt (2023-09-23 update).
 */
const PREFIX_TO_SLUG = {
  Genesis: "genesis",
  Exodus: "exodus",
  Leviticus: "leviticus",
  Numbers: "numbers",
  Deuteronomy: "deuteronomy",
  Josue: "joshua",
  Judges: "judges",
  Ruth: "ruth",
  // In the DR, 1-2 Kings are Samuel and 3-4 Kings are the modern Kings.
  "1 Kings": "1-samuel",
  "2 Kings": "2-samuel",
  "3 Kings": "1-kings",
  "4 Kings": "2-kings",
  "1 Paralipomenon": "1-chronicles",
  "2 Paralipomenon": "2-chronicles",
  "1 Esdras": "ezra",
  "2 Esdras": "nehemiah",
  Tobias: "tobit",
  Judith: "judith",
  Esther: "esther",
  Job: "job",
  Psalms: "psalms",
  Proverbs: "proverbs",
  Ecclesiastes: "ecclesiastes",
  "Canticle of Canticles": "song-of-solomon",
  Wisdom: "wisdom",
  Ecclesiasticus: "sirach",
  Isaias: "isaiah",
  Jeremias: "jeremiah",
  Lamentations: "lamentations",
  Baruch: "baruch",
  Ezechiel: "ezekiel",
  Daniel: "daniel",
  Osee: "hosea",
  Joel: "joel",
  Amos: "amos",
  Abdias: "obadiah",
  Jonas: "jonah",
  Micheas: "micah",
  Nahum: "nahum",
  Habacuc: "habakkuk",
  Sophonias: "zephaniah",
  Aggeus: "haggai",
  Zacharias: "zechariah",
  Malachias: "malachi",
  "1 Machabees": "1-maccabees",
  "2 Machabees": "2-maccabees",
  Matthew: "matthew",
  Mark: "mark",
  Luke: "luke",
  John: "john",
  Acts: "acts",
  Romans: "romans",
  "1 Corinthians": "1-corinthians",
  "2 Corinthians": "2-corinthians",
  Galatians: "galatians",
  Ephesians: "ephesians",
  Philippians: "philippians",
  Colossians: "colossians",
  "1 Thessalonians": "1-thessalonians",
  "2 Thessalonians": "2-thessalonians",
  "1 Timothy": "1-timothy",
  "2 Timothy": "2-timothy",
  Titus: "titus",
  Philemon: "philemon",
  Hebrews: "hebrews",
  James: "james",
  "1 Peter": "1-peter",
  "2 Peter": "2-peter",
  "1 John": "1-john",
  "2 John": "2-john",
  "3 John": "3-john",
  Jude: "jude",
  Apocalypse: "revelation",
};

/**
 * Defensive extras: if a future Gutenberg re-edit modernizes the headings
 * (its table of contents already says "The First Book of Samuel, otherwise
 * called..."), accept modern names too. Only applied for prefixes not
 * already claimed above — except the Kings ambiguity handled in main().
 */
const MODERN_PREFIXES = {
  "1 Samuel": "1-samuel",
  "2 Samuel": "2-samuel",
  "1 Chronicles": "1-chronicles",
  "2 Chronicles": "2-chronicles",
  Ezra: "ezra",
  Nehemiah: "nehemiah",
  Tobit: "tobit",
  Joshua: "joshua",
  "Song of Solomon": "song-of-solomon",
  Sirach: "sirach",
  Isaiah: "isaiah",
  Jeremiah: "jeremiah",
  Ezekiel: "ezekiel",
  Hosea: "hosea",
  Obadiah: "obadiah",
  Jonah: "jonah",
  Micah: "micah",
  Habakkuk: "habakkuk",
  Zephaniah: "zephaniah",
  Haggai: "haggai",
  Zechariah: "zechariah",
  Malachi: "malachi",
  "1 Maccabees": "1-maccabees",
  "2 Maccabees": "2-maccabees",
  Revelation: "revelation",
};

const CHAPTER_RE = /^(.{1,60}?)\s+Chapter\s+(\d+)\s*$/;
const VERSE_RE = /^(\d+):(\d+)\.\s*(.*)$/;

async function download() {
  for (const url of SOURCES) {
    try {
      process.stderr.write(`Downloading ${url} ...\n`);
      const res = await fetch(url, { redirect: "follow" });
      if (!res.ok) {
        process.stderr.write(`  HTTP ${res.status} — trying next source\n`);
        continue;
      }
      const text = await res.text();
      process.stderr.write(`  OK (${(text.length / 1e6).toFixed(1)} MB)\n`);
      // The complete DR is ~5.7 MB; anything much smaller is truncated
      // or an error page. Refuse to parse it.
      if (text.length < 4_000_000) {
        process.stderr.write(`  Suspiciously small (${text.length} bytes) — trying next source\n`);
        continue;
      }
      return text;
    } catch (err) {
      process.stderr.write(`  Failed: ${err?.message ?? err} — trying next source\n`);
    }
  }
  throw new Error("Could not download the Douay-Rheims text from any source.");
}

/** Strip the Gutenberg header/footer and the appendices. */
function trimGutenberg(raw) {
  let text = raw.replace(/\r\n/g, "\n");
  const start = text.indexOf("*** START OF THE PROJECT GUTENBERG EBOOK");
  if (start !== -1) {
    text = text.slice(text.indexOf("\n", start) + 1);
  } else {
    process.stderr.write("WARNING: Gutenberg START marker not found — parsing whole input.\n");
  }
  const end = text.indexOf("*** END OF THE PROJECT GUTENBERG EBOOK");
  if (end !== -1) text = text.slice(0, end);
  // The appendices reprint Abdias and Jude in 1610 spelling plus 3-4
  // Esdras; stop before them so no book gets duplicate chapters.
  const appendices = text.search(/^\s*APPENDICES\s*$/m);
  if (appendices !== -1) text = text.slice(0, appendices);
  return text;
}

/**
 * Build the effective prefix -> slug map. If the source ever switches to
 * modern "1 Samuel" headings, "1 Kings"/"2 Kings" must then mean the
 * modern books of Kings rather than Samuel.
 */
function buildPrefixMap(allPrefixes) {
  const map = { ...PREFIX_TO_SLUG };
  for (const [name, slug] of Object.entries(MODERN_PREFIXES)) {
    if (!(name in map)) map[name] = slug;
  }
  if (allPrefixes.has("1 Samuel") || allPrefixes.has("2 Samuel")) {
    process.stderr.write("NOTE: source uses modern Samuel headings; remapping 1-2 Kings accordingly.\n");
    map["1 Kings"] = "1-kings";
    map["2 Kings"] = "2-kings";
    delete map["3 Kings"];
    delete map["4 Kings"];
  }
  return map;
}

/**
 * Parse the trimmed text into { slug: string[][] } (chapters of verse
 * texts, in file order). Also returns numbering irregularities and any
 * chapter-heading prefixes that could not be mapped to a slug.
 */
function parse(text) {
  // Pre-scan chapter-heading prefixes so the Kings ambiguity can be
  // resolved before assigning any verses.
  const allPrefixes = new Set();
  for (const line of text.split("\n")) {
    const m = line.trim().match(CHAPTER_RE);
    if (m) allPrefixes.add(m[1]);
  }
  const prefixMap = buildPrefixMap(allPrefixes);

  const books = new Map(); // slug -> string[][]
  const unmapped = new Set();
  const irregular = []; // chapters whose printed verse numbers are not 1..n
  const warnings = [];

  let slug = null; // current book
  let chapterNo = 0; // current chapter number as printed
  let verses = null; // current chapter's verse texts (file order)
  let printedNums = null; // printed verse numbers, for the irregularity report
  let buf = null; // lines of the verse currently being accumulated

  const flushVerse = () => {
    if (buf && verses) {
      verses.push(buf.join(" ").replace(/\s+/g, " ").trim());
    }
    buf = null;
  };
  const flushChapter = () => {
    flushVerse();
    if (slug && printedNums && printedNums.some((n, i) => n !== i + 1)) {
      irregular.push(`${slug} ${chapterNo} (printed: ${printedNums.join(",")})`);
    }
    verses = null;
    printedNums = null;
  };

  for (const rawLine of text.split("\n")) {
    const line = rawLine.trim();
    if (line === "") {
      // Blank line ends the current verse paragraph.
      flushVerse();
      continue;
    }

    // New chapter heading. Only recognized between paragraphs (buf === null)
    // so a wrapped verse can never be mistaken for a heading.
    const cm = buf === null ? line.match(CHAPTER_RE) : null;
    if (cm) {
      flushChapter();
      const prefix = cm[1];
      const mapped = prefixMap[prefix];
      if (!mapped) {
        unmapped.add(prefix);
        slug = null;
        continue;
      }
      slug = mapped;
      chapterNo = parseInt(cm[2], 10);
      if (!books.has(slug)) books.set(slug, []);
      const chapters = books.get(slug);
      if (chapters.length !== chapterNo - 1) {
        warnings.push(`${slug}: chapter ${chapterNo} found after ${chapters.length} chapter(s) parsed`);
      }
      verses = [];
      printedNums = [];
      chapters.push(verses);
      continue;
    }

    // Verse start: "chapter:verse. text". The chapter part must match the
    // current heading — this rejects stray references inside notes.
    const vm = line.match(VERSE_RE);
    if (vm && verses && parseInt(vm[1], 10) === chapterNo) {
      flushVerse();
      printedNums.push(parseInt(vm[2], 10));
      buf = [vm[3]];
      continue;
    }

    // Continuation of the current verse paragraph; every other paragraph
    // (book intros, chapter summaries, commentary notes) is skipped.
    if (buf) buf.push(line);
  }
  flushChapter();

  return { books, unmapped, irregular, warnings };
}

function main() {
  const args = process.argv.slice(2);
  const force = args.includes("--force");
  const getFlag = (name) => {
    const i = args.indexOf(name);
    return i !== -1 && args[i + 1] ? args[i + 1] : null;
  };
  const inputPath = getFlag("--input");
  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const outDir = getFlag("--out") ?? path.join(scriptDir, "..", "public", "bible", "dra");

  const run = async () => {
    const raw = inputPath ? fs.readFileSync(inputPath, "utf8") : await download();
    const { books, unmapped, irregular, warnings } = parse(trimGutenberg(raw));

    let totalVerses = 0;
    for (const chapters of books.values()) {
      for (const ch of chapters) totalVerses += ch.length;
    }

    // ----- Validation report -----
    const expectedBySlug = new Map(EXPECTED.map(([slug, name, chapters]) => [slug, { name, chapters }]));
    const missing = EXPECTED.filter(([slug]) => !books.has(slug)).map(([slug]) => slug);
    const extra = [...books.keys()].filter((slug) => !expectedBySlug.has(slug));
    const okBooks = [];
    const expectedDiffs = [];
    const unexpectedMismatches = [];

    for (const [slug, chapters] of books) {
      const expected = expectedBySlug.get(slug);
      if (!expected) continue; // reported via `extra`
      const emptyChapters = chapters.filter((ch) => ch.length === 0).length;
      if (emptyChapters > 0) {
        unexpectedMismatches.push(`${slug}: ${emptyChapters} chapter(s) parsed with zero verses`);
        continue;
      }
      if (chapters.length === expected.chapters) {
        okBooks.push(slug);
      } else if (EXPECTED_DR_DIFFS[slug] === chapters.length) {
        expectedDiffs.push(`${slug}: ${chapters.length} chapters in DR vs ${expected.chapters} in app table (expected diff — DR includes the deuterocanonical additions)`);
        okBooks.push(slug);
      } else {
        unexpectedMismatches.push(`${slug}: parsed ${chapters.length} chapters, expected ${expected.chapters}`);
      }
    }

    console.log("\n===== Douay-Rheims build report =====");
    console.log(`Books parsed:        ${books.size} / ${EXPECTED.length} expected`);
    console.log(`Total verses:        ${totalVerses}`);
    if (missing.length) console.log(`MISSING books:       ${missing.join(", ")}`);
    if (extra.length) console.log(`UNEXPECTED books:    ${extra.join(", ")}`);
    if (unmapped.size) console.log(`UNMAPPED headings:   ${[...unmapped].join(" | ")}`);
    for (const w of warnings) console.log(`WARNING:             ${w}`);
    for (const d of expectedDiffs) console.log(`Expected diff:       ${d}`);
    for (const m of unexpectedMismatches) console.log(`MISMATCH:            ${m}`);
    if (irregular.length) {
      console.log("Irregular printed verse numbering (verses stored in file order; known");
      console.log("Vulgate quirks are Psalms 113/115/147 and Proverbs 12):");
      for (const line of irregular) console.log(`  ${line}`);
    }

    // ----- Write output -----
    // Books with unexpected chapter counts are NOT written (unless --force)
    // so the app falls back to bible-api.com for them instead of serving
    // silently bad data.
    const writable = new Set(okBooks);
    if (force) {
      for (const slug of books.keys()) {
        if (expectedBySlug.has(slug)) writable.add(slug);
      }
    }
    fs.mkdirSync(outDir, { recursive: true });
    let written = 0;
    for (const [slug, chapters] of books) {
      if (!writable.has(slug)) continue;
      const { name } = expectedBySlug.get(slug);
      fs.writeFileSync(path.join(outDir, `${slug}.json`), JSON.stringify({ name, chapters }));
      written++;
    }
    console.log(`\nWrote ${written} book file(s) to ${path.resolve(outDir)}`);

    const failed = missing.length > 0 || extra.length > 0 || unmapped.size > 0 || unexpectedMismatches.length > 0;
    if (failed && !force) {
      console.log("Completed with problems (see report above). Books listed as MISMATCH were skipped; re-run with --force to write them anyway.");
      process.exitCode = 1;
    } else {
      console.log(failed ? "Completed with problems (--force: mismatched books written anyway)." : "All books validated cleanly.");
    }
  };

  run().catch((err) => {
    console.error(`FAILED: ${err?.message ?? err}`);
    process.exitCode = 1;
  });
}

main();
