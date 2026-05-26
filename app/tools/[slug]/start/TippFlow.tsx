"use client";

import { useState } from "react";
import {
  Shell,
  PrimaryButton,
  GhostButton,
  BreathingCircle,
  Timer,
  CRISIS_NEXT_STEP,
  useAutoSave,
} from "./_shared";
import { createToolSession } from "../../../actions/journal";

/**
 * TIPP — physical-first distress tolerance.
 *
 * Sequence (each is its own screen):
 *   0. Intro — frame the four moves.
 *   1. T — Temperature. Instructions + 30-second timer for cold-water hold.
 *   2. I — Intense exercise. 60-second timer with "Done" tap to stop early.
 *   3. P — Paced breathing. Inline BreathingCircle, 4 rounds.
 *   4. P — Progressive muscle relaxation. Three rounds of 5-second tense-and-release,
 *          each on a different muscle group.
 *   5. Closing.
 */

type MuscleRound = { name: string; instruction: string };
const PMR_ROUNDS: MuscleRound[] = [
  {
    name: "Hands",
    instruction:
      "Make a tight fist with both hands. Squeeze. Hold the tension.",
  },
  {
    name: "Shoulders",
    instruction:
      "Lift your shoulders straight up to your ears. Press them up. Hold.",
  },
  {
    name: "Jaw and face",
    instruction:
      "Clench your jaw and scrunch your face. Hold the tension in everything above the neck.",
  },
];

