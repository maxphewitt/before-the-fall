"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Shell,
  PrimaryButton,
  BreathingCircle,
  ChoiceGrid,
  CRISIS_NEXT_STEP,
  useAutoSave,
} from "./_shared";
import { createToolSession } from "../../../../actions/journal";

/**
 * Box Breathing — 4-count inhale / hold / exhale / hold.
 *
 * Screens:
 *   0. Pick 4 or 8 rounds. (Some users want quick reset; some want a
 *      longer settle. Default 4.)
 *   1. Breathing circle animates. Auto-advances on completion.
 *   2. Before/after check — three buttons. Then closing.
 */

type Outcome = "calmer" | "same" | "still-rough";

export default function BoxBreathingFlow() {
  const [stepIdx, setStepIdx] = useState(0); // 0 = picker, 1 = breathing, 2 = after check + close
  const [rounds, setRounds] = useState<4 | 8>(4);
  const [outcome, setOutcome] = useState<Outcome | null>(null);

  const isClosing = stepIdx === 2;

  const { saving, saveError } = useAutoSave(
    isClosing && outcome !== null,
    async () => {
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
          {
            heading: "After check",
            prompt: "How does it feel now compared to when you started?",
            userAnswer:
              outcome === "calmer"
                ? "Calmer"
                : outcome === "same"
                  ? "Same"
                  : "Still rough",
          },
        ],
      });
      if (!res.success) throw new Error(res.error);
      return res;
    }
  );

  /* ─── Step 0: pick rounds ─── */
  if (stepIdx === 0) {
    return (
      <Shell
        toolName="Box Breathing"
        toolSlug="box-breathing"
        progress={{ current: 1, total: 3 }}
      >
        <h1 className="font-serif text-3xl md:text-4xl text-white font-light leading-tight mb-3 text-center">
          How long?
        </h1>
        <p className="text-white/75 font-light leading-relaxed mb-10 text-center text-sm">
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
          <PrimaryButton onClick={() => setStepIdx(1)}>
            Start →
          </PrimaryButton>
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
        progress={{ current: 2, total: 3 }}
      >
        <BreathingCircle
          secondsPerPhase={4}
          rounds={rounds}
          onComplete={() => setStepIdx(2)}
        />
      </Shell>
    );
  }

  /* ─── Step 2: after check + closing ─── */
  return (
    <Shell
      toolName="Box Breathing"
      toolSlug="box-breathing"
      progress={{ current: 3, total: 3 }}
    >
      <h1 className="font-serif text-3xl md:text-4xl text-white font-light leading-tight mb-3 text-center">
        Check in.
      </h1>
      <p className="text-white/75 font-light leading-relaxed mb-8 text-center text-sm">
        How does it feel now compared to when you started?
      </p>

      <ChoiceGrid
        columns={3}
        value={outcome}
        onChange={(v) => setOutcome(v as Outcome)}
        options={[
          { value: "calmer", label: "Calmer" },
          { value: "same", label: "Same" },
          { value: "still-rough", label: "Still rough" },
        ]}
      />

      {outcome && (
        <>
          <div className="mt-10 text-center">
            <p className="font-serif italic text-base text-white/85 font-light leading-relaxed mb-8 max-w-md mx-auto">
              {outcome === "calmer"
                ? "That's the parasympathetic nervous system kicking in. Two minutes of paced breath can do that — the body knows the pattern."
                : outcome === "same"
                  ? "Sometimes it doesn't land. The body's already loaded. TIPP works on the physiology directly — that's the next move."
                  : "If it's still hard, that's information. TIPP is built for exactly this — when breath alone isn't enough."}
            </p>
          </div>

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
            {outcome !== "calmer" && (
              <Link
                href="/tools/tipp/start"
                className="block bg-white/10 hover:bg-white/15 border border-white/15 hover:border-white/30 rounded-2xl px-5 py-4 transition-all"
              >
                <p className="font-medium text-white">Continue to TIPP →</p>
                <p className="text-xs text-white/65 font-light mt-1 leading-relaxed">
                  Cold water, intense exercise, paced breath, muscle release. Built for when breath alone isn&rsquo;t enough.
                </p>
              </Link>
            )}
            <Link
              href="/tools/grounding/start"
              className="block bg-white/10 hover:bg-white/15 border border-white/15 hover:border-white/30 rounded-2xl px-5 py-4 transition-all"
            >
              <p className="font-medium text-white">5-4-3-2-1 Grounding →</p>
              <p className="text-xs text-white/65 font-light mt-1 leading-relaxed">
                Pull yourself back into the room one sense at a time.
              </p>
            </Link>
            <a
              href={CRISIS_NEXT_STEP.href}
              className="block bg-white/10 hover:bg-white/15 border border-white/15 hover:border-white/30 rounded-2xl px-5 py-4 transition-all"
            >
              <p className="font-medium text-white">{CRISIS_NEXT_STEP.label}</p>
              <p className="text-xs text-white/65 font-light mt-1 leading-relaxed">
                {CRISIS_NEXT_STEP.description}
              </p>
            </a>
            <Link
              href="/tools"
              className="block bg-white/10 hover:bg-white/15 border border-white/15 hover:border-white/30 rounded-2xl px-5 py-4 transition-all"
            >
              <p className="font-medium text-white">Back to all tools</p>
              <p className="text-xs text-white/65 font-light mt-1 leading-relaxed">
                See the other Tier 1 exercises.
              </p>
            </Link>
          </div>
        </>
      )}
    </Shell>
  );
}
