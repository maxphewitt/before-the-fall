import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseServer } from "../../lib/supabase";

/**
 * GET /_a/[token]
 *
 * Magic-link admin authentication. The single way to obtain the admin
 * cookie. There is no public admin login form anywhere on the site.
 *
 * How it works:
 *   1. Max bookmarks https://beforethefall.app/_a/<ADMIN_MAGIC_PATH>
 *      where <ADMIN_MAGIC_PATH> is a long random string stored in the
 *      ADMIN_MAGIC_PATH env var on Vercel.
 *   2. Visiting the URL: middleware checks the beta cookie first
 *      (defense in depth — must be in the beta cohort). If absent,
 *      middleware redirects to `/`. Same as everywhere else.
 *   3. This route handler then compares the URL path segment to the
 *      env var. If they match, look up the founder admin and issue
 *      the btf_admin_id cookie. Redirect to /admin/review.
 *   4. If the token does NOT match (or env var is missing), return
 *      404. No body, no hint. Anyone scanning the URL space sees the
 *      same response as any other non-existent path.
 *
 * Security properties:
 *   - Requires beta cookie + correct token = two-factor.
 *   - No password form anywhere = no brute-forceable input.
 *   - Magic link is bookmarkable; rotating it means changing the env
 *     var on Vercel.
 *   - If the founder admin row is missing (e.g., seed-admin.ts was
 *     never run), we return a generic 500 with no detail.
 *
 * Bootstrap: before this works, run scripts/seed-admin.ts to mint
 * a founder admin_users row.
 */

// CRITICAL: this route must never be cached. The URL contains a secret
// token in the path; a cached response from a prior token attempt would
// be served to subsequent requests in the same region — defeating the
// whole point of the auth check. force-dynamic disables Next's static
// optimization. The explicit Cache-Control headers below cover any CDN
// or browser layer that might otherwise cache by path.
export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, private",
  "Pragma": "no-cache",
  "Expires": "0",
} as const;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const expected = process.env.ADMIN_MAGIC_PATH;

  // Diagnostic logging — structural-only, never the actual values.
  // Lets us debug 404s in Vercel function logs without leaking the
  // magic path or token. Safe to keep in production; the secrets
  // never enter the log line.
  const diag = {
    hasEnv: !!expected,
    envLen: expected?.length ?? 0,
    tokenLen: token?.length ?? 0,
    exactMatch: token === expected,
  };
  console.log("[_a/token] auth attempt", JSON.stringify(diag));

  // Constant-time-ish compare — short-circuit length first, then exact match.
  if (!expected || typeof expected !== "string" || expected.length < 16) {
    // Env var unset or trivially short → don't auth anyone. 404.
    return new NextResponse(null, { status: 404, headers: NO_CACHE_HEADERS });
  }
  if (token !== expected) {
    return new NextResponse(null, { status: 404, headers: NO_CACHE_HEADERS });
  }

  // Look up the founder admin row.
  const supabase = supabaseServer();
  const { data: founder, error } = await supabase
    .from("admin_users")
    .select("id")
    .eq("role", "founder")
    .is("revoked_at", null)
    .limit(1)
    .maybeSingle();

  if (error || !founder) {
    console.error("/_a/[token] founder lookup failed:", error);
    // Don't leak the cause to the client.
    return new NextResponse(null, { status: 500, headers: NO_CACHE_HEADERS });
  }

  const cookieStore = await cookies();
  cookieStore.set("btf_admin_id", founder.id as string, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12, // 12-hour admin session, matches existing pattern
  });

  // Touch last_seen_at on the admin row for the audit trail.
  await supabase
    .from("admin_users")
    .update({ last_seen_at: new Date().toISOString() })
    .eq("id", founder.id);

  // Redirect to the admin home. Same-origin only. The redirect itself
  // is also no-cache so a different admin (or the same admin after the
  // cookie expires) can't accidentally get served a cached redirect.
  const dest = request.nextUrl.clone();
  dest.pathname = "/admin/review";
  dest.search = "";
  const redirectResponse = NextResponse.redirect(dest);
  for (const [key, value] of Object.entries(NO_CACHE_HEADERS)) {
    redirectResponse.headers.set(key, value);
  }
  return redirectResponse;
}
