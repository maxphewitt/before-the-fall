"use client";

import { useState } from "react";

/**
 * Client subcomponent for the beta gate form.
 *
 * Posts to /api/verify-code (the only POST middleware lets through
 * without a beta cookie) and, on success, does a hard navigate to
 * `redirectTo` (default `/`) so the new cookie is sent on the next page
 * load. On the create-account flow this is set to `/onboard`, so a
 * redeemed code drops the visitor straight into the questionnaire.
 *
 * Generic error messages on all failure paths — never tells an
 * attacker whether the format was wrong vs. the code was wrong vs.
 * the code was deactivated.
 */
export default function BetaGateForm({
  redirectTo = "/",
}: {
  redirectTo?: string;
}) {
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = (await res.json().catch(() => null)) as
        | { ok?: boolean; error?: string }
        | null;
      if (res.ok && data?.ok === true) {
        // Hard navigate so the cookie set by the API route is included
        // on the next request.
        window.location.href = redirectTo;
        return;
      }
      setError(data?.error ?? "Something went wrong. Try again.");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block">
        <span className="text-[11px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold mb-2 block">
          Access code
        </span>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          disabled={submitting}
          autoFocus
          autoComplete="off"
          spellCheck={false}
          inputMode="text"
          placeholder="three-words-here"
          aria-label="Beta access code"
          className="w-full rounded-2xl bg-white/10 border-2 border-white/25 focus:border-btf-gold focus:outline-none px-5 py-4 text-base text-white font-light leading-relaxed placeholder:text-white/40 placeholder:italic transition-colors font-mono tracking-wide"
        />
      </label>

      {error && (
        <div
          role="alert"
          className="rounded-xl bg-red-900/30 border border-red-400/30 text-red-100 text-sm p-4"
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting || code.trim().length === 0}
        className="w-full bg-btf-gold hover:bg-btf-gold-light text-btf-sky-deep font-medium px-8 py-3.5 rounded-full shadow-lg disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-0.5 transition-all"
      >
        {submitting ? "Checking…" : "Enter →"}
      </button>
    </form>
  );
}
