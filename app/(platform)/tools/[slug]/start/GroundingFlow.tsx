"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  Shell,
  PrimaryButton,
  ChargeScale,
  ActivityComplete,
  CRISIS_NEXT_STEP,
  useAutoSave,
} from "./_shared";
import { createToolSession } from "../../../../actions/journal";
import { timeOfDayBucket } from "../../../../lib/journalTypes";

/**
 * 5-4-3-2-1 Grounding — acute layer.
 *
 * Design rule (from the build spec): gamify the meta-layer, never the
 * moment. The drill itself is calm, slow, and self-paced — no timers, no
 * scores, no failure, no quotas. Reward and pattern-surfacing live in the
 * grove (the meta layer), which the user meets only after they've come
 * down.
 *
 * Science framing (verified): 5-4-3-2-1 is a widely used grounding
 * exercise, not a validated standalone protocol. Its defensible mechanism
 * is ATTENTIONAL — redirecting attention to present-moment sensory input
 * can interrupt anxious or intrusive thought loops. We do NOT claim it
 * activates the parasympathetic system, and the optional 0–10 check is a
 * personal self-monitoring rating (SUDS-style), never presented as proof.
 * Authoritative guidance also notes grounding can be counterproductive
 * for some, so a calm "this isn't helping" off-ramp is always available.
 */

type SenseStep = {
  count: number;
  sense: string;
  verb: string;
  prompt: string;
  example: string;
  /** Sight uses a tap-the-real-room field; the rest take optional words. */
  field?: boolean;
};

const SENSES: SenseStep[] = [
  {
    count: 5,
    sense: "See",
    verb: "see",
    prompt:
      "Look at the real room, not the screen. Each time you notice something you can see, tap the space below.",
    example: "",
    field: true,
  },
  {
    count: 4,
    sense: "Feel",
    verb: "feel",
    prompt:
      "What can you feel touching your skin? Name one if you want — a texture, a temperature. A word is plenty.",
    example: "the chair, my sleeve, cool floor",
  },
  {
    count: 3,
    sense: "Hear",
    verb: "hear",
    prompt:
      "Close your eyes if you like. What can you hear — close, or far away?",
    example: "the fan, traffic, my own breath",
  },
  {
    count: 2,
    sense: "Smell",
    verb: "smell",
    prompt:
      "Take a slow breath in. Anything you can smell? If nothing's obvious, your own sleeve counts.",
    example: "coffee, soap",
  },
  {
    count: 1,
    sense: "Taste",
    verb: "taste",
    prompt: "One last thing — anything you can taste? The lingering taste counts.",
    example: "mint, tea",
  },
];

type Phase = "before" | "drill" | "after" | "closing";

