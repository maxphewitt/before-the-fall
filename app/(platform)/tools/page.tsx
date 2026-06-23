import Link from "next/link";
import { EXERCISES } from "../../lib/tools";
import BetaDisclaimerBanner from "../../components/BetaDisclaimerBanner";
import OnboardingRequired from "../../components/OnboardingRequired";
import { getCurrentUserId } from "../../lib/session";

// Activity tracking + onboarding gate both require request context.
export const dynamic = "force-dynamic";

/**
 * /tools — index of the six Tier 1 self-help exercises.
 *
 * Beta posture: requires an onboarded user (btf_user_id cookie). The
 * [[Anonymous First Access]] principle is paused during closed beta so
 * Max can attribute every interaction to a specific tester. Will
 * revisit at public launch — at that point the index may go back to
 * being open content with only the interactive walker (/tools/[slug]/start)
 * requiring sign-in.
 */
export default async function ToolsIndex() {
  const userId = await getCurrentUserId();
  if (!userId) return <OnboardingRequired returnTo="/tools" />;

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
        <p className="text-btf-text-mid font-light leading-relaxed mb-8">
          Each one comes from peer-reviewed clinical research and has been used for decades. Read once, use any time. None of them require an account.
        </p>

        <BetaDisclaimerBanner />

        {/* Field Journal — self-monitoring, the tool that makes the rest smarter */}
        <Link
          href="/field-journal"
          className="group relative flex flex-col overflow-hidden rounded-2xl border-2 border-btf-sky/30 bg-gradient-to-br from-btf-sky-pale/50 to-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-btf-sky hover:shadow-lg mb-6"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] tracking-[0.2em] uppercase text-btf-sky font-semibold">
              Field Journal · the daily habit
            </span>
            <span className="text-[10px] tracking-[0.18em] uppercase text-btf-text-light font-medium">
              ~10 sec
            </span>
          </div>
          <h2 className="font-serif text-xl text-btf-sky-deep font-light leading-snug mb-1">
            Log an urge — naming it is the work.
          </h2>
          <p className="text-sm text-btf-text-mid font-light leading-relaxed">
            A sub-ten-second log that earns the same whether you stood firm or gave
            in. Honesty over outcome. Over time it shows you your patterns &mdash; and
            makes the other tools smarter.
          </p>
          <span className="mt-3 text-[10px] uppercase tracking-[0.25em] text-btf-sky font-semibold group-hover:translate-x-1 transition-transform">
            Open the Field Journal →
          </span>
        </Link>

        <ul className="grid sm:grid-cols-2 gap-4">
          {EXERCISES.map((ex, i) => (
            <li key={ex.slug}>
              <Link
                href={`/tools/${ex.slug}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-btf-sky-pale/70 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-btf-sky-light hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-btf-sky focus-visible:ring-offset-2"
              >
                {/* Soft gold glow on hover */}
                <div
                  className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-btf-gold/0 blur-2xl transition-colors duration-500 group-hover:bg-btf-gold/15"
                  aria-hidden
                />

                <div className="relative flex items-center justify-between mb-3">
                  <span className="inline-flex items-center rounded-full bg-btf-sky-pale/70 px-2.5 py-1 text-[10px] tracking-[0.2em] uppercase text-btf-sky-deep font-semibold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {ex.estimatedTime && (
                    <span className="text-[10px] tracking-[0.18em] uppercase text-btf-text-light font-medium">
                      {shortTime(ex.estimatedTime)}
                    </span>
                  )}
                </div>

                <h2 className="font-serif text-xl text-btf-sky-deep font-light leading-snug mb-2 relative">
                  {ex.name}
                </h2>
                <p className="text-sm text-btf-text-mid font-light leading-relaxed relative mb-5 flex-1">
                  {ex.tagline}
                </p>

                <p className="relative text-[11px] tracking-[0.2em] uppercase font-semibold text-btf-sky group-hover:text-btf-sky-deep transition-colors">
                  Begin <span aria-hidden>&rarr;</span>
                </p>
              </Link>
            </li>
          ))}
        </ul>

        {/* Permanent safety footnote — NEVER dismissible. */}
        <p className="mt-10 rounded-xl border border-btf-sky-pale/70 bg-white px-5 py-4 text-xs leading-relaxed text-btf-text-mid font-light">
          These tools are not a substitute for a clinician. If you&rsquo;re in immediate danger, use the crisis button at the bottom of the screen, or call <a href="tel:988" className="text-btf-sky-deep font-medium underline-offset-2 hover:underline">988</a> right now.
        </p>
      </div>
    </main>
  );
}

/**
 * Compact display of the long estimatedTime strings on cards.
 *
 * Source notes say things like "5–15 minutes. Long enough for the urge
 * to crest and fall." On the card we want "5–15 min". The full text
 * still appears on the detail page.
 */
function shortTime(raw: string): string {
  // Grab the leading numeric / range token + minutes or seconds.
  const match = raw.match(/^[^a-zA-Z]*(\d+(?:[–—-]\d+)?)\s*(seconds?|minutes?|min|sec)/i);
  if (!match) return raw.split(/[.\s]/)[0] ?? raw;
  const range = match[1];
  const unit = match[2].toLowerCase().startsWith("sec") ? "sec" : "min";
  return `${range} ${unit}`;
}
