"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import StreakChip, { GoldCrossIcon } from "../../../../components/StreakChip";
import { getDisplayStreak } from "../../../../actions/streaks";
import type { DisplayStreak } from "../../../../lib/streakTypes";

/* ────────────────────────────────────────────────────────────────────
   Shared building blocks for the six interactive self-help tool flows.

   Every flow follows the same outer shape:
     - <Shell> wraps the screen with a header (exit link + optional
       progress bar) and the BTF aesthetic (deep sky → sky background,
       gold accents, serif title type).
     - Tool-specific screens live inside the Shell.
     - At the end, <ClosingScreen> renders a specific acknowledgment plus
       2–3 forward-motion choices (return to tools / next tool / call 988).

   Mobile-first. No page reloads between steps — every flow is a single
   client component managing its own step index.
   ──────────────────────────────────────────────────────────────────── */


/* ─── Shell ───────────────────────────────────────────────────────── */

export function Shell({
  toolName,
  toolSlug,
  progress,
  children,
}: {
  toolName: string;
  toolSlug: string;
  progress: { current: number; total: number } | null;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-btf-sky-deep via-btf-sky-deep to-btf-sky text-white">
      <div className="max-w-xl mx-auto px-6 py-8 sm:py-12">
        <div className="flex items-center justify-between mb-8">
          <Link
            href={`/tools/${toolSlug}`}
            className="text-white/60 hover:text-white text-xs inline-flex items-center gap-2 transition-colors uppercase tracking-[0.25em]"
          >
            <span aria-hidden>&larr;</span> Exit
          </Link>
          <p className="text-[10px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold">
            {toolName}
          </p>
        </div>

        {progress && (
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={progress.total}
            aria-valuenow={progress.current}
            aria-label="Progress"
            className="w-full h-1 bg-white/10 rounded-full overflow-hidden mb-10"
          >
            <div
              className="h-full bg-btf-gold transition-all duration-500"
              style={{
                width: `${Math.round(
                  (progress.current / progress.total) * 100
                )}%`,
              }}
            />
          </div>
        )}

        {children}
      </div>
    </main>
  );
}


/* ─── Welcome screen (shared opening for every tool) ──────────────── */

/**
 * The consistent first screen for every tool: a slow breathing brand cross,
 * a serif headline, an evocative line, and a single gold call-to-action —
 * the format we standardized from Urge Surfing. Any data/charge check is a
 * SEPARATE screen that follows this one (never the opening).
 *
 * `footer` is for an optional sub-link (e.g. the faith/wisdom path switch).
 */
export function WelcomeScreen({
  toolName,
  toolSlug,
  headline,
  body,
  ctaLabel = "I'm ready to begin",
  onBegin,
  footer,
}: {
  toolName: string;
  toolSlug: string;
  headline: string;
  body: string;
  ctaLabel?: string;
  onBegin: () => void;
  footer?: React.ReactNode;
}) {
  return (
    <Shell toolName={toolName} toolSlug={toolSlug} progress={null}>
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <div className="btf-breathe mb-8">
          <GoldCrossIcon width={34} />
        </div>
        <h1 className="font-serif text-3xl md:text-4xl text-white font-light leading-tight mb-4">
          {headline}
        </h1>
        <p className="text-white/80 font-light leading-relaxed mb-10 max-w-md mx-auto">
          {body}
        </p>
        <div className="w-full max-w-xs">
          <PrimaryButton onClick={onBegin}>{ctaLabel}</PrimaryButton>
        </div>
        {footer && <div className="mt-5 text-sm">{footer}</div>}
      </div>
    </Shell>
  );
}


/* ─── Primary button ──────────────────────────────────────────────── */

export function PrimaryButton({
  children,
  onClick,
  disabled,
  type = "button",
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={
        "w-full bg-btf-gold hover:bg-btf-gold-light text-btf-sky-deep font-medium px-8 py-4 rounded-full shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5 " +
        className
      }
    >
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  onClick,
  disabled,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={
        "w-full bg-white/10 hover:bg-white/15 text-white border border-white/20 hover:border-white/30 font-medium px-8 py-4 rounded-full disabled:opacity-40 transition-all " +
        className
      }
    >
      {children}
    </button>
  );
}


/* ─── Intensity slider (1–10 or 0–100) ────────────────────────────── */

