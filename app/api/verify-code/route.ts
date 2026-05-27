import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseServer } from "../../lib/supabase";
import {
  hashBetaAccessCode,
  isWellFormedBetaAccessCode,
} from "../../lib/betaAccessCode";
import { getSafetyMetadata } from "../../lib/safetyMetadata";

/**
 * POST /api/verify-code
 *
 *   Body: { code: string }
 *   Returns: { ok: true } | { ok: false, error: string }
 *
 * Validates a beta access code, creates a beta_access_session row,
 * and issues the `beta_authorized` cookie httpOnly. The cookie is
 * the session id (UUID) — no plaintext code is ever stored client-
 * side.
 *
 * This is the ONLY route besides `/` that the middleware lets through
 * without a beta cookie. Everything else redirects to `/` so a visitor
 * can't bypass the gate by direct URL.
 *
 * Cookie lifetime: 365 days. Closed-beta cohort is small and long-
 * lived; we don't want testers re-entering codes every week.
 */

// Matches middleware.ts BETA_COOKIE and the existing
// app/actions/betaAccess.ts naming. Renamed in the 2026-05-26
// beta-hardening sprint to align all three callers on one name.
const COOKIE_NAME = "btf_beta_access";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

const GENERIC = "Server hiccup. Try again.";
const NOT_RECOGNIZED = "Code not recognized.";
const DEACTIVATED = "This code has been deactivated. Contact Max.";
const MALFORMED = "Code format isn't right. Three words, lowercase.";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => null)) as
      | { code?: unknown }
      | null;
    const rawCode = typeof body?.code === "string" ? body.code : "";

    if (!isWellFormedBetaAccessCode(rawCode)) {
      return NextResponse.json({ ok: false, error: MALFORMED }, { status: 400 });
    }

    const codeHash = hashBetaAccessCode(rawCode);
    const supabase = supabaseServer();

    const { data: codeRow, error: codeError } = await supabase
      .from("beta_access_codes")
      .select("id, deactivated_at, use_count")
      .eq("code_hash", codeHash)
      .maybeSingle();

    if (codeError) {
      console.error("verify-code DB error (lookup):", codeError);
      return NextResponse.json({ ok: false, error: GENERIC }, { status: 500 });
    }
    if (!codeRow) {
      return NextResponse.json({ ok: false, error: NOT_RECOGNIZED }, { status: 401 });
    }
    if (codeRow.deactivated_at !== null) {
      return NextResponse.json({ ok: false, error: DEACTIVATED }, { status: 403 });
    }

    // Create a session row + bump code counters.
    const metadata = await getSafetyMetadata();
    const { data: sessionRow, error: sessionError } = await supabase
      .from("beta_access_sessions")
      .insert({
        beta_code_id: codeRow.id,
        ip_hash: metadata.hashedIp,
        user_agent: metadata.userAgent,
      })
      .select("id")
      .single();

    if (sessionError || !sessionRow) {
      console.error("verify-code DB error (session insert):", sessionError);
      return NextResponse.json({ ok: false, error: GENERIC }, { status: 500 });
    }

    await supabase
      .from("beta_access_codes")
      .update({
        use_count: (codeRow.use_count as number) + 1,
        last_used_at: new Date().toISOString(),
      })
      .eq("id", codeRow.id);

    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, sessionRow.id as string, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: COOKIE_MAX_AGE,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("verify-code exception:", err);
    return NextResponse.json({ ok: false, error: GENERIC }, { status: 500 });
  }
}
