"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Shell,
  PrimaryButton,
  ClosingScreen,
  CRISIS_NEXT_STEP,
  useAutoSave,
  type NextStep,
} from "./_shared";
import { createToolSession } from "../../../actions/journal";

/**
 * 5-4-3-2-1 Grounding.
 *
 * One sense per screen, revealed sequentially. Each sense has a text
 * input with a specific real-example placeholder. At the end, show
 * everything they typed back with the closing line.
 */

type SenseStep = {
  count: number;
  sense: string;
  verb: string;
  prompt: string;
  example: string;
};

const SENSES: SenseStep[] = [
  {
    count: 5,
    sense: "See",
    verb: "see",
    prompt:
      "Look away from your screen. What's in the room with you? Name them — even just one word each.",
    example: "lamp, window, my dog, a cup, the corner of the rug",
  },
  {
    count: 4,
    sense: "Feel",
    verb: "feel",
    prompt:
      "What's touching your skin or what can you touch? Name the texture or temperature.",
    example: "the chair under my legs, my hoodie sleeve, cold floor, my phone case",
  },
  {
    count: 3,
    sense: "Hear",
    verb: "hear",
    prompt:
      "Listen for three sounds. Name them. Close ones, far ones, both.",
    example: "the fan, traffic outside, my own breathing",
  },
  {
    count: 2,
    sense: "Smell",
    verb: "smell",
    prompt:
      "Two scents. If nothing is obvious, smell your own arm or a nearby object.",
    example: "coffee on my desk, the soap on my hands",
  },
  {
    count: 1,
    sense: "Taste",
    verb: "taste",
    prompt:
      "One thing you can taste right now. The lingering taste in your mouth counts.",
    example: "the mint from earlier",
  },
];

export default function GroundingFlow() {
  const router = useRouter();
  const [stepIdx, setStepIdx] = useState(0); // 0..4 = senses; 5 = closing
  const [answers, setAnswers] = useState<string[]>(SENSES.map(() => ""));

  const isClosing = stepIdx === SENSES.length;

  const { saving, saveError } = useAutoSave(
    isClosing && answers.some((a) => a.trim().length > 0),
    async () => {
      const res = await createToolSession({
        toolSlug: "grounding",
        toolName: "5-4-3-2-1 Grounding",
        steps: SENSES.map((s, i) => ({
          heading: `${s.count} things I can ${s.verb}`,
          prompt: s.prompt,
          userAnswer: answers[i],
        })),
      });
      if (!res.success) throw new Error(res.error);
      return res;
    }
  );

  function updateAnswer(value: string) {
    setAnswers((prev) => {
      const next = [...prev];
      next[stepIdx] = value;
      return next;
    });
  }

  if (isClosing) {
    return (
      <Shell
        toolName="5-4-3-2-1"
        toolSlug="grounding"
        progress={{ current: SENSES.length + 1, total: SENSES.length + 1 }}
      >
        <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold mb-3 text-center">
          You named the room
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-white font-light leading-tight mb-3 text-center">
          This is where you are.
        </h1>
        <p className="font-serif italic text-lg text-white/85 font-light leading-relaxed mb-8 text-center max-w-md mx-auto">
          This moment is real. Whatever pulled you out of it, this is what you came back to.
        </p>

        <ul className="space-y-3 mb-10">
          {SENSES.map((s, i) => (
            <li
              key={s.sense}
              className="bg-white/10 border border-white/15 rounded-2xl px-5 py-4"
            >
              <p className="text-[10px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold mb-2">
                {s.count} {s.sense}
              </p>
              <p className="text-white font-light leading-relaxed whitespace-pre-line">
                {answers[i] || (
                  <span className="italic text-white/40">(skipped)</span>
                )}
              </p>
            </li>
          ))}
        </ul>

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

        <NextStepsList
          steps={[
            {
              label: "Continue to Box Breathing →",
              href: "/tools/box-breathing/start",
              description:
                "Pace your breath now that you&rsquo;re back in the room. Often the natural next move.",
            },
            {
              label: "Back to all tools",
              href: "/tools",
              description: "See the other Tier 1 exercises.",
            },
            CRISIS_NEXT_STEP,
          ]}
        />
      </Shell>
    );
  }

  /* ─── Sense screens ─── */
  const step = SENSES[stepIdx];
  return (
    <Shell
      toolName="5-4-3-2-1"
      toolSlug="grounding"
      progress={{ current: stepIdx + 1, total: SENSES.length + 1 }}
    >
      <div className="text-center mb-6">
        <div className="font-serif font-light text-7xl text-btf-gold mb-2">
          {step.count}
        </div>
        <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold">
          things you can {step.verb}
        </p>
      </div>

      <p className="text-white/85 font-light leading-relaxed mb-6 text-base">
        {step.prompt}
      </p>

      <label className="block mb-8">
        <textarea
          value={answers[stepIdx]}
          onChange={(e) => updateAnswer(e.target.value)}
          autoFocus
          rows={4}
          placeholder={step.example}
          aria-label={`${step.count} things you can ${step.verb}`}
          className="w-full rounded-2xl bg-white/10 border-2 border-white/20 focus:border-btf-gold focus:outline-none px-5 py-4 text-base text-white font-light leading-relaxed resize-y placeholder:text-white/40 placeholder:italic transition-colors"
        />
      </label>

      <PrimaryButton
        onClick={() => setStepIdx(stepIdx + 1)}
        disabled={answers[stepIdx].trim().length === 0}
      >
        {stepIdx === SENSES.length - 1 ? "Finish →" : "Next →"}
      </PrimaryButton>
    </Shell>
  );
}

function NextStepsList({ steps }: { steps: NextStep[] }) {
  return (
    <div className="space-y-3">
      {steps.map((step) => (
        <a
          key={step.label}
          href={step.href}
          className="block bg-white/10 hover:bg-white/15 border border-white/15 hover:border-white/30 rounded-2xl px-5 py-4 transition-all"
        >
          <p className="font-medium text-white">{step.label}</p>
          {step.description && (
            <p
              className="text-xs text-white/65 font-light mt-1 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: step.description }}
            />
          )}
        </a>
      ))}
    </div>
  );
}
