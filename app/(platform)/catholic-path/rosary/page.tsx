import Link from "next/link";
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
          <Link
            href="/catholic-path"
            className="text-white/60 hover:text-white text-xs mb-6 inline-flex items-center gap-2 transition-colors uppercase tracking-[0.25em]"
          >
            <span aria-hidden>&larr;</span> Catholic Path
          </Link>

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
    </main>
  );
}
