"use client";

import { useState } from "react";
import {
  Shell,
  PrimaryButton,
  BreathingCircle,
  ChargeScale,
  ChoiceGrid,
  ActivityComplete,
  CRISIS_NEXT_STEP,
  useAutoSave,
  type CompletionStat,
  type NextStep,
} from "./_shared";
import { createToolSession } from "../../../../actions/journal";
import { timeOfDayBucket } from "../../../../lib/journalTypes";

/**
 * Box Breathing — 4-count inhale / hold / exhale / hold.
 *
 * Screens:
 *   0. Pick 4 or 8 rounds + an optional 0–10 "before" charge.
 *   1. Breathing circle animates. Auto-advances on completion.
 *   2. Optional 0–10 "after" charge.
 *   3. Closing — message derived from the before/after delta.
 *
 * The 0–10 check is the shared StateCheck (a SUDS-style self-monitoring
 * rating, not proof). Slow paced breathing is the one tool where the
 * parasympathetic framing is defensible (Zaccaro 2018), so the "eased"
 * message keeps it — but only when the person's own numbers show it.
 */

export default function BoxBreathingFlow() {
  const [stepIdx, setStepIdx] = useState(0); // 0 picker, 1 breathing, 2 after, 3 closing
  const [rounds, setRounds] = useState<4 | 8>(4);
  const [before, setBefore] = useState<number | null>(null);
  const [after, setAfter] = useState<number | null>(null);

  const isClosing = stepIdx === 3;
  const eased =
    before !== null && after !== null ? after < before : null;

  const { saving, saveError } = useAutoSave(isClosing, async () => {
    const res = await createToolSession({
      toolSlug: "box-breathing",
      toolName: "Box Breathing",
      steps: [
        {
          heading: "Rounds chosen",
          prompt: "How many rounds the user opted into.",
          userAnswer: `${rounds} rounds`,
        },
        {
          heading: "Completed",
          prompt:
            "Inhale 4, hold 4, exhale 4, hold 4 — paced by the on-screen circle.",
          userAnswer: `Completed ${rounds} rounds (${rounds * 16} seconds)`,
        },
        ...(before !== null || after !== null
          ? [
              {
                heading: "Charge before / after",
                prompt: "Optional 0–10 self-rating before and after.",
                userAnswer: `${before ?? "—"} → ${after ?? "—"}`,
              },
            ]
          : []),
      ],
      stateCheck: { before, after },
      timeOfDay: timeOfDayBucket(),
    });
    if (!res.success) throw new Error(res.error);
    return res;
  });

  /* ─── Step 0: pick rounds + optional before charge ─── */
  if (stepIdx === 0) {
    return (
      <Shell
        toolName="Box Breathing"
        toolSlug="box-breathing"
        progress={{ current: 1, total: 4 }}
      >
        <h1 className="font-serif text-3xl md:text-4xl text-white font-light leading-tight mb-3 text-center">
          How long?
        </h1>
        <p className="text-white/75 font-light leading-relaxed mb-8 text-center text-sm">
          Four rounds is about a minute, enough to interrupt a spike. Eight rounds is closer to two minutes, enough to actually settle.
        </p>

        <ChoiceGrid
          columns={2}
          value={String(rounds)}
          onChange={(v) => setRounds(v === "8" ? 8 : 4)}
          options={[
            {
              value: "4",
              label: "4 rounds",
              description: "About 1 minute. For interrupting.",
            },
            {
              value: "8",
              label: "8 rounds",
              description: "About 2 minutes. For settling.",
            },
          ]}
        />

        <div className="mt-10">
          <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold mb-2 text-center">
            Before we start · optional
          </p>
          <p className="text-sm text-white/60 font-light mb-5 text-center">
            How charged do you feel right now? Just a note to yourself.
          </p>
          <ChargeScale value={before} onChange={setBefore} />
        </div>

        <div className="mt-10">
          <PrimaryButton onClick={() => setStepIdx(1)}>Start →</PrimaryButton>
        </div>
      </Shell>
    );
  }

  /* ─── Step 1: breathing circle ─── */
  if (stepIdx === 1) {
    return (
      <Shell
        toolName="Box Breathing"
        toolSlug="box-breathing"
        progress={{ current: 2, total: 4 }}
      >
        <BreathingCircle
          secondsPerPhase={4}
          rounds={rounds}
          onComplete={() => setStepIdx(2)}
        />
      </Shell>
    );
  }

  /* ─── Step 2: optional after charge ─── */
  if (stepIdx === 2) {
    return (
      <Shell
        toolName="Box Breathing"
        toolSlug="box-breathing"
        progress={{ current: 3, total: 4 }}
      >
        <h1 className="font-serif text-3xl md:text-4xl text-white font-light leading-tight mb-3 text-center">
          Check in.
        </h1>
        <p className="text-white/75 font-light leading-relaxed mb-8 text-center text-sm">
          How charged do you feel now?
        </p>

        <ChargeScale value={after} onChange={setAfter} />

        <div className="mt-10 space-y-3">
          <PrimaryButton onClick={() => setStepIdx(3)}>Done</PrimaryButton>
          <button
            type="button"
            onClick={() => setStepIdx(3)}
            className="block w-full text-sm text-white/55 hover:text-white/80 font-light py-2 transition-colors"
          >
            Skip
          </button>
        </div>
      </Shell>
    );
  }

  /* ─── Step 3: closing ─── */
  const stats: CompletionStat[] = [
    { label: "rounds", value: String(rounds) },
    ...(before !== null || after !== null
      ? [{ label: "charge", value: `${before ?? "—"} → ${after ?? "—"}` }]
      : []),
  ];
  const nextSteps: NextStep[] = [
    ...(eased !== true
      ? [
          {
            label: "Continue to TIPP →",
            href: "/tools/tipp/start",
            description:
              "Cold water, intense exercise, paced breath, muscle release. Built for when breath alone isn't enough.",
          },
        ]
      : []),
    {
      label: "5-4-3-2-1 Grounding →",
      href: "/tools/grounding/start",
      description: "Pull yourself back into the room one sense at a time.",
    },
    CRISIS_NEXT_STEP,
    {
      label: "Back to all tools",
      href: "/tools",
      description: "See the other Tier 1 exercises.",
    },
  ];

  return (
    <Shell
      toolName="Box Breathing"
      toolSlug="box-breathing"
      progress={{ current: 4, total: 4 }}
    >
      <ActivityComplete
        eyebrow="Done"
        headline={eased ? "You brought it down." : "You paced your breath."}
        acknowledgment={
          eased === true
            ? "That's the parasympathetic nervous system settling — slow, paced breath is one of the few things shown to shift it. The body knows the pattern."
            : eased === false
              ? "Sometimes breath alone doesn't land — the body's already loaded. TIPP works on the physiology more directly; that's a fair next move."
              : "You gave the breath a few rounds. However it landed, that's enough."
        }
        stats={stats}
        saving={saving}
        saveError={saveError}
        nextSteps={nextSteps}
      />
    </Shell>
  );
}
