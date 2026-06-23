import { notFound, redirect } from "next/navigation";
import { getExerciseBySlug } from "../../../../lib/tools";
import { getCurrentUserId } from "../../../../lib/session";
import { getCurrentUserFaithRole } from "../../../../lib/profile";
import StopFlow from "./StopFlow";
import UrgeSurfingFlow from "./UrgeSurfingFlow";
import BoxBreathingFlow from "./BoxBreathingFlow";
import GroundingFlow from "./GroundingFlow";
import TippFlow from "./TippFlow";
import ThoughtRecordFlow from "./ThoughtRecordFlow";

/**
 * /tools/[slug]/start — interactive walker for one Tier 1 exercise.
 *
 * Each tool has its own bespoke flow (one tile per letter, timers,
 * animated wave, breathing circle, etc.) rather than a generic
 * step-by-step renderer. The slug determines which flow renders.
 *
 * Server component handles auth + lookup, then hands off to the
 * tool-specific client component for the interactive portion. Unauth
 * users are bounced to /return so they sign back in.
 *
 * In Next 15+, dynamic route `params` is a Promise. Await it.
 *
 * NOTE: We intentionally do NOT export `generateStaticParams` here even
 * though the slug set is finite. The walker reads the session cookie
 * (via getCurrentUserId) and writes to the journal, so it must run
 * dynamically per request. Combining `force-dynamic` with
 * `generateStaticParams` is a build-time conflict in Next.js.
 */
export const dynamic = "force-dynamic";

export default async function ToolStartPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ex = getExerciseBySlug(slug);
  if (!ex) notFound();

  const userId = await getCurrentUserId();
  if (!userId) {
    redirect("/return");
  }

  switch (slug) {
    case "stop":
      return <StopFlow />;
    case "urge-surfing": {
      // Default the narration voice from the faith preference set at
      // onboarding, so we don't ask every session. growing_closer / open
      // → faith path; secular → wisdom path; unknown → let them choose once.
      const faith = await getCurrentUserFaithRole();
      const initialPath =
        faith === "secular" ? "secular" : faith ? "catholic" : undefined;
      return <UrgeSurfingFlow initialPath={initialPath} />;
    }
    case "box-breathing":
      return <BoxBreathingFlow />;
    case "grounding":
      return <GroundingFlow />;
    case "tipp":
      return <TippFlow />;
    case "thought-record":
      return <ThoughtRecordFlow />;
    default:
      // Defensive — getExerciseBySlug would have already 404'd, but
      // TypeScript wants exhaustive handling.
      notFound();
  }
}
