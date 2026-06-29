import Link from "next/link";
import { cookies } from "next/headers";

/**
 * Marketing (public) layout.
 *
 * Wraps every page in the (marketing) route group — the open,
 * un-gated zone: Home, Who We Are, and (later) News & Articles. The
 * gated platform lives under (platform) and has its own shell.
 *
 * The top nav is the single trusted source for auth entry: Log In and
 * Create Account. When a session cookie is present (e.g. a logged-in
 * user viewing the public site via ?stay=1) the auth buttons collapse
 * to a single "Enter platform" link.
 *
 * Brand: deep sky blue / white / gold, with the cross as the mark.
 * Mobile-first: the nav is a single wrapping row that scales up.
 */

// Top-level marketing tabs. Add new tabs here — the nav renders this
// array, so extending the site is a one-line change. `comingSoon`
// renders a disabled label with a "Soon" badge instead of a link.
const NAV_TABS: { href: string; label: string; comingSoon?: boolean }[] = [
  { href: "/", label: "Home" },
  { href: "/what-we-offer", label: "What We Offer" },
  { href: "/who-we-are", label: "Who We Are" },
  { href: "/loved-one", label: "For Loved Ones" },
  { href: "/news", label: "News & Articles" },
];

function BrandMark() {
  return (
    <Link href="/" className="flex items-center gap-2.5 group">
      {/* Cross */}
      <span className="relative w-5 h-6 flex-shrink-0" aria-hidden>
        <span className="absolute left-1/2 top-0 -translate-x-1/2 w-1 h-6 bg-btf-gold rounded-sm" />
        <span className="absolute left-1/2 top-1.5 -translate-x-1/2 w-4 h-1 bg-btf-gold rounded-sm" />
      </span>
      <span className="font-serif text-lg sm:text-xl text-white font-light tracking-wide group-hover:text-btf-gold-light transition-colors">
        Before the Fall
      </span>
    </Link>
  );
}

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Presence check only — no activity side effects on public pages.
  const signedIn = !!(await cookies()).get("btf_user_id");

  return (
    <div className="min-h-screen flex flex-col bg-btf-off-white">
      {/* ── Header / nav ── */}
      <header className="bg-btf-sky-deep text-white sticky top-0 z-30 shadow-sm">
        <nav
          aria-label="Primary"
          className="max-w-6xl mx-auto px-5 sm:px-6 py-3 flex flex-wrap items-center gap-x-6 gap-y-3"
        >
          <BrandMark />

          {/* Tabs */}
          <ul className="order-3 w-full sm:order-2 sm:w-auto sm:flex-1 flex items-center gap-1 overflow-x-auto -mx-1 px-1">
            {NAV_TABS.map((tab) =>
              tab.comingSoon ? (
                <li key={tab.label} className="flex-shrink-0">
                  <span className="inline-flex items-center gap-1.5 px-3 py-2 text-[13px] font-light text-white/45 cursor-default whitespace-nowrap">
                    {tab.label}
                    <span className="text-[9px] uppercase tracking-[0.15em] bg-white/10 text-white/60 px-1.5 py-0.5 rounded-full">
                      Soon
                    </span>
                  </span>
                </li>
              ) : (
                <li key={tab.label} className="flex-shrink-0">
                  <Link
                    href={tab.href}
                    className="inline-block px-3 py-2 text-[13px] font-light text-white/80 hover:text-white whitespace-nowrap transition-colors"
                  >
                    {tab.label}
                  </Link>
                </li>
              )
            )}
          </ul>

          {/* Auth entry — single trusted source */}
          <div className="order-2 sm:order-3 ml-auto flex items-center gap-2 flex-shrink-0">
            {signedIn ? (
              <Link
                href="/home"
                className="text-btf-sky-deep bg-btf-gold hover:bg-btf-gold-light text-xs sm:text-sm font-medium px-4 py-2 rounded-full transition-colors shadow-sm whitespace-nowrap"
              >
                Enter platform →
              </Link>
            ) : (
              <>
                <Link
                  href="/return"
                  className="text-white/85 hover:text-white border border-white/25 hover:bg-white/10 text-xs sm:text-sm font-medium px-3.5 py-2 rounded-full transition-colors whitespace-nowrap"
                >
                  Log In
                </Link>
                <Link
                  href="/onboard"
                  className="text-btf-sky-deep bg-btf-gold hover:bg-btf-gold-light text-xs sm:text-sm font-medium px-4 py-2 rounded-full transition-colors shadow-sm whitespace-nowrap"
                >
                  Create Account
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* ── Page ── */}
      <main className="flex-1">{children}</main>

      {/* ── Shared marketing footer ── */}
      <footer className="bg-btf-sky-deep text-white/70">
        <div className="max-w-6xl mx-auto px-6 pt-14 pb-10">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="lg:pr-6">
              <div className="flex items-center gap-2.5 mb-4">
                <span className="relative w-5 h-6" aria-hidden>
                  <span className="absolute left-1/2 top-0 -translate-x-1/2 w-1 h-6 bg-btf-gold rounded-sm" />
                  <span className="absolute left-1/2 top-1.5 -translate-x-1/2 w-4 h-1 bg-btf-gold rounded-sm" />
                </span>
                <span className="font-serif text-lg text-white font-light tracking-wide">
                  Before the Fall
                </span>
              </div>
              <p className="font-serif italic text-sm text-white/80 leading-relaxed">
                Reaching the lost before they become unreachable.
              </p>
              <p className="text-xs text-white/55 leading-relaxed mt-3">
                A Texas-based nonprofit initiative for the moment before harm.
              </p>
            </div>

            {/* Explore */}
            <nav aria-label="Explore">
              <p className="text-[10px] tracking-[0.25em] uppercase text-btf-gold-light/80 font-semibold mb-4">
                Explore
              </p>
              <ul className="space-y-2.5 text-sm font-light">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/what-we-offer" className="hover:text-white transition-colors">What We Offer</Link></li>
                <li><Link href="/who-we-are" className="hover:text-white transition-colors">Who We Are</Link></li>
                <li><Link href="/loved-one" className="hover:text-white transition-colors">For Loved Ones</Link></li>
                <li><span className="text-white/40">News &amp; Articles (soon)</span></li>
              </ul>
            </nav>

            {/* Account */}
            <nav aria-label="Account">
              <p className="text-[10px] tracking-[0.25em] uppercase text-btf-gold-light/80 font-semibold mb-4">
                Your account
              </p>
              <ul className="space-y-2.5 text-sm font-light">
                {signedIn ? (
                  <li><Link href="/home" className="hover:text-white transition-colors">Enter platform</Link></li>
                ) : (
                  <>
                    <li><Link href="/onboard" className="hover:text-white transition-colors">Create account</Link></li>
                    <li><Link href="/return" className="hover:text-white transition-colors">Log in</Link></li>
                  </>
                )}
                <li><Link href="/loved-one" className="hover:text-white transition-colors">Help a loved one</Link></li>
              </ul>
            </nav>

            {/* Crisis */}
            <div>
              <p className="text-[10px] tracking-[0.25em] uppercase text-btf-gold-light/80 font-semibold mb-4">
                In crisis now — 24/7
              </p>
              <ul className="space-y-2.5 text-sm font-light">
                <li>
                  <a href="tel:988" className="hover:text-white transition-colors">
                    <span className="text-btf-gold-light">988</span> · Suicide &amp; Crisis Lifeline
                  </a>
                </li>
                <li>
                  <a href="tel:18007997233" className="hover:text-white transition-colors">
                    <span className="text-btf-gold-light">1-800-799-7233</span> · DV Hotline
                  </a>
                </li>
                <li>
                  <a href="sms:741741&body=HOME" className="hover:text-white transition-colors">
                    Text <span className="text-btf-gold-light">HOME</span> to 741741
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/55">
            <p>&copy; 2026 Before the Fall. All rights reserved.</p>
            <p>
              Not therapy. Not an emergency service. In danger? Call{" "}
              <span className="text-btf-gold-light">911</span>.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
