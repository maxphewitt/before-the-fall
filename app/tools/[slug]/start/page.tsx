import { notFound, redirect } from "next/navigation";
import { EXERCISES, getExerciseBySlug } from "../../../lib/tools";
import { getCurrentUserId } from "../../../lib/session";
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
 */
export function generateStaticParams() {
  return EXERCISES.map((e) => ({ slug: e.slug }));
}

// The walker reads identity from a cookie and writes to the journal,
// so it must run dynamically per request.
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
    case "urge-surfing":
      return <UrgeSurfingFlow />;
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
