import { NextResponse, type NextRequest } from "next/server";

/**
 * Route protection for the two-zone site (restructure 2026-06-15).
 *
 * The site is split into a PUBLIC marketing zone and a GATED platform
 * zone. This middleware is the perimeter that enforces the split;
 * server components and server actions do deep validation as
 * defense-in-depth.
 *
 * ── Zones ─────────────────────────────────────────────────────────
 *
 *   PUBLIC (no account, always reachable):
 *     /                 marketing home / landing
 *     /who-we-are       marketing
 *     /return           log in (paste recovery code)
 *     /onboard          create account (beta-gated SERVER-SIDE in
 *                       createUser, not here — see below)
 *     /loved-one        the "bridge" program explainer (read-only)
 *     /offline          crisis fallback — must work code or no code
 *     /api/verify-code  issues the beta cookie during signup
 *     static assets
 *
 *   GATED (requires a `btf_user_id` session cookie):
 *     /today /tools /journal /catholic-path
 *     /loved-one/quiz, /loved-one/result, /loved-one/resources
 *     A logged-out hit on any of these → 302 to `/` (the landing has
 *     prominent Log In / Create Account). The tools are therefore
 *     unreachable by direct URL without an account.
 *
 *   ADMIN (own auth):
 *     /admin/*  requires the `btf_admin_id` cookie (→ `/` if missing).
 *     /a/*      magic-link path; the 32-byte URL token is the gate, so
 *               it passes through here untouched.
 *
 * ── Beta gate ─────────────────────────────────────────────────────
 *
 * The beta access code is NO LONGER a perimeter gate on browsing.
 * Marketing and login are fully open. The code is required only to
 * CREATE AN ACCOUNT, and that requirement is enforced server-side in
 * app/actions/createUser.ts (it rejects when BETA_GATE_ENABLED=true and
 * there's no valid beta session). So this middleware doesn't read
 * BETA_GATE_ENABLED at all — the gate moved to the signup action.
 *
 * ── Logged-in routing ─────────────────────────────────────────────
 *
 * A logged-in visitor hitting `/`, `/return`, or `/onboard` is soft-
 * redirected to `/today` (the platform home) UNLESS the URL carries
 * `?stay=1`. The platform shell links to `/?stay=1` so a logged-in user
 * can still view the public site without being bounced straight back.
 */

const USER_COOKIE = "btf_user_id";
const ADMIN_COOKIE = "btf_admin_id";

/** Static asset extensions that always pass through. */
const STATIC_EXT = /\.(png|jpg|jpeg|svg|gif|webp|ico|woff2?|ttf|css|js|map|txt|xml)$/i;

/**
 * Routes that require a logged-in user. A path is gated if it equals one
 * of these or starts with it followed by `/`.
 */
const GATED_PREFIXES = [
  "/home",
  "/today",
  "/explore",
  "/you",
  "/tools",
  "/journal",
  "/field-journal",
  "/catholic-path",
  "/loved-one/quiz",
  "/loved-one/result",
  "/loved-one/resources",
];

/**
 * Paths a logged-in user should be bounced away from (into the
 * platform), unless they explicitly asked to stay on the public site
 * with ?stay=1.
 */
const LOGGED_IN_REDIRECT_PATHS = new Set(["/", "/return", "/onboard"]);

function isGated(pathname: string): boolean {
  return GATED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
}

function redirectTo(request: NextRequest, pathname: string): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = ""; // strip any sensitive/echoed query params
  return NextResponse.redirect(url);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Framework + static asset shortcuts.
  if (pathname.startsWith("/_next/")) return NextResponse.next();
  if (STATIC_EXT.test(pathname)) return NextResponse.next();

  // Magic-link admin auth path: the URL token is the gate (handler 404s
  // unless it matches), so let it through without any cookie.
  if (pathname.startsWith("/a/")) return NextResponse.next();

  // Admin routes need only the admin cookie. No redirect to a login
  // form (that would advertise the route) — missing cookie → home.
  if (pathname.startsWith("/admin")) {
    if (!request.cookies.get(ADMIN_COOKIE)) return redirectTo(request, "/");
    return NextResponse.next();
  }

  const isLoggedIn = !!request.cookies.get(USER_COOKIE);

  // Logged-in users landing on the public/auth entry points are sent
  // straight to the platform, unless they asked to stay (?stay=1).
  if (
    isLoggedIn &&
    LOGGED_IN_REDIRECT_PATHS.has(pathname) &&
    request.nextUrl.searchParams.get("stay") !== "1"
  ) {
    return redirectTo(request, "/home");
  }

  // Gated platform routes require a session. Logged-out → landing.
  if (isGated(pathname) && !isLoggedIn) {
    return redirectTo(request, "/");
  }

  // Everything else (marketing, auth, /loved-one explainer, /offline,
  // /api/verify-code) is public.
  return NextResponse.next();
}

export const config = {
  // Run on every request except framework asset paths the matcher
  // shouldn't touch. The static-extension shortcut inside the function
  // is the second line of defense.
  matcher: ["/((?!_next/static|_next/image).*)"],
};
