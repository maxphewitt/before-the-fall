"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Shell,
  PrimaryButton,
  GhostButton,
  IntensitySlider,
  CRISIS_NEXT_STEP,
  useAutoSave,
} from "./_shared";
import { createToolSession } from "../../../actions/journal";

/**
 * Urge Surfing.
 *
 * Screens:
 *   0. Intensity check — 1–10 slider. Required before starting.
 *   1. Wave session. Animated cresting wave for SESSION_SECONDS total.
 *      At 4 checkpoint times, a re-rate prompt slides in over the
 *      animation; the user picks a new 1–10 rating and keeps watching.
 *      The wave visually decays after roughly the 30% mark — research
 *      from Marlatt & Gordon shows urges peak then fall.
 *   2. Closing — simple SVG line chart of the 5 ratings + "Look at that.
 *      You rode it down." or "You stayed with it" if it didn't drop.
 *      Saved to journal with the time-series.
 *
 * The user can end the session early (e.g. urge has passed) via a button.
 * A "still rough" path on the closing screen routes to TIPP.
 */

const SESSION_SECONDS = 600; // 10 minutes
const CHECKPOINTS: number[] = [150, 300, 450, 600]; // 2.5m, 5m, 7.5m, 10m (end)

type Rating = { atSecond: number; value: number };

