import BetaGate from "../../components/BetaGate";
import OnboardClient from "./OnboardFlow";
import { getBetaAccessCodeId } from "../../actions/betaAccess";

/**
 * /onboard — create account.
 *
 * This server wrapper enforces the closed-beta gate at the
 * create-account step (the new home for the beta gate after the
 * 2026-06-15 restructure — it used to wall the whole site):
 *
 *   - When BETA_GATE_ENABLED=true and the visitor has NOT redeemed a
 *     valid beta access code, we render the code-entry gate. Redeeming
 *     a code (POST /api/verify-code) sets the cookie and reloads
 *     /onboard, dropping them into the questionnaire.
 *   - Otherwise we render the onboarding questionnaire directly.
 *
 * This is a UX convenience only. The authoritative enforcement is the
 * server-side guard in createUser(), which rejects account creation if
 * the gate is on and there's no valid beta session — so the gate can't
 * be bypassed by reaching the questionnaire some other way.
 *
 * The crisis numbers on the gate screen are always visible, code or no.
 */
export default async function OnboardPage() {
  if (process.env.BETA_GATE_ENABLED === "true") {
    const betaCodeId = await getBetaAccessCodeId();
    if (!betaCodeId) {
      return <BetaGate redirectTo="/onboard" />;
    }
  }
  return <OnboardClient />;
}