export default function TippFlow() {
  const [stepIdx, setStepIdx] = useState(0); // 0..5
  const [pmrRound, setPmrRound] = useState(0); // 0..2 within step 4
  const [pmrPhase, setPmrPhase] = useState<"tense" | "release">("tense");

  const isClosing = stepIdx === 5;

  const { saving, saveError } = useAutoSave(isClosing, async () => {
    const res = await createToolSession({
      toolSlug: "tipp",
      toolName: "TIPP",
      steps: [
        {
          heading: "T — Temperature",
          prompt:
            "30 seconds of cold on the face or in the hands. Triggers the mammalian dive reflex.",
          userAnswer: "Completed 30-second cold hold.",
        },
        {
          heading: "I — Intense exercise",
          prompt: "Up to 60 seconds of all-out movement. Spends the adrenaline.",
          userAnswer: "Completed intense exercise interval.",
        },
        {
          heading: "P — Paced breathing",
          prompt: "Four rounds of 4-4-4-4 box breathing.",
          userAnswer: "Completed 4 rounds of box breathing.",
        },
        {
          heading: "P — Progressive muscle relaxation",
          prompt: "Three rounds of 5-second tense-and-release on hands, shoulders, jaw.",
          userAnswer: "Completed 3 rounds of tense and release.",
        },
      ],
    });
    if (!res.success) throw new Error(res.error);
    return res;
  });

  /* ─── 0: intro ─── */
  if (stepIdx === 0) {
    return (
      <Shell toolName="TIPP" toolSlug="tipp" progress={{ current: 1, total: 6 }}>
        <h1 className="font-serif text-3xl md:text-4xl text-white font-light leading-tight mb-3 text-center">
          Four physical moves.
        </h1>
        <p className="text-white/75 font-light leading-relaxed mb-8 text-center text-sm">
          TIPP works on the body before the brain. When emotional intensity is high enough that thinking-based tools feel impossible, this is the path. About 5 minutes.
        </p>
        <ul className="space-y-3 mb-10 text-left">
          {[
            { letter: "T", what: "Cold on the face or hands (30 seconds)." },
            { letter: "I", what: "Intense exercise (up to 60 seconds)." },
            { letter: "P", what: "Paced breathing (4 rounds)." },
            { letter: "P", what: "Tense and release (3 rounds)." },
          ].map((s, i) => (
            <li
              key={i}
              className="flex items-center gap-4 bg-white/10 border border-white/15 rounded-2xl px-4 py-3"
            >
              <span className="font-serif text-3xl text-btf-gold font-light w-8 text-center">
                {s.letter}
              </span>
              <span className="text-white/85 font-light text-sm flex-1">
                {s.what}
              </span>
            </li>
          ))}
        </ul>
        <PrimaryButton onClick={() => setStepIdx(1)}>I&rsquo;m ready →</PrimaryButton>
      </Shell>
    );
  }

  /* ─── 1: T — temperature ─── */
  if (stepIdx === 1) {
    return (
      <Shell toolName="TIPP" toolSlug="tipp" progress={{ current: 2, total: 6 }}>
        <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold mb-2 text-center">
          T &mdash; Temperature
        </p>
        <h1 className="font-serif text-2xl md:text-3xl text-white font-light leading-tight mb-3 text-center">
          Cold on the face.
        </h1>
        <p className="text-white/75 font-light leading-relaxed mb-6 text-center text-sm">
          Splash cold water on your face. Or press an ice pack or cold cloth to your forehead and cheekbones. Or hold ice in each hand. Triggers the mammalian dive reflex; the heart rate drops in seconds.
        </p>
        <p className="text-white/55 font-light leading-relaxed mb-8 text-center text-xs italic">
          Start the timer once you have the cold ready.
        </p>

        <Timer
          seconds={30}
          label="Hold the cold"
          allowEarly={false}
          onComplete={() => setStepIdx(2)}
        />
      </Shell>
    );
  }

  /* ─── 2: I — intense exercise ─── */
  if (stepIdx === 2) {
    return (
      <Shell toolName="TIPP" toolSlug="tipp" progress={{ current: 3, total: 6 }}>
        <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold mb-2 text-center">
          I &mdash; Intense exercise
        </p>
        <h1 className="font-serif text-2xl md:text-3xl text-white font-light leading-tight mb-3 text-center">
          Burn it off.
        </h1>
        <p className="text-white/75 font-light leading-relaxed mb-8 text-center text-sm">
          Jumping jacks, burpees, push-ups until you can&rsquo;t, sprint in place &mdash; whatever you have room for. Go all-out. The point is to spend the adrenaline the body has loaded.
        </p>

        <Timer
          seconds={60}
          label="Go"
          allowEarly={true}
          earlyLabel="I&rsquo;m done"
          onComplete={() => setStepIdx(3)}
        />
      </Shell>
    );
  }

  /* ─── 3: P — paced breathing ─── */
  if (stepIdx === 3) {
    return (
      <Shell toolName="TIPP" toolSlug="tipp" progress={{ current: 4, total: 6 }}>
        <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold mb-2 text-center">
          P &mdash; Paced breathing
        </p>
        <h1 className="font-serif text-2xl md:text-3xl text-white font-light leading-tight mb-6 text-center">
          Settle the breath.
        </h1>

        <BreathingCircle
          secondsPerPhase={4}
          rounds={4}
          onComplete={() => setStepIdx(4)}
        />
      </Shell>
    );
  }

  /* ─── 4: P — progressive muscle relaxation ─── */
  if (stepIdx === 4) {
    const round = PMR_ROUNDS[pmrRound];
    return (
      <Shell toolName="TIPP" toolSlug="tipp" progress={{ current: 5, total: 6 }}>
        <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold mb-2 text-center">
          P &mdash; Tense and release · Round {pmrRound + 1} of {PMR_ROUNDS.length}
        </p>
        <h1 className="font-serif text-2xl md:text-3xl text-white font-light leading-tight mb-3 text-center">
          {round.name}
        </h1>

        {pmrPhase === "tense" ? (
          <>
            <p className="text-white/85 font-light leading-relaxed mb-8 text-center">
              {round.instruction}
            </p>
            <Timer
              seconds={5}
              label="Tense — hold"
              allowEarly={false}
              onComplete={() => setPmrPhase("release")}
            />
          </>
        ) : (
          <>
            <p className="text-white/85 font-light leading-relaxed mb-2 text-center">
              Release. Let it go all at once.
            </p>
            <p className="text-white/65 font-light leading-relaxed mb-8 text-center text-sm italic">
              Notice the difference between tense and released. That&rsquo;s the whole point.
            </p>
            <PrimaryButton
              onClick={() => {
                if (pmrRound + 1 < PMR_ROUNDS.length) {
                  setPmrRound(pmrRound + 1);
                  setPmrPhase("tense");
                } else {
                  setStepIdx(5);
                }
              }}
            >
              {pmrRound + 1 < PMR_ROUNDS.length ? "Next round →" : "Finish →"}
            </PrimaryButton>
          </>
        )}
      </Shell>
    );
  }

  /* ─── 5: closing ─── */
  return (
    <Shell toolName="TIPP" toolSlug="tipp" progress={{ current: 6, total: 6 }}>
      <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold mb-3 text-center">
        Body first
      </p>
      <h1 className="font-serif text-3xl md:text-4xl text-white font-light leading-tight mb-3 text-center">
        You changed your physiology.
      </h1>
      <p className="font-serif italic text-base text-white/85 font-light leading-relaxed mb-10 text-center max-w-md mx-auto">
        Cold, exertion, paced breath, deliberate release &mdash; the body just got dialed down. The brain follows. Whatever felt impossible to think through five minutes ago should feel approachable now.
      </p>

      {saving && (
        <p className="text-xs text-white/55 text-center mb-4">
          Saving to your journal…
        </p>
      )}
      {saveError && (
        <div
          role="alert"
          className="mb-6 rounded-xl bg-red-900/30 border border-red-400/30 text-red-100 text-sm p-4"
        >
          {saveError}
        </div>
      )}

      <div className="space-y-3">
        <a
          href="/tools/thought-record/start"
          className="block bg-white/10 hover:bg-white/15 border border-white/15 hover:border-white/30 rounded-2xl px-5 py-4 transition-all"
        >
          <p className="font-medium text-white">Continue to CBT Thought Record →</p>
          <p className="text-xs text-white/65 font-light mt-1 leading-relaxed">
            With the body settled, this is the moment to look at the thought driving everything.
          </p>
        </a>
        <a
          href="/tools/stop/start"
          className="block bg-white/10 hover:bg-white/15 border border-white/15 hover:border-white/30 rounded-2xl px-5 py-4 transition-all"
        >
          <p className="font-medium text-white">STOP →</p>
          <p className="text-xs text-white/65 font-light mt-1 leading-relaxed">
            Lock in what just happened: gap between urge and action.
          </p>
        </a>
        <a
          href={CRISIS_NEXT_STEP.href}
          className="block bg-white/10 hover:bg-white/15 border border-white/15 hover:border-white/30 rounded-2xl px-5 py-4 transition-all"
        >
          <p className="font-medium text-white">{CRISIS_NEXT_STEP.label}</p>
          <p className="text-xs text-white/65 font-light mt-1 leading-relaxed">
            {CRISIS_NEXT_STEP.description}
          </p>
        </a>
        <a
          href="/tools"
          className="block bg-white/10 hover:bg-white/15 border border-white/15 hover:border-white/30 rounded-2xl px-5 py-4 transition-all"
        >
          <p className="font-medium text-white">Back to all tools</p>
        </a>
      </div>
    </Shell>
  );
}
