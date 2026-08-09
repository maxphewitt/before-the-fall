"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { RosaryStep } from "../../../../lib/rosary";
import type { HabitSlug } from "../../../../lib/habits";
import { recordHabitCompletionForCurrentUser } from "../../../../actions/habits";

/**
 * ChapletWalker — the text-first walker (the original Rosary walker's
 * design, revived from the vault archive) for chaplets without a 3D
 * model yet, e.g. the Seven Sorrows Rosary. One step on screen at a
 * time, bead counter per unit, keyboard nav (→/Space/Enter next,
 * ← back, and the crisis exit ramp stays on screen).
 *
 * Parameterized so other chaplets (Divine Mercy, St. Michael, …) reuse
 * it: unitLabel/unitTotal/beadsPerUnit describe the repeating section.
 */
export default function ChapletWalker({
  title,
  steps,
  unitLabel,
  unitTotal,
  beadsPerUnit,
  closingBeadLabel,
  exitHref = "/catholic-path/rosary",
  habitSlug = "rosary",
}: {
  title: string;
  steps: RosaryStep[];
  unitLabel: string; // e.g. "Sorrow"
  unitTotal: number; // e.g. 7
  beadsPerUnit: number; // e.g. 7 Hail Marys per sorrow
  closingBeadLabel?: string; // e.g. "In honor of Our Lady's tears"
  exitHref?: string;
  /** Which daily habit finishing this chaplet completes. */
  habitSlug?: HabitSlug;
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
  function restartUnit() {
    if (step.section !== "decade" || !("decade" in step) || step.decade == null) return;
    const firstIdx = steps.findIndex(
      (s) => s.section === "decade" && s.kind === "meditation" && "decade" in s && s.decade === step.decade
    );
    if (firstIdx !== -1) setIndex(firstIdx);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement | null)?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea") return;
      if (e.key === "ArrowRight" || e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setIndex((i) => Math.min(i + 1, total - 1));
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setIndex((i) => Math.max(i - 1, 0));
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [total]);

  useEffect(() => {
    containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [index]);

  // Habit completion — once, on the final step (same slug as the Rosary).
  const completionFired = useRef(false);
  useEffect(() => {
    if (atEnd && !completionFired.current) {
      completionFired.current = true;
      recordHabitCompletionForCurrentUser(habitSlug).catch(() => {});
    }
  }, [atEnd, habitSlug]);

  let headerLine = "";
  if (step.section === "opening") headerLine = "Opening prayers";
  else if (step.section === "closing") headerLine = "Closing prayers";
  else if (step.section === "decade" && "decade" in step)
    headerLine = `${unitLabel} ${step.decade} of ${unitTotal}`;

  const showBeads =
    step.kind === "prayer" &&
    step.section === "decade" &&
    step.name === "Hail Mary" &&
    typeof step.beadIndex === "number";

  return (
    <main className="min-h-screen bg-gradient-to-b from-btf-deep-night via-btf-sky-deep to-btf-sky text-white relative overflow-hidden">
      <div
        className="absolute top-[-150px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-btf-gold/15 blur-3xl pointer-events-none"
        aria-hidden
      />

      <Link
        href={exitHref}
        aria-label="Exit"
        className="absolute top-5 left-5 z-10 text-white/60 hover:text-white text-xs tracking-[0.25em] uppercase font-medium transition-colors"
      >
        ← Exit
      </Link>

      <div className="absolute top-5 left-0 right-0 z-0 text-center pointer-events-none">
        <p className="text-[10px] tracking-[0.25em] uppercase text-btf-gold/80 font-semibold">
          {title}
        </p>
      </div>

      <div className="absolute top-14 left-6 right-6 h-px bg-white/15 z-0">
        <div
          className="h-full bg-btf-gold transition-all duration-500"
          style={{ width: `${progressPct}%` }}
          aria-hidden
        />
      </div>

      <div
        ref={containerRef}
        className="relative max-w-2xl mx-auto px-6 pt-24 pb-32 min-h-screen flex flex-col justify-center"
      >
        <p className="text-center text-[11px] tracking-[0.25em] uppercase text-btf-gold-light/80 font-semibold mb-3">
          {headerLine}
        </p>

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

        {step.kind === "prayer" && (
          <div key={index} className="text-center animate-in fade-in duration-500">
            <h2 className="font-serif text-2xl md:text-3xl font-light text-btf-gold-light mb-4">
              {step.name}
            </h2>

            {typeof step.openingHailIndex === "number" && (
              <p className="text-[10px] tracking-[0.25em] uppercase text-white/40 font-semibold mb-4">
                Hail Mary {step.openingHailIndex + 1} of 3
                {closingBeadLabel ? ` — ${closingBeadLabel}` : ""}
              </p>
            )}

            <p className="font-serif text-lg md:text-2xl text-white/95 font-light leading-relaxed text-balance">
              {step.body}
            </p>

            {showBeads && (
              <div
                className="flex justify-center items-center gap-2 mt-10"
                aria-label={`Hail Mary ${(step.beadIndex ?? 0) + 1} of ${beadsPerUnit}`}
              >
                {Array.from({ length: beadsPerUnit }).map((_, i) => {
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
            {step.section === "decade" && step.kind !== "meditation" ? (
              <button
                type="button"
                onClick={restartUnit}
                aria-label={`Restart ${unitLabel.toLowerCase()}`}
                className="text-xs tracking-[0.25em] uppercase text-white/60 hover:text-white transition-colors px-3 py-2"
              >
                Restart {unitLabel.toLowerCase()} ↺
              </button>
            ) : (
              <span aria-hidden className="w-[7rem]" />
            )}
          </div>

          {atEnd ? (
            <Link
              href={exitHref}
              className="w-full block text-center bg-gradient-to-br from-btf-gold to-btf-gold-light text-btf-sky-deep font-medium px-8 py-4 rounded-full shadow-lg shadow-btf-gold/30 hover:-translate-y-0.5 transition-transform"
            >
              Amen. Return to the Rosary →
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
