"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Exercise } from "../../../lib/tools";
import { createToolSession } from "../../../actions/journal";

/**
 * Interactive step-by-step walker for a Tier 1 self-help exercise.
 *
 * Flow:
 *   1. Intro screen — frames the exercise and asks for consent to start.
 *   2. One screen per instruction step. Heading + body are read-only;
 *      a textarea below captures the user's note for THIS step.
 *      "Back" and "Next" buttons (or "Skip note" / "Save & next") move
 *      between steps. State is held entirely in component state — nothing
 *      is persisted until the user explicitly Saves at the end.
 *   3. Final screen — optional reflection field + Save button. Saving
 *      calls createToolSession() which writes an encrypted Activity
 *      journal entry with the structured payload. On success, route to
 *      /journal so the user sees their session in the Activity Journals
 *      group.
 *
 * Read-only after save — activity entries can be deleted but not edited.
 */
export default function ToolWalker({ exercise }: { exercise: Exercise }) {
  const router = useRouter();

  // -1 = intro; 0..N-1 = step index; N = reflection / save
  const [stepIdx, setStepIdx] = useState<number>(-1);

  // Per-step user notes (parallel array to exercise.instructions).
  const [answers, setAnswers] = useState<string[]>(
    () => exercise.instructions.map(() => "")
  );
  const [summary, setSummary] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalSteps = exercise.instructions.length;
  const isIntro = stepIdx === -1;
  const isReflection = stepIdx === totalSteps;
  const isStep = !isIntro && !isReflection;

  function updateAnswer(i: number, value: string) {
    setAnswers((prev) => {
      const next = [...prev];
      next[i] = value;
      return next;
    });
  }

  async function onSave() {
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await createToolSession({
        toolSlug: exercise.slug,
        toolName: exercise.name,
        steps: exercise.instructions.map((s, i) => ({
          heading: s.heading ?? `Step ${i + 1}`,
          prompt: s.body,
          userAnswer: answers[i] ?? "",
        })),
        summary,
      });
      if (res.success) {
        router.push("/journal");
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

  /* ─────────── INTRO ─────────── */
  if (isIntro) {
    return (
      <Shell exercise={exercise} progress={null}>
        <p className="text-[11px] tracking-[0.25em] text-btf-gold uppercase font-semibold mb-3">
          Self-help walker
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-btf-sky-deep font-light leading-tight mb-3">
          {exercise.name}
        </h1>
        <p className="font-serif italic text-lg text-btf-text-mid font-light leading-relaxed mb-8">
          {exercise.tagline}
        </p>

        <div className="rounded-2xl bg-white border border-btf-sky-pale p-6 mb-5">
          <p className="text-[10px] tracking-[0.2em] uppercase text-btf-sky font-semibold mb-2">
            How this works
          </p>
          <p className="text-btf-text-mid font-light leading-relaxed text-sm">
            I&rsquo;ll walk you through {totalSteps} steps. Each one has a
            short prompt and a place to write whatever you&rsquo;re
            noticing. When you&rsquo;re done, I&rsquo;ll save it as an
            Activity entry in your journal &mdash; encrypted, read-only
            after save, and grouped with your other {exercise.name}{" "}
            sessions.
          </p>
          {exercise.estimatedTime && (
            <p className="text-xs text-btf-text-light font-light mt-3">
              <span className="uppercase tracking-widest">Time:</span>{" "}
              {exercise.estimatedTime}
            </p>
          )}
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => setStepIdx(0)}
            className="flex-1 bg-gradient-to-br from-btf-sky to-btf-sky-deep text-white font-medium px-8 py-3.5 rounded-full shadow-lg hover:-translate-y-0.5 transition-transform"
          >
            Start →
          </button>
          <Link
            href={`/tools/${exercise.slug}`}
            className="flex-1 flex items-center justify-center bg-white border-2 border-btf-text-light/30 text-btf-text-mid font-medium px-8 py-3.5 rounded-full hover:bg-btf-off-white transition-colors"
          >
            Cancel
          </Link>
        </div>
      </Shell>
    );
  }

  /* ─────────── REFLECTION / SAVE ─────────── */
  if (isReflection) {
    const anyAnswer = answers.some((a) => a.trim().length > 0);
    return (
      <Shell exercise={exercise} progress={{ current: totalSteps, total: totalSteps }}>
        <p className="text-[11px] tracking-[0.25em] text-btf-gold uppercase font-semibold mb-3">
          Almost done
        </p>
        <h2 className="font-serif text-2xl md:text-3xl text-btf-sky-deep font-light leading-tight mb-3">
          Anything to add?
        </h2>
        <p className="text-btf-text-mid font-light leading-relaxed mb-6 text-sm">
          Optional. A sentence or two on what shifted, what stayed the
          same, or what you want to remember.
        </p>

        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          disabled={submitting}
          rows={6}
          aria-label="Optional reflection"
          placeholder="Optional…"
          className="w-full rounded-2xl bg-white border-2 border-btf-sky-pale/60 focus:border-btf-sky focus:outline-none px-5 py-4 text-base text-btf-text-dark font-light leading-relaxed resize-y shadow-sm transition-colors"
        />

        {!anyAnswer && (
          <p className="mt-3 text-xs text-btf-text-light font-light leading-relaxed">
            You haven&rsquo;t written anything in any step yet. Go back and
            add a note to at least one step before saving.
          </p>
        )}

        {error && (
          <div
            role="alert"
            className="mt-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm p-4"
          >
            {error}
          </div>
        )}

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => setStepIdx(totalSteps - 1)}
            disabled={submitting}
            className="flex-1 bg-white border-2 border-btf-text-light/30 text-btf-text-mid font-medium px-8 py-3.5 rounded-full hover:bg-btf-off-white transition-colors"
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={submitting || !anyAnswer}
            className="flex-1 bg-gradient-to-br from-btf-sky to-btf-sky-deep text-white font-medium px-8 py-3.5 rounded-full shadow-lg disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-0.5 transition-transform"
          >
            {submitting ? "Saving…" : "Save to journal"}
          </button>
        </div>
      </Shell>
    );
  }

  /* ─────────── STEP ─────────── */
  const step = exercise.instructions[stepIdx];
  const isLastStep = stepIdx === totalSteps - 1;
  return (
    <Shell exercise={exercise} progress={{ current: stepIdx + 1, total: totalSteps }}>
      <p className="text-[10px] tracking-[0.25em] uppercase text-btf-text-light font-semibold mb-3">
        Step {stepIdx + 1} of {totalSteps}
      </p>
      {step.heading && (
        <h2 className="font-serif text-2xl md:text-3xl text-btf-sky-deep font-light leading-tight mb-3">
          {step.heading}
        </h2>
      )}
      <p className="text-btf-text-mid font-light leading-relaxed mb-6 text-base">
        {step.body}
      </p>

      <label className="block">
        <span className="text-[10px] tracking-[0.2em] uppercase text-btf-text-light font-semibold mb-2 block">
          Your note
        </span>
        <textarea
          value={answers[stepIdx]}
          onChange={(e) => updateAnswer(stepIdx, e.target.value)}
          autoFocus
          rows={6}
          aria-label={`Note for step ${stepIdx + 1}: ${step.heading ?? ""}`}
          placeholder="Write whatever's coming up for you…"
          className="w-full rounded-2xl bg-white border-2 border-btf-sky-pale/60 focus:border-btf-sky focus:outline-none px-5 py-4 text-base text-btf-text-dark font-light leading-relaxed resize-y shadow-sm transition-colors"
        />
      </label>

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={() => setStepIdx((i) => i - 1)}
          className="flex-1 bg-white border-2 border-btf-text-light/30 text-btf-text-mid font-medium px-8 py-3.5 rounded-full hover:bg-btf-off-white transition-colors"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={() => setStepIdx((i) => i + 1)}
          className="flex-1 bg-gradient-to-br from-btf-sky to-btf-sky-deep text-white font-medium px-8 py-3.5 rounded-full shadow-lg hover:-translate-y-0.5 transition-transform"
        >
          {isLastStep ? "Finish →" : "Next →"}
        </button>
      </div>
    </Shell>
  );
}

/**
 * Shared layout shell so the three screens (intro / step / reflection)
 * share the same header, progress bar, and exit affordance.
 */
function Shell({
  exercise,
  progress,
  children,
}: {
  exercise: Exercise;
  progress: { current: number; total: number } | null;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-btf-off-white px-6 py-10 sm:py-14">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link
            href={`/tools/${exercise.slug}`}
            className="text-btf-text-light hover:text-btf-sky-deep text-sm inline-flex items-center gap-2 transition-colors"
          >
            <span aria-hidden>&larr;</span> Exit walker
          </Link>
          {progress && (
            <div
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={progress.total}
              aria-valuenow={progress.current}
              aria-label="Walker progress"
              className="flex-shrink-0 w-32 h-1.5 bg-btf-sky-pale/60 rounded-full overflow-hidden ml-4"
            >
              <div
                className="h-full bg-gradient-to-r from-btf-sky to-btf-sky-deep transition-all"
                style={{
                  width: `${Math.round((progress.current / progress.total) * 100)}%`,
                }}
              />
            </div>
          )}
        </div>

        {children}
      </div>
    </main>
  );
}
