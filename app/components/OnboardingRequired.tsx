import Link from "next/link";

/**
 * Server-rendered overlay shown when a visitor has the beta cookie
 * but no user session. Drops in place of the protected content (so
 * we never serve any of the real page to an un-onboarded visitor).
 *
 * Visually a centered modal card on a darkened sky background. The
 * CrisisExitRamp from the root layout still floats above this, so
 * anyone in immediate distress can still reach 988 / DV / Text Line
 * without onboarding.
 *
 * Two paths forward:
 *   - "Begin onboarding" → /onboard (new tester completes the seven
 *     questions, gets a 12-word recovery code, lands signed in).
 *   - "I already have a recovery code" → /return (existing user
 *     pastes the code, restores their session).
 *
 * `returnTo` is included as a query param on /onboard and /return so
 * we can route the user back to where they were trying to go once
 * they finish signing in. (Sanitized in the receiving routes.)
 */
export default function OnboardingRequired({
  returnTo,
}: {
  returnTo?: string;
}) {
  const safeReturn =
    returnTo && returnTo.startsWith("/") && !returnTo.startsWith("//")
      ? returnTo
      : null;
  const onboardHref = safeReturn
    ? `/onboard?from=${encodeURIComponent(safeReturn)}`
    : "/onboard";
  const returnHref = safeReturn
    ? `/return?from=${encodeURIComponent(safeReturn)}`
    : "/return";

  return (
    <main className="min-h-screen bg-gradient-to-b from-btf-sky-deep via-btf-sky-deep to-btf-sky text-white flex items-center justify-center px-6 py-10">
      {/* Soft gold glow behind the card */}
      <div
        className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-btf-gold/15 blur-3xl"
        aria-hidden
      />

      <div
        role="dialog"
        aria-labelledby="onboard-required-title"
        aria-describedby="onboard-required-body"
        className="relative max-w-md w-full rounded-3xl bg-btf-sky-deep border-2 border-btf-gold/40 shadow-2xl p-7 sm:p-9"
      >
        {/* Cross */}
        <div className="relative w-10 h-10 mx-auto mb-6" aria-hidden>
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-1.5 h-10 bg-btf-gold rounded-sm" />
          <div className="absolute left-1/2 top-2.5 -translate-x-1/2 w-7 h-1.5 bg-btf-gold rounded-sm" />
        </div>

        <p className="text-[10px] tracking-[0.28em] text-btf-gold-light uppercase font-semibold mb-3 text-center">
          One step first
        </p>
        <h1
          id="onboard-required-title"
          className="font-serif text-2xl sm:text-3xl font-light leading-tight text-center mb-3"
        >
          Set up your space before we begin.
        </h1>
        <p
          id="onboard-required-body"
          className="text-sm text-white/85 font-light leading-relaxed text-center mb-7"
        >
          Seven short questions, about two minutes. We don&rsquo;t ask for a
          name, an email, or a phone number — only what you&rsquo;ll need to
          find your way back. After that, the tools and the Catholic Path open
          up for you.
        </p>

        <Link
          href={onboardHref}
          className="block w-full bg-gradient-to-br from-btf-gold to-btf-gold-light text-btf-sky-deep font-medium text-center px-8 py-3.5 rounded-full shadow-lg shadow-btf-gold/30 hover:-translate-y-0.5 transition-transform mb-3"
        >
          Begin onboarding
        </Link>
        <Link
          href={returnHref}
          className="block w-full bg-white/10 border border-white/25 text-white/90 font-light text-center px-6 py-3 rounded-full backdrop-blur-sm hover:bg-white/20 transition-colors"
        >
          I already have a recovery code
        </Link>

        <p className="text-[11px] text-white/55 font-light text-center mt-6 leading-relaxed">
          If you&rsquo;re in crisis right now, the button at the bottom of every
          screen is for you — no sign-in needed.
        </p>
      </div>
    </main>
  );
}
