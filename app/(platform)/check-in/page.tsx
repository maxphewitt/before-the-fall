import { getCurrentUserId } from "../../lib/session";
import OnboardingRequired from "../../components/OnboardingRequired";
import {
  getCurrentUserFaithRole,
  getCurrentUserDisplayName,
} from "../../lib/profile";
import { getCheckInStatus } from "../../actions/checkIns";
import { getCheckInScript } from "../../lib/checkIn";
import CheckInWalker from "./CheckInWalker";

/**
 * /check-in — the welfare check a returning user meets first. Warm,
 * skippable, never an attendance record (no day counts are ever shown).
 * The entire script (greeting, mood question, branches, next steps) comes
 * from getCheckInScript — the seam the future AI progress companion will
 * sit behind (Max's 2026-07-28 vision). Draft copy pending clinician
 * review.
 *
 * Reachable directly at any tier: the Home invite card only appears at
 * gentle/full/welcome-back, but someone who navigates here on a normal
 * day still gets a sensible generic check-in.
 */
export const dynamic = "force-dynamic";

export default async function CheckInPage() {
  const userId = await getCurrentUserId();
  if (!userId) return <OnboardingRequired returnTo="/check-in" />;

  const [faithRole, displayName, statusRes] = await Promise.all([
    getCurrentUserFaithRole(),
    getCurrentUserDisplayName(),
    getCheckInStatus(),
  ]);

  const secular = faithRole === "secular";
  const tier = statusRes.success ? statusRes.data.tier : "none";
  const script = getCheckInScript({ tier, secular, displayName });

  return <CheckInWalker script={script} secular={secular} />;
}
