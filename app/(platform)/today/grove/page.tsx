import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUserId } from "../../../lib/session";
import { getToolMoments } from "../../../actions/journal";
import { getStateCheckSummary } from "../../../actions/stateChecks";
import type { TimeOfDayBucket } from "../../../lib/journalTypes";
import GroveConstellation from "./GroveConstellation";

/**
 * /today/grove — the meta layer for grounding.
 *
 * A browsable archive of every grounding moment: the person's own words,
 * the time, and their optional before/after note. Over weeks it becomes a
 * personal map of every time they came back to the present — worth more at
 * 2am than any badge.
 *
 * Insights here are strengths-based and deliberately NOT clinical. The
 * before/after numbers are the person's own self-monitoring notes, framed
 * as "notice your own change" — never as proof the tool works.
 *
 * Force-dynamic: reads the live (decrypted, server-side) archive.
 */
export const dynamic = "force-dynamic";

const TIME_LABEL: Record<TimeOfDayBucket, string> = {
  "early-morning": "the early morning",
  morning: "the morning",
  afternoon: "the afternoon",
  evening: "the evening",
  night: "at night",
  "late-night": "late at night",
};

export default async function GrovePage() {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/return");

  const [momentsResult, summary] = await Promise.all([
    getToolMoments("grounding"),
    getStateCheckSummary("grounding"),
  ]);
  const moments = momentsResult.success ? momentsResult.data : [];

  const insightLines: string[] = [];
  if (summary && summary.pairedCount > 0) {
    insightLines.push(
      `When you noted a before and after, it eased ${summary.easedCount} of ${summary.pairedCount} ${summary.pairedCount === 1 ? "time" : "times"}.`
    );
  }
  if (summary?.mostCommonTime) {
    insightLines.push(
      `You reach for grounding most in ${TIME_LABEL[summary.mostCommonTime.timeOfDay]}.`
    );
  }

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
            href="/tools/grounding/start"
            className="text-xs text-btf-sky-deep underline underline-offset-4 hover:text-btf-sky"
          >
            Ground again
          </Link>
        </div>

        <p className="text-[11px] tracking-[0.25em] text-btf-gold uppercase font-semibold mb-3">
          Your grove
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-btf-sky-deep font-light leading-tight mb-3">
          Every light is a time you came back.
        </h1>

        {moments.length === 0 ? (
          <div className="mt-6 rounded-2xl bg-btf-sky-pale/60 border border-btf-sky-deep/10 p-6">
            <p className="text-btf-text-mid font-light leading-relaxed mb-5">
              Your grove is empty for now. Each time you run a grounding
              session, this fills with a light — your own words, kept. It
              becomes a record you can look back on: proof, in your own hand,
              that you can come back to the present.
            </p>
            <Link
              href="/tools/grounding/start"
              className="inline-block bg-btf-sky-deep hover:bg-btf-sky text-white font-medium px-6 py-3 rounded-full transition-colors"
            >
              Try a grounding session &rarr;
            </Link>
          </div>
        ) : (
          <>
            <p className="text-btf-text-mid font-light leading-relaxed mb-6">
              You&rsquo;ve come back {moments.length}{" "}
              {moments.length === 1 ? "time" : "times"}. Each light is one of
              them.
            </p>

            {insightLines.length > 0 && (
              <div className="rounded-2xl bg-btf-sky-pale/60 border border-btf-sky-deep/10 p-5 mb-6">
                <p className="text-[11px] tracking-[0.2em] uppercase text-btf-sky-deep/80 font-semibold mb-2">
                  What your grove shows
                </p>
                <ul className="space-y-1.5">
                  {insightLines.map((line) => (
                    <li
                      key={line}
                      className="text-btf-text-dark font-light leading-relaxed"
                    >
                      {line}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-btf-text-light font-light mt-3 leading-relaxed">
                  These are your own notes — a reminder of what helps you, not a
                  clinical measure.
                </p>
              </div>
            )}

            <GroveConstellation moments={moments} />
          </>
        )}
      </div>
    </main>
  );
}
