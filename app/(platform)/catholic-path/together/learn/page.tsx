import { getCurrentUserId } from "../../../../lib/session";
import { currentMonthlyDevotion, moduleSessions, periodKey } from "../../../../lib/monthlyDevotions";
import { getCompletedSessions, getLeaderboard } from "../../../../actions/quiz";
import { getPosition } from "../../../../actions/devotion";
import OnboardingRequired from "../../../../components/OnboardingRequired";
import ModuleWalker from "../ModuleWalker";

/**
 * /catholic-path/together/learn — the month's learning module (Begin → sessions).
 */
export const dynamic = "force-dynamic";

export default async function LearnPage() {
  const userId = await getCurrentUserId();
  if (!userId) return <OnboardingRequired returnTo="/catholic-path/together/learn" />;

  const devotion = currentMonthlyDevotion();
  const sessions = moduleSessions(devotion);
  const period = periodKey();

  const [completed, leaderboard, position] = await Promise.all([
    getCompletedSessions(period),
    getLeaderboard(period),
    getPosition(period),
  ]);

  return (
    <ModuleWalker
      monthLabel={devotion.monthLabel}
      devotionTitle={devotion.title}
      period={period}
      sessions={sessions}
      initialCompleted={completed}
      initialLeaderboard={leaderboard}
      initialPosition={position}
    />
  );
}
