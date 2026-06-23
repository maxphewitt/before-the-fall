import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUserId } from "../../../lib/session";
import { getToolMoments } from "../../../actions/journal";
import { getUrgeSurfStats } from "../../../actions/urgeSurf";
import type { UrgeOutcome } from "../../../lib/journalTypes";

/**
 * /today/waves — the meta layer for urge surfing ("Waves you rode").
 *
 * The acceptance-based counterpart to the grounding grove. It reflects the
 * RELATIONSHIP to urges, never their intensity:
 *   - a mastery count that includes every outcome equally (a slip is a
 *     logged act of showing up, never a streak-break — Abstinence Violation
 *     Effect-safe),
 *   - coping confidence "then vs now" (a rising-is-good self-efficacy read),
 *   - each wave kept in the person's own words.
 *
 * There is deliberately NO urge-intensity chart. Insight is strengths-based
 * and explicitly non-clinical.
 *
 * Force-dynamic: reads the live (decrypted, server-side) archive.
 */
export const dynamic = "force-dynamic";

const OUTCOME_LABEL: Record<UrgeOutcome, string> = {
  rode_it_out: "Rode it out",
  stepped_away: "Stepped away",
  acted_on_it: "Logged honestly",
};

function formatWhen(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function WavesPage() {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/return");

  const [momentsResult, stats] = await Promise.all([
    getToolMoments("urge-surfing"),
    getUrgeSurfStats(),
  ]);
  const moments = momentsResult.success ? momentsResult.data : [];

  const totalMinutes = stats
    ? Math.max(0, Math.round(stats.totalSecondsStayed / 60))
    : 0;
  const showConfidenceTrend =
    stats &&
    stats.confidencePoints >= 2 &&
    stats.firstConfidence !== null &&
    stats.latestConfidence !== null;

  return (
    <main className="min-h-screen bg-btf-off-white px-6 py-10 sm:py-14">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/today"
            className="text-btf-text-light hover:text-btf-sky-deep text-sm inline-flex items-center gap-2 transition-colors"
          >
            <span aria-hidden>&larr;</span> Today
          </Link>
          <Link
            href="/tools/urge-surfing/start"
            className="text-xs text-btf-sky-deep underline underline-offset-4 hover:text-btf-sky"
          >
            Ride one out
          </Link>
        </div>

        <p className="text-[11px] tracking-[0.25em] text-btf-gold uppercase font-semibold mb-3">
          Waves you rode
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-btf-sky-deep font-light leading-tight mb-3">
          Every wave you stayed with.
        </h1>

        {moments.length === 0 ? (
          <div className="mt-6 rounded-2xl bg-btf-sky-pale/60 border border-btf-sky-deep/10 p-6">
            <p className="text-btf-text-mid font-light leading-relaxed mb-5">
              Nothing here yet. Each time you ride out an urge, it&rsquo;s kept here —
              in your own words, with every outcome counting the same. Over time it
              becomes proof you don&rsquo;t have to act to make an urge end.
            </p>
            <Link
              href="/tools/urge-surfing/start"
              className="inline-block bg-btf-sky-deep hover:bg-btf-sky text-white font-medium px-6 py-3 rounded-full transition-colors"
            >
              Ride one out &rarr;
            </Link>
          </div>
        ) : (
          <>
            <p className="text-btf-text-mid font-light leading-relaxed mb-6">
              You&rsquo;ve stayed with {moments.length}{" "}
              {moments.length === 1 ? "wave" : "waves"}
              {totalMinutes > 0 ? `, ${totalMinutes} minutes in all` : ""}. Every one
              counts — the easy ones and the hard ones.
            </p>

            {showConfidenceTrend && (
              <div className="rounded-2xl bg-btf-sky-pale/60 border border-btf-sky-deep/10 p-5 mb-6">
                <p className="text-[11px] tracking-[0.2em] uppercase text-btf-sky-deep/80 font-semibold mb-2">
                  Your confidence
                </p>
                <p className="text-btf-text-dark font-light leading-relaxed">
                  How able you feel to handle urges like these went from{" "}
                  <span className="font-serif text-btf-sky-deep text-xl">
                    {stats!.firstConfidence}
                  </span>{" "}
                  to{" "}
                  <span className="font-serif text-btf-sky-deep text-xl">
                    {stats!.latestConfidence}
                  </span>
                  .
                </p>
                <p className="text-xs text-btf-text-light font-light mt-2 leading-relaxed">
                  This is your own sense of your footing — not a clinical measure. It&rsquo;s
                  the number that&rsquo;s good to see grow.
                </p>
              </div>
            )}

            <ul className="space-y-3">
              {moments.map((m) => (
                <li
                  key={m.id}
                  className="rounded-2xl bg-white border border-btf-sky-deep/10 px-5 py-4 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <p className="text-[11px] tracking-[0.2em] uppercase text-btf-text-light font-semibold">
                      {formatWhen(m.completedAt)}
                    </p>
                    {m.outcome && (
                      <span className="text-[11px] tracking-[0.15em] uppercase text-btf-sky-deep font-semibold">
                        {OUTCOME_LABEL[m.outcome]}
                      </span>
                    )}
                  </div>
                  {m.words.length > 0 ? (
                    <p className="text-btf-text-dark font-light leading-relaxed">
                      {m.words.join(" · ")}
                    </p>
                  ) : (
                    <p className="text-btf-text-light font-light italic">
                      You stayed with it without needing words.
                    </p>
                  )}
                  {m.confidence !== undefined && (
                    <p className="text-sm text-btf-sky-deep font-light mt-2">
                      Felt able to handle it: {m.confidence}/100
                    </p>
                  )}
                </li>
              ))}
            </ul>

            <p className="text-xs text-btf-text-light font-light text-center mt-6">
              No streaks. No scores. No urge ratings — just proof you keep showing up.
            </p>
          </>
        )}
      </div>
    </main>
  );
}
