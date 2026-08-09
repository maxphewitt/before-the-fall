/**
 * Daily Mass Reading CITATIONS (2026-08-04).
 *
 * ATTRIBUTION: citation data vendored from the open-source
 * github.com/westhong/catholic-daily-readings project (a small personal
 * project; its README states MIT for the code/citation-metadata, but
 * there's no formal LICENSE file in the repo — treat as informally open
 * and keep this attribution). That project itself derives citations
 * from the daily readings published at bible.usccb.org.
 *
 * We store ONLY citations here — book/chapter/verse references, public
 * facts, no copyright — exactly like the rest of our Scripture content.
 * The readings proclaimed at Mass in the US use the NABRE translation,
 * which IS copyrighted (see Max's standing rule) — we never store or
 * display that text. Actual verse text is rendered from our own
 * self-hosted Douay-Rheims (public/bible/dra/) via massReadingText.ts.
 *
 * COVERAGE: 2023-01-01 through 2027-10-31 (1,763 dates, snapshotted
 * 2026-08-04). Past that date, either re-run the same USCCB-scrape
 * technique to extend this file, or graduate to a liturgical-day-label
 * + cycle table (romcal for date resolution) so it never needs
 * re-scraping — see the 2026-08-04 handoff Session Log entry for the
 * full design discussion. Not needed yet; this file has over a year of
 * runway from today.
 */

import fs from "node:fs";
import path from "node:path";

export type ReadingCitation = { citation: string; sources: string[] };

export type MassReadingSlot =
  | "first_reading"
  | "responsorial_psalm"
  | "second_reading"
  | "alleluia"
  | "verse_before_gospel"
  | "sequence"
  | "gospel";

export type MassDay = {
  date: string;
  url?: string;
  lectionary_number: number;
  feast: string;
  mass: string;
  readings: Partial<Record<MassReadingSlot, ReadingCitation[]>>;
};

type RawFile = Record<string, MassDay[]>;

export const LECTIONARY_MIN_DATE = "2023-01-01";
export const LECTIONARY_MAX_DATE = "2027-10-31";

/** Module-level cache — the file is immutable at runtime. */
let cache: RawFile | null | undefined;

function readData(): RawFile | null {
  if (cache !== undefined) return cache;
  try {
    const file = path.join(process.cwd(), "public", "data", "lectionary-readings.json");
    const parsed = JSON.parse(fs.readFileSync(file, "utf8")) as RawFile;
    cache = parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    cache = null;
  }
  return cache;
}

/**
 * Picks the Mass for a date when the source lists more than one entry
 * (e.g. Christmas has Vigil/Night/Dawn/Day) — prefers the entry marked
 * "default", else the first entry that actually has readings filled
 * in, else just the first entry.
 */
export function getMassReadingsForDate(dateISO: string): MassDay | null {
  const data = readData();
  if (!data) return null;
  const entries = data[dateISO];
  if (!entries || entries.length === 0) return null;
  const withDefault = entries.find((e) => e.mass === "default");
  if (withDefault) return withDefault;
  const withReadings = entries.find(
    (e) => e.readings && Object.keys(e.readings).length > 0
  );
  return withReadings ?? entries[0];
}

const SLOT_LABELS: Partial<Record<MassReadingSlot, string>> = {
  first_reading: "First Reading",
  responsorial_psalm: "Responsorial Psalm",
  second_reading: "Second Reading",
  gospel: "Gospel",
};

/**
 * The "walkable" readings for a day, in Mass order, skipping any slot
 * this day doesn't have (most weekdays have no second reading, and a
 * handful of multi-Mass feast days are missing citations entirely in
 * the source — those just won't appear here). Alleluia / verse-before-
 * gospel / sequence are short acclamations, not full readings — never
 * offered as their own walk.
 */
export function getWalkableReadings(
  day: MassDay
): { slot: MassReadingSlot; label: string; citation: string }[] {
  const order: MassReadingSlot[] = [
    "first_reading",
    "responsorial_psalm",
    "second_reading",
    "gospel",
  ];
  const out: { slot: MassReadingSlot; label: string; citation: string }[] = [];
  for (const slot of order) {
    const citation = day.readings[slot]?.[0]?.citation;
    if (citation) out.push({ slot, label: SLOT_LABELS[slot]!, citation });
  }
  return out;
}
