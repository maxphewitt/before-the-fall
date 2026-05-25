import { notFound, redirect } from "next/navigation";
import { EXERCISES, getExerciseBySlug } from "../../../lib/tools";
import { getCurrentUserId } from "../../../lib/session";
import ToolWalker from "./ToolWalker";

/**
 * /tools/[slug]/start — the interactive walker for one Tier 1 exercise.
 *
 * Server component handles auth + tool lookup, then hands off to the
 * client component for the step-by-step flow.
 *
 * Unauthenticated users are bounced to /return so they sign back in. The
 * /tools/[slug] static description remains public; only the walker (which
 * saves to journal) requires identity.
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

  return <ToolWalker exercise={ex} />;
}
