import Link from "next/link";
import {
  PRAYERS,
  CATEGORY_LABELS,
  CATEGORY_BLURBS,
  SEASON_LABELS,
  getPrayersByCategory,
  getPrayersBySeason,
} from "../../lib/prayers";
import {
  getCurrentLiturgicalSeason,
  getSeasonBlurb,
} from "../../lib/liturgicalCalendar";
import PrayerSearch from "./PrayerSearch";
import { getCurrentUserId } from "../../lib/session";
import OnboardingRequired from "../../components/OnboardingRequired";

/**
 * /catholic-path/prayers — Prayer Library landing.
 *
 * Server component. Three sections:
 *   1. AI-free search input — keyword + tag matching with synonym
 *      expansion. User describes a situation; matching prayers appear.
 *   2. Current liturgical season callout — auto-detected from the
 *      Roman calendar. Surfaces season-appropriate prayers.
 *   3. Six category browse tiles.
 *
 * The search component is a client subcomponent so we can render
 * results on every keystroke. The dataset is small (~40 prayers in v1)
 * so client-side search is cheap.
 *
 * Renders dynamically so the season-of-day callout reflects the actual
 * request time instead of a build-time snapshot.
 */
export const dynamic = "force-dynamic";

export default async function PrayerLibraryPage() {
  const userId = await getCurrentUserId();
  if (!userId) return <OnboardingRequired returnTo="/catholic-path/prayers" />;

  const season = getCurrentLiturgicalSeason();
  const seasonPrayers = getPrayersBySeason(season);
  const categories = [
    "emergency",
    "daily",
    "situational",
    "patron-saints",
    "intercession",
    "liturgical",
  ] as const;

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
            Prayer Library
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-light leading-[1.15] mb-5">
            {PRAYERS.length} prayers the Church has reached for.
          </h1>
          <p className="font-serif italic text-lg md:text-xl text-white/85 font-light mb-2 max-w-xl mx-auto text-balance">
            Describe what you&rsquo;re carrying, or browse by category. Each prayer cites its source.
          </p>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-6 py-10 sm:py-14">
        {/* Search */}
        <PrayerSearch />

        {/* Current liturgical season */}
        {seasonPrayers.length > 0 && (
          <section className="mt-12" aria-labelledby="season-heading">
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
              {seasonPrayers.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/catholic-path/prayers/${p.id}`}
                    className="block rounded-2xl bg-white border-2 border-btf-gold/30 hover:border-btf-gold hover:shadow-md p-4 transition-all"
                  >
                    <p className="font-medium text-btf-sky-deep">{p.title}</p>
                    <p className="text-xs text-btf-text-mid font-light mt-1 leading-relaxed">
                      {p.when_to_use}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Categories */}
        <section className="mt-12" aria-labelledby="categories-heading">
          <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold font-semibold mb-3">
            Browse by kind
          </p>
          <h2
            id="categories-heading"
            className="font-serif text-2xl text-btf-sky-deep font-light mb-6"
          >
            Six categories.
          </h2>
          <ul className="grid sm:grid-cols-2 gap-3">
            {categories.map((cat) => {
              const count = getPrayersByCategory(cat).length;
              return (
                <li key={cat}>
                  <Link
                    href={`/catholic-path/prayers/category/${cat}`}
                    className="group h-full block rounded-2xl bg-white border-2 border-btf-sky-pale/60 hover:border-btf-sky-light hover:shadow-md p-5 transition-all"
                  >
                    <div className="flex items-baseline justify-between gap-3 mb-1">
                      <h3 className="font-serif text-lg text-btf-sky-deep font-light">
                        {CATEGORY_LABELS[cat]}
                      </h3>
                      <span className="text-[10px] tracking-[0.2em] uppercase text-btf-text-light font-semibold">
                        {count} {count === 1 ? "prayer" : "prayers"}
                      </span>
                    </div>
                    <p className="text-xs text-btf-text-mid font-light leading-relaxed">
                      {CATEGORY_BLURBS[cat]}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        {/* DRAFT v1 banner */}
        <div className="rounded-xl bg-btf-gold-pale/60 border border-btf-gold/30 text-btf-text-mid text-xs font-light p-4 mt-12 leading-relaxed">
          <span className="font-medium text-btf-sky-deep">
            Draft v1 &middot; closed beta:
          </span>{" "}
          all prayer text is public-domain traditional Catholic prayer. Source URLs cited per prayer. Father Murphy is reviewing the library before public launch &mdash; if you spot anything off, message Max.
        </div>
      </div>
    </main>
  );
}
