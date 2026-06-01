import { notFound } from "next/navigation";
import { getMysteryBySlug, MYSTERIES, generateRosary } from "../../../lib/rosary";
import RosaryWalker from "./RosaryWalker";
import { getCurrentUserId } from "../../../lib/session";
import OnboardingRequired from "../../../components/OnboardingRequired";

// Beta posture: onboarded users only. Per-request render so the cookie
// check happens at request time; generateStaticParams stays for
// routing hints.
export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return MYSTERIES.map((m) => ({ mystery: m.slug }));
}

export default async function RosaryMysteryPage({
  params,
}: {
  params: Promise<{ mystery: string }>;
}) {
  const { mystery: slug } = await params;
  const mystery = getMysteryBySlug(slug);
  if (!mystery) notFound();

  const userId = await getCurrentUserId();
  if (!userId) {
    return <OnboardingRequired returnTo={`/catholic-path/rosary/${slug}`} />;
  }

  const steps = generateRosary(mystery);

  return <RosaryWalker mysteryName={mystery.name} steps={steps} />;
}
