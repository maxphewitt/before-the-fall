import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { signOutUser } from "../actions/userSession";

/**
 * Platform (gated) shell.
 *
 * Wraps every page in the (platform) route group — the account-only
 * zone: today, tools, journal, catholic-path, and the gated loved-one
 * steps. Provides a persistent top bar with:
 *   - the brand mark → /today (platform home)
 *   - a "Public site ↗" link → /?stay=1 (the escape hatch a logged-in
 *     user uses to view the open marketing site without being bounced
 *     straight back by middleware)
 *   - Sign out
 *
 * Defense-in-depth: middleware (proxy.ts) already redirects logged-out
 * visitors away from these routes, but we re-check the session cookie
 * here so the chrome never renders for an un-authenticated request.
 * Presence check only (no activity side effects) — individual pages do
 * the authoritative getCurrentUserId() lookup.
 */
export default async function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const signedIn = !!(await cookies()).get("btf_user_id");
  if (!signedIn) redirect("/");

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-btf-sky-deep text-white sticky top-0 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 py-3 flex items-center gap-4">
          {/* Brand → platform home */}
          <Link href="/today" className="flex items-center gap-2.5 group flex-shrink-0">
            <span className="relative w-5 h-6" aria-hidden>
              <span className="absolute left-1/2 top-0 -translate-x-1/2 w-1 h-6 bg-btf-gold rounded-sm" />
              <span className="absolute left-1/2 top-1.5 -translate-x-1/2 w-4 h-1 bg-btf-gold rounded-sm" />
            </span>
            <span className="font-serif text-lg text-white font-light tracking-wide group-hover:text-btf-gold-light transition-colors">
              Before the Fall
            </span>
          </Link>

          <div className="ml-auto flex items-center gap-3 flex-shrink-0">
            {/* Escape hatch to the public site (won't bounce back) */}
            <Link
              href="/?stay=1"
              className="text-white/75 hover:text-white text-[10px] sm:text-xs tracking-[0.2em] uppercase font-medium transition-colors whitespace-nowrap"
            >
              Public site ↗
            </Link>
            {/* Sign out */}
            <form action={signOutUser}>
              <button
                type="submit"
                className="text-btf-sky-deep bg-btf-gold/90 hover:bg-btf-gold text-[10px] sm:text-xs tracking-[0.2em] uppercase font-medium px-3.5 py-2 rounded-full transition-colors whitespace-nowrap"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="flex-1">{children}</div>
    </div>
  );
}
