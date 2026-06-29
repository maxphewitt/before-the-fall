import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import PlatformNav from "./_nav/PlatformNav";

/**
 * Platform (gated) shell.
 *
 * Wraps every page in the (platform) route group — the account-only zone:
 * home, tools, journal, catholic-path, grove, and the gated loved-one
 * steps. Provides the persistent PlatformNav (left sidebar on desktop, a
 * floating bottom dock on mobile) and the calm deep-night → sky brand
 * background the redesign (2026-06-28) standardised on.
 *
 * The old top bar and the per-page "← Home" back button are gone: Home is
 * now the post-login landing (/home) and navigation lives entirely in
 * PlatformNav.
 *
 * Defense-in-depth: middleware (proxy.ts) already redirects logged-out
 * visitors away from these routes, but we re-check the session cookie here
 * so the chrome never renders for an un-authenticated request. Presence
 * check only — individual pages do the authoritative getCurrentUserId().
 */
export default async function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const signedIn = !!(await cookies()).get("btf_user_id");
  if (!signedIn) redirect("/");

  return (
    <div className="relative min-h-screen text-[#e9f1f8] md:pl-[236px] bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(61,143,196,0.35),transparent_60%),linear-gradient(180deg,#0a1a2a_0%,#0d2238_38%,#103453_100%)]">
      <PlatformNav />
      {/* Bottom padding clears the mobile dock; desktop clears via sidebar pad. */}
      <div className="pb-32 md:pb-0">{children}</div>
    </div>
  );
}
