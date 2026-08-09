import Link from "next/link";
import BackLink from "../../_nav/BackLink";
import { getCurrentUserId } from "../../../lib/session";
import OnboardingRequired from "../../../components/OnboardingRequired";
import { HOURS } from "../../../lib/liturgyOfHours";

/**
 * /catholic-path/liturgy-of-the-hours — pick an Hour.
 *
 * Our own version (Cycle I — see lib/liturgyOfHours.ts for scope and
 * sourcing) sits alongside a link-out to the full official text, per
 * Max's call 2026-08-04: build a public-domain version AND still point
 * people at the real, complete, current breviary if that's what they
 * want. Same posture as the Mass Readings button — linking out costs
 * nothing and some people will prefer the official text.
 */
export const dynamic = "force-dynamic";

export default async function LiturgyOfHoursLanding() {
  const userId = await getCurrentUserId();
  if (!userId) {
    return <OnboardingRequired returnTo="/catholic-path/liturgy-of-the-hours" />;
  }

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
            Liturgy of the Hours
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-light leading-[1.15] mb-5">
            Pray the day in pieces.
          </h1>
          <p className="font-serif italic text-lg md:text-xl text-white/85 font-light mb-2 max-w-xl mx-auto text-balance">
            Five hours, five chances to hand the day back to God — psalms, a canticle, a reading, and a place to bring what you're carrying.
          </p>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-6 py-10 sm:py-14">
        <ul className="space-y-2.5">
          {HOURS.map((h) => (
            <li key={h.slug}>
              <Link
                href={`/catholic-path/liturgy-of-the-hours/${h.slug}`}
                className="block rounded-2xl bg-white/[0.055] border border-white/[0.09] hover:border-btf-gold/40 hover:bg-white/[0.08] px-5 py-4 transition-all"
              >
                <span className="block font-serif text-lg text-[#e9f1f8]">{h.label}</span>
                <span className="block text-[13px] text-[#9fb6c8] font-light mt-0.5">{h.subtitle}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Link out to the full official text */}
        <section className="mt-10 rounded-2xl bg-white/[0.04] border border-white/[0.09] p-5 text-center">
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#9fb6c8] font-semibold mb-2">
            Want the full, official text?
          </p>
          <p className="text-xs text-white/70 font-light leading-relaxed mb-4">
            Ours uses the public-domain Douay-Rheims and skips the current translation's copyrighted text and the historic four-week psalm cycle. For the complete official Liturgy of the Hours, exactly as the Church prays it today:
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://divineoffice.org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-btf-gold hover:bg-btf-gold-light text-btf-sky-deep font-medium text-sm px-6 py-3 shadow-lg hover:-translate-y-0.5 transition-all"
            >
              Open divineoffice.org &rarr;
            </a>
            <a
              href="https://www.ibreviary.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 border border-white/20 hover:border-btf-gold/50 text-white font-medium text-sm px-6 py-3 transition-all"
            >
              Open iBreviary &rarr;
            </a>
          </div>
        </section>

        {/* DRAFT v1 banner */}
        <div className="rounded-xl bg-white/[0.04] border border-btf-gold/25 text-white/70 text-xs font-light p-4 mt-6 leading-relaxed">
          <span className="font-medium text-[#e9f1f8]">Draft v1 &middot; closed beta:</span>{" "}
          one day's worth of Hours (Cycle I), repeated daily for now &mdash; the historic four-week psalter rotation is future content. Antiphons, intercessions, and closing prayers are original compositions, not the official translation. Father Murphy is reviewing before public launch.
        </div>
      </div>
    </main>
  );
}
