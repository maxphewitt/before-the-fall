import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getMassReadingsForDate,
  getWalkableReadings,
  type MassReadingSlot,
} from "../../../../../../lib/lectionary";
import { resolveMassReadingVerses } from "../../../../../../lib/massReadingText";
import { bibleLinkForCitation } from "../../../../../../lib/bibleLink";
import ScriptureWalker from "../../../scripture/[id]/read/ScriptureWalker";

/**
 * /catholic-path/mass-readings/[date]/[slot] — one Mass reading,
 * verse-by-verse. Reuses the exact same ScriptureWalker as Daily
 * Scripture (Going deeper is skipped — no authored commentary exists
 * yet for arbitrary daily citations; Continue in the Bible still works,
 * since bibleLinkForCitation only needs the book + chapter).
 *
 * date = YYYY-MM-DD (the visitor's local date, set by MassReadingsToday
 * client-side). slot = one of the MassReadingSlot keys.
 */
export const dynamic = "force-dynamic";

export default async function MassReadingReadPage({
  params,
}: {
  params: Promise<{ date: string; slot: string }>;
}) {
  const { date, slot } = await params;
  const day = getMassReadingsForDate(date);
  if (!day) notFound();

  const entry = getWalkableReadings(day).find(
    (r) => r.slot === (slot as MassReadingSlot)
  );
  if (!entry) notFound();

  const link = bibleLinkForCitation(entry.citation);
  const bibleLink = link
    ? { href: `/catholic-path/bible/${link.slug}/${link.chapter}`, label: link.label }
    : null;

  const resolved = await resolveMassReadingVerses(entry.citation);

  if (!resolved) {
    // Rare: citation didn't parse (crosses a chapter boundary) or the
    // local DR text is missing for that book. Degrade gracefully — a
    // way to keep reading — instead of a bare 404.
    return (
      <main className="min-h-screen bg-gradient-to-b from-btf-deep-night via-btf-sky-deep to-btf-sky text-white flex items-center justify-center px-6">
        <div className="max-w-md text-center py-16">
          <p className="text-[10px] tracking-[0.25em] uppercase text-btf-gold-light font-semibold mb-3">
            {entry.label}
          </p>
          <h1 className="font-serif text-2xl font-light mb-4">{entry.citation}</h1>
          <p className="text-sm text-white/70 font-light leading-relaxed mb-8">
            We couldn&rsquo;t line this citation up with our verse text
            automatically.{" "}
            {bibleLink
              ? "You can still read the chapter it's from below, or read today's actual reading at USCCB."
              : "You can read today's actual reading at USCCB."}
          </p>
          <div className="space-y-3">
            {bibleLink && (
              <Link
                href={bibleLink.href}
                className="block w-full rounded-2xl bg-white/10 border border-white/20 hover:border-btf-gold/50 px-5 py-4 transition-colors"
              >
                Read {bibleLink.label} &rarr;
              </Link>
            )}
            {day.url && (
              <a
                href={day.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center rounded-2xl bg-white/10 border border-white/20 px-5 py-4 text-sm"
              >
                Today&rsquo;s reading at usccb.org &rarr;
              </a>
            )}
            <Link
              href="/catholic-path/mass-readings"
              className="block w-full text-center rounded-2xl bg-btf-gold hover:bg-btf-gold-light text-btf-sky-deep font-medium px-5 py-4"
            >
              Back to today&rsquo;s readings
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <ScriptureWalker
      passageId={`mass-${date}-${entry.slot}`}
      title={`${entry.label}${day.feast ? ` — ${day.feast}` : ""}`}
      citation={entry.citation}
      translation="Douay-Rheims"
      verses={resolved.verses}
      reflectionPrompt="What in this reading meets you today?"
      deeper={null}
      bibleLink={bibleLink}
      exitHref="/catholic-path/mass-readings"
      libraryHref="/catholic-path/mass-readings"
      habitSlug="mass-readings"
    />
  );
}
