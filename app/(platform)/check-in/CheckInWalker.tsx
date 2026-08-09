"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import type {
  CheckInMood,
  CheckInNextStep,
  CheckInScript,
} from "../../lib/checkIn";
import { submitCheckIn } from "../../actions/checkIns";

/**
 * CheckInWalker — the client flow for /check-in. One gentle step at a
 * time: greeting → "How are you, really?" → a branch shaped by the answer
 * (the "I fell" branch gets its lapse-is-a-page framing as its own step)
 * → one small next step → a warm close.
 *
 * All copy arrives via the CheckInScript prop (built by getCheckInScript,
 * the future AI companion's seam) — nothing user-facing is hardcoded here
 * except structural labels like "Back". Draft flow pending clinician
 * review.
 *
 * Anything typed in the journal box is sent to the encrypted journal via
 * submitCheckIn; the check_ins table only ever receives structured
 * signals. Skipping every optional part is always allowed.
 */

type Phase = "greeting" | "mood" | "lapse" | "branch" | "next" | "done";

export default function CheckInWalker({
  script,
  secular,
}: {
  script: CheckInScript;
  /** Which fell-branch variant this script was built with (structured signal only). */
  secular: boolean;
}) {
  const [phase, setPhase] = useState<Phase>("greeting");
  const [mood, setMood] = useState<CheckInMood | null>(null);
  const [journalText, setJournalText] = useState("");
  const [chosenStep, setChosenStep] = useState<CheckInNextStep | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const branch = mood ? script.branches[mood] : null;
  const hasLapseStep = mood === "fell" && !!branch?.lapsePreface;

  const phases = useMemo<Phase[]>(
    () =>
      hasLapseStep
        ? ["greeting", "mood", "lapse", "branch", "next", "done"]
        : ["greeting", "mood", "branch", "next", "done"],
    [hasLapseStep]
  );
  const phaseIndex = phases.indexOf(phase);

  function pickMood(m: CheckInMood) {
    setMood(m);
    setPhase(m === "fell" && script.branches[m].lapsePreface ? "lapse" : "branch");
  }

  function goBack() {
    if (phaseIndex > 0 && phase !== "done") setPhase(phases[phaseIndex - 1]);
  }

  function finish(step: CheckInNextStep) {
    if (isPending || !mood) return;
    setChosenStep(step);
    setError(null);
    startTransition(async () => {
      // branch records which variant of the flow was walked — for "fell"
      // that includes the faith/secular fork (e.g. 'fell:faith'). A
      // structured signal only; never the user's words.
      const branch =
        mood === "fell" ? (secular ? "fell:secular" : "fell:faith") : mood;
      const res = await submitCheckIn({
        mood,
        branch,
        journalText,
        nextStep: step,
      });
      if (res.success) {
        setPhase("done");
      } else {
        setError(res.error);
      }
    });
  }

  const chosen = chosenStep
    ? script.nextSteps.find((s) => s.value === chosenStep)
    : null;

  return (
    <main className="mx-auto w-full max-w-[480px] md:max-w-[600px] px-[18px] pt-8">
      {/* Header row: quiet exit + progress dots. Skippable by design. */}
      <div className="flex items-center justify-between mb-8">
        {phase !== "greeting" && phase !== "done" ? (
          <button
            type="button"
            onClick={goBack}
            className="text-xs tracking-[0.2em] uppercase text-[#9fb6c8] hover:text-white transition-colors"
          >
            <BackArrow /> Back
          </button>
        ) : (
          <span aria-hidden className="w-16" />
        )}
        <div className="flex items-center gap-2" aria-hidden>
          {phases.map((p, i) => (
            <span
              key={p}
              className={
                "rounded-full transition-all duration-300 " +
                (i === phaseIndex
                  ? "w-3 h-3 bg-btf-gold shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                  : i < phaseIndex
                    ? "w-2 h-2 bg-btf-gold/70"
                    : "w-2 h-2 bg-white/20")
              }
            />
          ))}
        </div>
        {phase !== "done" ? (
          <Link
            href="/home"
            className="text-xs tracking-[0.2em] uppercase text-[#9fb6c8] hover:text-white transition-colors"
          >
            Not now
          </Link>
        ) : (
          <span aria-hidden className="w-16" />
        )}
      </div>

      {/* ── Greeting ── */}
      {phase === "greeting" && (
        <div className="text-center animate-in fade-in duration-500">
          <p className="text-[10px] tracking-[0.28em] uppercase text-btf-gold-light/80 font-semibold mb-4">
            Check-in
          </p>
          <h1 className="font-serif text-3xl md:text-4xl font-light leading-tight text-balance mb-4">
            {script.greeting.title}
          </h1>
          <p className="text-[15px] text-[#cddcea] font-light leading-relaxed text-balance mb-9">
            {script.greeting.body}
          </p>
          <GoldButton onClick={() => setPhase("mood")}>
            Take a minute
          </GoldButton>
        </div>
      )}

      {/* ── Mood question ── */}
      {phase === "mood" && (
        <div className="animate-in fade-in duration-500">
          <h1 className="font-serif text-3xl font-light text-center mb-3">
            {script.moodQuestion.title}
          </h1>
          <p className="text-sm text-[#9fb6c8] font-light text-center leading-relaxed mb-7">
            {script.moodQuestion.body}
          </p>
          <div className="space-y-3">
            {script.moodOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => pickMood(opt.value)}
                className="w-full text-left rounded-2xl bg-white/[0.055] border border-white/[0.09] hover:border-btf-gold/45 hover:bg-white/[0.08] transition-all p-[18px] flex items-center gap-4"
              >
                <span className="min-w-0 flex-1">
                  <span className="block font-serif text-[18px] leading-tight">
                    {opt.label}
                  </span>
                  <span className="block text-[13px] text-[#9fb6c8] mt-1 leading-snug">
                    {opt.description}
                  </span>
                </span>
                <Chevron />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Lapse framing (fell only) ── */}
      {phase === "lapse" && branch?.lapsePreface && (
        <div className="text-center animate-in fade-in duration-500">
          <h1 className="font-serif text-3xl md:text-4xl font-light leading-tight text-balance mb-5">
            {branch.lapsePreface.title}
          </h1>
          <p className="text-[15px] text-[#cddcea] font-light leading-relaxed text-balance mb-9">
            {branch.lapsePreface.body}
          </p>
          <GoldButton onClick={() => setPhase("branch")}>Continue</GoldButton>
        </div>
      )}

      {/* ── Branch: copy + suggestions + optional private journal ── */}
      {phase === "branch" && branch && (
        <div className="animate-in fade-in duration-500">
          <h1 className="font-serif text-[26px] md:text-3xl font-light leading-tight text-balance mb-3">
            {branch.heading}
          </h1>
          <p className="text-sm text-[#cddcea] font-light leading-relaxed mb-6">
            {branch.body}
          </p>

          {branch.suggestions.length > 0 && (
            <div className="space-y-3 mb-6">
              {branch.suggestions.map((s) => {
                const inner = (
                  <>
                    <span className="min-w-0 flex-1">
                      <span className="block font-serif text-[17px] leading-tight">
                        {s.title}
                      </span>
                      <span className="block text-[12px] text-[#9fb6c8] mt-1 leading-snug">
                        {s.description}
                      </span>
                    </span>
                    {s.href && <Chevron />}
                  </>
                );
                const cardClass =
                  "w-full flex items-center gap-4 rounded-2xl bg-white/[0.055] border border-white/[0.09] p-4 text-left";
                return s.href ? (
                  <Link
                    key={s.title}
                    href={s.href}
                    className={
                      cardClass +
                      " hover:border-btf-gold/45 hover:bg-white/[0.08] transition-all"
                    }
                  >
                    {inner}
                  </Link>
                ) : (
                  <div key={s.title} className={cardClass}>
                    {inner}
                  </div>
                );
              })}
            </div>
          )}

          <label className="block mb-6">
            <span className="block font-serif text-[17px] mb-1.5">
              {branch.journalPrompt}
            </span>
            <span className="block text-[12px] text-[#9fb6c8] mb-2.5">
              Optional — saved to your encrypted journal, for your eyes only.
            </span>
            <textarea
              value={journalText}
              onChange={(e) => setJournalText(e.target.value)}
              placeholder={branch.journalPlaceholder}
              rows={5}
              className="w-full rounded-2xl bg-white/[0.055] border border-white/[0.09] p-4 text-sm text-white placeholder:text-[#8aa0b0] font-light leading-relaxed focus:outline-none focus:border-btf-gold/50 resize-y"
            />
          </label>

          {branch.affirmation && (
            <p className="font-serif italic text-[15px] text-btf-gold-light/90 font-light leading-relaxed mb-6">
              {branch.affirmation}
            </p>
          )}

          <GoldButton onClick={() => setPhase("next")} full>
            Continue
          </GoldButton>

          {branch.supportLine && (
            <p className="text-[12px] text-[#8aa0b0] font-light leading-relaxed text-center mt-5">
              {branch.supportLine}{" "}
              <Link
                href="/tools"
                className="text-btf-gold-light underline underline-offset-4"
              >
                Open the tools
              </Link>
            </p>
          )}
        </div>
      )}

      {/* ── One small next step ── */}
      {phase === "next" && (
        <div className="animate-in fade-in duration-500">
          <h1 className="font-serif text-[26px] md:text-3xl font-light leading-tight mb-3">
            One small next step.
          </h1>
          <p className="text-sm text-[#9fb6c8] font-light leading-relaxed mb-7">
            Pick whichever feels honest. All three count.
          </p>
          <div className="space-y-3">
            {script.nextSteps.map((s) => (
              <button
                key={s.value}
                type="button"
                disabled={isPending}
                onClick={() => finish(s.value)}
                className="w-full text-left rounded-2xl bg-white/[0.055] border border-white/[0.09] hover:border-btf-gold/45 hover:bg-white/[0.08] transition-all p-[18px] flex items-center gap-4 disabled:opacity-50 disabled:cursor-wait"
              >
                <span className="min-w-0 flex-1">
                  <span className="block font-serif text-[17px] leading-tight">
                    {s.title}
                  </span>
                  <span className="block text-[12px] text-[#9fb6c8] mt-1 leading-snug">
                    {s.description}
                  </span>
                </span>
                <Chevron />
              </button>
            ))}
          </div>
          {error && (
            <p className="text-[13px] text-red-300/90 text-center mt-5">
              {error}
            </p>
          )}
        </div>
      )}

      {/* ── Warm close ── */}
      {phase === "done" && (
        <div className="text-center animate-in fade-in duration-500 pt-6">
          <SunriseIcon />
          <h1 className="font-serif text-3xl md:text-4xl font-light leading-tight text-balance mt-5 mb-4">
            {script.closing.title}
          </h1>
          <p className="text-[15px] text-[#cddcea] font-light leading-relaxed text-balance mb-9">
            {script.closing.body}
          </p>
          {chosen?.href && chosen.href !== "/home" ? (
            <>
              <Link
                href={chosen.href}
                className="block w-full text-center rounded-full bg-gradient-to-b from-btf-gold-light to-btf-gold text-[#2a2008] font-semibold px-8 py-3.5 shadow-lg shadow-btf-gold/30 hover:-translate-y-0.5 transition-transform mb-3"
              >
                {chosen.title}
              </Link>
              <Link
                href="/home"
                className="block w-full text-center rounded-full bg-white/10 border border-white/25 text-white/90 font-light px-6 py-3 hover:bg-white/20 transition-colors"
              >
                Return home
              </Link>
            </>
          ) : (
            <Link
              href="/home"
              className="block w-full text-center rounded-full bg-gradient-to-b from-btf-gold-light to-btf-gold text-[#2a2008] font-semibold px-8 py-3.5 shadow-lg shadow-btf-gold/30 hover:-translate-y-0.5 transition-transform"
            >
              Return home
            </Link>
          )}
        </div>
      )}
    </main>
  );
}

/* ── small pieces (inline SVG only; no emoji) ── */

function GoldButton({
  onClick,
  children,
  full,
}: {
  onClick: () => void;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        (full ? "block w-full " : "inline-flex items-center justify-center ") +
        "text-center rounded-full bg-gradient-to-b from-btf-gold-light to-btf-gold text-[#2a2008] font-semibold px-8 py-3.5 shadow-lg shadow-btf-gold/30 hover:-translate-y-0.5 transition-transform"
      }
    >
      {children}
    </button>
  );
}

function Chevron() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#9fb6c8"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="flex-none"
      aria-hidden
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function BackArrow() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="inline-block -mt-0.5 mr-1"
      aria-hidden
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function SunriseIcon() {
  return (
    <svg
      width="34"
      height="34"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#e8cc7a"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mx-auto"
      aria-hidden
    >
      <path d="M12 9V3M8 6l4-3 4 3" />
      <path d="M5 18a7 7 0 0 1 14 0" />
      <path d="M2 18h2M20 18h2M4.9 13.9l1.4 1.4M19.1 13.9l-1.4 1.4" />
      <path d="M3 22h18" />
    </svg>
  );
}
