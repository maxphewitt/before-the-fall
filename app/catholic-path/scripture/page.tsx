import Link from "next/link";
import {
  PASSAGES,
  THEME_LABELS,
  THEME_BLURBS,
  getPassagesByTheme,
  getPassagesBySeason,
  getPassageForDate,
} from "../../lib/scripture";
import {
  getCurrentLiturgicalSeason,
  getSeasonBlurb,
} from "../../lib/liturgicalCalendar";
import { SEASON_LABELS } from "../../lib/prayers";

/**
 * /catholic-path/scripture — Daily Scripture landing.
 *
 * Server component. Three sections:
 *   1. Today's passage — picked deterministically by date, weighted
 *      toward the current liturgical season's passages.
 *   2. Liturgical-season callout if there are season-specific passages.
 *   3. Browse by theme (Comfort, Mercy, Trust, Suffering, Hope,
 *      Discernment, Surrender, Healing, Conversion).
 *
 * All text is Douay-Rheims (public domain). NABRE / RSV-2CE pending
 * Task #16 licensing.
 *
 * Renders dynamically so "today's passage" reflects the actual request
 * date instead of the build-time snapshot.
 */
export const dynamic = "force-dynamic";

const THEMES_DISPLAY_ORDER = [
  "comfort",
  "mercy",
  "trust",
  "suffering",
  "hope",
  "discernment",
  "surrender",
  "healing",
  "conversion",
] as const;

