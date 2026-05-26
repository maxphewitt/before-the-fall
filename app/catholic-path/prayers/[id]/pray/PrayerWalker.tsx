"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createEntry } from "../../../../actions/journal";
import { recordHabitCompletionForCurrentUser } from "../../../../actions/habits";

/**
 * Guided line-by-line walker for a single prayer.
 *
 * Flow:
 *   - One line per screen, large serif type centered.
 *   - Tap "Next" (or press Right/Space) to advance.
 *   - At the end: optional intention text field. Save creates a
 *     journal entry with journal_type='intention'. Skip exits to
 *     /catholic-path/prayers.
 *
 * Lightweight by design — this is the mode for actually praying, not
 * for reading. The detail page is for reading.
 */

export default function PrayerWalker({
  prayerId,
  title,
  lines,
  author,
}: {
  prayerId: string;
  title: string;
  lines: string[];
  author: string;
}) {
  const router = useRouter();
  const [stepIdx, setStepIdx] = useState(0); // 0..lines.length-1 = lines; lines.length = intention; lines.length+1 = closing
  const [intention, setIntention] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [authBlocked, setAuthBlocked] = useState(false);

  const totalLines = lines.length;
  const isLine = stepIdx < totalLines;
  const isIntention = stepIdx === totalLines;
  const isClosing = stepIdx === totalLines + 1;

  // Record habit completion exactly once when the user reaches the
  // closing screen. The intention save (if any) is handled separately;
  // this fires regardless so the habit counts as done whether or not
  // the user wrote anything.
  const completionFired = useRef(false);
  useEffect(() => {
    if (isClosing && !completionFired.current) {
      completionFired.current = true;
      recordHabitCompletionForCurrentUser("prayer").catch(() => {
        /* swallow — best-effort */
      });
    }
  }, [isClosing]);

  async function onSaveIntention() {
    if (submitting) return;
    const text = intention.trim();
    if (text.length === 0) {
      // Skip-style — just exit.
      setStepIdx(totalLines + 1);
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await createEntry(
        `Intention after praying ${title}:\n\n${text}`,
        "intention"
      );
      if (res.success) {
        setSaved(true);
        setStepIdx(totalLines + 1);
      } else {
        // The createEntry "not signed in" error has friendly copy already;
        // surface a softer affordance instead of red error styling.
        const NOT_SIGNED_IN_MARKER = "not signed in";
        if (res.error.toLowerCase().includes(NOT_SIGNED_IN_MARKER)) {
          setAuthBlocked(true);
        } else {
          setError(res.error);
        }
      }
    } catch (err) {
      console.error(err);
      setError("Unexpected error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  /* ─── Line screen ─── */
  if (isLine) {
    const line = lines[stepIdx];
    const isLast = stepIdx === totalLines - 1;
    return (
      <main className="min-h-screen bg-gradient-to-b from-btf-sky-deep via-btf-sky-deep to-btf-sky text-white">
        <div className="max-w-xl mx-auto px-6 py-8 sm:py-12 min-h-screen flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <Link
              href={`/catholic-path/prayers/${prayerId}`}
              className="text-white/60 hover:text-white text-xs inline-flex items-center gap-2 transition-colors uppercase tracking-[0.25em]"
            >
              <span aria-hidden>&larr;</span> Exit
            </Link>
            <p className="text-[10px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold">
              {title}
            </p>
          </div>

          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={totalLines}
            aria-valuenow={stepIdx + 1}
            aria-label="Prayer progress"
            className="w-full h-1 bg-white/10 rounded-full overflow-hidden mb-12"
          >
            <div
              className="h-full bg-btf-gold transition-all duration-500"
              style={{ width: `${Math.round(((stepIdx + 1) / totalLines) * 100)}%` }}
            />
          </div>

          <div className="flex-1 flex items-center justify-center">
            <p className="font-serif text-2xl sm:text-3xl text-white font-light leading-relaxed text-center max-w-lg">
              {line}
            </p>
          </div>

          <div className="mt-12 flex gap-3">
            {stepIdx > 0 && (
              <button
                type="button"
                onClick={() => setStepIdx(stepIdx - 1)}
                className="flex-1 bg-white/10 hover:bg-white/15 text-white border border-white/20 hover:border-white/30 font-medium px-6 py-3.5 rounded-full transition-all"
              >
                ← Back
              </button>
            )}
            <button
              type="button"
              onClick={() => setStepIdx(stepIdx + 1)}
              className="flex-[2] bg-btf-gold hover:bg-btf-gold-light text-btf-sky-deep font-medium px-8 py-3.5 rounded-full shadow-lg hover:-translate-y-0.5 transition-all"
            >
              {isLast ? "Amen →" : "Next →"}
            </button>
          </div>

          <p className="text-[10px] tracking-[0.25em] uppercase text-white/40 font-semibold text-center mt-6">
            Line {stepIdx + 1} of {totalLines}
          </p>
        </div>
      </main>
    );
  }

  /* ─── Intention step ─── */
  if (isIntention) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-btf-sky-deep via-btf-sky-deep to-btf-sky text-white">
        <div className="max-w-xl mx-auto px-6 py-8 sm:py-12 min-h-screen flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <Link
              href={`/catholic-path/prayers/${prayerId}`}
              className="text-white/60 hover:text-white text-xs inline-flex items-center gap-2 transition-colors uppercase tracking-[0.25em]"
            >
              <span aria-hidden>&larr;</span> Exit
            </Link>
            <p className="text-[10px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold">
              {title}
            </p>
          </div>

          <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold mb-3 text-center">
            Optional
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl text-white font-light leading-tight mb-3 text-center">
            Anything you want to name?
          </h2>
          <p className="text-white/75 font-light leading-relaxed mb-6 text-center text-sm">
            A person, a fear, a hope &mdash; whatever you carried into this prayer. Saved as an Intention in your journal, encrypted.
          </p>

          <textarea
            value={intention}
            onChange={(e) => setIntention(e.target.value)}
            disabled={submitting}
            rows={6}
            placeholder="Optional…"
            aria-label="Optional intention to save with this prayer"
            className="w-full rounded-2xl bg-white/10 border-2 border-white/20 focus:border-btf-gold focus:outline-none px-5 py-4 text-base text-white font-light leading-relaxed resize-y placeholder:text-white/40 placeholder:italic transition-colors"
          />

          {error && (
            <div
              role="alert"
              className="mt-4 rounded-xl bg-red-900/30 border border-red-400/30 text-red-100 text-sm p-4"
            >
              {error}
            </div>
          )}

          {authBlocked && (
            <div
              role="alert"
              className="mt-4 rounded-xl bg-white/10 border border-white/20 text-white/85 text-sm p-4 leading-relaxed"
            >
              Saving an intention requires a signed-in account. <Link href="/return" className="underline underline-offset-4 text-btf-gold-light">Paste your recovery code</Link> to sign in, then come back here.
            </div>
          )}

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => setStepIdx(totalLines + 1)}
              disabled={submitting}
              className="flex-1 bg-white/10 hover:bg-white/15 text-white border border-white/20 hover:border-white/30 font-medium px-6 py-3.5 rounded-full transition-all"
            >
              Skip
            </button>
            <button
              type="button"
              onClick={onSaveIntention}
              disabled={submitting}
              className="flex-1 bg-btf-gold hover:bg-btf-gold-light text-btf-sky-deep font-medium px-8 py-3.5 rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 transition-all"
            >
              {submitting ? "Saving…" : intention.trim() ? "Save to journal →" : "Continue →"}
            </button>
          </div>
        </div>
      </main>
    );
  }

  /* ─── Closing screen ─── */
  if (isClosing) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-btf-sky-deep via-btf-sky-deep to-btf-sky text-white">
        <div className="max-w-xl mx-auto px-6 py-8 sm:py-12 min-h-screen flex flex-col">
          <div className="flex items-center justify-between mb-12">
            <Link
              href="/catholic-path/prayers"
              className="text-white/60 hover:text-white text-xs inline-flex items-center gap-2 transition-colors uppercase tracking-[0.25em]"
            >
              <span aria-hidden>&larr;</span> Library
            </Link>
            <p className="text-[10px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold">
              {title}
            </p>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold mb-3">
              Amen
            </p>
            <h1 className="font-serif text-3xl md:text-4xl text-white font-light leading-tight mb-4 max-w-md">
              You prayed it.
            </h1>
            <p className="font-serif italic text-base text-white/85 font-light leading-relaxed mb-2 max-w-md">
              {saved
                ? "Your intention is saved in your journal. The prayer is held; the rest is in His hands."
                : "The prayer is held; the rest is in His hands."}
            </p>
            <p className="text-xs text-white/55 font-light mt-6 max-w-sm">
              {author}
            </p>
          </div>

          <div className="space-y-3 mt-12">
            <button
              type="button"
              onClick={() => {
                setStepIdx(0);
                setIntention("");
                setSaved(false);
                setError(null);
                setAuthBlocked(false);
              }}
              className="w-full bg-white/10 hover:bg-white/15 text-white border border-white/20 hover:border-white/30 font-medium px-6 py-3.5 rounded-full transition-all"
            >
              Pray it again
            </button>
            <button
              type="button"
              onClick={() => router.push("/catholic-path/prayers")}
              className="w-full bg-btf-gold hover:bg-btf-gold-light text-btf-sky-deep font-medium px-8 py-3.5 rounded-full shadow-lg hover:-translate-y-0.5 transition-all"
            >
              Back to the library
            </button>
          </div>
        </div>
      </main>
    );
  }

  return null;
}
