"use client";

import { useEffect, useState } from "react";

/**
 * Client-only component that:
 *   1. Registers /sw.js as the service worker on first mount.
 *   2. Listens for the `beforeinstallprompt` event (Chrome/Android) and
 *      surfaces a discreet "Install" button so users can save Before
 *      the Fall to their home screen.
 *
 * iOS doesn't fire beforeinstallprompt — Safari users install via the
 * Share menu manually. We show a one-time hint banner on iOS too.
 *
 * Renders nothing in normal state. Only renders when an install
 * affordance is available AND the user hasn't already installed.
 */

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const INSTALL_DISMISSED_KEY = "btf:install-dismissed";

// Lazy initializers — run once on first render. Safe to touch
// window/localStorage here because the file is "use client" and these
// initializers only execute in the browser. SSR returns false from the
// typeof guard.
function readDismissed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(INSTALL_DISMISSED_KEY) === "true";
  } catch {
    return false;
  }
}

function detectIosSafari(): boolean {
  if (typeof window === "undefined") return false;
  const ua = window.navigator.userAgent;
  const isIos =
    /iPad|iPhone|iPod/.test(ua) &&
    !(window as unknown as { MSStream?: unknown }).MSStream;
  const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
  // Don't surface the hint if already running standalone.
  const isStandalone =
    window.matchMedia &&
    window.matchMedia("(display-mode: standalone)").matches;
  const isIosStandalone =
    (window.navigator as Navigator & { standalone?: boolean }).standalone ===
    true;
  return isIos && isSafari && !isStandalone && !isIosStandalone;
}

export default function PWARegister() {
  const [installEvent, setInstallEvent] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showIosHint] = useState<boolean>(detectIosSafari);
  const [dismissed, setDismissed] = useState<boolean>(readDismissed);

  useEffect(() => {
    // Register the service worker. Failures are non-fatal — the app
    // works fine without it, just no offline support.
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch((err) => {
        console.warn("SW registration failed (non-fatal):", err);
      });
    }

    // Don't subscribe to install prompts if we're already installed.
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone ===
        true;
    if (isStandalone) return;

    // Chrome/Android install prompt. The setState inside this event
    // handler is allowed — only setState in the effect body itself
    // trips react-hooks/set-state-in-effect.
    function onBeforeInstallPrompt(e: Event) {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
    }
    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    };
  }, []);

  function onDismiss() {
    setDismissed(true);
    try {
      localStorage.setItem(INSTALL_DISMISSED_KEY, "true");
    } catch {
      // ignore
    }
  }

  async function onInstall() {
    if (!installEvent) return;
    try {
      await installEvent.prompt();
      const choice = await installEvent.userChoice;
      if (choice.outcome === "accepted") {
        setInstallEvent(null);
      } else {
        onDismiss();
      }
    } catch (err) {
      console.warn("Install prompt failed:", err);
    }
  }

  if (dismissed) return null;
  if (!installEvent && !showIosHint) return null;

  // Chrome/Android — native install prompt available.
  if (installEvent) {
    return (
      <div
        role="region"
        aria-label="Install Before the Fall"
        className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-5 sm:w-80 z-30 bg-btf-sky-deep text-white rounded-2xl shadow-2xl border border-btf-gold/30 px-5 py-4"
      >
        <p className="text-[10px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold mb-1">
          Save this app
        </p>
        <p className="text-sm text-white/85 font-light leading-relaxed mb-3">
          Install Before the Fall on your home screen so you can reach it without a browser.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onInstall}
            className="flex-1 bg-btf-gold hover:bg-btf-gold-light text-btf-sky-deep font-medium text-sm px-4 py-2 rounded-full transition-colors"
          >
            Install
          </button>
          <button
            type="button"
            onClick={onDismiss}
            className="text-white/70 hover:text-white text-sm px-3 py-2 transition-colors"
          >
            Not now
          </button>
        </div>
      </div>
    );
  }

  // iOS — Safari requires manual install via Share → Add to Home Screen.
  return (
    <div
      role="region"
      aria-label="Install Before the Fall on iOS"
      className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-5 sm:w-80 z-30 bg-btf-sky-deep text-white rounded-2xl shadow-2xl border border-btf-gold/30 px-5 py-4"
    >
      <p className="text-[10px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold mb-1">
        Save this app
      </p>
      <p className="text-sm text-white/85 font-light leading-relaxed mb-3">
        Tap <span aria-hidden>&#x1f5d2;&#xfe0f;</span> at the bottom of Safari, then &ldquo;Add to Home Screen&rdquo;.
      </p>
      <button
        type="button"
        onClick={onDismiss}
        className="text-white/70 hover:text-white text-xs underline underline-offset-4"
      >
        Don&rsquo;t show this again
      </button>
    </div>
  );
}