export default function ScriptureLandingPage() {
  const season = getCurrentLiturgicalSeason();
  const today = new Date();
  const todaysPassage = getPassageForDate(today, season);
  const seasonPassages = getPassagesBySeason(season);

  // USCCB daily-readings URL format is MMDDYY.cfm.
  const usccbDate = (() => {
    const yy = String(today.getFullYear()).slice(-2);
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${mm}${dd}${yy}`;
  })();

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-b from-btf-sky-deep via-btf-sky-deep to-btf-sky text-white py-14 px-6 overflow-hidden">
        <div
          className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[500px] h-[400px] rounded-full bg-btf-gold/25 blur-3xl pointer-events-none"
          aria-hidden
        />
        <div className="relative max-w-3xl mx-auto text-center">
          <Link
            href="/catholic-path"
            className="text-white/60 hover:text-white text-xs mb-8 inline-flex items-center gap-2 transition-colors uppercase tracking-[0.25em]"
          >
            <span aria-hidden>&larr;</span> Catholic Path
          </Link>

          <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold mb-3 mt-4">
            Daily Scripture
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-light leading-[1.15] mb-5">
            {PASSAGES.length} passages to read slowly.
          </h1>
          <p className="font-serif italic text-lg md:text-xl text-white/85 font-light mb-2 max-w-xl mx-auto text-balance">
            Douay-Rheims, public-domain Catholic translation. One verse at a time, with a place to write what rises.
          </p>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-6 py-10 sm:py-14">
        {/* Today's passage */}
        <section className="mb-12" aria-labelledby="today-heading">
          <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold font-semibold mb-3">
            Today
          </p>
          <h2
            id="today-heading"
            className="font-serif text-2xl text-btf-sky-deep font-light mb-2"
          >
            {todaysPassage.title}
          </h2>
          <p className="text-xs text-btf-text-light font-light mb-5">
            {todaysPassage.citation} &middot; {todaysPassage.translation}
          </p>

          <Link
            href={`/catholic-path/scripture/${todaysPassage.id}`}
            className="block rounded-2xl bg-white border-2 border-btf-gold/30 hover:border-btf-gold hover:shadow-md p-6 transition-all"
          >
            <p className="font-serif text-base text-btf-text-dark font-light leading-relaxed mb-4 line-clamp-5">
              {todaysPassage.full_text.split("\n\n")[0]}
            </p>
            <p className="text-xs text-btf-text-mid font-light leading-relaxed italic">
              {todaysPassage.when_to_use}
            </p>
            <p className="text-[10px] uppercase tracking-[0.25em] text-btf-gold font-semibold mt-4">
              Read this passage &rarr;
            </p>
          </Link>
        </section>

        {/* Liturgical season */}
        {seasonPassages.length > 1 && (
          <section className="mb-12" aria-labelledby="season-heading">
            <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold font-semibold mb-3">
              For this season
            </p>
            <h2
              id="season-heading"
              className="font-serif text-2xl text-btf-sky-deep font-light mb-2"
            >
              {SEASON_LABELS[season]}
            </h2>
            <p className="text-sm text-btf-text-mid font-light leading-relaxed mb-5">
              {getSeasonBlurb(season)}
            </p>
            <ul className="space-y-3">
              {seasonPassages
                .filter((p) => p.id !== todaysPassage.id)
                .map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/catholic-path/scripture/${p.id}`}
                      className="block rounded-2xl bg-white border border-btf-sky-pale/60 hover:border-btf-sky-light hover:shadow-md p-4 transition-all"
                    >
                      <p className="font-medium text-btf-sky-deep">{p.title}</p>
                      <p className="text-xs text-btf-text-light font-light mt-0.5">
                        {p.citation}
                      </p>
                      <p className="text-xs text-btf-text-mid font-light mt-1 leading-relaxed">
                        {p.when_to_use}
                      </p>
                    </Link>
                  </li>
                ))}
            </ul>
          </section>
        )}

        {/* Themes */}
        <section className="mt-12" aria-labelledby="themes-heading">
          <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold font-semibold mb-3">
            Browse by theme
          </p>
          <h2
            id="themes-heading"
            className="font-serif text-2xl text-btf-sky-deep font-light mb-6"
          >
            What are you carrying?
          </h2>
          <ul className="grid sm:grid-cols-2 gap-3">
            {THEMES_DISPLAY_ORDER.map((theme) => {
              const count = getPassagesByTheme(theme).length;
              if (count === 0) return null;
              return (
                <li key={theme}>
                  <Link
                    href={`/catholic-path/scripture/theme/${theme}`}
                    className="group h-full block rounded-2xl bg-white border-2 border-btf-sky-pale/60 hover:border-btf-sky-light hover:shadow-md p-5 transition-all"
                  >
                    <div className="flex items-baseline justify-between gap-3 mb-1">
                      <h3 className="font-serif text-lg text-btf-sky-deep font-light">
                        {THEME_LABELS[theme]}
                      </h3>
                      <span className="text-[10px] tracking-[0.2em] uppercase text-btf-text-light font-semibold">
                        {count} {count === 1 ? "passage" : "passages"}
                      </span>
                    </div>
                    <p className="text-xs text-btf-text-mid font-light leading-relaxed">
                      {THEME_BLURBS[theme]}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Today's Mass readings link */}
        <section className="mt-12 rounded-2xl bg-btf-sky-pale/40 border border-btf-sky-pale p-5 text-center">
          <p className="text-[10px] tracking-[0.25em] uppercase text-btf-sky-deep font-semibold mb-2">
            For today&rsquo;s Mass
          </p>
          <a
            href={`https://bible.usccb.org/bible/readings/${usccbDate}.cfm`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-btf-sky-deep underline underline-offset-4 font-medium"
          >
            Read today&rsquo;s actual Mass readings at usccb.org &rarr;
          </a>
          <p className="text-xs text-btf-text-mid font-light mt-2 leading-relaxed">
            The library above is a curated set of passages for moments the platform&rsquo;s users actually face. For the daily lectionary, go directly to the USCCB.
          </p>
        </section>

        {/* DRAFT v1 banner */}
        <div className="rounded-xl bg-btf-gold-pale/60 border border-btf-gold/30 text-btf-text-mid text-xs font-light p-4 mt-10 leading-relaxed">
          <span className="font-medium text-btf-sky-deep">
            Draft v1 &middot; closed beta:
          </span>{" "}
          all passages are from the Douay-Rheims Bible (Challoner revision, public domain). NABRE and RSV-2CE coming once Task #16 licensing resolves. Father Murphy is reviewing the library before public launch &mdash; if you spot anything off, message Max.
        </div>
      </div>
    </main>
  );
}
