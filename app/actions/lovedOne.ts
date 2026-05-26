"use server";

import { supabaseServer } from "../lib/supabase";
import {
  generateLovedOneCode,
  hashLovedOneCode,
  isWellFormedLovedOneCode,
  normalizeLovedOneCode,
} from "../lib/lovedOneCode";

/**
 * Server actions for the loved-one (Concerned Significant Other) flow.
 *
 *   createLovedOneIntake — stores quiz answers against a fresh code,
 *     returns the PLAINTEXT code to the caller exactly once.
 *
 *   lookupLovedOneIntake — given a code, returns the answer payload if
 *     the code is valid, not expired, and not yet redeemed. Read-only.
 *
 *   redeemLovedOneIntake — marks the code as redeemed by the given
 *     user id. Called from createUser when ?code= was present at
 *     /onboard. Idempotent at the DB level via the unique index +
 *     redeemed_at IS NULL filter.
 *
 * Types live inline here since this file is "use server" and Next.js
 * Server Action modules can only export async functions. Consumers
 * import the async functions; the shape of the returned data is
 * inferred from the return types.
 */

export type LovedOneAnswers = {
  relationship: string;
  populations: string[];
  duration: string;
  severitySignals: string[];
  attemptedConversation: string;
  faithContext: string;
  csoState: string;
  goal: string;
};

type CreateOk = { success: true; code: string };
type CreateErr = { success: false; error: string };

type LookupOk = { success: true; data: LovedOneAnswers };
type LookupErr = { success: false; error: string };

type RedeemOk = { success: true };
type RedeemErr = { success: false; error: string };

const GENERIC = "Something went wrong. Please try again.";

export async function createLovedOneIntake(
  answers: LovedOneAnswers
): Promise<CreateOk | CreateErr> {
  try {
    if (!answers.relationship || !Array.isArray(answers.populations) || answers.populations.length === 0) {
      return { success: false, error: "Missing required answers." };
    }
    const code = generateLovedOneCode();
    const codeHash = hashLovedOneCode(code);

    const supabase = supabaseServer();
    const { error } = await supabase.from("loved_one_intake").insert({
      code_hash: codeHash,
      relationship: answers.relationship,
      populations: answers.populations,
      duration: answers.duration,
      severity_signals: answers.severitySignals,
      attempted_conversation: answers.attemptedConversation,
      faith_context: answers.faithContext,
      cso_state: answers.csoState,
      goal: answers.goal,
    });

    if (error) {
      console.error("createLovedOneIntake DB error:", error);
      return { success: false, error: GENERIC };
    }
    return { success: true, code };
  } catch (err) {
    console.error("createLovedOneIntake exception:", err);
    return { success: false, error: GENERIC };
  }
}

export async function lookupLovedOneIntake(
  rawCode: string
): Promise<LookupOk | LookupErr> {
  try {
    if (!isWellFormedLovedOneCode(rawCode)) {
      return { success: false, error: "That doesn't look like a valid code." };
    }
    const codeHash = hashLovedOneCode(rawCode);
    const supabase = supabaseServer();
    const { data, error } = await supabase
      .from("loved_one_intake")
      .select(
        "relationship, populations, duration, severity_signals, attempted_conversation, faith_context, cso_state, goal, expires_at, redeemed_at"
      )
      .eq("code_hash", codeHash)
      .maybeSingle();

    if (error) {
      console.error("lookupLovedOneIntake DB error:", error);
      return { success: false, error: GENERIC };
    }
    if (!data) {
      return { success: false, error: "Code not found." };
    }
    if (data.redeemed_at !== null) {
      return { success: false, error: "Code already used." };
    }
    if (
      data.expires_at &&
      new Date(data.expires_at as string).getTime() < Date.now()
    ) {
      return { success: false, error: "Code expired." };
    }

    return {
      success: true,
      data: {
        relationship: (data.relationship as string) ?? "",
        populations: (data.populations as string[]) ?? [],
        duration: (data.duration as string) ?? "",
        severitySignals: (data.severity_signals as string[]) ?? [],
        attemptedConversation: (data.attempted_conversation as string) ?? "",
        faithContext: (data.faith_context as string) ?? "",
        csoState: (data.cso_state as string) ?? "",
        goal: (data.goal as string) ?? "",
      },
    };
  } catch (err) {
    console.error("lookupLovedOneIntake exception:", err);
    return { success: false, error: GENERIC };
  }
}

/**
 * Mark a code as redeemed. Idempotent — if the row was already
 * redeemed, the update affects zero rows and we return success
 * without surfacing an error to the caller (their code use was
 * benign even if the code was already consumed).
 */
export async function redeemLovedOneIntake(input: {
  rawCode: string;
  userId: string;
}): Promise<RedeemOk | RedeemErr> {
  try {
    if (!isWellFormedLovedOneCode(input.rawCode)) {
      return { success: false, error: "Invalid code format." };
    }
    const codeHash = hashLovedOneCode(input.rawCode);
    const supabase = supabaseServer();
    const { error } = await supabase
      .from("loved_one_intake")
      .update({
        redeemed_at: new Date().toISOString(),
        redeemed_by_user_id: input.userId,
      })
      .eq("code_hash", codeHash)
      .is("redeemed_at", null);

    if (error) {
      console.error("redeemLovedOneIntake DB error:", error);
      return { success: false, error: GENERIC };
    }
    return { success: true };
  } catch (err) {
    console.error("redeemLovedOneIntake exception:", err);
    return { success: false, error: GENERIC };
  }
}

/**
 * Convenience wrapper for client/onboard pre-population. Returns the
 * normalized code as well so the caller can pass it back to createUser
 * for redemption after the form submits.
 */
export async function normalizeLovedOneCodeForUrl(
  raw: string
): Promise<string | null> {
  if (!isWellFormedLovedOneCode(raw)) return null;
  return normalizeLovedOneCode(raw);
}
