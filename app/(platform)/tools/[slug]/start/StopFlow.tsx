"use client";

import { useState } from "react";
import {
  Shell,
  PrimaryButton,
  PacedBreathingCircle,
  ActivityComplete,
  CRISIS_NEXT_STEP,
  useAutoSave,
} from "./_shared";
import { GoldCrossIcon } from "../../../../components/StreakChip";
import { createToolSession } from "../../../../actions/journal";

/**
 * STOP — DBT crisis-survival skill: a deliberate pause between urge and
 * action. Stop · Take a step back · Observe · Proceed mindfully.
 *
 * Rebuilt (calm-game craft, dialed to a whisper):
 *   - Each step is single-focus with staged reveals and eased motion; every
 *     tap is acknowledged; nothing auto-fires.
 *   - "Take a step back" uses the best-evidenced lever — a few slow breaths
 *     (the same paced circle as the other tools).
 *   - "Observe" captures the user's own words; they're reflected back at the
 *     end (real feedback, not hollow praise).
 *   - A path-aware "you're not alone" beat (Christ was tempted too / a Stoic
 *     framing) — common-humanity, shame-reducing.
 *   - Closes on ActivityComplete (streak chip + mastery archive in the grove)
 *     so return is driven by meaning, not streak-pressure.
 *
 * Claims kept defensible: STOP is a recognized DBT skill for putting a gap
 * between urge and action — not a trial-proven, standalone cure, and not a
 * substitute for crisis care.
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
  const [step, setStep] = useState(0); // 0 title,1 S,2 T,3 O,4 encouragement,5 closing
  const [started, setStarted] = useState(false); // breath gate on T
  const [observed, setObserved] = useState("");

  const enc = ENCOURAGEMENT[path];
  const isClosing = step === 5;

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
    });
    if (!res.success) throw new Error(res.error);
    return res;
  });

  /* ─── 0: calm intro ─── */
  if (step === 0) return <Intro onContinue={() => setStep(1)} />;

  /* ─── 1: S — Stop ─── */
  if (step === 1) {
    return (
      <StopShell progress={{ current: 1, total: 5 }}>
        <LetterMark letter="S" word="Stop" />
        <p className="text-white/85 font-light leading-relaxed mb-10 text-center max-w-md mx-auto">
          Freeze where you are. Don&rsquo;t move, don&rsquo;t reach, don&rsquo;t
          speak. Just for a few seconds — that&rsquo;s the whole job right now.
        </p>
        <PrimaryButton onClick={() => setStep(2)}>I&rsquo;m still →</PrimaryButton>
      </StopShell>
    );
  }

  /* ─── 2: T — Take a step back (guided breath) ─── */
  if (step === 2) {
    return (
      <StopShell progress={{ current: 2, total: 5 }}>
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
            onComplete={() => setStep(3)}
          />
        )}
      </StopShell>
    );
  }

  /* ─── 3: O — Observe ─── */
  if (step === 3) {
    return (
      <StopShell progress={{ current: 3, total: 5 }}>
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
        <PrimaryButton onClick={() => setStep(4)}>I&rsquo;ve noticed →</PrimaryButton>
      </StopShell>
    );
  }

  /* ─── 4: Encouragement — you're not alone ─── */
  if (step === 4) {
    return (
      <StopShell progress={{ current: 4, total: 5 }}>
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
          <PrimaryButton onClick={() => setStep(5)}>
            Proceed mindfully →
          </PrimaryButton>
        </div>
      </StopShell>
    );
  }

  /* ─── 5: P — closing ─── */
  return (
    <StopShell progress={{ current: 5, total: 5 }}>
      <ActivityComplete
        eyebrow="P — Proceed mindfully"
        headline="You made a gap."
        acknowledgment="You stopped, you breathed, you noticed — and you didn't act on autopilot. That gap between the urge and the action is the whole skill, and you just stood in it."
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

/* ─── Calm intro ──────────────────────────────────────────────────── */

function Intro({ onContinue }: { onContinue: () => void }) {
  return (
    <StopShell progress={null}>
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center btf-fade-up">
        <GoldCrossIcon width={32} />
        <h1 className="font-serif text-5xl md:text-6xl text-white font-light leading-none mt-7 mb-4">
          Stop.
        </h1>
        <p className="text-white/75 font-light leading-relaxed max-w-sm mb-6">
          A pause between the urge and what you do next. Four small moves — and
          you set the pace.
        </p>
        <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold-light/70 font-semibold mb-12">
          Stop &middot; Take a step back &middot; Observe &middot; Proceed
        </p>
        <div className="w-full max-w-xs">
          <PrimaryButton onClick={onContinue}>Begin</PrimaryButton>
        </div>
      </div>
    </StopShell>
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
