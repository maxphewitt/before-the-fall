import Link from "next/link";
import {
  PASSAGES,
  THEME_LABELS,
  THEME_BLURBS,
  getPassagesByTheme,
  getPassagesBySeason,
  getPassageForDate,
} from "../../../lib/scripture";
import {
  getCurrentLiturgicalSeason,
  getSeasonBlurb,
} from "../../../lib/liturgicalCalendar";
import { SEASON_LABELS } from "../../../lib/prayers";
import BackLink from "../../_nav/BackLink";
import { getCurrentUserId } from "../../../lib/session";
import OnboardingRequired from "../../../components/OnboardingRequired";
import DailyScriptureSections from "./DailyScriptureSections";

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

export default async function ScriptureLandingPage() {
  const userId = await getCurrentUserId();
  if (!userId) return <OnboardingRequired returnTo="/catholic-path/scripture" />;

  const season = getCurrentLiturgicalSeason();
  const seasonPassages = getPassagesBySeason(season);

  // Server's best guess at today — used for the SSR placeholder before
  // the client picks the user-local date. The client overrides on mount.
  const initialPassage = getPassageForDate(new Date(), season);

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-b from-btf-sky-deep via-btf-sky-deep to-btf-sky text-white py-14 px-6 overflow-hidden">
        <div
          className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[500px] h-[400px] rounded-full bg-btf-gold/25 blur-3xl pointer-events-none"
          aria-hidden
        />
        <div className="relative max-w-3xl mx-auto text-center">
          <BackLink
            fallbackHref="/catholic-path"
            label="Catholic Path"
            className="text-white/60 hover:text-white text-xs mb-8 inline-flex items-center gap-2 transition-colors uppercase tracking-[0.25em]"
          />

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
        {/* Today's passage + season list + USCCB link — all rendered by
            DailyScriptureSections, which picks "today" from the user's
            local Date on mount. */}
        <DailyScriptureSections
          allPassages={PASSAGES}
          seasonPassages={seasonPassages}
          season={season}
          seasonLabel={SEASON_LABELS[season]}
          seasonBlurb={getSeasonBlurb(season)}
          initialPassageId={initialPassage.id}
        />

        {/* Themes */}
        <section className="mt-12" aria-labelledby="themes-heading">
          <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold font-semibold mb-3">
            Browse by theme
          </p>
          <h2
            id="themes-heading"
            className="font-serif text-2xl text-[#e9f1f8] font-light mb-6"
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
                    className="group h-full block rounded-2xl bg-white/[0.055] border border-white/[0.09] hover:border-btf-gold/40 hover:bg-white/[0.08] p-5 transition-all"
                  >
                    <div className="flex items-baseline justify-between gap-3 mb-1">
                      <h3 className="font-serif text-lg text-[#e9f1f8] font-light">
                        {THEME_LABELS[theme]}
                      </h3>
                      <span className="text-[10px] tracking-[0.2em] uppercase text-[#9fb6c8] font-semibold">
                        {count} {count === 1 ? "passage" : "passages"}
                      </span>
                    </div>
                    <p className="text-xs text-white/70 font-light leading-relaxed">
                      {THEME_BLURBS[theme]}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        {/* DRAFT v1 banner */}
        <div className="rounded-xl bg-white/[0.04] border border-btf-gold/25 text-white/70 text-xs font-light p-4 mt-10 leading-relaxed">
          <span className="font-medium text-[#e9f1f8]">
            Draft v1 &middot; closed beta:
          </span>{" "}
          all passages are from the Douay-Rheims Bible (Challoner revision, public domain). NABRE and RSV-2CE coming once Task #16 licensing resolves. Father Murphy is reviewing the library before public launch &mdash; if you spot anything off, message Max.
        </div>
      </div>
    </main>
  );
}