export function IntensitySlider({
  value,
  onChange,
  min,
  max,
  label,
  leftLabel,
  rightLabel,
}: {
  value: number;
  onChange: (n: number) => void;
  min: number;
  max: number;
  label?: string;
  leftLabel?: string;
  rightLabel?: string;
}) {
  return (
    <div className="space-y-3">
      {label && (
        <label className="text-[11px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold block">
          {label}
        </label>
      )}
      <div className="text-center font-serif text-5xl text-white font-light">
        {value}
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label ?? "Intensity"}
        className="w-full h-2 bg-white/15 rounded-full appearance-none accent-btf-gold cursor-pointer"
        style={{
          WebkitAppearance: "none",
        }}
      />
      <div className="flex justify-between text-xs text-white/60 font-light px-1">
        <span>{leftLabel ?? `${min}`}</span>
        <span>{rightLabel ?? `${max}`}</span>
      </div>
    </div>
  );
}


/* ─── Charge scale (optional 0–10 before/after self-rating) ───────── */

/**
 * Discrete, tappable 0–10 "how charged do you feel" scale (0 = calm,
 * 10 = overwhelmed). This is the shared StateCheck input used across
 * tools. It is a SUDS-style SELF-MONITORING rating — framed to the user as
 * "notice your own change", never as proof a tool works. Always optional;
 * `value` is null until the person picks.
 */
export function ChargeScale({
  value,
  onChange,
  leftLabel = "calm",
  rightLabel = "overwhelmed",
}: {
  value: number | null;
  onChange: (n: number) => void;
  leftLabel?: string;
  rightLabel?: string;
}) {
  return (
    <div>
      <div
        role="group"
        aria-label="How charged do you feel, 0 calm to 10 overwhelmed"
        className="flex justify-center gap-[6px]"
      >
        {Array.from({ length: 11 }, (_, i) => {
          const lit = value !== null && i <= value;
          return (
            <button
              key={i}
              type="button"
              aria-label={`${i} of 10`}
              aria-pressed={value === i}
              onClick={() => onChange(i)}
              className={
                "h-12 w-[22px] rounded-md transition-all duration-300 hover:-translate-y-0.5 " +
                (lit
                  ? "bg-gradient-to-b from-btf-gold to-btf-gold-light"
                  : "bg-white/10 hover:bg-white/20")
              }
            />
          );
        })}
      </div>
      <div className="flex justify-between max-w-[240px] mx-auto mt-3 px-1">
        <span className="text-xs text-white/45 font-light">{leftLabel}</span>
        <span className="text-xs text-white/45 font-light">{rightLabel}</span>
      </div>
    </div>
  );
}


/* ─── Countdown timer ─────────────────────────────────────────────── */

/**
 * Counts DOWN from `seconds` to 0. Fires `onComplete` when it hits 0.
 * The "Done early" button (if `allowEarly`) calls `onComplete` immediately.
 * Visual: large numeric countdown + a thin progress ring (CSS).
 */
export function Timer({
  seconds,
  label,
  allowEarly,
  earlyLabel = "Done",
  onComplete,
}: {
  seconds: number;
  label: string;
  allowEarly?: boolean;
  earlyLabel?: string;
  onComplete: () => void;
}) {
  const [remaining, setRemaining] = useState(seconds);
  const fired = useRef(false);

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining((r) => Math.max(0, r - 1));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // Fire onComplete once when the countdown reaches zero. Ref guards
  // against React strict-mode double-invocation. Lives in an effect
  // because React 19 forbids reading refs during render.
  useEffect(() => {
    if (remaining <= 0 && !fired.current) {
      fired.current = true;
      onComplete();
    }
  }, [remaining, onComplete]);

  const pct = ((seconds - remaining) / seconds) * 100;

  return (
    <div className="text-center">
      <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold mb-4">
        {label}
      </p>

      <div className="relative w-44 h-44 mx-auto mb-8">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="6"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="var(--btf-gold, #d4a44a)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${(pct * 2.827).toFixed(1)} 282.7`}
            className="transition-[stroke-dasharray] duration-1000 linear"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-serif text-5xl text-white font-light">
            {remaining}
          </span>
          <span className="text-[10px] tracking-[0.25em] uppercase text-white/55 font-semibold mt-1">
            seconds
          </span>
        </div>
      </div>

      {allowEarly && (
        <PrimaryButton
          onClick={() => {
            if (!fired.current) {
              fired.current = true;
              onComplete();
            }
          }}
        >
          {earlyLabel}
        </PrimaryButton>
      )}
    </div>
  );
}


/* ─── Breathing circle ────────────────────────────────────────────── */

/**
 * Square-paced breathing visual. inhale → hold → exhale → hold, each
 * `secondsPerPhase` long. Loops for `rounds` cycles, then fires `onComplete`.
 * The circle scales between 0.55 and 1.0 over inhale/exhale; holds are
 * stationary.
 */
