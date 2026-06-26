"use client";

import { useState } from "react";
import {
  Shell,
  PrimaryButton,
  ChargeScale,
  PacedBreathingCircle,
  ActivityComplete,
  WelcomeScreen,
  CRISIS_NEXT_STEP,
  useAutoSave,
} from "./_shared";
import { createToolSession } from "../../../../actions/journal";
import { timeOfDayBucket } from "../../../../lib/journalTypes";

/**
 * STOP — DBT crisis-survival skill: a deliberate pause between urge and
 * action. Stop · Take a step back · Observe · Proceed mindfully.
 *
 * Uses the SAME shared features as the other tools (no new tracking):
 *   - StateCheck: optional 0–10 "how strong is the pull" before/after →
 *     createToolSession({ stateCheck, timeOfDay }) → the state_checks table +
 *     the grove. STOP now contributes to the cross-tool data like the rest.
 *   - The journal: the user's own Observe words are saved + reflected back.
 *   - Habit completion + streak + ActivityComplete grove archive → the return
 *     loop (meaning/mastery, not streak-pressure).
 *
 * Calm-game craft dialed to a whisper: single-focus steps, staged reveals,
 * eased motion, nothing auto-fires; the breath does the settling.
 *
 * Claims kept defensible: a recognized DBT skill for the urge-action gap —
 * not a trial-proven cure, not a substitute for crisis care.
 */

type Encouragement = {
  eyebrow: string;
  headline: string;
  body: string;
  quote: string;
  source: string;
};

const ENCOURAGEMENT: Record<"christian" | "secular", Encouragement> = {
  christian: {
    eyebrow: "You're not alone in this",
    headline: "He stood here too.",
    body: "Jesus was led into the wilderness and tempted — and met each temptation without giving in (Matthew 4:1–11). The pull you feel now, he felt. You don't stand in this gap alone.",
    quote:
      "There hath no temptation taken you but such as is common to man: but God is faithful, who will… with the temptation also make a way to escape.",
    source: "1 Corinthians 10:13",
  },
  secular: {
    eyebrow: "You're not alone in this",
    headline: "You're not the first to stand here.",
    body: "The pull you feel is human, and it passes. Between what you feel and what you do there's a space — and right now you're standing in it.",
    quote: "Men are disturbed not by things, but by the views which they take of them.",
    source: "Epictetus",
  },
};

