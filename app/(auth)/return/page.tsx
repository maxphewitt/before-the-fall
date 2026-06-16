"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { resumeSession } from "../../actions/resumeSession";

/**
 * /return — the returning-user entry point.
 *
 * Visitors who already have a 12-word recovery code paste it here.
 * On success the session cookie is set and we send them home.
 *
 * Visual language matches /onboard: off-white background, btf-sky-deep
 * headings, btf-gold eyebrow, btf-sky CTA. Crisis exit ramp comes from
 * the root layout, so we don't render it here directly.
 */
export default function ReturnPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lostOpen, setLostOpen] = useState(false);
  // "Keep me logged in on this device." Default on. When off, the
  // session cookie is dropped when the browser window closes, so a new
  // window lands back on the public home to log in again.
  const [keepLoggedIn, setKeepLoggedIn] = useState(true);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await resumeSession(code, keepLoggedIn);
      if (res.success) {
        // Straight into the platform. (A logged-in visitor hitting `/`
        // is soft-redirected here anyway; go direct to skip the hop.)
        router.push("/today");
        router.refresh();
      } else {
        setError(res.error);
      }
    } catch (err) {
      console.error(err);
      setError("Unexpected error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-btf-off-white px-6 py-10 sm:py-14">
      <div className="max-w-2xl mx-auto">
        <p className="text-[11px] tracking-[0.25em] text-btf-gold uppercase font-semibold mb-3">
          Returning
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-btf-sky-deep font-light leading-tight mb-4">
          Welcome back.
        </h1>
        <p className="text-btf-text-mid font-light leading-relaxed mb-8">
          Paste your twelve-word recovery code below. Lowercase, separated by
          spaces. We&rsquo;ll match it and bring you back to where you left off.
        </p>

        <form onSubmit={onSubmit}>
          <label
            htmlFor="recovery-code"
            className="block text-[10px] tracking-[0.25em] uppercase text-btf-text-light font-semibold mb-2"
          >
            Your recovery code
          </label>
          <textarea
            id="recovery-code"
            name="recovery-code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={submitting}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            rows={4}
            aria-describedby={error ? "recovery-code-error" : undefined}
            aria-invalid={error ? true : undefined}
            placeholder="twelve lowercase words separated by spaces"
            className="w-full rounded-2xl bg-white border-2 border-btf-sky-pale/60 focus:border-btf-sky focus:outline-none px-5 py-4 font-mono text-base sm:text-lg text-btf-sky-deep leading-relaxed tracking-wide resize-none shadow-sm transition-colors"
          />

          {error && (
            <div
              id="recovery-code-error"
              role="alert"
              className="mt-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm p-4"
            >
              {error}
            </div>
          )}

          {/* Keep-me-logged-in choice. Off = session-only cookie, so a new
              window lands back on the home page to log in again. */}
          <label className="mt-6 flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={keepLoggedIn}
              onChange={(e) => setKeepLoggedIn(e.target.checked)}
              disabled={submitting}
              className="mt-0.5 h-5 w-5 flex-shrink-0 rounded border-2 border-btf-sky-pale text-btf-sky focus:ring-btf-sky accent-btf-sky"
            />
            <span className="text-sm text-btf-text-mid font-light leading-relaxed">
              <span className="font-medium text-btf-sky-deep">
                Keep me logged in on this device.
              </span>
              <br />
              Leave this unchecked on a shared or borrowed device — you&rsquo;ll
              be signed out when you close the window and can log in again next
              time.
            </span>
          </label>

          <button
            type="submit"
            disabled={submitting || code.trim().length === 0}
            className="mt-6 w-full max-w-md mx-auto bg-gradient-to-br from-btf-sky to-btf-sky-deep text-white font-medium px-8 py-3.5 rounded-full shadow-lg disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-0.5 transition-transform block"
          >
            {submitting ? "Looking for you…" : "Continue"}
          </button>
        </form>

        {/* "Lost your code?" expandable explainer */}
        <div className="mt-10 border-t border-btf-text-light/15 pt-6">
          <button
            type="button"
            onClick={() => setLostOpen((o) => !o)}
            aria-expanded={lostOpen}
            aria-controls="lost-code-explainer"
            className="w-full text-left flex items-center justify-between gap-3 text-sm text-btf-sky-deep font-medium hover:text-btf-sky transition-colors"
          >
            <span>Lost your code?</span>
            <span aria-hidden className="text-btf-text-light text-lg">
              {lostOpen ? "−" : "+"}
            </span>
          </button>
          {lostOpen && (
            <div
              id="lost-code-explainer"
              className="mt-4 space-y-3 text-sm text-btf-text-mid font-light leading-relaxed"
            >
              <p>
                We can&rsquo;t recover a lost recovery code. We don&rsquo;t store
                the words themselves &mdash; only a one-way hash &mdash; and we
                don&rsquo;t hold any other identifier we could fall back on
                (no email, no phone, no name). That&rsquo;s the cost of keeping
                you anonymous.
              </p>
              <p>
                If your code is truly gone, the path forward is to{" "}
                <Link
                  href="/onboard"
                  className="text-btf-sky-deep underline underline-offset-2 hover:text-btf-sky"
                >
                  start fresh as a new user
                </Link>
                . You won&rsquo;t recover your previous saved progress, but
                you&rsquo;ll get a new code and the same tools.
              </p>
              <p>
                Before you do that &mdash; double-check the obvious places:
                your password manager (Apple Passwords, 1Password, Bitwarden),
                Notes on your phone, a screenshot in your photo library, or
                anywhere else you might have saved twelve words.
              </p>
            </div>
          )}
        </div>

        {/* Footer back-link */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="text-xs tracking-[0.25em] uppercase text-btf-text-light hover:text-btf-sky-deep transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
