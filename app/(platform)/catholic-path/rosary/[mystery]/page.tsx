import { notFound } from "next/navigation";
import { getMysteryBySlug, MYSTERIES, generateRosary } from "../../../../lib/rosary";
import RosaryWalker from "./RosaryWalker";
import { getCurrentUserId } from "../../../../lib/session";
import OnboardingRequired from "../../../../components/OnboardingRequired";
import {
  getIntentionForDate,
  formatIntentionPeriod,
} from "../../../../lib/popeIntentions";

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

  // Pope's intention is monthly — server-side calendar month is fine
  // (timezone slippage at most a few hours per month boundary; the
  // user gets either this month's or last month's, which is acceptable
  // for monthly content). Day-of-week is timezone-sensitive and handled
  // client-side in the landing page.
  const now = new Date();
  const intention = {
    ...getIntentionForDate(now),
    period: formatIntentionPeriod(now, "en-US"),
  };

  const steps = generateRosary(mystery, intention);

  return <RosaryWalker mysteryName={mystery.name} steps={steps} />;
}