export function BreathingCircle({
  secondsPerPhase = 4,
  rounds = 4,
  onComplete,
}: {
  secondsPerPhase?: number;
  rounds?: number;
  onComplete: () => void;
}) {
  const PHASES = ["Inhale", "Hold", "Exhale", "Hold"] as const;
  const [tick, setTick] = useState(0); // total seconds elapsed
  const fired = useRef(false);
  const cycleSeconds = secondsPerPhase * 4;
  const totalSeconds = cycleSeconds * rounds;

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // Fire onComplete once when the round count is hit. We don't track
  // "done" as state — the parent unmounts this component on the next
  // step, which cleans up the interval. A ref guard prevents firing
  // twice if React strict-mode double-invokes. Lives in an effect
  // because React 19 forbids reading refs during render.
  useEffect(() => {
    if (tick >= totalSeconds && !fired.current) {
      fired.current = true;
      onComplete();
    }
  }, [tick, totalSeconds, onComplete]);

  const inCycleSecond = tick % cycleSeconds;
  const phaseIdx = Math.floor(inCycleSecond / secondsPerPhase);
  const phase = PHASES[phaseIdx];
  const secondInPhase = inCycleSecond % secondsPerPhase;
  const remainingInPhase = secondsPerPhase - secondInPhase;
  const currentRound = Math.min(rounds, Math.floor(tick / cycleSeconds) + 1);

  // Scale: 0.55 at start of inhale → 1.0 at end of inhale, stays 1.0 on
  // hold, → 0.55 over exhale, stays 0.55 on next hold.
  const t = inCycleSecond / cycleSeconds; // 0 to 1 across the full cycle
  let scale = 0.55;
  if (t < 0.25) {
    // inhale
    scale = 0.55 + (0.45 * t) / 0.25;
  } else if (t < 0.5) {
    // hold at top
    scale = 1.0;
  } else if (t < 0.75) {
    // exhale
    scale = 1.0 - (0.45 * (t - 0.5)) / 0.25;
  } else {
    // hold at bottom
    scale = 0.55;
  }

  return (
    <div className="text-center">
      <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold mb-2">
        Round {currentRound} of {rounds}
      </p>

      <div className="relative w-64 h-64 mx-auto my-8">
        <div
          className="absolute inset-0 rounded-full bg-btf-gold/25 blur-2xl transition-transform duration-1000"
          style={{ transform: `scale(${scale + 0.1})` }}
        />
        <div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-btf-gold to-btf-gold-light transition-transform duration-1000"
          style={{ transform: `scale(${scale})` }}
          aria-hidden
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-btf-sky-deep">
          <span className="font-serif text-4xl font-light">{phase}</span>
          <span className="font-serif text-5xl font-light mt-1">
            {remainingInPhase}
          </span>
        </div>
      </div>

      <p className="text-sm text-white/70 font-light">
        Follow the circle. {secondsPerPhase} in, {secondsPerPhase} hold,{" "}
        {secondsPerPhase} out, {secondsPerPhase} hold.
      </p>
    </div>
  );
}


/* ─── Paced breathing circle (inhale / exhale only) ───────────────── */

/**
 * Slow resonance-style paced breathing: inhale `inhale`s, exhale `exhale`s,
 * no holds. Defaults to 4 in / 6 out (~6 breaths/min, gentle longer exhale)
 * — the calming pace used for TIPP. Same gold-orb visual language as
 * BreathingCircle so the tools feel uniform. Loops `rounds` then fires
 * onComplete. Reduced-motion users still get the phase/seconds text.
 */
