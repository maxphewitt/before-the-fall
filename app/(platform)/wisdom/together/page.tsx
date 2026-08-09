import { getCurrentUserId } from "../../../lib/session";
import { currentMonthlyWisdom, wisdomSessions, wisdomPeriodKey } from "../../../lib/monthlyWisdom";
import { getCompletedSessions, getLeaderboard } from "../../../actions/quiz";
import { getPosition } from "../../../actions/devotion";
import OnboardingRequired from "../../../components/OnboardingRequired";
import ModuleWalker from "../../catholic-path/together/ModuleWalker";

/**
 * /wisdom/together — "Learn Together", the secular mirror of the monthly
 * Pray Together learning module. One topic per month, taught through 1–2
 * philosophers/poets (public domain, no religion, no spirituality).
 *
 * Reuses the shared ModuleWalker with secular labels; the period key is
 * namespaced ("wisdom-YYYY-MM") so quiz scores, time, and position never
 * collide with the Catholic module in the shared tables.
 */
export const dynamic = "force-dynamic";

export default async function LearnTogetherPage() {
  const userId = await getCurrentUserId();
  if (!userId) return <OnboardingRequired returnTo="/wisdom/together" />;

  const wisdom = currentMonthlyWisdom();
  const period = wisdomPeriodKey();

  const [completed, leaderboard, position] = await Promise.all([
    getCompletedSessions(period),
    getLeaderboard(period),
    getPosition(period),
  ]);

  return (
    <ModuleWalker
      monthLabel={wisdom.monthLabel}
      devotionTitle={wisdom.topic}
      period={period}
      sessions={wisdomSessions(wisdom)}
      initialCompleted={completed}
      initialLeaderboard={leaderboard}
      initialPosition={position}
      backHref="/explore"
      backLabel="Explore"
      prayLabel="Practice"
      closingLabel="Closing thought"
      resultCopy="Well done — every answer is time spent learning what steadies you. Your place is saved."
    />
  );
}