export default function UrgeSurfingFlow() {
  const [stepIdx, setStepIdx] = useState(0);
  const [initialIntensity, setInitialIntensity] = useState(7);
  const [ratings, setRatings] = useState<Rating[]>([]);

  const isClosing = stepIdx === 2;
  const finalRating = ratings[ratings.length - 1]?.value ?? initialIntensity;
  const delta = initialIntensity - finalRating;

  const { saving, saveError } = useAutoSave(isClosing, async () => {
    const allRatings: Rating[] = [{ atSecond: 0, value: initialIntensity }, ...ratings];
    const res = await createToolSession({
      toolSlug: "urge-surfing",
      toolName: "Urge Surfing",
      steps: [
        {
          heading: "Starting intensity",
          prompt: "Rate the urge 1–10 at the start.",
          userAnswer: `${initialIntensity}/10`,
        },
        ...ratings.map((r) => ({
          heading: `Re-rate at ${formatMinSec(r.atSecond)}`,
          prompt: "How intense is it right now?",
          userAnswer: `${r.value}/10`,
        })),
        {
          heading: "Change",
          prompt: "Start vs. end.",
          userAnswer:
            delta > 0
              ? `Dropped ${delta} points (${initialIntensity} → ${finalRating})`
              : delta < 0
                ? `Rose ${Math.abs(delta)} points — staying with it`
                : `Held steady at ${initialIntensity}`,
        },
      ],
      summary: `Time series: ${allRatings.map((r) => `${formatMinSec(r.atSecond)}=${r.value}`).join(", ")}`,
    });
    if (!res.success) throw new Error(res.error);
    return res;
  });

  /* ─── Step 0: starting intensity ─── */
  if (stepIdx === 0) {
    return (
      <Shell
        toolName="Urge Surfing"
        toolSlug="urge-surfing"
        progress={{ current: 1, total: 3 }}
      >
        <h1 className="font-serif text-3xl md:text-4xl text-white font-light leading-tight mb-3 text-center">
          How strong is the urge?
        </h1>
        <p className="text-white/75 font-light leading-relaxed mb-10 text-center text-sm">
          One is barely there. Ten is right at the edge of acting on it. There&rsquo;s no wrong number.
        </p>

        <IntensitySlider
          value={initialIntensity}
          onChange={setInitialIntensity}
          min={1}
          max={10}
          label="Right now"
          leftLabel="1 · barely there"
          rightLabel="10 · about to act"
        />

        <div className="mt-12">
          <PrimaryButton onClick={() => setStepIdx(1)}>
            Start the wave →
          </PrimaryButton>
          <p className="text-xs text-white/55 font-light text-center mt-3">
            ~10 minutes. You can stop early when it passes.
          </p>
        </div>
      </Shell>
    );
  }

  /* ─── Step 1: wave session ─── */
  if (stepIdx === 1) {
    return (
      <WaveSession
        initialIntensity={initialIntensity}
        onRating={(r) =>
          setRatings((prev) => {
            // Replace existing rating at this checkpoint if any.
            const filtered = prev.filter((p) => p.atSecond !== r.atSecond);
            return [...filtered, r].sort((a, b) => a.atSecond - b.atSecond);
          })
        }
        ratings={ratings}
        onComplete={() => setStepIdx(2)}
        onEndEarly={() => setStepIdx(2)}
      />
    );
  }

  /* ─── Step 2: closing ─── */
  const allRatings: Rating[] = [
    { atSecond: 0, value: initialIntensity },
    ...ratings,
  ];

  return (
    <Shell
      toolName="Urge Surfing"
      toolSlug="urge-surfing"
      progress={{ current: 3, total: 3 }}
    >
      <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold mb-3 text-center">
        The wave broke
      </p>
      <h1 className="font-serif text-3xl md:text-4xl text-white font-light leading-tight mb-3 text-center">
        {delta > 0 ? "Look at that. You rode it down." : delta < 0 ? "You stayed with it." : "It held — and you didn't act."}
      </h1>
      <p className="font-serif italic text-base text-white/85 font-light leading-relaxed mb-10 text-center max-w-md mx-auto">
        {delta > 0
          ? `You started at ${initialIntensity} and ended at ${finalRating}. That's ${delta} points the urge lost to you. The next time it shows up, you have evidence it crests and falls.`
          : delta < 0
            ? `You stayed with the wave even when it built. That's the skill — the urge doesn't get to dictate your next move just because it's loud.`
            : `The intensity didn't drop, but you didn't act. That counts. Sitting with an urge without obeying it is the whole exercise.`}
      </p>

      <UrgeChart ratings={allRatings} />

      {saving && (
        <p className="text-xs text-white/55 text-center mt-6 mb-4">
          Saving to your journal…
        </p>
      )}
      {saveError && (
        <div
          role="alert"
          className="mt-6 mb-6 rounded-xl bg-red-900/30 border border-red-400/30 text-red-100 text-sm p-4"
        >
          {saveError}
        </div>
      )}

      <div className="space-y-3 mt-10">
        {finalRating >= 6 && (
          <Link
            href="/tools/tipp/start"
            className="block bg-white/10 hover:bg-white/15 border border-white/15 hover:border-white/30 rounded-2xl px-5 py-4 transition-all"
          >
            <p className="font-medium text-white">Continue to TIPP →</p>
            <p className="text-xs text-white/65 font-light mt-1 leading-relaxed">
              If it&rsquo;s still loud, TIPP works on the body when thinking-based tools aren&rsquo;t enough.
            </p>
          </Link>
        )}
        <Link
          href="/tools/box-breathing/start"
          className="block bg-white/10 hover:bg-white/15 border border-white/15 hover:border-white/30 rounded-2xl px-5 py-4 transition-all"
        >
          <p className="font-medium text-white">Box Breathing →</p>
          <p className="text-xs text-white/65 font-light mt-1 leading-relaxed">
            A minute or two of paced breath to settle the rest of the way.
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
    </Shell>
  );
}

/* ─── Wave session ─────────────────────────────────────────────── */

