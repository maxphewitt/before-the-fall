/**
 * /offline — minimal fallback served when the service worker can't
 * reach the network AND the requested page isn't cached.
 *
 * Job is exactly one thing: keep crisis numbers visible. Everything
 * else is removed.
 */
export const dynamic = "force-static";

export default function OfflinePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-btf-sky-deep via-btf-sky-deep to-btf-sky text-white px-6 py-14">
      <div className="max-w-md mx-auto text-center">
        <div className="relative w-14 h-14 mx-auto mb-8" aria-hidden>
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-2 h-14 bg-btf-gold rounded-sm" />
          <div className="absolute left-1/2 top-4 -translate-x-1/2 w-10 h-2 bg-btf-gold rounded-sm" />
        </div>

        <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold mb-3">
          You&rsquo;re offline
        </p>
        <h1 className="font-serif text-3xl font-light leading-tight mb-4">
          The platform isn&rsquo;t reachable right now.
        </h1>
        <p className="font-serif italic text-base text-white/85 font-light leading-relaxed mb-12">
          If you&rsquo;re in crisis, these numbers work without a connection.
        </p>

        <ul className="space-y-3 text-left">
          <li>
            <a
              href="tel:988"
              className="block rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 px-5 py-4 transition-colors"
            >
              <p className="text-[10px] tracking-[0.25em] uppercase text-btf-gold-light font-semibold mb-1">
                988 Suicide &amp; Crisis Lifeline
              </p>
              <p className="font-serif text-lg text-white">Call or text 988</p>
            </a>
          </li>
          <li>
            <a
              href="sms:741741&body=HOME"
              className="block rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 px-5 py-4 transition-colors"
            >
              <p className="text-[10px] tracking-[0.25em] uppercase text-btf-gold-light font-semibold mb-1">
                Crisis Text Line
              </p>
              <p className="font-serif text-lg text-white">Text HOME to 741741</p>
            </a>
          </li>
          <li>
            <a
              href="tel:18007997233"
              className="block rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 px-5 py-4 transition-colors"
            >
              <p className="text-[10px] tracking-[0.25em] uppercase text-btf-gold-light font-semibold mb-1">
                National Domestic Violence Hotline
              </p>
              <p className="font-serif text-lg text-white">Call 1-800-799-7233</p>
            </a>
          </li>
          <li>
            <a
              href="tel:18006624357"
              className="block rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 px-5 py-4 transition-colors"
            >
              <p className="text-[10px] tracking-[0.25em] uppercase text-btf-gold-light font-semibold mb-1">
                SAMHSA National Helpline
              </p>
              <p className="font-serif text-lg text-white">Call 1-800-662-4357</p>
            </a>
          </li>
        </ul>

        <p className="text-xs text-white/55 font-light mt-12 leading-relaxed">
          When your connection comes back, refresh the page.
        </p>
      </div>
    </main>
  );
}
