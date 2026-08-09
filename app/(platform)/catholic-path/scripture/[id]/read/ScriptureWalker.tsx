"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BackLink from "../../../../_nav/BackLink";
import { createEntry } from "../../../../../actions/journal";
import { recordHabitCompletionForCurrentUser } from "../../../../../actions/habits";

/**
 * Verse-by-verse scripture walker.
 *
 * Flow:
 *   - One verse per screen with verse number badge and large serif type.
 *   - Forward/back nav, progress bar.
 *   - After the last verse, the closing sequence (every completion,
 *     from any entry point):
 *       1. "Going deeper" — the passage's `deeper` study paragraph,
 *          only when present.
 *       2. Reflection prompt + open text field. Save writes a journal
 *          entry (journal_type='reflection'). Skip exits.
 *       3. Closing screen with a "Continue in the Bible" card (when
 *          the citation resolved to a reader chapter), plus "Read it
 *          again" and "Back to library" options.
 */
export default function ScriptureWalker({
  passageId,
  title,
  citation,
  translation,
  verses,
  reflectionPrompt,
  deeper,
  bibleLink,
}: {
  passageId: string;
  title: string;
  citation: string;
  translation: string;
  verses: { number: string; text: string }[];
  reflectionPrompt: string;
  /** Optional "Going deeper" paragraph (ScripturePassage.deeper). */
  deeper?: string | null;
  /** Precomputed by the server page via bibleLinkForCitation(). */
  bibleLink?: { href: string; label: string } | null;
}) {
  const router = useRouter();
  const totalVerses = verses.length;
  // 0..totalVerses-1 = verses; then (when `deeper` exists) the Going
  // deeper step; then reflection; then closing.
  const [stepIdx, setStepIdx] = useState(0);
  const [reflection, setReflection] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [authBlocked, setAuthBlocked] = useState(false);

  const hasDeeper = typeof deeper === "string" && deeper.trim().length > 0;
  const reflectionIdx = totalVerses + (hasDeeper ? 1 : 0);
  const closingIdx = reflectionIdx + 1;

  const isVerse = stepIdx < totalVerses;
  const isDeeper = hasDeeper && stepIdx === totalVerses;
  const isReflection = stepIdx === reflectionIdx;
  const isClosing = stepIdx === closingIdx;

  // Record habit completion exactly once when the user reaches the
  // closing screen. Reflection save (if any) is handled separately.
  const completionFired = useRef(false);
  useEffect(() => {
    if (isClosing && !completionFired.current) {
      completionFired.current = true;
      recordHabitCompletionForCurrentUser("scripture").catch(() => {
        /* swallow — best-effort */
      });
    }
  }, [isClosing]);

  async function onSaveReflection() {
    if (submitting) return;
    const text = reflection.trim();
    if (text.length === 0) {
      setStepIdx(closingIdx);
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const body =
        `Reflection on ${title} (${citation}):\n\n` +
        `Prompt: ${reflectionPrompt}\n\n` +
        text;
      const res = await createEntry(body, "reflection");
      if (res.success) {
        setSaved(true);
        setStepIdx(closingIdx);
      } else {
        if (res.error.toLowerCase().includes("not signed in")) {
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

  /* ─── Verse screen ─── */
  if (isVerse) {
    const verse = verses[stepIdx];
    const isLast = stepIdx === totalVerses - 1;
    return (
      <main className="min-h-screen bg-gradient-to-b from-btf-deep-night via-btf-sky-deep to-btf-sky text-white">
        <div className="max-w-xl mx-auto px-6 py-8 sm:py-12 min-h-screen flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <BackLink
              fallbackHref={`/catholic-path/scripture/${passageId}`}
              label="Exit"
              className="text-white/60 hover:text-white text-xs inline-flex items-center gap-2 transition-colors uppercase tracking-[0.25em]"
            />
            <p className="text-[10px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold">
              {title}
            </p>
          </div>

          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={totalVerses}
            aria-valuenow={stepIdx + 1}
            aria-label="Reading progress"
            className="w-full h-1 bg-white/10 rounded-full overflow-hidden mb-12"
          >
            <div
              className="h-full bg-btf-gold transition-all duration-500"
              style={{
                width: `${Math.round(((stepIdx + 1) / totalVerses) * 100)}%`,
              }}
            />
          </div>

          <div className="flex-1 flex items-center justify-center">
            <div className="max-w-lg">
              <p className="text-center mb-4">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-btf-gold/20 text-btf-gold-light font-serif text-base">
                  {verse.number}
                </span>
              </p>
              <p className="font-serif text-xl sm:text-2xl text-white font-light leading-relaxed text-center">
                {verse.text}
              </p>
            </div>
          </div>

          <div className="mt-12 flex gap-3">
            {stepIdx > 0 && (
              <button
                type="button"
                onClick={() => setStepIdx(stepIdx - 1)}
                className="flex-1 bg-white/10 hover:bg-white/15 text-white border border-white/20 hover:border-white/30 font-medium px-6 py-3.5 rounded-full transition-all"
              >
                &larr; Back
              </button>
            )}
            <button
              type="button"
              onClick={() => setStepIdx(stepIdx + 1)}
              className="flex-[2] bg-btf-gold hover:bg-btf-gold-light text-btf-sky-deep font-medium px-8 py-3.5 rounded-full shadow-lg hover:-translate-y-0.5 transition-all"
            >
              {isLast ? (hasDeeper ? "Go deeper →" : "Reflect →") : "Next →"}
            </button>
          </div>

          <p className="text-[10px] tracking-[0.25em] uppercase text-white/40 font-semibold text-center mt-6">
            Verse {stepIdx + 1} of {totalVerses} &middot; {citation} &middot; {translation}
          </p>
        </div>
      </main>
    );
  }

  /* ─── Going deeper step ─── */
  if (isDeeper) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-btf-deep-night via-btf-sky-deep to-btf-sky text-white">
        <div className="max-w-xl mx-auto px-6 py-8 sm:py-12 min-h-screen flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <BackLink
              fallbackHref={`/catholic-path/scripture/${passageId}`}
              label="Exit"
              className="text-white/60 hover:text-white text-xs inline-flex items-center gap-2 transition-colors uppercase tracking-[0.25em]"
            />
            <p className="text-[10px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold">
              {title}
            </p>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <div className="max-w-lg w-full">
              <div className="rounded-2xl bg-white/10 border border-white/20 p-6">
                <p className="text-[10px] tracking-[0.25em] uppercase text-btf-gold-light font-semibold mb-3">
                  Going deeper
                </p>
                <p className="text-[15px] text-white/90 font-light leading-relaxed">
                  {deeper}
                </p>
              </div>
              <p className="text-[10px] tracking-[0.25em] uppercase text-white/40 font-semibold text-center mt-5">
                {citation} &middot; {translation}
              </p>
            </div>
          </div>

          <div className="mt-12 flex gap-3">
            <button
              type="button"
              onClick={() => setStepIdx(totalVerses - 1)}
              className="flex-1 bg-white/10 hover:bg-white/15 text-white border border-white/20 hover:border-white/30 font-medium px-6 py-3.5 rounded-full transition-all"
            >
              &larr; Back
            </button>
            <button
              type="button"
              onClick={() => setStepIdx(reflectionIdx)}
              className="flex-[2] bg-btf-gold hover:bg-btf-gold-light text-btf-sky-deep font-medium px-8 py-3.5 rounded-full shadow-lg hover:-translate-y-0.5 transition-all"
            >
              Reflect →
            </button>
          </div>
        </div>
      </main>
    );
  }

  /* ─── Reflection step ─── */
  if (isReflection) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-btf-deep-night via-btf-sky-deep to-btf-sky text-white">
        <div className="max-w-xl mx-auto px-6 py-8 sm:py-12 min-h-screen flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <BackLink
              fallbackHref={`/catholic-path/scripture/${passageId}`}
              label="Exit"
              className="text-white/60 hover:text-white text-xs inline-flex items-center gap-2 transition-colors uppercase tracking-[0.25em]"
            />
            <p className="text-[10px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold">
              {title}
            </p>
          </div>

          <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold mb-3 text-center">
            Reflect
          </p>
          <h2 className="font-serif text-xl sm:text-2xl text-white font-light leading-tight mb-3 text-center italic">
            {reflectionPrompt}
          </h2>
          <p className="text-white/65 font-light leading-relaxed mb-6 text-center text-xs">
            Optional. Whatever rises. Saved as a Reflection in your journal, encrypted.
          </p>

          <textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            disabled={submitting}
            rows={8}
            placeholder="Optional…"
            aria-label="Reflection on this passage"
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
              Saving a reflection requires a signed-in account.{" "}
              <Link
                href="/return"
                className="underline underline-offset-4 text-btf-gold-light"
              >
                Paste your recovery code
              </Link>{" "}
              to sign in, then come back.
            </div>
          )}

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => setStepIdx(closingIdx)}
              disabled={submitting}
              className="flex-1 bg-white/10 hover:bg-white/15 text-white border border-white/20 hover:border-white/30 font-medium px-6 py-3.5 rounded-full transition-all"
            >
              Skip
            </button>
            <button
              type="button"
              onClick={onSaveReflection}
              disabled={submitting}
              className="flex-1 bg-btf-gold hover:bg-btf-gold-light text-btf-sky-deep font-medium px-8 py-3.5 rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 transition-all"
            >
              {submitting
                ? "Saving…"
                : reflection.trim()
                  ? "Save to journal →"
                  : "Continue →"}
            </button>
          </div>
        </div>
      </main>
    );
  }

  /* ─── Closing screen ─── */
  if (isClosing) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-btf-deep-night via-btf-sky-deep to-btf-sky text-white">
        <div className="max-w-xl mx-auto px-6 py-8 sm:py-12 min-h-screen flex flex-col">
          <div className="flex items-center justify-between mb-12">
            <BackLink
              fallbackHref="/catholic-path/scripture"
              label="Library"
              className="text-white/60 hover:text-white text-xs inline-flex items-center gap-2 transition-colors uppercase tracking-[0.25em]"
            />
            <p className="text-[10px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold">
              {title}
            </p>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold mb-3">
              The Word
            </p>
            <h1 className="font-serif text-3xl md:text-4xl text-white font-light leading-tight mb-4 max-w-md">
              You sat with it.
            </h1>
            <p className="font-serif italic text-base text-white/85 font-light leading-relaxed mb-2 max-w-md">
              {saved
                ? "Your reflection is in your journal. The Word is doing its work — even when nothing felt different."
                : "The Word is doing its work — even when nothing felt different."}
            </p>
            <p className="text-xs text-white/55 font-light mt-6 max-w-sm">
              {citation} &middot; {translation}
            </p>
          </div>

          <div className="space-y-3 mt-12">
            {bibleLink && (
              <Link
                href={bibleLink.href}
                className="block w-full rounded-2xl bg-white/10 border border-white/20 hover:border-btf-gold/50 px-5 py-4 transition-colors"
              >
                <span className="block text-[10px] tracking-[0.25em] uppercase text-btf-gold-light font-semibold">
                  Continue in the Bible
                </span>
                <span className="block text-white/90 font-medium mt-1">
                  Keep reading — {bibleLink.label} →
                </span>
              </Link>
            )}
            <button
              type="button"
              onClick={() => {
                setStepIdx(0);
                setReflection("");
                setSaved(false);
                setError(null);
                setAuthBlocked(false);
              }}
              className="w-full bg-white/10 hover:bg-white/15 text-white border border-white/20 hover:border-white/30 font-medium px-6 py-3.5 rounded-full transition-all"
            >
              Read it again
            </button>
            <button
              type="button"
              onClick={() => router.push("/catholic-path/scripture")}
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