export function PacedBreathingCircle({
  inhale = 4,
  exhale = 6,
  rounds = 5,
  onComplete,
}: {
  inhale?: number;
  exhale?: number;
  rounds?: number;
  onComplete: () => void;
}) {
  const [tick, setTick] = useState(0);
  const fired = useRef(false);
  const cycleSeconds = inhale + exhale;
  const totalSeconds = cycleSeconds * rounds;

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (tick >= totalSeconds && !fired.current) {
      fired.current = true;
      onComplete();
    }
  }, [tick, totalSeconds, onComplete]);

  const inCycle = tick % cycleSeconds;
  const inhaling = inCycle < inhale;
  const phase = inhaling ? "Breathe in" : "Breathe out";
  const remainingInPhase = inhaling
    ? inhale - inCycle
    : cycleSeconds - inCycle;
  const currentRound = Math.min(rounds, Math.floor(tick / cycleSeconds) + 1);

  // Scale 0.55 → 1.0 across inhale, 1.0 → 0.55 across exhale.
  const scale = inhaling
    ? 0.55 + (0.45 * inCycle) / inhale
    : 1.0 - (0.45 * (inCycle - inhale)) / exhale;

  return (
    <div className="text-center">
      <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold mb-2">
        Round {currentRound} of {rounds}
      </p>

      <div className="relative w-64 h-64 mx-auto my-8">
        <div
          className="absolute inset-0 rounded-full bg-btf-gold/25 blur-2xl transition-transform duration-1000"
          style={{ transform: `scale(${scale + 0.1})` }}
        />
        <div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-btf-gold to-btf-gold-light transition-transform duration-1000"
          style={{ transform: `scale(${scale})` }}
          aria-hidden
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-btf-sky-deep">
          <span className="font-serif text-4xl font-light">{phase}</span>
          <span className="font-serif text-5xl font-light mt-1">
            {remainingInPhase}
          </span>
        </div>
      </div>

      <p className="text-sm text-white/70 font-light">
        Let the out-breath be slow and gentle. {inhale} in, {exhale} out.
      </p>
    </div>
  );
}


/* ─── Closing screen ──────────────────────────────────────────────── */

export type NextStep = {
  label: string;
  href: string;
  description?: string;
};

