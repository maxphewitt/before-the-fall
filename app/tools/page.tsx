import Link from "next/link";
import { EXERCISES } from "../lib/tools";

/**
 * /tools — index of the six Tier 1 self-help exercises.
 *
 * Public, no auth gate. Tools are harm-reduction content; anyone can
 * read them. Per [[Anonymous First Access]] we don't put a signup wall
 * between a person in distress and the tool that might help.
 */
export default function ToolsIndex() {
  return (
    <main className="min-h-screen bg-btf-off-white px-6 py-10 sm:py-14">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="text-btf-text-light hover:text-btf-sky-deep text-sm mb-6 inline-flex items-center gap-2 transition-colors"
        >
          <span aria-hidden>&larr;</span> Home
        </Link>

        <p className="text-[11px] tracking-[0.25em] text-btf-gold uppercase font-semibold mb-3">
          Self-help tools
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-btf-sky-deep font-light leading-tight mb-3">
          Six exercises for the hardest minutes.
        </h1>
        <p className="text-btf-text-mid font-light leading-relaxed mb-6">
          Each one comes from peer-reviewed clinical research and has been used for decades. Read once, use any time. None of them require an account.
        </p>

        <div className="rounded-xl bg-btf-gold-pale/40 border border-btf-gold/30 text-btf-text-mid text-xs font-light p-4 mb-10 leading-relaxed">
          <span className="font-medium text-btf-sky-deep">Draft v1 &middot; closed beta:</span> these descriptions are pending sign-off by our clinical advisor before public launch. They are not a substitute for a clinician. If you&rsquo;re in immediate danger, use the crisis button at the bottom of the screen.
        </div>

        <ul className="grid sm:grid-cols-2 gap-4">
          {EXERCISES.map((ex) => (
            <li key={ex.slug}>
              <Link
                href={`/tools/${ex.slug}`}
                className="block h-full rounded-2xl bg-white border-2 border-btf-sky-pale/60 hover:border-btf-sky-light hover:shadow-md p-5 transition-all"
              >
                <p className="text-[10px] tracking-[0.2em] uppercase text-btf-sky font-semibold mb-2">
                  {ex.estimatedTime ?? "Practice"}
                </p>
                <h2 className="font-serif text-xl text-btf-sky-deep font-light mb-2">
                  {ex.name}
                </h2>
                <p className="text-sm text-btf-text-mid font-light leading-relaxed">
                  {ex.tagline}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
