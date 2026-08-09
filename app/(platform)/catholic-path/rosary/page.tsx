import Link from "next/link";
import BackLink from "../../_nav/BackLink";
import ArtPlaceholder from "../../../components/ArtPlaceholder";
import { MYSTERIES, todaysMysterySlug } from "../../../lib/rosary";
import { getCurrentUserId } from "../../../lib/session";
import OnboardingRequired from "../../../components/OnboardingRequired";
import MysteryPicker from "./MysteryPicker";

/**
 * /catholic-path/rosary — pick a mystery.
 *
 * Today's mystery surfaces prominently per the traditional day-of-week
 * pairing; the other three are quieter tiles. DRAFT v1 banner at the
 * bottom — content is public-domain prayer text + factual scripture
 * summaries; framing copy pending Father Murphy review.
 *
 * Day-of-week determination is delegated to the <MysteryPicker /> client
 * component so it uses the visitor's local timezone (the server runs in
 * UTC, which would make Sunday-night visitors in the US see Monday's
 * mystery). Server pre-renders the picker with the server's best guess
 * so we don't ship an empty hero on first paint.
 */
export const dynamic = "force-dynamic";

export default async function RosaryLanding() {
  const userId = await getCurrentUserId();
  if (!userId) return <OnboardingRequired returnTo="/catholic-path/rosary" />;

  // Server's "today" is the initial placeholder; the client overwrites
  // it from the browser's local Date on mount.
  const initialTodaySlug = todaysMysterySlug();

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-b from-btf-sky-deep to-btf-sky text-white py-14 px-6 overflow-hidden">
        <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[400px] h-[300px] rounded-full bg-btf-gold/25 blur-3xl pointer-events-none" aria-hidden />
        <div className="relative max-w-3xl mx-auto text-center">
          <BackLink
            fallbackHref="/catholic-path"
            label="Catholic Path"
            className="text-white/60 hover:text-white text-xs mb-6 inline-flex items-center gap-2 transition-colors uppercase tracking-[0.25em]"
          />

          <div className="relative w-12 h-12 mx-auto mb-6 mt-2" aria-hidden>
            <div className="absolute left-1/2 top-0 -translate-x-1/2 w-1.5 h-12 bg-btf-gold rounded-sm" />
            <div className="absolute left-1/2 top-3 -translate-x-1/2 w-9 h-1.5 bg-btf-gold rounded-sm" />
          </div>

          <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold mb-3">
            The Rosary
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-light leading-[1.15] mb-4">
            Pick a mystery.
          </h1>
          <p className="font-serif italic text-base md:text-lg text-white/85 font-light max-w-lg mx-auto text-balance">
            Pray along, or use it as a script. Twenty-ish minutes when you give it the time it asks for.
          </p>
        </div>
      </section>

      <MysteryPicker mysteries={MYSTERIES} initialTodaySlug={initialTodaySlug} />

      {/* Chaplets — devotions prayed on the beads beyond the four
          mysteries. Artwork box on the LEFT (Max, 2026-07-28), art
          placeholder until illustrations land — see ArtPlaceholder. */}
      <section className="max-w-3xl mx-auto px-6 pt-6 pb-4">
        <p className="text-[11px] tracking-[0.25em] uppercase text-white/70 font-semibold mb-4 px-0.5">
          Chaplets
        </p>
        <Link
          href="/catholic-path/rosary/seven-sorrows"
          className="group flex rounded-2xl overflow-hidden bg-white/[0.055] border border-white/[0.09] hover:border-btf-gold/40 hover:-translate-y-0.5 transition-all"
        >
          {/* Illustration slot — square, left side */}
          <div className="relative flex-none w-[110px] sm:w-[140px] self-stretch">
            <ArtPlaceholder className="absolute inset-0 h-full" />
          </div>
          <div className="p-4 sm:p-5 min-w-0">
            <p className="font-cinzel text-[10px] tracking-[0.18em] uppercase text-btf-gold-light">
              The Servite chaplet
            </p>
            <h3 className="font-serif text-[20px] leading-tight mt-1.5 mb-1 text-white">
              The Seven Sorrows of Mary
            </h3>
            <p className="text-[12.5px] text-[#d4e3f0] font-light leading-snug">
              Walk the seven sorrows Our Lady carried — from Simeon&rsquo;s
              prophecy to the tomb — an Our Father and seven Hail Marys for
              each. For anyone grieving, or walking beside someone who is.
            </p>
            <p className="text-[10px] uppercase tracking-[0.25em] text-btf-gold font-semibold mt-2.5 group-hover:translate-x-1 transition-transform">
              Begin →
            </p>
          </div>
        </Link>
      </section>

      {/* DRAFT banner (moved here when the picker was redesigned) */}
      <section className="max-w-3xl mx-auto px-6 pb-14">
        <div className="rounded-xl bg-btf-gold/[0.12] border border-btf-gold/30 text-white/85 text-xs font-light p-4 mt-6 leading-relaxed">
          <span className="font-medium text-btf-gold-light">Draft v1 &middot; closed beta:</span> the prayer texts are traditional and public-domain. The brief mystery and sorrow descriptions are factual summaries of scripture, not full meditations &mdash; richer reflections will be added after Father Murphy&rsquo;s review. The Rosary never replaces a priest or the sacraments.
        </div>
      </section>
    </main>
  );
}