export default function GroundingFlow() {
  const [phase, setPhase] = useState<Phase>("before");
  const [stepIdx, setStepIdx] = useState(0);
  const [beforeCharge, setBeforeCharge] = useState<number | null>(null);
  const [afterCharge, setAfterCharge] = useState<number | null>(null);

  // Per-sense words (chips). Sight (index 0) uses taps, not words.
  const [words, setWords] = useState<string[][]>(SENSES.map(() => []));
  const [sightTaps, setSightTaps] = useState(0);
  const [draft, setDraft] = useState("");

  // Brief settle between steps — the pacing does the breathing work.
  const [settling, setSettling] = useState(false);

  const totalDrill = SENSES.length;

  function addWord() {
    const v = draft.trim();
    if (!v) return;
    setWords((prev) => {
      const next = prev.map((arr) => [...arr]);
      next[stepIdx].push(v);
      return next;
    });
    setDraft("");
  }

  function advance() {
    setDraft("");
    if (stepIdx < totalDrill - 1) {
      setSettling(true);
      window.setTimeout(() => {
        setStepIdx((i) => i + 1);
        setSettling(false);
      }, 750);
    } else {
      setPhase("after");
    }
  }

  /* ── Build the save payload (used on the closing screen) ─────────── */
  const sightAnswer =
    sightTaps > 0
      ? `${sightTaps} ${sightTaps === 1 ? "thing" : "things"} noticed`
      : "";
  const stepAnswers = SENSES.map((s, i) =>
    i === 0 ? sightAnswer : words[i].join(", ")
  );
  const hasContent =
    sightTaps > 0 || words.some((arr, i) => i !== 0 && arr.length > 0);

  const { saving, saveError } = useAutoSave(
    phase === "closing" && hasContent,
    async () => {
      const res = await createToolSession({
        toolSlug: "grounding",
        toolName: "5-4-3-2-1 Grounding",
        steps: SENSES.map((s, i) => ({
          heading: `${s.count} ${s.sense.toLowerCase()}`,
          prompt: s.prompt,
          userAnswer: stepAnswers[i],
        })),
        stateCheck: { before: beforeCharge, after: afterCharge },
        timeOfDay: timeOfDayBucket(),
      });
      if (!res.success) throw new Error(res.error);
      return res;
    }
  );

  /* ─── BEFORE check (optional, prominent skip) ────────────────────── */
  if (phase === "before") {
    return (
      <GroundShell toolName="5-4-3-2-1" progress={null}>
        <div className="text-center">
          <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold mb-5">
            before we begin · optional
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-white font-light leading-tight mb-2">
            How charged do you feel right now?
          </h1>
          <p className="text-sm text-white/60 font-light mb-8">
            Just a private note to yourself, so you can notice any change after.
          </p>

          <ChargeScale value={beforeCharge} onChange={setBeforeCharge} />

          <div className="mt-10 space-y-3">
            <PrimaryButton
              onClick={() => setPhase("drill")}
              disabled={beforeCharge === null}
            >
              Begin &rarr;
            </PrimaryButton>
            <button
              type="button"
              onClick={() => setPhase("drill")}
              className="block w-full text-sm text-white/55 hover:text-white/80 font-light py-2 transition-colors"
            >
              Skip — just take me there
            </button>
          </div>
        </div>
      </GroundShell>
    );
  }

  /* ─── AFTER check (optional) ─────────────────────────────────────── */
  if (phase === "after") {
    return (
      <GroundShell toolName="5-4-3-2-1" progress={null}>
        <div className="text-center">
          <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold mb-5">
            you made it through · optional
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-white font-light leading-tight mb-8">
            And now — how charged do you feel?
          </h1>

          <ChargeScale value={afterCharge} onChange={setAfterCharge} />

          <div className="mt-10 space-y-3">
            <PrimaryButton onClick={() => setPhase("closing")}>
              Keep this moment
            </PrimaryButton>
            <button
              type="button"
              onClick={() => setPhase("closing")}
              className="block w-full text-sm text-white/55 hover:text-white/80 font-light py-2 transition-colors"
            >
              Skip
            </button>
          </div>
        </div>
      </GroundShell>
    );
  }

  /* ─── CLOSING (meta-layer handoff) ───────────────────────────────── */
  if (phase === "closing") {
    const showDelta = beforeCharge !== null && afterCharge !== null;
    const eased = showDelta && afterCharge! < beforeCharge!;
    return (
      <GroundShell
        toolName="5-4-3-2-1"
        progress={{ current: totalDrill + 1, total: totalDrill + 1 }}
      >
        <ActivityComplete
          eyebrow="you named the room"
          headline="This is where you are."
          acknowledgment="This moment is real. Whatever pulled you out of it, this is what you came back to."
          stats={
            showDelta
              ? [
                  { label: "before", value: String(beforeCharge) },
                  { label: "after", value: String(afterCharge) },
                ]
              : []
          }
          saving={saving}
          saveError={saveError}
          nextSteps={[
            {
              label: "Continue to Box Breathing →",
              href: "/tools/box-breathing/start",
              description:
                "Pace your breath now that you're back in the room. Often the natural next move.",
            },
            {
              label: "See your grove →",
              href: "/today/grove",
              description: "Every time you came back, kept in your own words.",
            },
            CRISIS_NEXT_STEP,
          ]}
        >
          {showDelta && (
            <p className="text-xs text-white/55 font-light mb-6 -mt-2">
              {eased
                ? "That's your own note that it eased a little — worth remembering."
                : "However it moved, you stayed and came back. That's the part that counts."}
            </p>
          )}
          <ul className="space-y-3 mb-8 text-left">
            {SENSES.map((s, i) => {
              const answer = stepAnswers[i];
              return (
                <li
                  key={s.sense}
                  className="bg-white/10 border border-white/15 rounded-2xl px-5 py-4"
                >
                  <p className="text-[10px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold mb-2">
                    {s.count} {s.sense}
                  </p>
                  <p className="text-white font-light leading-relaxed">
                    {answer || (
                      <span className="italic text-white/40">(let it pass)</span>
                    )}
                  </p>
                </li>
              );
            })}
          </ul>
        </ActivityComplete>
      </GroundShell>
    );
  }

  /* ─── DRILL — one sense per screen, self-paced, no quota ─────────── */
  const step = SENSES[stepIdx];
  return (
    <GroundShell
      toolName="5-4-3-2-1"
      progress={{ current: stepIdx + 1, total: totalDrill + 1 }}
    >
      <div
        className={
          "transition-opacity duration-700 " +
          (settling ? "opacity-0" : "opacity-100")
        }
      >
        <div className="text-center mb-6">
          <div className="font-serif font-light text-7xl text-btf-gold mb-2 leading-none">
            {step.count}
          </div>
          <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold">
            things you can {step.verb}
          </p>
        </div>

        <p className="text-white/85 font-light leading-relaxed mb-6 text-base text-center max-w-md mx-auto">
          {step.prompt}
        </p>

        {step.field ? (
          <SightField taps={sightTaps} onTap={() => setSightTaps((n) => n + 1)} />
        ) : (
          <WordCapture
            words={words[stepIdx]}
            draft={draft}
            example={step.example}
            verb={step.verb}
            onDraft={setDraft}
            onAdd={addWord}
          />
        )}

        <div className="mt-8">
          <PrimaryButton onClick={advance}>
            {stepIdx === totalDrill - 1 ? "I'm ready →" : "Move on →"}
          </PrimaryButton>
          <p className="text-xs text-white/45 font-light text-center mt-4">
            However many you find is enough. There&rsquo;s no wrong number.
          </p>
          <Link
            href="/tools"
            className="block text-center text-xs text-white/45 hover:text-white/70 font-light underline underline-offset-2 mt-3 transition-colors"
          >
            If this isn&rsquo;t helping, that&rsquo;s okay — see other tools
          </Link>
        </div>
      </div>
    </GroundShell>
  );
}