export function ClosingScreen({
  headline,
  acknowledgment,
  nextSteps,
  saving,
  saveError,
}: {
  headline: string;
  acknowledgment: string;
  nextSteps: NextStep[];
  saving?: boolean;
  saveError?: string | null;
}) {
  return (
    <div className="text-center">
      <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold mb-3">
        Done
      </p>
      <h1 className="font-serif text-3xl md:text-4xl text-white font-light leading-tight mb-4">
        {headline}
      </h1>
      <p className="font-serif italic text-lg text-white/85 font-light leading-relaxed mb-10 max-w-md mx-auto">
        {acknowledgment}
      </p>

      {saving && (
        <p className="text-xs text-white/55 mb-4">Saving to your journal…</p>
      )}
      {saveError && (
        <div
          role="alert"
          className="mb-6 rounded-xl bg-red-900/30 border border-red-400/30 text-red-100 text-sm p-4"
        >
          {saveError}
        </div>
      )}

      <div className="space-y-3 text-left">
        {nextSteps.map((step) => (
          <Link
            key={step.href}
            href={step.href}
            className="block bg-white/10 hover:bg-white/15 border border-white/15 hover:border-white/30 rounded-2xl px-5 py-4 transition-all"
          >
            <p className="font-medium text-white">{step.label}</p>
            {step.description && (
              <p className="text-xs text-white/65 font-light mt-1 leading-relaxed">
                {step.description}
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}


/* ─── Display streak hook + unified completion screen ─────────────── */

/**
 * Loads the single surfaced streak once (after an activity completes).
 * Returns null while loading or if unavailable.
 */
export function useDisplayStreak(active: boolean): DisplayStreak | null {
  const [streak, setStreak] = useState<DisplayStreak | null>(null);
  const fetched = useRef(false);
  useEffect(() => {
    if (!active || fetched.current) return;
    fetched.current = true;
    getDisplayStreak()
      .then(setStreak)
      .catch((err) => console.error("getDisplayStreak (client):", err));
  }, [active]);
  return streak;
}

export type CompletionStat = { label: string; value: string };

/**
 * The unified "you completed it" window shared by every activity:
 * a streak chip (gold cross, taps through to the grove), a confirmation +
 * a reflective line, optional stats, optional custom content, and a
 * recommended next tool (the first next-step, highlighted) plus other
 * options. The recommendation will later be AI-guided.
 */
export function ActivityComplete({
  eyebrow = "Done",
  headline,
  acknowledgment,
  stats,
  nextSteps,
  saving,
  saveError,
  children,
}: {
  eyebrow?: string;
  headline: string;
  acknowledgment?: string;
  stats?: CompletionStat[];
  nextSteps: NextStep[];
  saving?: boolean;
  saveError?: string | null;
  children?: React.ReactNode;
}) {
  const streak = useDisplayStreak(true);

  return (
    <div className="text-center">
      {streak && (
        <div className="flex justify-center mb-8">
          <StreakChip streak={streak} tone="dark" />
        </div>
      )}

      <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold mb-3">
        {eyebrow}
      </p>
      <h1 className="font-serif text-3xl md:text-4xl text-white font-light leading-tight mb-3">
        {headline}
      </h1>
      {acknowledgment && (
        <p className="font-serif italic text-lg text-white/85 font-light leading-relaxed mb-8 max-w-md mx-auto">
          {acknowledgment}
        </p>
      )}

      {children}

      {stats && stats.length > 0 && (
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center rounded-2xl bg-white/[0.07] border border-white/15 px-5 py-3 min-w-[7rem]"
            >
              <GoldCrossIcon width={11} glow={false} />
              <div className="font-serif text-2xl text-btf-gold-light font-light leading-none mt-2">
                {s.value}
              </div>
              <div className="text-[10px] tracking-[0.2em] uppercase text-white/55 font-semibold mt-1.5">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      )}

      {saving && (
        <p className="text-xs text-white/55 mb-4">Saving to your journal…</p>
      )}
      {saveError && (
        <div
          role="alert"
          className="mb-6 rounded-xl bg-red-900/30 border border-red-400/30 text-red-100 text-sm p-4"
        >
          {saveError}
        </div>
      )}

      <div className="space-y-3 text-left">
        {nextSteps.map((step, i) => {
          const isInternal = step.href.startsWith("/");
          const highlight = i === 0;
          const className =
            "block rounded-2xl px-5 py-4 transition-all border " +
            (highlight
              ? "bg-btf-gold/15 border-btf-gold/50 hover:bg-btf-gold/20"
              : "bg-white/10 hover:bg-white/15 border-white/15 hover:border-white/30");
          const content = (
            <>
              {highlight && (
                <p className="text-[10px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold mb-1">
                  Recommended next
                </p>
              )}
              <p className="font-medium text-white">{step.label}</p>
              {step.description && (
                <p className="text-xs text-white/65 font-light mt-1 leading-relaxed">
                  {step.description}
                </p>
              )}
            </>
          );
          return isInternal ? (
            <Link key={step.label} href={step.href} className={className}>
              {content}
            </Link>
          ) : (
            <a key={step.label} href={step.href} className={className}>
              {content}
            </a>
          );
        })}
      </div>
    </div>
  );
}


/* ─── Choice grid ─────────────────────────────────────────────────── */

export function ChoiceGrid({
  options,
  value,
  onChange,
  columns = 3,
}: {
  options: { value: string; label: string; description?: string }[];
  value: string | null;
  onChange: (v: string) => void;
  columns?: 2 | 3;
}) {
  return (
    <div
      className={
        columns === 2
          ? "grid grid-cols-2 gap-3"
          : "grid grid-cols-1 sm:grid-cols-3 gap-3"
      }
    >
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={active}
            className={
              "rounded-2xl border-2 px-4 py-4 text-left transition-all " +
              (active
                ? "border-btf-gold bg-btf-gold/15 text-white shadow-lg"
                : "border-white/15 bg-white/5 text-white/85 hover:border-white/30 hover:bg-white/10")
            }
          >
            <span className="block font-medium">{opt.label}</span>
            {opt.description && (
              <span className="block text-[11px] text-white/65 font-light mt-1 leading-snug">
                {opt.description}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}


/* ─── Crisis CTA helper ───────────────────────────────────────────── */

/**
 * The "go to crisis line" choice surfaces 988 directly. Anchor uses
 * tel: so mobile dials immediately. Desktop users see the number and
 * the global crisis button is also visible on every page.
 */
export const CRISIS_NEXT_STEP: NextStep = {
  label: "Call or text 988",
  href: "tel:988",
  description:
    "Suicide & Crisis Lifeline. Free, confidential, 24 hours a day. Veterans press 1.",
};


/* ─── Save status hook ────────────────────────────────────────────── */

/**
 * Helper for flows that save a tool session to the journal as soon as
 * the closing screen renders, so the user doesn't have to remember to
 * tap a Save button. Returns the current save state for display.
 */
export function useAutoSave<T>(
  shouldSave: boolean,
  doSave: () => Promise<T>
): { saving: boolean; saveError: string | null; saved: T | null } {
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState<T | null>(null);
  const triggered = useRef(false);

  useEffect(() => {
    if (!shouldSave || triggered.current) return;
    triggered.current = true;
    setSaving(true);
    doSave()
      .then((value) => {
        setSaved(value);
        setSaving(false);
      })
      .catch((err: unknown) => {
        console.error("useAutoSave error:", err);
        setSaveError(
          err instanceof Error ? err.message : "Could not save to journal."
        );
        setSaving(false);
      });
  }, [shouldSave, doSave]);

  return { saving, saveError, saved };
}
