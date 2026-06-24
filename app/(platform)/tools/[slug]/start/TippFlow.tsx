"use client";

import { useState } from "react";
import {
  Shell,
  PrimaryButton,
  Timer,
  PacedBreathingCircle,
  ChargeScale,
  ActivityComplete,
  CRISIS_NEXT_STEP,
  useAutoSave,
} from "./_shared";
import { createToolSession } from "../../../../actions/journal";
import { timeOfDayBucket } from "../../../../lib/journalTypes";

/**
 * TIPP — physical-first distress tolerance (DBT). Brings high arousal
 * DOWN fast: Temperature, Intense exercise, Paced breathing, Paired
 * muscle relaxation.
 *
 * Design (calm, not stimulating — TIPP is a crisis down-regulator):
 *   - Nothing auto-starts. Every step EXPLAINS first, then the user taps
 *     Begin, then the guided pacing runs. (Fixes the old auto-start timers.)
 *   - One safety caution up front; the two physical steps (cold, exercise)
 *     can be skipped.
 *   - Uniform with 5-4-3-2-1 / breathing: dark Shell, slow ambient glow,
 *     gold circular pacers.
 *   - Optional 0–10 before/after charge (TIPP's goal IS lowering arousal,
 *     so a SUDS-style self-rating fits) → reflected in the grove.
 *
 * Claims kept defensible: TIPP is a clinically-taught crisis skill, not a
 * trial-proven package; it works on the body's physiology to bring arousal
 * down in the moment — not a cure or a substitute for crisis care.
 */

type PmrGroup = { name: string; instruction: string };
const PMR_GROUPS: PmrGroup[] = [
  {
    name: "Hands",
    instruction:
      "As you breathe in, make a tight fist with both hands and squeeze. Hold it while you read.",
  },
  {
    name: "Shoulders",
    instruction:
      "As you breathe in, lift your shoulders up toward your ears and press. Hold it.",
  },
  {
    name: "Jaw and face",
    instruction:
      "As you breathe in, gently clench your jaw and scrunch your face. Hold it.",
  },
];

type Step = 0 | 1 | 2 | 3 | 4 | 5 | 6; // intro, T, I, Pbreath, PMR, after, closing