/* ─── Ambient shell: Shell + the slow breathing glow ──────────────── */

function GroundShell({
  toolName,
  progress,
  children,
}: {
  toolName: string;
  progress: { current: number; total: number } | null;
  children: React.ReactNode;
}) {
  return (
    <Shell toolName={toolName} toolSlug="grounding" progress={progress}>
      <div className="relative isolate">
        <div
          aria-hidden
          className="grounding-breath pointer-events-none absolute left-1/2 top-[34%] -z-10 h-[26rem] w-[26rem] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(201,168,76,0.20), transparent 70%)",
          }}
        />
        <div className="relative z-10">{children}</div>
      </div>
    </Shell>
  );
}

/* ─── Sight: tap the real room (calm viewfinder substitute) ───────── */

type Bloom = { id: number; x: number; y: number };

function SightField({ taps, onTap }: { taps: number; onTap: () => void }) {
  const [blooms, setBlooms] = useState<Bloom[]>([]);
  const nextId = useRef(0);

  function handleTap(e: React.MouseEvent<HTMLButtonElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    const id = nextId.current++;
    setBlooms((prev) => [...prev, { id, x, y }]);
    window.setTimeout(
      () => setBlooms((prev) => prev.filter((b) => b.id !== id)),
      1100
    );
    onTap();
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleTap}
        aria-label="Tap each time you notice something you can see"
        className="relative block w-full h-44 rounded-3xl overflow-hidden border border-white/15 bg-white/[0.04] hover:bg-white/[0.06] transition-colors cursor-pointer"
      >
        {taps === 0 && (
          <span className="absolute inset-0 flex items-center justify-center text-center px-8 text-sm text-white/45 font-light leading-relaxed pointer-events-none">
            Eyes on the real room — not the screen.
            <br />
            Tap here as you spot each thing.
          </span>
        )}
        {blooms.map((b) => (
          <span
            key={b.id}
            className="grounding-bloom absolute h-5 w-5 rounded-full pointer-events-none"
            style={{
              left: `${b.x}%`,
              top: `${b.y}%`,
              background:
                "radial-gradient(circle, rgba(232,204,122,0.9), transparent 72%)",
            }}
          />
        ))}
      </button>
      {taps > 0 && (
        <p className="text-center text-sm text-btf-gold-light font-light">
          {taps} {taps === 1 ? "thing" : "things"} noticed
        </p>
      )}
    </div>
  );
}

/* ─── Word capture for the other four senses (optional chips) ─────── */

function WordCapture({
  words,
  draft,
  example,
  verb,
  onDraft,
  onAdd,
}: {
  words: string[];
  draft: string;
  example: string;
  verb: string;
  onDraft: (v: string) => void;
  onAdd: () => void;
}) {
  return (
    <div>
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => onDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAdd();
            }
          }}
          autoFocus
          placeholder={example ? `e.g. ${example}` : "one word, if you want…"}
          aria-label={`Something you can ${verb}`}
          className="flex-1 rounded-2xl bg-white/10 border-2 border-white/20 focus:border-btf-gold focus:outline-none px-5 py-3.5 text-base text-white font-light placeholder:text-white/35 placeholder:italic transition-colors"
        />
        <button
          type="button"
          onClick={onAdd}
          disabled={draft.trim().length === 0}
          aria-label="Add"
          className="rounded-2xl border-2 border-white/20 bg-white/10 px-5 text-white font-light disabled:opacity-30 hover:bg-white/15 transition-colors"
        >
          Add
        </button>
      </div>
      {words.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {words.map((w, i) => (
            <span
              key={`${w}-${i}`}
              className="rounded-full bg-btf-gold/15 text-btf-gold-light text-sm font-light px-4 py-1.5"
            >
              {w}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

