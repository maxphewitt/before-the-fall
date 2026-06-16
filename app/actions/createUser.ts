"use server";

import { supabaseServer } from "../lib/supabase";
import { generateRecoveryCode, hashRecoveryCode } from "../lib/recoveryCode";
import { setSessionCookie } from "../lib/session";
import { getSafetyMetadata } from "../lib/safetyMetadata";
import { mapOnboardingPopulation, type PopulationSlug } from "../lib/habits";
import { seedDefaultHabitsForUser } from "./habits";
import { redeemLovedOneIntake } from "./lovedOne";
import { getBetaAccessCodeId } from "./betaAccess";

export type ProfileData = {
  framing: string;
  here_for: string;
  populations: string[];
  emotional_state: string;
  faith_role: string;
  support_level: string;
  duration: string;
  discovery: string;
};

export type CreateUserResult =
  | { success: true; recoveryCode: string; userId: string }
  | { success: false; error: string };

/**
 * Create a new user with a fresh 12-word recovery code AND save their
 * onboarding questionnaire profile in one server-side flow.
 *
 * Two rows are written: users (identity + hashed code) and user_profiles
 * (questionnaire answers, drives personalization). A safety_logs row is
 * also written — elevated priority if the user reported self-harm risk
 * or asked for urgent crisis support.
 *
 * Returns the PLAINTEXT recovery code to the client one time only.
 * After this call, the platform has no way to reproduce the code.
 */
export async function createUser(
  profile: ProfileData,
  options?: { lovedOneCode?: string; persist?: boolean }
): Promise<CreateUserResult> {
  try {
    // Resolve the beta access code FIRST. It does double duty:
    //   1. The closed-beta SERVER-SIDE gate. When BETA_GATE_ENABLED is
    //      on, account creation requires a valid, redeemed beta access
    //      session (the `btf_beta_access` cookie issued by
    //      /api/verify-code). A null here means no/invalid code → reject
    //      before any row is written. This is the real enforcement
    //      boundary: it can't be bypassed by hitting /onboard directly
    //      or by calling this action, because it runs server-side.
    //   2. Linking the signup back to the tester whose code let them in.
    // Null is allowed once the gate is turned off at public launch.
    const betaAccessCodeId = await getBetaAccessCodeId();

    if (process.env.BETA_GATE_ENABLED === "true" && !betaAccessCodeId) {
      return {
        success: false,
        error: "A beta access code is required to create an account right now.",
      };
    }

    const recoveryCode = generateRecoveryCode();
    const hash = hashRecoveryCode(recoveryCode);

    const supabase = supabaseServer();

    // 1) Insert user
    const { data: userData, error: userError } = await supabase
      .from("users")
      .insert({
        recovery_code_hash: hash,
        beta_access_code_id: betaAccessCodeId,
      })
      .select("id")
      .single();

    if (userError || !userData) {
      console.error("createUser DB error:", userError);
      return { success: false, error: "Database error. Please try again." };
    }

    // 2) Insert profile
    const { error: profileError } = await supabase
      .from("user_profiles")
      .insert({
        user_id: userData.id,
        framing: profile.framing,
        here_for: profile.here_for,
        populations: profile.populations,
        emotional_state: profile.emotional_state,
        faith_role: profile.faith_role,
        support_level: profile.support_level,
        duration: profile.duration,
        discovery: profile.discovery,
      });

    if (profileError) {
      console.error("createProfile DB error:", profileError);
      // Note: user row was created. In production we'd want a DB transaction
      // or background cleanup. For v1 we accept the orphan row.
      return { success: false, error: "Profile save failed. Please try again." };
    }

    // 3) Log safety event — elevated if self-harm reported or urgent support requested
    const elevatedPriority =
      profile.populations.includes("self_harm") ||
      profile.support_level === "urgent";

    const metadata = await getSafetyMetadata();
    await supabase.from("safety_logs").insert({
      user_id: userData.id,
      event_type: elevatedPriority ? "signup_elevated" : "signup",
      ip_hash: metadata.hashedIp,
      user_agent: metadata.userAgent,
    });

    // 4) Set the session cookie so the new user is treated as logged in
    // immediately. Without this they'd have to bounce through /return after
    // signup, which is a terrible first experience. `persist` honors the
    // "Keep me logged in on this device" choice made on the disclosure step
    // (defaults to true).
    await setSessionCookie(userData.id, options?.persist ?? true);

    // 5) Seed default habits for the Today tracker. Best-effort — if
    // this fails, the user lands on /today empty and edits manually.
    // Catholic-warm = growing_closer or open; secular gets no
    // Catholic Path habits.
    const populationSlugs: PopulationSlug[] = profile.populations
      .map(mapOnboardingPopulation)
      .filter((p): p is PopulationSlug => p !== null);
    const catholicPath = profile.faith_role !== "secular";
    try {
      await seedDefaultHabitsForUser({
        userId: userData.id,
        populations: populationSlugs,
        catholicPath,
      });
    } catch (err) {
      console.error("seedDefaultHabitsForUser failed (non-fatal):", err);
    }

    // 6) Redeem the loved-one referral code if one was provided.
    // Best-effort; if it fails the user still gets their account.
    if (options?.lovedOneCode) {
      try {
        await redeemLovedOneIntake({
          rawCode: options.lovedOneCode,
          userId: userData.id,
        });
      } catch (err) {
        console.error("redeemLovedOneIntake failed (non-fatal):", err);
      }
    }

    return { success: true, recoveryCode, userId: userData.id };
  } catch (err) {
    console.error("createUser exception:", err);
    return { success: false, error: "Unexpected error. Please try again." };
  }
}
