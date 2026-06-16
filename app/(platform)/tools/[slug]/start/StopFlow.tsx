"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Shell,
  PrimaryButton,
  CRISIS_NEXT_STEP,
  useAutoSave,
} from "./_shared";
import { createToolSession } from "../../../../actions/journal";

/**
 * STOP — DBT crisis-survival skill.
 *
 * Flow:
 *   0. Title reveal — letters of "STOP." appear one at a time, then
 *      a single "I stopped." button.
 *   1. S — "Stop." Freeze. Single Next button.
 *   2. T — "Take a step back." Single Next button.
 *   3. O — "Observe." Required free-text: "What do you feel in your
 *      body right now?" with a real example in the placeholder so the
 *      first-time user knows what to put in.
 *   4. P — "Proceed mindfully." Closing screen with three choices:
 *      continue to Urge Surfing, return to /tools, or call 988.
 */
export default function StopFlow() {
  const router = useRouter();
  const [stepIdx, setStepIdx] = useState(0);
  const [bodyNote, setBodyNote] = useState("");

  const TOTAL = 5;

  // Auto-save on the closing screen.
  const isClosing = stepIdx === 4;
  const { saving, saveError } = useAutoSave(
    isClosing && bodyNote.trim().length > 0,
    async () => {
      const res = await createToolSession({
        toolSlug: "stop",
        toolName: "STOP",
        steps: [
          {
            heading: "Stop",
            prompt: "Freeze. Don't move. Don't reach. Don't speak.",
            userAnswer: "Completed.",
          },
          {
            heading: "Take a step back",
            prompt: "Mentally or literally. A foot of distance from whatever's in front of you.",
            userAnswer: "Completed.",
          },
          {
            heading: "Observe — body check",
            prompt: "What do you feel in your body right now?",
            userAnswer: bodyNote,
          },
          {
            heading: "Proceed mindfully",
            prompt: "Next move on purpose, not on autopilot.",
            userAnswer: "Completed.",
          },
        ],
      });
      if (!res.success) throw new Error(res.error);
      return res;
    }
  );

  /* ─── Step 0: title reveal ─── */
  if (stepIdx === 0) return <TitleReveal onContinue={() => setStepIdx(1)} />;

  /* ─── Step 1: S ─── */
  if (stepIdx === 1) {
    return (
      <Shell toolName="STOP" toolSlug="stop" progress={{ current: 1, total: TOTAL }}>
        <LetterCard letter="S" word="Stop" />
        <p className="text-white/85 font-light leading-relaxed mb-10 text-center">
          Freeze where you are. Don&rsquo;t move. Don&rsquo;t reach. Don&rsquo;t speak. Three seconds. That&rsquo;s the whole job right now.
        </p>
        <PrimaryButton onClick={() => setStepIdx(2)}>I&rsquo;m frozen →</PrimaryButton>
      </Shell>
    );
  }

  /* ─── Step 2: T ─── */
  if (stepIdx === 2) {
    return (
      <Shell toolName="STOP" toolSlug="stop" progress={{ current: 2, total: TOTAL }}>
        <LetterCard letter="T" word="Take a step back" />
        <p className="text-white/85 font-light leading-relaxed mb-10 text-center">
          Mentally or physically. Put a foot of distance between you and whatever&rsquo;s in front of you &mdash; the phone, the screen, the bottle, the person, the thought.
        </p>
        <PrimaryButton onClick={() => setStepIdx(3)}>I stepped back →</PrimaryButton>
      </Shell>
    );
  }

  /* ─── Step 3: O — required body check ─── */
  if (stepIdx === 3) {
    return (
      <Shell toolName="STOP" toolSlug="stop" progress={{ current: 3, total: TOTAL }}>
        <LetterCard letter="O" word="Observe" />
        <label className="block mb-6">
          <span className="text-[11px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold mb-3 block">
            What do you feel in your body right now?
          </span>
          <textarea
            value={bodyNote}
            onChange={(e) => setBodyNote(e.target.value)}
            autoFocus
            rows={5}
            placeholder="My chest is tight. My hands want to reach for my phone. My jaw is clenched."
            className="w-full rounded-2xl bg-white/10 border-2 border-white/20 focus:border-btf-gold focus:outline-none px-5 py-4 text-base text-white font-light leading-relaxed resize-y placeholder:text-white/40 placeholder:italic transition-colors"
          />
        </label>
        <p className="text-xs text-white/55 font-light leading-relaxed mb-8">
          No judgment. No action. Just notice. The body knows things the brain hasn&rsquo;t named yet.
        </p>
        <PrimaryButton
          onClick={() => setStepIdx(4)}
          disabled={bodyNote.trim().length === 0}
        >
          Next →
        </PrimaryButton>
      </Shell>
    );
  }

  /* ─── Step 4: P — closing + choices ─── */
  return (
    <Shell toolName="STOP" toolSlug="stop" progress={{ current: 5, total: TOTAL }}>
      <LetterCard letter="P" word="Proceed mindfully" small />
      <h1 className="font-serif text-2xl md:text-3xl text-white font-light leading-tight mb-4 text-center">
        You created a gap.
      </h1>
      <p className="font-serif italic text-base text-white/85 font-light leading-relaxed mb-10 max-w-md mx-auto text-center">
        Between the urge and the action. That gap is the whole skill. Your next move is the one you choose, not the one the urge picked for you.
      </p>

      {saving && (
        <p className="text-xs text-white/55 text-center mb-4">Saving to your journal…</p>
      )}
      {saveError && (
        <div role="alert" className="mb-6 rounded-xl bg-red-900/30 border border-red-400/30 text-red-100 text-sm p-4">
          {saveError}
        </div>
      )}

      <div className="space-y-3">
        <button
          type="button"
          onClick={() => router.push("/tools/urge-surfing/start")}
          className="w-full text-left bg-white/10 hover:bg-white/15 border border-white/15 hover:border-white/30 rounded-2xl px-5 py-4 transition-all"
        >
          <p className="font-medium text-white">Continue to Urge Surfing →</p>
          <p className="text-xs text-white/65 font-light mt-1 leading-relaxed">
            If the urge is still there, ride it until it falls. Often the natural next move after STOP.
          </p>
        </button>
        <a
          href={CRISIS_NEXT_STEP.href}
          className="block bg-white/10 hover:bg-white/15 border border-white/15 hover:border-white/30 rounded-2xl px-5 py-4 transition-all"
        >
          <p className="font-medium text-white">{CRISIS_NEXT_STEP.label}</p>
          <p className="text-xs text-white/65 font-light mt-1 leading-relaxed">
            {CRISIS_NEXT_STEP.description}
          </p>
        </a>
        <button
          type="button"
          onClick={() => router.push("/tools")}
          className="w-full text-left bg-white/10 hover:bg-white/15 border border-white/15 hover:border-white/30 rounded-2xl px-5 py-4 transition-all"
        >
          <p className="font-medium text-white">Back to all tools</p>
          <p className="text-xs text-white/65 font-light mt-1 leading-relaxed">
            See the other Tier 1 exercises.
          </p>
        </button>
      </div>
    </Shell>
  );
}