function WaveSession({
  initialIntensity,
  ratings,
  onRating,
  onComplete,
  onEndEarly,
}: {
  initialIntensity: number;
  ratings: Rating[];
  onRating: (r: Rating) => void;
  onComplete: () => void;
  onEndEarly: () => void;
}) {
  const startedAtRef = useRef<number | null>(null);
  const [elapsed, setElapsed] = useState(0);

  // Initialize the start time after mount so we don't call Date.now()
  // during render (which fails react-hooks/purity in React 19).
  useEffect(() => {
    startedAtRef.current = Date.now();
    const id = setInterval(() => {
      if (startedAtRef.current === null) return;
      const e = Math.floor((Date.now() - startedAtRef.current) / 1000);
      setElapsed(e);
    }, 250);
    return () => clearInterval(id);
  }, []);

  // Derived during render — no setState in effect, no useEffect that
  // mirrors state. `promptForSecond` is just "first checkpoint reached
  // that the user hasn't answered yet" computed from elapsed + ratings.
  const promptForSecond =
    CHECKPOINTS.find(
      (cp) => elapsed >= cp && !ratings.some((r) => r.atSecond === cp)
    ) ?? null;
  const promptOpen = promptForSecond !== null;

  // Complete the session once we hit total seconds AND the final
  // checkpoint has been answered. Side-effect lives in an effect; no
  // setState here, only the parent's onComplete callback.
  useEffect(() => {
    if (
      elapsed >= SESSION_SECONDS &&
      ratings.some((r) => r.atSecond === SESSION_SECONDS) &&
      !promptOpen
    ) {
      onComplete();
    }
  }, [elapsed, ratings, promptOpen, onComplete]);

  function submitRating(value: number) {
    if (promptForSecond === null) return;
    onRating({ atSecond: promptForSecond, value });
  }

  const tNorm = Math.min(1, elapsed / SESSION_SECONDS);
  const elapsedMin = Math.floor(elapsed / 60);
  const elapsedSec = elapsed % 60;

  return (
    <Shell
      toolName="Urge Surfing"
      toolSlug="urge-surfing"
      progress={{ current: 2, total: 3 }}
    >
      <div className="text-center mb-4">
        <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold mb-2">
          Stay with the wave
        </p>
        <p className="font-serif text-2xl text-white font-light tabular-nums">
          {String(elapsedMin).padStart(2, "0")}:
          {String(elapsedSec).padStart(2, "0")}
        </p>
      </div>

      <WaveVisual tNorm={tNorm} intensity={initialIntensity} />

      <p className="text-white/75 font-light leading-relaxed text-center text-sm mt-8 mb-2">
        Urges follow a wave. They peak, then they fall on their own.
      </p>
      <p className="text-white/55 font-light leading-relaxed text-center text-xs mb-10">
        You don&rsquo;t have to do anything to make this one leave. Just don&rsquo;t feed it.
      </p>

      <GhostButton onClick={onEndEarly}>It passed — end early</GhostButton>

      {/* Re-rate prompt — modal-style sheet */}
      {promptOpen && promptForSecond !== null && (
        <RerateDialog
          key={promptForSecond}
          atSecond={promptForSecond}
          initialValue={
            ratings[ratings.length - 1]?.value ?? initialIntensity
          }
          onSubmit={(value) => submitRating(value)}
        />
      )}
    </Shell>
  );
}

/* ─── Re-rate dialog ──────────────────────────────────────────── */

/**
 * Modal sheet that opens at each checkpoint to ask "where is the urge
 * now?". Owns its own slider state so we can derive `promptOpen` in the
 * parent without mirroring slider value through React state in the
 * parent (which would trip the new react-hooks/set-state-in-effect rule).
 *
 * Remounted whenever `promptForSecond` changes (via React `key={}`),
 * which is how the slider resets to the prior rating between
 * checkpoints.
 */