export default function StopFlow({
  path = "secular",
}: {
  path?: "christian" | "secular";
}) {
  // 0 intro · 1 before · 2 S · 3 T · 4 O · 5 encouragement · 6 after · 7 closing
  const [step, setStep] = useState(0);
  const [started, setStarted] = useState(false); // breath gate on T
  const [observed, setObserved] = useState("");
  const [before, setBefore] = useState<number | null>(null);
  const [after, setAfter] = useState<number | null>(null);

  const enc = ENCOURAGEMENT[path];
  const isClosing = step === 7;
  const eased = before !== null && after !== null ? after < before : null;

  const { saving, saveError } = useAutoSave(isClosing, async () => {
    const res = await createToolSession({
      toolSlug: "stop",
      toolName: "STOP",
      steps: [
        {
          heading: "Stop",
          prompt: "Freeze. Don't move, reach, or speak.",
          userAnswer: "Stopped.",
        },
        {
          heading: "Take a step back",
          prompt: "A few slow breaths; let the adrenaline settle.",
          userAnswer: "Took a few slow breaths.",
        },
        {
          heading: "Observe",
          prompt: "What's happening inside and around you, without judgment.",
          userAnswer: observed.trim() || "Took a moment to notice.",
        },
        {
          heading: "Proceed mindfully",
          prompt: "The next move chosen on purpose, not on autopilot.",
          userAnswer: "Chose the next move on purpose.",
        },
      ],
      stateCheck: { before, after },
      timeOfDay: timeOfDayBucket(),
    });
    if (!res.success) throw new Error(res.error);
    return res;
  });

  /* ─── 0: welcome (shared format) ─── */
  if (step === 0) {
    return (
      <WelcomeScreen
        toolName="STOP"
        toolSlug="stop"
        headline="There's a gap."
        body="A small space sits between the urge and the act — easy to miss at full speed. We'll slow down and stand in it together: four small moves, at your pace."
        onBegin={() => setStep(1)}
      />
    );
  }

  /* ─── 1: before charge (optional) ─── */
  if (step === 1) {
    return (
      <StopShell progress={{ current: 1, total: 6 }}>
        <div className="text-center">
          <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold mb-5">
            before we begin · optional
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-white font-light leading-tight mb-2">
            How strong is the pull right now?
          </h1>
          <p className="text-sm text-white/60 font-light mb-8">
            Just a private note to yourself, so you can see what shifts.
          </p>
          <ChargeScale
            value={before}
            onChange={setBefore}
            leftLabel="barely there"
            rightLabel="overwhelming"
          />
          <div className="mt-10 space-y-3">
            <PrimaryButton onClick={() => setStep(2)}>Begin →</PrimaryButton>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="block w-full text-sm text-white/55 hover:text-white/80 font-light py-2 transition-colors"
            >
              Skip — just take me there
            </button>
          </div>
        </div>
      </StopShell>
    );
  }

  /* ─── 2: S — Stop ─── */
  if (step === 2) {
    return (
      <StopShell progress={{ current: 2, total: 6 }}>
        <LetterMark letter="S" word="Stop" />
        <p className="text-white/85 font-light leading-relaxed mb-10 text-center max-w-md mx-auto">
          Freeze where you are. Don&rsquo;t move, don&rsquo;t reach, don&rsquo;t
          speak. Just for a few seconds — that&rsquo;s the whole job right now.
        </p>
        <PrimaryButton onClick={() => setStep(3)}>I&rsquo;m still →</PrimaryButton>
      </StopShell>
    );
  }

  /* ─── 3: T — Take a step back (guided breath) ─── */
  if (step === 3) {
    return (
      <StopShell progress={{ current: 3, total: 6 }}>
        <LetterMark letter="T" word="Take a step back" />
        {!started ? (
          <>
            <p className="text-white/85 font-light leading-relaxed mb-10 text-center max-w-md mx-auto">
              Step back — in your mind or with your feet — and breathe. A few
              slow breaths let the rush settle enough to think. Follow the circle
              when you&rsquo;re ready.
            </p>
            <PrimaryButton onClick={() => setStarted(true)}>
              Breathe with me →
            </PrimaryButton>
          </>
        ) : (
          <PacedBreathingCircle
            inhale={4}
            exhale={6}
            rounds={3}
            onComplete={() => setStep(4)}
          />
        )}
      </StopShell>
    );
  }

  /* ─── 4: O — Observe ─── */
  if (step === 4) {
    return (
      <StopShell progress={{ current: 4, total: 6 }}>
        <LetterMark letter="O" word="Observe" />
        <label className="block mb-4">
          <span className="text-[11px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold mb-3 block text-center">
            What do you notice right now?
          </span>
          <textarea
            value={observed}
            onChange={(e) => setObserved(e.target.value)}
            autoFocus
            rows={5}
            placeholder="My chest is tight. My hand keeps reaching for my phone. The urge is loud but I haven't moved."
            className="w-full rounded-2xl bg-white/10 border-2 border-white/20 focus:border-btf-gold focus:outline-none px-5 py-4 text-base text-white font-light leading-relaxed resize-y placeholder:text-white/35 placeholder:italic transition-colors"
          />
        </label>
        <p className="text-xs text-white/55 font-light leading-relaxed mb-8 text-center">
          No judgment, no action — just notice. Your body often knows what the
          mind hasn&rsquo;t named yet. (You can leave this blank.)
        </p>
        <PrimaryButton onClick={() => setStep(5)}>I&rsquo;ve noticed →</PrimaryButton>
      </StopShell>
    );
  }

  /* ─── 5: encouragement — you're not alone ─── */
  if (step === 5) {
    return (
      <StopShell progress={{ current: 5, total: 6 }}>
        <div className="text-center">
          <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold mb-3 btf-fade-up">
            {enc.eyebrow}
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-white font-light leading-tight mb-4 btf-fade-up btf-d-1">
            {enc.headline}
          </h1>
          <p className="text-white/80 font-light leading-relaxed mb-8 max-w-md mx-auto btf-fade-up btf-d-2">
            {enc.body}
          </p>
          <blockquote className="border-l-2 border-btf-gold/50 pl-5 py-1 text-left max-w-md mx-auto mb-10 btf-fade-up btf-d-3">
            <p className="font-serif italic text-lg text-white/90 font-light leading-relaxed">
              &ldquo;{enc.quote}&rdquo;
            </p>
            <p className="text-sm text-btf-gold-light font-medium mt-2">
              — {enc.source}
            </p>
          </blockquote>
          <PrimaryButton onClick={() => setStep(6)}>One last check →</PrimaryButton>
        </div>
      </StopShell>
    );
  }

  /* ─── 6: after charge (optional) ─── */
  if (step === 6) {
    return (
      <StopShell progress={{ current: 6, total: 6 }}>
        <div className="text-center">
          <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold mb-5">
            one more · optional
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-white font-light leading-tight mb-8">
            And now — how strong is the pull?
          </h1>
          <ChargeScale
            value={after}
            onChange={setAfter}
            leftLabel="barely there"
            rightLabel="overwhelming"
          />
          <div className="mt-10 space-y-3">
            <PrimaryButton onClick={() => setStep(7)}>Keep this moment</PrimaryButton>
            <button
              type="button"
              onClick={() => setStep(7)}
              className="block w-full text-sm text-white/55 hover:text-white/80 font-light py-2 transition-colors"
            >
              Skip
            </button>
          </div>
        </div>
      </StopShell>
    );
  }

  /* ─── 7: P — closing ─── */
  return (
    <StopShell progress={null}>
      <ActivityComplete
        eyebrow="P — Proceed mindfully"
        headline={eased ? "The pull is already easing." : "You made a gap."}
        acknowledgment="You stopped, you breathed, you noticed — and you didn't act on autopilot. That gap between the urge and the action is the whole skill, and you just stood in it."
        stats={
          before !== null || after !== null
            ? [
                { label: "pull before", value: String(before ?? "—") },
                { label: "pull after", value: String(after ?? "—") },
              ]
            : []
        }
        saving={saving}
        saveError={saveError}
        nextSteps={[
          {
            label: "Continue to Urge Surfing →",
            href: "/tools/urge-surfing/start",
            description:
              "If the urge is still here, ride it out until it falls. Often the natural next move after STOP.",
          },
          {
            label: "See your grove →",
            href: "/today/grove",
            description: "The times you came back, kept in one place.",
          },
          CRISIS_NEXT_STEP,
        ]}
      >
        {observed.trim().length > 0 && (
          <div className="rounded-2xl bg-white/[0.07] border border-white/15 px-5 py-4 mb-8 text-left">
            <p className="text-[10px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold mb-2">
              You noticed
            </p>
            <p className="text-white/85 font-light leading-relaxed whitespace-pre-line">
              {observed.trim()}
            </p>
          </div>
        )}
      </ActivityComplete>
    </StopShell>
  );
}

/* ─── Ambient shell ───────────────────────────────────────────────── */

function StopShell({
  progress,
  children,
}: {
  progress: { current: number; total: number } | null;
  children: React.ReactNode;
}) {
  return (
    <Shell toolName="STOP" toolSlug="stop" progress={progress}>
      <div className="relative isolate">
        <div
          aria-hidden
          className="grounding-breath pointer-events-none absolute left-1/2 top-[34%] -z-10 h-[26rem] w-[26rem] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(201,168,76,0.16), transparent 70%)",
          }}
        />
        <div className="relative z-10">{children}</div>
      </div>
    </Shell>
  );
}

/* ─── Letter mark ─────────────────────────────────────────────────── */

function LetterMark({ letter, word }: { letter: string; word: string }) {
  return (
    <div className="text-center mb-8">
      <div className="font-serif font-light text-7xl text-btf-gold mb-2 leading-none">
        {letter}
      </div>
      <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold">
        {word}
      </p>
    </div>
  );
}
