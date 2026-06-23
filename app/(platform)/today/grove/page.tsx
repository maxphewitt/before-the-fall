import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUserId } from "../../../lib/session";
import { getToolMoments } from "../../../actions/journal";
import { getStateCheckSummary } from "../../../actions/stateChecks";
import { getUrgeSurfStats } from "../../../actions/urgeSurf";
import { getJourney } from "../../../actions/habits";
import { getDisplayStreak } from "../../../actions/streaks";
import type { TimeOfDayBucket } from "../../../lib/journalTypes";
import StreakChip from "../../../components/StreakChip";
import GroveTabs from "./GroveTabs";

/**
 * /today/grove — the one progress hub.
 *
 * Consolidates everything that was scattered across pages: the surfaced
 * streak (with the gold cross), the 90-day journey, the grounding grove,
 * and the urge-surfing "waves" archive — behind calm tabs so it's all on
 * one page without feeling like too much. /today/journey and /today/waves
 * redirect here.
 *
 * Strengths-based and explicitly non-clinical throughout. Force-dynamic:
 * reads the live (decrypted, server-side) data.
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

  const [streak, journeyRes, grounding, groundingSummary, waves, urgeStats] =
    await Promise.all([
      getDisplayStreak(),
      getJourney(90),
      getToolMoments("grounding"),
      getStateCheckSummary("grounding"),
      getToolMoments("urge-surfing"),
      getUrgeSurfStats(),
    ]);

  const journeyDays = journeyRes.success ? journeyRes.data : [];
  const groundingMoments = grounding.success ? grounding.data : [];
  const waveMoments = waves.success ? waves.data : [];

  const groundingInsight: string[] = [];
  if (groundingSummary && groundingSummary.pairedCount > 0) {
    groundingInsight.push(
      `When you noted a before and after, it eased ${groundingSummary.easedCount} of ${groundingSummary.pairedCount} ${groundingSummary.pairedCount === 1 ? "time" : "times"}.`
    );
  }
  if (groundingSummary?.mostCommonTime) {
    groundingInsight.push(
      `You reach for grounding most in ${TIME_LABEL[groundingSummary.mostCommonTime.timeOfDay]}.`
    );
  }

  const wavesMinutes = urgeStats
    ? Math.max(0, Math.round(urgeStats.totalSecondsStayed / 60))
    : 0;

  return (
    <main className="min-h-screen bg-btf-off-white px-6 py-10 sm:py-14">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/today"
          className="text-btf-text-light hover:text-btf-sky-deep text-sm mb-6 inline-flex items-center gap-2 transition-colors"
        >
          <span aria-hidden>&larr;</span> Today
        </Link>

        <p className="text-[11px] tracking-[0.25em] text-btf-gold uppercase font-semibold mb-3">
          Your grove
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-btf-sky-deep font-light leading-tight mb-6">
          Everything you&rsquo;ve come back to.
        </h1>

        {streak && (
          <div className="flex justify-center mb-8">
            <StreakChip streak={streak} href={null} tone="light" />
          </div>
        )}

        <GroveTabs
          journeyDays={journeyDays}
          groundingMoments={groundingMoments}
          groundingInsight={groundingInsight}
          waves={waveMoments}
          wavesCount={waveMoments.length}
          wavesMinutes={wavesMinutes}
          confidenceFirst={urgeStats?.firstConfidence ?? null}
          confidenceLatest={urgeStats?.latestConfidence ?? null}
          confidencePoints={urgeStats?.confidencePoints ?? 0}
        />

        <p className="text-xs text-btf-text-light font-light text-center mt-8">
          No scores. No broken streaks. Just proof, in your own words.
        </p>
      </div>
    </main>
  );
}