/* ─── Title reveal screen ───────────────────────────────────────── */

function TitleReveal({ onContinue }: { onContinue: () => void }) {
  const letters = ["S", "T", "O", "P"];
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    if (revealed >= letters.length) return;
    const id = setTimeout(() => setRevealed((r) => r + 1), 450);
    return () => clearTimeout(id);
  }, [revealed, letters.length]);

  const ready = revealed >= letters.length;

  return (
    <Shell toolName="STOP" toolSlug="stop" progress={null}>
      <div className="min-h-[40vh] flex flex-col items-center justify-center">
        <div className="flex gap-3 mb-4">
          {letters.map((l, i) => (
            <span
              key={i}
              className={
                "font-serif font-light text-6xl sm:text-7xl transition-all duration-500 " +
                (i < revealed
                  ? "text-btf-gold opacity-100 translate-y-0"
                  : "text-btf-gold opacity-0 translate-y-3")
              }
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {l}
            </span>
          ))}
          <span
            className={
              "font-serif font-light text-6xl sm:text-7xl text-btf-gold transition-opacity duration-500 " +
              (ready ? "opacity-100" : "opacity-0")
            }
          >
            .
          </span>
        </div>
        <p
          className={
            "font-serif italic text-base text-white/75 font-light max-w-xs text-center leading-relaxed transition-opacity duration-500 mb-12 " +
            (ready ? "opacity-100" : "opacity-0")
          }
        >
          Before you do the next thing, stop.
        </p>
        <div
          className={
            "w-full transition-opacity duration-500 " +
            (ready ? "opacity-100" : "opacity-0 pointer-events-none")
          }
        >
          <PrimaryButton onClick={onContinue}>I stopped.</PrimaryButton>
        </div>
      </div>
    </Shell>
  );
}

function LetterCard({
  letter,
  word,
  small,
}: {
  letter: string;
  word: string;
  small?: boolean;
}) {
  return (
    <div className="text-center mb-8">
      <div
        className={
          (small ? "text-5xl" : "text-7xl") +
          " font-serif font-light text-btf-gold mb-2"
        }
      >
        {letter}
      </div>
      <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold">
        {word}
      </p>
    </div>
  );
}
