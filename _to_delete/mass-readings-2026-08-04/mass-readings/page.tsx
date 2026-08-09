import BackLink from "../../_nav/BackLink";
import { getCurrentUserId } from "../../../lib/session";
import OnboardingRequired from "../../../components/OnboardingRequired";
import MassReadingsToday from "./MassReadingsToday";

/**
 * /catholic-path/mass-readings — Daily Mass Readings landing (2026-08-04).
 *
 * Today's first reading / responsorial psalm / [second reading] /
 * gospel, each opening in the same verse-by-verse walker Daily
 * Scripture uses (Continue in the Bible inherited for free). Citations
 * only are sourced/vendored (see lib/lectionary.ts); verse text is our
 * own Douay-Rheims, never the copyrighted NABRE used at actual Mass.
 *
 * Always shows TODAY — no missed-day debt, per the platform's mercy-in-
 * the-mechanics rule. "Today" is resolved client-side (MassReadingsToday)
 * so it uses the visitor's local date, not the server's UTC guess.
 */
export const dynamic = "force-dynamic";

export default async function MassReadingsLanding() {
  const userId = await getCurrentUserId();
  if (!userId) {
    return <OnboardingRequired returnTo="/catholic-path/mass-readings" />;
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
            Daily Mass Readings
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-light leading-[1.15] mb-5">
            Today&rsquo;s readings.
          </h1>
          <p className="font-serif italic text-lg md:text-xl text-white/85 font-light mb-2 max-w-xl mx-auto text-balance">
            The same readings proclaimed at Mass today, from the Douay-Rheims. One verse at a time, with a place to write what rises.
          </p>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-6 py-10 sm:py-14">
        <MassReadingsToday />

        {/* Translation note — small print, same posture as Daily Scripture */}
        <section className="mt-10 rounded-2xl bg-white/[0.04] border border-white/[0.09] p-4">
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#9fb6c8] font-semibold mb-2">
            About these readings
          </p>
          <p className="text-xs text-white/70 font-light leading-relaxed">
            The readings proclaimed at Mass in the US use the NABRE translation, which is copyrighted. We show only which passages are read each day, then render the verse text from our own public-domain Douay-Rheims &mdash; the same translation used throughout Daily Scripture and the Bible reader. For the exact wording used at Mass, visit{" "}
            <a
              href="https://bible.usccb.org/bible/readings"
              target="_blank"
              rel="noopener noreferrer"
              className="text-btf-gold-light underline underline-offset-4"
            >
              usccb.org
            </a>
            .
          </p>
        </section>

        {/* DRAFT v1 banner */}
        <div className="rounded-xl bg-white/[0.04] border border-btf-gold/25 text-white/70 text-xs font-light p-4 mt-6 leading-relaxed">
          <span className="font-medium text-[#e9f1f8]">
            Draft v1 &middot; closed beta:
          </span>{" "}
          reading citations sourced from the open catholic-daily-readings project (citations only &mdash; no copyrighted text); Father Murphy is reviewing before public launch.
        </div>
      </div>
    </main>
  );
}