export default function TippFlow() {
  const [step, setStep] = useState<Step>(0);
  const [started, setStarted] = useState(false); // read → Begin gate for timed steps
  const [before, setBefore] = useState<number | null>(null);
  const [after, setAfter] = useState<number | null>(null);
  const [pmrRound, setPmrRound] = useState(0);
  const [pmrPhase, setPmrPhase] = useState<"ready" | "tense" | "release">("ready");

  function go(next: Step) {
    setStarted(false);
    setStep(next);
  }

  const isClosing = step === 6;
  const eased = before !== null && after !== null ? after < before : null;

  const { saving, saveError } = useAutoSave(isClosing, async () => {
    const res = await createToolSession({
      toolSlug: "tipp",
      toolName: "TIPP",
      steps: [
        {
          heading: "TIPP sequence",
          prompt:
            "Temperature, intense exercise, paced breathing, and paired muscle relaxation — physical skills to bring arousal down.",
          userAnswer: "Worked through the TIPP steps.",
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

  /* ─── 0: intro + safety caution + optional before charge ─── */
  if (step === 0) {
    return (
      <TippShell progress={{ current: 1, total: 7 }}>
        <h1 className="font-serif text-3xl md:text-4xl text-white font-light leading-tight mb-3 text-center">
          Four moves for the body.
        </h1>
        <p className="text-white/75 font-light leading-relaxed mb-6 text-center text-sm">
          When intensity is too high for thinking-based tools, TIPP works on
          your body first to bring it down. It&rsquo;s a short-term reset for the
          moment — go at your own pace.
        </p>

        <div className="rounded-2xl bg-white/[0.06] border border-btf-gold/40 px-5 py-4 mb-8 flex gap-3">
          <CautionTriangle />
          <p className="text-white/80 font-light text-sm leading-relaxed">
            <span className="text-btf-gold-light font-medium">Before you start:</span>{" "}
            the cold-water and intense-exercise steps can be hard on the body. If
            you have a heart condition, an eating disorder, or faint easily, skip
            those two steps or check with a doctor first.
          </p>
        </div>

        <ul className="space-y-3 mb-8 text-left">
          {[
            { letter: "T", what: "Cold on the face — slows the heart in seconds." },
            { letter: "I", what: "A burst of movement — spends the adrenaline." },
            { letter: "P", what: "Slow paced breathing." },
            { letter: "P", what: "Tense and release, muscle by muscle." },
          ].map((s, i) => (
            <li
              key={i}
              className="flex items-center gap-4 bg-white/10 border border-white/15 rounded-2xl px-4 py-3"
            >
              <span className="font-serif text-3xl text-btf-gold font-light w-8 text-center">
                {s.letter}
              </span>
              <span className="text-white/85 font-light text-sm flex-1">{s.what}</span>
            </li>
          ))}
        </ul>

        <div className="mb-8">
          <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold mb-2 text-center">
            Before we start · optional
          </p>
          <p className="text-sm text-white/60 font-light mb-5 text-center">
            How charged do you feel right now?
          </p>
          <ChargeScale value={before} onChange={setBefore} />
        </div>

        <PrimaryButton onClick={() => go(1)}>I&rsquo;m ready →</PrimaryButton>
      </TippShell>
    );
  }

  /* ─── 1: T — Temperature (read → Begin → 30s) ─── */
  if (step === 1) {
    return (
      <TippShell progress={{ current: 2, total: 7 }}>
        <StepEyebrow>T — Temperature</StepEyebrow>
        {!started ? (
          <ReadyScreen
            title="Cold on the face."
            body="Splash cold water on your face, or hold a cold pack or cool cloth to your forehead and around your eyes for about 30 seconds. Don't hold your breath or submerge — just the cold. It triggers a reflex that slows your heart."
            onBegin={() => setStarted(true)}
            onSkip={() => go(2)}
          />
        ) : (
          <Timer
            seconds={30}
            label="Hold the cold"
            allowEarly={false}
            onComplete={() => go(2)}
          />
        )}
      </TippShell>
    );
  }

  /* ─── 2: I — Intense exercise (read → Begin → soft 60s timer, done early) ─── */
  if (step === 2) {
    return (
      <TippShell progress={{ current: 3, total: 7 }}>
        <StepEyebrow>I — Intense exercise</StepEyebrow>
        {!started ? (
          <ReadyScreen
            title="Move it out."
            body="Jumping jacks, a brisk walk on the spot, push-ups — whatever you have room for. Move to comfortable exertion to spend the adrenaline; don't overdo it. If a racing heart tends to feed panic for you, skip this and go to the breathing."
            beginLabel="Begin — start the timer"
            onBegin={() => setStarted(true)}
            onSkip={() => go(3)}
          />
        ) : (
          <Timer
            seconds={60}
            label="Move"
            allowEarly={true}
            earlyLabel="I&rsquo;m done"
            onComplete={() => go(3)}
          />
        )}
      </TippShell>
    );
  }

  /* ─── 3: P — Paced breathing (read → Begin → paced circle) ─── */
  if (step === 3) {
    return (
      <TippShell progress={{ current: 4, total: 7 }}>
        <StepEyebrow>P — Paced breathing</StepEyebrow>
        {!started ? (
          <ReadyScreen
            title="Slow the breath."
            body="Breathe slowly — in for four, out for six, letting the out-breath be gentle and a little longer. Follow the circle. Five slow rounds."
            onBegin={() => setStarted(true)}
          />
        ) : (
          <PacedBreathingCircle
            inhale={4}
            exhale={6}
            rounds={5}
            onComplete={() => go(4)}
          />
        )}
      </TippShell>
    );
  }

  /* ─── 4: P — Paired muscle relaxation (per group: read → tense → release) ─── */
  if (step === 4) {
    const group = PMR_GROUPS[pmrRound];
    return (
      <TippShell progress={{ current: 5, total: 7 }}>
        <StepEyebrow>
          P — Tense and release · {pmrRound + 1} of {PMR_GROUPS.length}
        </StepEyebrow>
        <h1 className="font-serif text-2xl md:text-3xl text-white font-light leading-tight mb-3 text-center">
          {group.name}
        </h1>

        {pmrPhase === "ready" && (
          <>
            <p className="text-white/85 font-light leading-relaxed mb-8 text-center max-w-md mx-auto">
              {group.instruction}
            </p>
            <PrimaryButton onClick={() => setPmrPhase("tense")}>
              Tense &mdash; begin →
            </PrimaryButton>
          </>
        )}

        {pmrPhase === "tense" && (
          <Timer
            seconds={5}
            label="Hold the tension"
            allowEarly={false}
            onComplete={() => setPmrPhase("release")}
          />
        )}

        {pmrPhase === "release" && (
          <>
            <p className="text-white/85 font-light leading-relaxed mb-2 text-center">
              Now let it go, all at once, with a slow breath out.
            </p>
            <p className="text-white/65 font-light leading-relaxed mb-8 text-center text-sm italic">
              Notice the difference between tense and released. That&rsquo;s the
              part that settles you.
            </p>
            <PrimaryButton
              onClick={() => {
                if (pmrRound + 1 < PMR_GROUPS.length) {
                  setPmrRound(pmrRound + 1);
                  setPmrPhase("ready");
                } else {
                  go(5);
                }
              }}
            >
              {pmrRound + 1 < PMR_GROUPS.length ? "Next group →" : "Done →"}
            </PrimaryButton>
          </>
        )}
      </TippShell>
    );
  }

  /* ─── 5: after charge (optional) ─── */
  if (step === 5) {
    return (
      <TippShell progress={{ current: 6, total: 7 }}>
        <div className="text-center">
          <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold mb-5">
            one more · optional
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-white font-light leading-tight mb-8">
            How charged do you feel now?
          </h1>
          <ChargeScale value={after} onChange={setAfter} />
          <div className="mt-10 space-y-3">
            <PrimaryButton onClick={() => go(6)}>Keep this</PrimaryButton>
            <button
              type="button"
              onClick={() => go(6)}
              className="block w-full text-sm text-white/55 hover:text-white/80 font-light py-2 transition-colors"
            >
              Skip
            </button>
          </div>
        </div>
      </TippShell>
    );
  }

  /* ─── 6: closing ─── */
  return (
    <TippShell progress={{ current: 7, total: 7 }}>
      <ActivityComplete
        eyebrow="Body first"
        headline={eased ? "You brought it down." : "You worked through it."}
        acknowledgment={
          eased === true
            ? "Cold, movement, slow breath, deliberate release — your body just got dialed down a notch, and the mind tends to follow."
            : "Cold, movement, slow breath, deliberate release. However it landed, you gave your body the reset — that's the skill."
        }
        stats={
          before !== null || after !== null
            ? [
                { label: "before", value: String(before ?? "—") },
                { label: "after", value: String(after ?? "—") },
              ]
            : []
        }
        saving={saving}
        saveError={saveError}
        nextSteps={[
          {
            label: "Continue to CBT Thought Record →",
            href: "/tools/thought-record/start",
            description:
              "With the body settled, this is the moment to look at the thought driving it.",
          },
          {
            label: "See your grove →",
            href: "/today/grove",
            description: "Your progress and the times you came back, all in one place.",
          },
          CRISIS_NEXT_STEP,
          {
            label: "Back to all tools",
            href: "/tools",
            description: "See the other Tier 1 exercises.",
          },
        ]}
      />
    </TippShell>
  );
}

/* ─── Shared bits ─────────────────────────────────────────────────── */

function TippShell({
  progress,
  children,
}: {
  progress: { current: number; total: number } | null;
  children: React.ReactNode;
}) {
  return (
    <Shell toolName="TIPP" toolSlug="tipp" progress={progress}>
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

function StepEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold mb-2 text-center">
      {children}
    </p>
  );
}

function ReadyScreen({
  title,
  body,
  beginLabel = "Begin →",
  onBegin,
  onSkip,
}: {
  title: string;
  body: string;
  beginLabel?: string;
  onBegin: () => void;
  onSkip?: () => void;
}) {
  return (
    <>
      <h1 className="font-serif text-2xl md:text-3xl text-white font-light leading-tight mb-3 text-center">
        {title}
      </h1>
      <p className="text-white/80 font-light leading-relaxed mb-8 text-center text-sm max-w-md mx-auto">
        {body}
      </p>
      <PrimaryButton onClick={onBegin}>{beginLabel}</PrimaryButton>
      {onSkip && (
        <button
          type="button"
          onClick={onSkip}
          className="block w-full text-sm text-white/55 hover:text-white/80 font-light py-3 mt-1 transition-colors"
        >
          Skip this step
        </button>
      )}
    </>
  );
}

function CautionTriangle() {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="text-btf-gold-light flex-shrink-0 mt-0.5"
    >
      <path d="M10.3 3.3 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.3a2 2 0 0 0-3.4 0z" />
      <path d="M12 9v4M12 17h.01" />
    </svg>
  );
}
