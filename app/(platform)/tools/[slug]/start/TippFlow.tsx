"use client";

import { useState } from "react";
import {
  Shell,
  PrimaryButton,
  Timer,
  PacedBreathingCircle,
  ChargeScale,
  ActivityComplete,
  WelcomeScreen,
  CRISIS_NEXT_STEP,
  useAutoSave,
} from "./_shared";
import { createToolSession } from "../../../../actions/journal";
import { timeOfDayBucket } from "../../../../lib/journalTypes";

/**
 * TIPP — physical-first distress tolerance (DBT). Brings high arousal DOWN
 * fast: Temperature, Intense exercise, Paced breathing, Paired muscle
 * relaxation.
 *
 * Flow (uniform with the other tools):
 *   0. Welcome (shared format) — the four moves + a safety caution note below.
 *   1. Optional 0–10 "before" charge (the data check on its own page).
 *   2–5. T / I / paced breathing / PMR — each EXPLAINS first, then the user
 *        taps Begin, then the guided pacing runs (nothing auto-starts).
 *   6. Optional 0–10 "after" charge.
 *   7. Closing (ActivityComplete → streak chip + grove).
 *
 * Calm, not stimulating. Claims kept defensible (crisis skill, not a
 * trial-proven package or a cure).
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

type Step = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

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

  const isClosing = step === 7;
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

  /* ─── 0: welcome — four moves + safety caution below ─── */
  if (step === 0) {
    return (
      <WelcomeScreen
        toolName="TIPP"
        toolSlug="tipp"
        headline="Four moves for the body."
        body="When intensity is too high for thinking-based tools, TIPP works on your body first to bring it down. A short reset for the moment — go at your own pace."
        ctaLabel="I'm ready to begin"
        onBegin={() => go(1)}
        footer={
          <div className="rounded-2xl bg-white/[0.06] border border-btf-gold/40 px-5 py-4 flex gap-3 text-left">
            <CautionTriangle />
            <p className="text-white/80 font-light text-sm leading-relaxed">
              <span className="text-btf-gold-light font-medium">Before you start:</span>{" "}
              the cold-water and intense-exercise steps can be hard on the body.
              If you have a heart condition, an eating disorder, or faint easily,
              skip those two steps or check with a doctor first.
            </p>
          </div>
        }
      >
        <ul className="space-y-3 text-left">
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
      </WelcomeScreen>
    );
  }

  /* ─── 1: before charge (optional) ─── */
  if (step === 1) {
    return (
      <TippShell progress={{ current: 1, total: 7 }}>
        <div className="text-center">
          <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold mb-5">
            before we begin · optional
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-white font-light leading-tight mb-8">
            How charged do you feel right now?
          </h1>
          <ChargeScale value={before} onChange={setBefore} />
          <div className="mt-10 space-y-3">
            <PrimaryButton onClick={() => go(2)}>Begin →</PrimaryButton>
            <button
              type="button"
              onClick={() => go(2)}
              className="block w-full text-sm text-white/55 hover:text-white/80 font-light py-2 transition-colors"
            >
              Skip — just take me there
            </button>
          </div>
        </div>
      </TippShell>
    );
  }

  /* ─── 2: T — Temperature (read → Begin → 30s) ─── */
  if (step === 2) {
    return (
      <TippShell progress={{ current: 2, total: 7 }}>
        <StepEyebrow>T — Temperature</StepEyebrow>
        {!started ? (
          <ReadyScreen
            title="Cold on the face."
            body="Splash cold water on your face, or hold a cold pack or cool cloth to your forehead and around your eyes for about 30 seconds. Don't hold your breath or submerge — just the cold. It triggers a reflex that slows your heart."
            onBegin={() => setStarted(true)}
            onSkip={() => go(3)}
          />
        ) : (
          <Timer seconds={30} label="Hold the cold" allowEarly={false} onComplete={() => go(3)} />
        )}
      </TippShell>
    );
  }

  /* ─── 3: I — Intense exercise (read → Begin → soft 60s timer) ─── */
  if (step === 3) {
    return (
      <TippShell progress={{ current: 3, total: 7 }}>
        <StepEyebrow>I — Intense exercise</StepEyebrow>
        {!started ? (
          <ReadyScreen
            title="Move it out."
            body="Jumping jacks, a brisk walk on the spot, push-ups — whatever you have room for. Move to comfortable exertion to spend the adrenaline; don't overdo it. If a racing heart tends to feed panic for you, skip this and go to the breathing."
            beginLabel="Begin — start the timer"
            onBegin={() => setStarted(true)}
            onSkip={() => go(4)}
          />
        ) : (
          <Timer
            seconds={60}
            label="Move"
            allowEarly={true}
            earlyLabel="I&rsquo;m done"
            onComplete={() => go(4)}
          />
        )}
      </TippShell>
    );
  }

  /* ─── 4: P — Paced breathing (read → Begin → paced circle) ─── */
  if (step === 4) {
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
          <PacedBreathingCircle inhale={4} exhale={6} rounds={5} onComplete={() => go(5)} />
        )}
      </TippShell>
    );
  }

  /* ─── 5: P — Paired muscle relaxation ─── */
  if (step === 5) {
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
                  go(6);
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

  /* ─── 6: after charge (optional) ─── */
  if (step === 6) {
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
            <PrimaryButton onClick={() => go(7)}>Keep this</PrimaryButton>
            <button
              type="button"
              onClick={() => go(7)}
              className="block w-full text-sm text-white/55 hover:text-white/80 font-light py-2 transition-colors"
            >
              Skip
            </button>
          </div>
        </div>
      </TippShell>
    );
  }

  /* ─── 7: closing ─── */
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
