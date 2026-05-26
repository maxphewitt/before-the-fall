"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";
import type { RosaryStep } from "../../../lib/rosary";
import { recordHabitCompletionForCurrentUser } from "../../../actions/habits";

/**
 * Immersive Rosary walker.
 *
 * One step on screen at a time. Large serif text, soft gradient,
 * minimal chrome. Visual bead counter for the 10 Hail Marys per decade.
 * Keyboard: Right/Space/Enter → next, Left → back, Escape → exit.
 *
 * Crisis exit ramp from root layout is still on screen at bottom-right.
 */
export default function RosaryWalker({
  mysteryName,
  steps,
}: {
  mysteryName: string;
  steps: RosaryStep[];
}) {
  const [index, setIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const total = steps.length;
  const step = steps[index];
  const atStart = index === 0;
  const atEnd = index === total - 1;

  const progressPct = useMemo(
    () => Math.round(((index + 1) / total) * 100),
    [index, total]
  );

  function goNext() {
    setIndex((i) => Math.min(i + 1, total - 1));
  }
  function goBack() {
    setIndex((i) => Math.max(i - 1, 0));
  }

  // Restart the current decade — find the first step of the current
  // decade (which is always the meditation) and jump to it.
  function restartDecade() {
    if (step.section !== "decade" || step.kind === "meditation") {
      // From the meditation, no-op (we're already there).
      if (step.kind === "meditation") return;
    }
    const currentDecade =
      step.section === "decade" && "decade" in step ? step.decade : null;
    if (currentDecade == null) return;
    const firstIdx = steps.findIndex(
      (s) =>
        s.section === "decade" &&
        s.kind === "meditation" &&
        "decade" in s &&
        s.decade === currentDecade
    );
    if (firstIdx !== -1) setIndex(firstIdx);
  }

  // Keyboard nav
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      // Don't intercept if user is interacting with a focusable element
      // (e.g., an input). The walker has none today, but defensive.
      const tag = (e.target as HTMLElement | null)?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea") return;

      if (e.key === "ArrowRight" || e.key === " " || e.key === "Enter") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goBack();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [total]);

  // Scroll to top of the prayer block on each step change for long
  // prayers (Apostles' Creed, Hail Holy Queen, Final).
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [index]);

  // Record habit completion exactly once when the user reaches the final
  // step. The ref guard prevents firing twice if React strict-mode
  // double-invokes effects in dev. Best-effort — never blocks the user.
  const completionFired = useRef(false);
  useEffect(() => {
    if (atEnd && !completionFired.current) {
      completionFired.current = true;
      recordHabitCompletionForCurrentUser("rosary").catch(() => {
        // Swallow — completion logging is best-effort.
      });
    }
  }, [atEnd]);

  // ─── Header line: which section + decade + step name ────────────────
  let headerLine = "";
  let subHeaderLine = "";
  if (step.section === "opening") {
    headerLine = "Opening prayers";
  } else if (step.section === "closing") {
    headerLine = "Closing prayers";
  } else if (step.section === "decade" && "decade" in step) {
    headerLine = `Decade ${step.decade} of 5`;
    if (step.kind === "meditation") {
      subHeaderLine = step.name;
    }
  }

  // ─── Bead counter: only on Hail Marys inside a decade ───────────────
  const showBeads =
    step.kind === "prayer" &&
    step.section === "decade" &&
    step.name === "Hail Mary" &&
    typeof step.beadIndex === "number";

  return (
    <main className="min-h-screen bg-gradient-to-b from-btf-sky-deep via-btf-sky-deep to-btf-sky text-white relative overflow-hidden">
      {/* Gold glow */}
      <div
        className="absolute top-[-150px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-btf-gold/15 blur-3xl pointer-events-none"
        aria-hidden
      />

      {/* Exit button — top-left */}
      <Link
        href="/catholic-path/rosary"
        aria-label="Exit Rosary"
        className="absolute top-5 left-5 z-10 text-white/60 hover:text-white text-xs tracking-[0.25em] uppercase font-medium transition-colors"
      >
        ← Exit
      </Link>

      {/* Mystery name — top center */}
      <div className="absolute top-5 left-0 right-0 z-0 text-center pointer-events-none">
        <p className="text-[10px] tracking-[0.25em] uppercase text-btf-gold/80 font-semibold">
          {mysteryName.replace(/^The /, "")}
        </p>
      </div>

      {/* Progress bar — thin */}
      <div className="absolute top-14 left-6 right-6 h-px bg-white/15 z-0">
        <div
          className="h-full bg-btf-gold transition-all duration-500"
          style={{ width: `${progressPct}%` }}
          aria-hidden
        />
      </div>

      {/* Main content area */}
      <div
        ref={containerRef}
        className="relative max-w-2xl mx-auto px-6 pt-24 pb-32 min-h-screen flex flex-col justify-center"
      >
        {/* Section / decade indicator */}
        <p className="text-center text-[11px] tracking-[0.25em] uppercase text-btf-gold-light/80 font-semibold mb-3">
          {headerLine}
        </p>

        {/* Meditation step */}
        {step.kind === "meditation" && (
          <div key={index} className="text-center animate-in fade-in duration-500">
            <h1 className="font-serif text-3xl md:text-5xl font-light text-white mb-4 text-balance leading-[1.15]">
              {step.name}
            </h1>
            <p className="text-[11px] tracking-[0.2em] uppercase text-btf-gold-light/70 font-semibold mb-6">
              {step.scriptureRef}
            </p>
            <p className="font-serif italic text-lg md:text-xl text-white/85 font-light leading-relaxed text-balance">
              {step.summary}
            </p>
          </div>
        )}

        {/* Prayer step */}
        {step.kind === "prayer" && (
          <div key={index} className="text-center animate-in fade-in duration-500">
            <h2 className="font-serif text-2xl md:text-3xl font-light text-btf-gold-light mb-2">
              {step.name}
            </h2>
            {subHeaderLine && (
              <p className="text-[11px] tracking-[0.2em] uppercase text-white/50 font-semibold mb-4">
                {subHeaderLine}
              </p>
            )}

            {/* Opening Hail Mary indicator (1 of 3, etc.) */}
            {typeof step.openingHailIndex === "number" && (
              <p className="text-[10px] tracking-[0.25em] uppercase text-white/40 font-semibold mb-4">
                Hail Mary {step.openingHailIndex + 1} of 3
              </p>
            )}

            <p className="font-serif text-lg md:text-2xl text-white/95 font-light leading-relaxed text-balance">
              {step.body}
            </p>

            {/* Bead counter for decade Hail Marys */}
            {showBeads && (
              <div
                className="flex justify-center items-center gap-2 mt-10"
                aria-label={`Hail Mary ${(step.beadIndex ?? 0) + 1} of 10`}
              >
                {Array.from({ length: 10 }).map((_, i) => {
                  const beadIdx = step.beadIndex ?? 0;
                  const completed = i < beadIdx;
                  const current = i === beadIdx;
                  return (
                    <span
                      key={i}
                      aria-hidden
                      className={`rounded-full transition-all duration-300 ${
                        current
                          ? "w-3.5 h-3.5 bg-btf-gold shadow-[0_0_12px_rgba(212,175,55,0.6)]"
                          : completed
                            ? "w-2.5 h-2.5 bg-btf-gold/80"
                            : "w-2 h-2 bg-white/20"
                      }`}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Controls — bottom */}
      <div className="absolute bottom-0 left-0 right-0 px-6 pb-8 pt-6 bg-gradient-to-t from-btf-sky-deep via-btf-sky-deep/95 to-transparent z-10">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between gap-3 mb-3">
            <button
              type="button"
              onClick={goBack}
              disabled={atStart}
              aria-label="Previous prayer"
              className="text-xs tracking-[0.25em] uppercase text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-3 py-2"
            >
              ← Back
            </button>

            <p className="text-[10px] tracking-[0.25em] uppercase text-white/40 font-semibold">
              {index + 1} / {total}
            </p>

            {step.section === "decade" && step.kind !== "meditation" && (
              <button
                type="button"
                onClick={restartDecade}
                aria-label="Restart decade"
                className="text-xs tracking-[0.25em] uppercase text-white/60 hover:text-white transition-colors px-3 py-2"
              >
                Restart decade ↺
              </button>
            )}
            {!(step.section === "decade" && step.kind !== "meditation") && (
              <span aria-hidden className="w-[7rem]" />
            )}
          </div>

          {atEnd ? (
            <Link
              href="/catholic-path/rosary"
              className="w-full block text-center bg-gradient-to-br from-btf-gold to-btf-gold-light text-btf-sky-deep font-medium px-8 py-4 rounded-full shadow-lg shadow-btf-gold/30 hover:-translate-y-0.5 transition-transform"
            >
              Amen. Return to Catholic Path →
            </Link>
          ) : (
            <button
              type="button"
              onClick={goNext}
              className="w-full bg-gradient-to-br from-btf-gold to-btf-gold-light text-btf-sky-deep font-medium px-8 py-4 rounded-full shadow-lg shadow-btf-gold/30 hover:-translate-y-0.5 transition-transform"
            >
              Continue →
            </button>
          )}

          <p className="text-center text-[10px] tracking-[0.25em] uppercase text-white/30 font-semibold mt-4">
            Space or → to continue · ← to go back
          </p>
        </div>
      </div>
    </main>
  );
}
