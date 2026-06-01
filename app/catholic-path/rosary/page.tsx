import Link from "next/link";
import { MYSTERIES, todaysMysterySlug, getMysteryBySlug } from "../../lib/rosary";
import BumpActivity from "../../components/BumpActivity";

/**
 * /catholic-path/rosary — pick a mystery.
 *
 * Today's mystery surfaces prominently per the traditional day-of-week
 * pairing; the other three are below as quieter tiles. DRAFT v1 banner
 * at the bottom — content is public-domain prayer text + factual scripture
 * summaries; framing copy pending Father Murphy review.
 *
 * Rendered dynamically so the day-of-week reflects the actual request time
 * instead of the build-time snapshot (which would freeze the rosary on
 * whatever day Vercel last built the page).
 */
export const dynamic = "force-dynamic";

export default function RosaryLanding() {
  const todaySlug = todaysMysterySlug();
  const today = getMysteryBySlug(todaySlug)!;
  const others = MYSTERIES.filter((m) => m.slug !== todaySlug);

  const weekdayName = new Date().toLocaleDateString(undefined, { weekday: "long" });

  return (
    <>
    <BumpActivity />
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

      {/* Today's mystery */}
      <section className="py-12 px-6 bg-gradient-to-b from-white to-btf-gold-pale/30">
        <div className="max-w-3xl mx-auto">
          <p className="text-center text-[11px] tracking-[0.25em] text-btf-gold uppercase font-semibold mb-4">
            Today is {weekdayName}
          </p>
          <Link
            href={`/catholic-path/rosary/${today.slug}`}
            className="group block rounded-2xl p-8 md:p-10 bg-white border-2 border-btf-gold shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            <h2 className="font-serif text-2xl md:text-3xl text-btf-sky-deep font-light mb-3 text-center">
              {today.name}
            </h2>
            <p className="text-center text-btf-text-mid font-light leading-relaxed mb-6 text-balance">
              {today.subtitle}
            </p>
            <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2 max-w-xl mx-auto text-sm text-btf-text-mid font-light">
              {today.decades.map((d) => (
                <li key={d.number} className="flex gap-2">
                  <span aria-hidden className="text-btf-gold">✦</span>
                  <span>{d.name}</span>
                </li>
              ))}
            </ul>
            <p className="text-center text-[10px] uppercase tracking-[0.25em] text-btf-gold font-semibold mt-7 group-hover:translate-x-1 transition-transform">
              Begin →
            </p>
          </Link>
        </div>
      </section>

      {/* Other mysteries */}
      <section className="py-12 px-6 bg-btf-off-white">
        <div className="max-w-3xl mx-auto">
          <p className="text-center text-[11px] tracking-[0.25em] text-btf-text-light uppercase font-semibold mb-6">
            Other mysteries
          </p>
          <ul className="grid sm:grid-cols-3 gap-4">
            {others.map((m) => (
              <li key={m.slug}>
                <Link
                  href={`/catholic-path/rosary/${m.slug}`}
                  className="group h-full block rounded-2xl bg-white border border-btf-gold/30 hover:border-btf-gold hover:shadow-md p-5 transition-all flex flex-col"
                >
                  <h3 className="font-serif text-lg text-btf-sky-deep font-light mb-1">
                    {m.name.replace(/^The /, "")}
                  </h3>
                  <p className="text-xs text-btf-text-light font-light mb-3">
                    {m.days.join(" · ")}
                  </p>
                  <p className="text-xs text-btf-text-mid font-light leading-relaxed flex-1">
                    {m.subtitle}
                  </p>
                </Link>
              </li>
            ))}
          </ul>

          <div className="rounded-xl bg-btf-gold-pale/40 border border-btf-gold/30 text-btf-text-mid text-xs font-light p-4 mt-10 leading-relaxed">
            <span className="font-medium text-btf-sky-deep">Draft v1 &middot; closed beta:</span> the prayer texts are traditional and public-domain. The brief mystery descriptions are factual summaries of scripture, not full meditations &mdash; richer reflections will be added after Father Murphy&rsquo;s review. The Rosary never replaces a priest or the sacraments.
          </div>
        </div>
      </section>
    </main>
    </>
  );
}
