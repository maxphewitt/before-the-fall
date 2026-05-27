"use client";

import { useEffect, useState } from "react";

/**
 * Dismissible closed-beta banner.
 *
 * Sits at the top of /tools (and any other surface that wants it)
 * to set expectations without buying real estate forever. Once
 * dismissed, the choice persists in localStorage so testers don't
 * see it every visit.
 *
 * The localStorage key is versioned. If the disclaimer text changes
 * meaningfully — e.g., a different version label, a different
 * authority signing off the content — bump the version so previously
 * dismissed users see the new copy once.
 *
 * Note: this is NOT the safety/crisis disclaimer. That copy lives
 * inline and is never dismissible. This banner only conveys the
 * "we're in closed beta, content pending clinician sign-off" signal.
 */

const STORAGE_KEY = "btf_dismissed_disclaimer_v1";

function safeReadDismissed(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    // Private mode or localStorage unavailable — fail open, show banner.
    return false;
  }
}

export default function BetaDisclaimerBanner() {
  // `null` means we haven't read localStorage yet (SSR / first paint).
  // Once we know whether the user dismissed, this becomes a boolean.
  // Rendering nothing while null avoids a flash-of-banner before the
  // dismissed state is loaded.
  const [dismissed, setDismissed] = useState<boolean | null>(null);

  useEffect(() => {
    // Reading localStorage requires the client. Allowed exception to
    // the no-setState-in-effect rule because this state can only be
    // determined on the client.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDismissed(safeReadDismissed());
  }, []);

  function dismiss() {
    setDismissed(true);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Best effort. If storage is locked, banner will reappear next visit.
    }
  }

  if (dismissed === null || dismissed) return null;

  return (
    <div
      role="status"
      className="relative mb-8 overflow-hidden rounded-2xl border border-btf-gold/40 bg-gradient-to-r from-btf-sky-deep via-btf-sky-deep to-btf-sky text-white shadow-md"
    >
      {/* Soft gold glow behind the badge */}
      <div
        className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-btf-gold/30 blur-3xl pointer-events-none"
        aria-hidden
      />
      <div className="relative flex items-start gap-4 px-5 py-4 sm:px-6 sm:py-5">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] tracking-[0.28em] uppercase text-btf-gold-light font-semibold mb-1.5">
            Closed beta &middot; v1
          </p>
          <p className="text-sm text-white/90 font-light leading-relaxed">
            These exercises are pending sign-off by our clinical advisor before public launch. Read freely &mdash; just know we&rsquo;re still refining.
          </p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss closed-beta banner"
          className="shrink-0 rounded-full p-1.5 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <path
              d="M4 4L12 12M12 4L4 12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