function RerateDialog({
  atSecond,
  initialValue,
  onSubmit,
}: {
  atSecond: number;
  initialValue: number;
  onSubmit: (value: number) => void;
}) {
  const [value, setValue] = useState<number>(initialValue);
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="rerate-title"
      className="fixed inset-0 z-50 bg-btf-sky-deep/90 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
    >
      <div className="bg-btf-sky-deep border border-white/15 rounded-3xl max-w-md w-full p-6 shadow-2xl">
        <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold mb-2 text-center">
          {formatMinSec(atSecond)} in
        </p>
        <h2
          id="rerate-title"
          className="font-serif text-2xl text-white font-light mb-6 text-center"
        >
          Where is it now?
        </h2>
        <IntensitySlider
          value={value}
          onChange={setValue}
          min={1}
          max={10}
          leftLabel="1 · barely there"
          rightLabel="10 · about to act"
        />
        <div className="mt-8">
          <PrimaryButton onClick={() => onSubmit(value)}>
            Keep going →
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

/* ─── Wave visual ─────────────────────────────────────────────── */

/**
 * SVG wave that rises to a crest around the 30% mark, then decays.
 * Amplitude scales with initial intensity. Animated by mapping `tNorm`
 * (0..1) to phase + an envelope curve.
 */
function WaveVisual({
  tNorm,
  intensity,
}: {
  tNorm: number;
  intensity: number;
}) {
  // Envelope: rises 0 → 1 from 0..0.3, then 1 → 0.2 from 0.3..1.
  let envelope;
  if (tNorm < 0.3) {
    envelope = tNorm / 0.3;
  } else {
    envelope = 1 - ((tNorm - 0.3) / 0.7) * 0.8;
  }
  const amplitude = 30 + 30 * (intensity / 10);
  const swellY = 90 - envelope * amplitude;

  // Build a smooth wave path across width 400, baseline y=90.
  const points: string[] = [];
  const N = 80;
  for (let i = 0; i <= N; i++) {
    const x = (i / N) * 400;
    const phase = (i / N) * Math.PI * 3 + tNorm * 12;
    const oscillation = Math.sin(phase) * (8 + envelope * 6);
    const yLine =
      90 - envelope * amplitude * (0.6 + 0.4 * Math.sin(phase / 2));
    points.push(`${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${(yLine + oscillation).toFixed(1)}`);
  }
  const wavePath = points.join(" ");
  const fillPath = `${wavePath} L 400 120 L 0 120 Z`;

  return (
    <div className="relative">
      <svg
        viewBox="0 0 400 120"
        className="w-full h-44 sm:h-52"
        aria-label="Urge wave visualization"
      >
        <defs>
          <linearGradient id="waveGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#d4a44a" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#d4a44a" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <line
          x1="0"
          y1="90"
          x2="400"
          y2="90"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="0.5"
          strokeDasharray="2 4"
        />
        <path d={fillPath} fill="url(#waveGradient)" />
        <path d={wavePath} fill="none" stroke="#d4a44a" strokeWidth="1.5" />
        <line
          x1={tNorm * 400}
          y1="10"
          x2={tNorm * 400}
          y2="110"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="1"
        />
      </svg>
      <p className="text-xs text-white/45 font-light text-center mt-2 tabular-nums">
        Intensity at start: {intensity}/10 · Envelope: {Math.round(envelope * 100)}%
      </p>
      <p className="sr-only">
        Wave amplitude at peak {Math.round(amplitude)} units; current
        envelope {(envelope * 100).toFixed(0)}%; current y-offset {swellY.toFixed(0)}.
      </p>
    </div>
  );
}

/* ─── Closing chart ───────────────────────────────────────────── */

function UrgeChart({ ratings }: { ratings: Rating[] }) {
  if (ratings.length < 2) {
    return (
      <p className="text-white/65 text-sm text-center italic">
        (Session ended too early to chart.)
      </p>
    );
  }
  const W = 320;
  const H = 160;
  const padX = 24;
  const padY = 16;
  const xs = ratings.map((r) => r.atSecond);
  const xMax = Math.max(...xs);
  const yMax = 10;
  const yMin = 0;

  const toX = (s: number) => padX + (s / xMax) * (W - padX * 2);
  const toY = (v: number) =>
    H - padY - ((v - yMin) / (yMax - yMin)) * (H - padY * 2);

  const pathD = ratings
    .map((r, i) => `${i === 0 ? "M" : "L"} ${toX(r.atSecond)} ${toY(r.value)}`)
    .join(" ");

  return (
    <div className="bg-white/5 border border-white/15 rounded-2xl px-4 py-5">
      <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold mb-3 text-center">
        Your urge curve
      </p>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-label="Urge intensity over time chart">
        {/* y-axis grid */}
        {[2, 4, 6, 8, 10].map((v) => (
          <g key={v}>
            <line
              x1={padX}
              x2={W - padX}
              y1={toY(v)}
              y2={toY(v)}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="0.5"
            />
            <text
              x={padX - 6}
              y={toY(v) + 3}
              fill="rgba(255,255,255,0.4)"
              fontSize="7"
              textAnchor="end"
            >
              {v}
            </text>
          </g>
        ))}
        <path d={pathD} fill="none" stroke="#d4a44a" strokeWidth="2" strokeLinejoin="round" />
        {ratings.map((r, i) => (
          <g key={i}>
            <circle cx={toX(r.atSecond)} cy={toY(r.value)} r="3" fill="#d4a44a" />
            <text
              x={toX(r.atSecond)}
              y={toY(r.value) - 8}
              fill="white"
              fontSize="8"
              textAnchor="middle"
            >
              {r.value}
            </text>
            <text
              x={toX(r.atSecond)}
              y={H - 4}
              fill="rgba(255,255,255,0.5)"
              fontSize="7"
              textAnchor="middle"
            >
              {formatMinSec(r.atSecond)}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function formatMinSec(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, "0")}`;
}
