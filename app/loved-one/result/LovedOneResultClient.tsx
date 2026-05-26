"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

/**
 * Client subcomponent that renders the loved-one result screen:
 *   1. The referral code (copy to clipboard).
 *   2. The share link with the code embedded.
 *   3. Three CRAFT-informed resources for the CSO.
 *   4. External resources (988, SAMHSA family helpline, Al-Anon, etc.).
 *
 * The code itself lives in ?code= when we generated it server-side
 * and routed here with the plaintext in the URL. We also persist the
 * code to localStorage on first load so back-button / refresh still
 * finds it (otherwise the URL loses the query string and the page
 * shows "no code"). localStorage is acceptable here because the code
 * is the CSO's own data on their own device.
 */
const STORAGE_KEY = "btf:lovedOneCode";

function readStoredCode(): string {
  if (typeof window === "undefined") return "";
  try {
    return localStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

function writeStoredCode(code: string): void {
  if (typeof window === "undefined") return;
  try {
    if (code) localStorage.setItem(STORAGE_KEY, code);
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export default function LovedOneResultClient() {
  const searchParams = useSearchParams();
  const urlCode = searchParams.get("code") ?? "";
  // Lazy init: prefer URL code, fall back to localStorage. Persist
  // URL code to localStorage on first render via the initializer so
  // we survive back/refresh without a useEffect.
  const [code] = useState<string>(() => {
    const stored = readStoredCode();
    if (urlCode) {
      if (urlCode !== stored) writeStoredCode(urlCode);
      return urlCode;
    }
    return stored;
  });
  const [copied, setCopied] = useState<"code" | "link" | null>(null);
  const [origin] = useState<string>(() =>
    typeof window !== "undefined" ? window.location.origin : ""
  );

  const shareUrl = origin
    ? `${origin}/onboard?code=${encodeURIComponent(code)}`
    : "";

  async function copy(value: string, kind: "code" | "link") {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(kind);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.warn("Clipboard copy failed:", err);
    }
  }

  if (!code) {
    return (
      <main className="min-h-screen bg-btf-off-white px-6 py-14">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold font-semibold mb-3">
            Nothing to show yet
          </p>
          <h1 className="font-serif text-2xl text-btf-sky-deep font-light mb-4">
            Start the quiz to generate a referral code.
          </h1>
          <p className="text-btf-text-mid font-light leading-relaxed mb-6 text-sm">
            Once you complete the quiz, your code lives here on this device for 90 days. You can come back to copy it or read the resources any time.
          </p>
          <Link
            href="/loved-one/quiz"
            className="inline-block bg-gradient-to-br from-btf-sky to-btf-sky-deep text-white font-medium px-6 py-3 rounded-full shadow-lg hover:-translate-y-0.5 transition-transform"
          >
            Start the quiz &rarr;
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <section className="relative bg-gradient-to-b from-btf-sky-deep via-btf-sky-deep to-btf-sky text-white py-14 px-6 overflow-hidden">
        <div
          className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[500px] h-[400px] rounded-full bg-btf-gold/25 blur-3xl pointer-events-none"
          aria-hidden
        />
        <div className="relative max-w-2xl mx-auto text-center">
          <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold mb-3">
            Your referral code
          </p>
          <h1 className="font-serif text-3xl md:text-4xl font-light leading-tight mb-4">
            Here&rsquo;s the bridge.
          </h1>
          <p className="font-serif italic text-base md:text-lg text-white/85 font-light mb-8 max-w-md mx-auto">
            When they&rsquo;re ready, they enter this code at sign-up and the platform meets them where you said they are.
          </p>

          <div className="bg-white/10 border-2 border-btf-gold/40 rounded-2xl p-6 mb-4 backdrop-blur-sm">
            <p className="font-mono text-2xl sm:text-3xl text-btf-gold-light font-medium break-all select-all">
              {code}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <button
              type="button"
              onClick={() => copy(code, "code")}
              className="flex-1 bg-btf-gold hover:bg-btf-gold-light text-btf-sky-deep font-medium px-6 py-3 rounded-full shadow-lg transition-colors"
            >
              {copied === "code" ? "Copied ✓" : "Copy code"}
            </button>
            <button
              type="button"
              onClick={() => copy(shareUrl, "link")}
              className="flex-1 bg-white/10 hover:bg-white/15 text-white border border-white/25 font-medium px-6 py-3 rounded-full transition-colors"
            >
              {copied === "link" ? "Link copied ✓" : "Copy share link"}
            </button>
          </div>

          <p className="text-xs text-white/55 font-light mt-6 max-w-md mx-auto leading-relaxed">
            The code is valid for 90 days and works one time. We don&rsquo;t store it in plaintext — copy it before you leave this page.
          </p>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-6 py-10 sm:py-14">
        {/* Resources for the CSO */}
        <section className="mb-12">
          <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold font-semibold mb-3">
            For you
          </p>
          <h2 className="font-serif text-2xl text-btf-sky-deep font-light mb-2">
            Three short reads.
          </h2>
          <p className="text-btf-text-mid font-light leading-relaxed mb-6 text-sm">
            Grounded in CRAFT (Community Reinforcement and Family Training, Meyers et al.) — the protocol with the strongest peer-reviewed evidence for helping a CSO actually engage their loved one in care.
          </p>

          <ul className="space-y-3">
            <li>
              <Link
                href="/loved-one/resources/first-conversation"
                className="block rounded-2xl bg-white border-2 border-btf-sky-pale/60 hover:border-btf-sky-light hover:shadow-md p-5 transition-all"
              >
                <p className="font-medium text-btf-sky-deep mb-1">
                  How to have the first conversation
                </p>
                <p className="text-sm text-btf-text-mid font-light leading-relaxed">
                  Timing, opening lines, what to listen for, and what to NOT say. About 3 minutes.
                </p>
              </Link>
            </li>
            <li>
              <Link
                href="/loved-one/resources/what-not-to-say"
                className="block rounded-2xl bg-white border-2 border-btf-sky-pale/60 hover:border-btf-sky-light hover:shadow-md p-5 transition-all"
              >
                <p className="font-medium text-btf-sky-deep mb-1">
                  What not to say
                </p>
                <p className="text-sm text-btf-text-mid font-light leading-relaxed">
                  The well-meaning phrases that close the conversation, and what to say instead. About 2 minutes.
                </p>
              </Link>
            </li>
            <li>
              <Link
                href="/loved-one/resources/caring-for-yourself"
                className="block rounded-2xl bg-white border-2 border-btf-sky-pale/60 hover:border-btf-sky-light hover:shadow-md p-5 transition-all"
              >
                <p className="font-medium text-btf-sky-deep mb-1">
                  Caring for yourself while you wait
                </p>
                <p className="text-sm text-btf-text-mid font-light leading-relaxed">
                  CSO burnout is real and clinically documented. What helps. About 3 minutes.
                </p>
              </Link>
            </li>
          </ul>
        </section>

        {/* External resources for the CSO */}
        <section className="mb-12">
          <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold font-semibold mb-3">
            For ongoing support
          </p>
          <h2 className="font-serif text-2xl text-btf-sky-deep font-light mb-4">
            People you can talk to.
          </h2>
          <ul className="space-y-3">
            <li className="rounded-2xl bg-white border border-btf-sky-pale/60 p-4">
              <p className="text-[10px] tracking-[0.2em] uppercase text-btf-text-light font-semibold mb-1">
                SAMHSA National Helpline
              </p>
              <a
                href="tel:18006624357"
                className="font-serif text-base text-btf-sky-deep underline underline-offset-4"
              >
                1-800-662-4357
              </a>
              <p className="text-xs text-btf-text-mid font-light leading-relaxed mt-1">
                Free, confidential, 24/7. Referrals for substance use AND mental-health treatment, with a track for family members.
              </p>
            </li>
            <li className="rounded-2xl bg-white border border-btf-sky-pale/60 p-4">
              <p className="text-[10px] tracking-[0.2em] uppercase text-btf-text-light font-semibold mb-1">
                Al-Anon
              </p>
              <a
                href="https://al-anon.org"
                target="_blank"
                rel="noopener noreferrer"
                className="font-serif text-base text-btf-sky-deep underline underline-offset-4"
              >
                al-anon.org
              </a>
              <p className="text-xs text-btf-text-mid font-light leading-relaxed mt-1">
                Group support for friends and family of people with addiction. Faith-friendly (12-step has spiritual roots) without being religious.
              </p>
            </li>
            <li className="rounded-2xl bg-white border border-btf-sky-pale/60 p-4">
              <p className="text-[10px] tracking-[0.2em] uppercase text-btf-text-light font-semibold mb-1">
                SMART Recovery Family &amp; Friends
              </p>
              <a
                href="https://www.smartrecovery.org/family"
                target="_blank"
                rel="noopener noreferrer"
                className="font-serif text-base text-btf-sky-deep underline underline-offset-4"
              >
                smartrecovery.org/family
              </a>
              <p className="text-xs text-btf-text-mid font-light leading-relaxed mt-1">
                Built directly on the CRAFT clinical model. Secular, evidence-based, online meetings.
              </p>
            </li>
            <li className="rounded-2xl bg-white border border-btf-sky-pale/60 p-4">
              <p className="text-[10px] tracking-[0.2em] uppercase text-btf-text-light font-semibold mb-1">
                Catholic Charities (your diocese)
              </p>
              <a
                href="https://catholiccharitiesusa.org"
                target="_blank"
                rel="noopener noreferrer"
                className="font-serif text-base text-btf-sky-deep underline underline-offset-4"
              >
                catholiccharitiesusa.org
              </a>
              <p className="text-xs text-btf-text-mid font-light leading-relaxed mt-1">
                Most dioceses have counseling and family-support services. Sliding-scale fees; faith-rooted clinical care.
              </p>
            </li>
          </ul>
        </section>

        <div className="rounded-xl bg-btf-gold-pale/40 border border-btf-gold/30 text-btf-text-mid text-xs font-light p-4 leading-relaxed text-center">
          <span className="font-medium text-btf-sky-deep">
            One more thing:
          </span>{" "}
          you can&rsquo;t fix this for them. But what you&rsquo;re doing right now &mdash; showing up, learning the right way to help &mdash; is the single most evidence-supported thing you can do.
        </div>

        {/* Return home + forget code */}
        <div className="mt-10 flex flex-col items-center gap-4">
          <Link
            href="/"
            className="text-btf-text-light hover:text-btf-sky-deep text-sm inline-flex items-center gap-2 transition-colors uppercase tracking-[0.25em]"
          >
            <span aria-hidden>&larr;</span> Back to home
          </Link>
          <button
            type="button"
            onClick={() => {
              writeStoredCode("");
              window.location.href = "/";
            }}
            className="text-xs text-btf-text-light/80 hover:text-btf-text-mid underline underline-offset-4"
          >
            Forget this code on this device
          </button>
        </div>
      </div>
    </main>
  );
}
