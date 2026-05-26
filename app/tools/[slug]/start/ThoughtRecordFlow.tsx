"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Shell,
  PrimaryButton,
  IntensitySlider,
  CRISIS_NEXT_STEP,
  useAutoSave,
} from "./_shared";
import { createToolSession } from "../../../actions/journal";

/**
 * CBT Thought Record — Beck's seven-column structure, one field per
 * screen. Each text field has a "Show me an example" toggle revealing
 * a real worked example. Emotion fields use 0–100 sliders. The final
 * screen renders the start vs. end emotion ratings side by side with
 * the delta highlighted.
 */

const EXAMPLES = {
  situation:
    "My roommate left dishes in the sink again. Tuesday evening, after I got home from work.",
  thought: "Nobody respects me. This is going to be my whole life.",
  emotionLabel: "Anger and resentment.",
  evidenceFor:
    "They've left dishes before. I asked last week and the conversation didn't stick. They didn't text to say sorry today either.",
  evidenceAgainst:
    "They cleaned the bathroom on Sunday without being asked. They covered my shift in March. 'Nobody respects me' isn't a fact about this situation — it's a story I'm telling.",
  balanced:
    "My roommate is messy in the kitchen and that's frustrating. It doesn't mean I'm not respected — it means we need a specific conversation about dishes, not a referendum on the relationship.",
} as const;

export default function ThoughtRecordFlow() {
  const [stepIdx, setStepIdx] = useState(0); // 0..7, then 8 = closing

  const [situation, setSituation] = useState("");
  const [thought, setThought] = useState("");
  const [emotionLabel, setEmotionLabel] = useState("");
  const [emotionStart, setEmotionStart] = useState(60);
  const [evidenceFor, setEvidenceFor] = useState("");
  const [evidenceAgainst, setEvidenceAgainst] = useState("");
  const [balanced, setBalanced] = useState("");
  const [emotionEnd, setEmotionEnd] = useState(60);

  const TOTAL = 8;
  const isClosing = stepIdx === TOTAL;
  const delta = emotionStart - emotionEnd;

  const { saving, saveError } = useAutoSave(isClosing, async () => {
    const res = await createToolSession({
      toolSlug: "thought-record",
      toolName: "CBT Thought Record",
      steps: [
        { heading: "Situation", prompt: "What happened? Where, who, what?", userAnswer: situation },
        { heading: "Automatic thought", prompt: "Word for word.", userAnswer: thought },
        { heading: "Emotion (named)", prompt: "What were you feeling?", userAnswer: emotionLabel },
        { heading: "Emotion intensity at start", prompt: "0–100.", userAnswer: `${emotionStart}/100` },
        { heading: "Evidence FOR the thought", prompt: "Concrete facts that support it.", userAnswer: evidenceFor },
        { heading: "Evidence AGAINST the thought", prompt: "Concrete facts that contradict it.", userAnswer: evidenceAgainst },
        { heading: "Balanced thought", prompt: "A truer story.", userAnswer: balanced },
        {
          heading: "Re-rated emotion",
          prompt: "0–100 after working the columns.",
          userAnswer: `${emotionEnd}/100 (${delta > 0 ? `down ${delta}` : delta < 0 ? `up ${Math.abs(delta)}` : "no change"})`,
        },
      ],
    });
    if (!res.success) throw new Error(res.error);
    return res;
  });

  /* ─── Closing ─── */
  if (isClosing) {
    return (
      <Shell
        toolName="Thought Record"
        toolSlug="thought-record"
        progress={{ current: TOTAL + 1, total: TOTAL + 1 }}
      >
        <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold mb-3 text-center">
          The tool working
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-white font-light leading-tight mb-3 text-center">
          {delta >= 20
            ? `You dropped ${delta} points.`
            : delta > 0
              ? `You moved ${delta} points.`
              : delta === 0
                ? "The number didn't move — and that's information too."
                : "The number went up."}
        </h1>
        <p className="font-serif italic text-base text-white/85 font-light leading-relaxed mb-10 text-center max-w-md mx-auto">
          {delta >= 20
            ? "That's the tool working. Forcing the thought to defend itself with evidence changed how loud it was."
            : delta > 0
              ? "Even a 10-point drop is real. Run the columns again if you have time — the second pass usually goes further."
              : delta === 0
                ? "Sometimes the thought really is sticky. The honest move is to bring it to a person — a therapist, a sponsor, a priest, someone who can sit with it longer than a journal entry."
                : "Sometimes naming a thought makes it heavier before it gets lighter. The work isn't finished; this session caught something live."}
        </p>

        <BeforeAfterChart start={emotionStart} end={emotionEnd} label={emotionLabel} />

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
          <Link
            href="/tools/stop/start"
            className="block bg-white/10 hover:bg-white/15 border border-white/15 hover:border-white/30 rounded-2xl px-5 py-4 transition-all"
          >
            <p className="font-medium text-white">STOP →</p>
            <p className="text-xs text-white/65 font-light mt-1 leading-relaxed">
              Lock in the gap. The thought just had to defend itself; the next one will too.
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
          </Link>
        </div>
      </Shell>
    );
  }

  /* ─── Text-field screens ─── */
  if (stepIdx === 0)
    return (
      <FieldScreen
        toolName="Thought Record"
        progress={{ current: 1, total: TOTAL }}
        heading="1. Situation"
        sub="Just the facts. Where, when, who, what happened."
        value={situation}
        onChange={setSituation}
        example={EXAMPLES.situation}
        placeholder="Today, after work…"
        onNext={() => setStepIdx(1)}
      />
    );

  if (stepIdx === 1)
    return (
      <FieldScreen
        toolName="Thought Record"
        progress={{ current: 2, total: TOTAL }}
        heading="2. The thought"
        sub="What went through your head, word for word? Even if it sounds dramatic — especially if it sounds dramatic."
        value={thought}
        onChange={setThought}
        example={EXAMPLES.thought}
        placeholder="Word for word…"
        onNext={() => setStepIdx(2)}
      />
    );

  if (stepIdx === 2)
    return (
      <FieldScreen
        toolName="Thought Record"
        progress={{ current: 3, total: TOTAL }}
        heading="3. Name the emotion"
        sub="Just the name. Anger, shame, fear, dread, jealousy. One word or two."
        value={emotionLabel}
        onChange={setEmotionLabel}
        example={EXAMPLES.emotionLabel}
        placeholder="Anger and resentment."
        rows={2}
        onNext={() => setStepIdx(3)}
      />
    );

  if (stepIdx === 3) {
    return (
      <Shell
        toolName="Thought Record"
        toolSlug="thought-record"
        progress={{ current: 4, total: TOTAL }}
      >
        <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold mb-2 text-center">
          4. Rate it
        </p>
        <h1 className="font-serif text-2xl md:text-3xl text-white font-light leading-tight mb-3 text-center">
          How intense is {emotionLabel ? `"${emotionLabel}"` : "the feeling"} right now?
        </h1>
        <p className="text-white/65 font-light leading-relaxed mb-10 text-center text-sm">
          0 means absent. 100 means it&rsquo;s the only thing in the room.
        </p>

        <IntensitySlider
          value={emotionStart}
          onChange={setEmotionStart}
          min={0}
          max={100}
          leftLabel="0"
          rightLabel="100"
        />

        <div className="mt-12">
          <PrimaryButton onClick={() => setStepIdx(4)}>Next →</PrimaryButton>
        </div>
      </Shell>
    );
  }

  if (stepIdx === 4)
    return (
      <FieldScreen
        toolName="Thought Record"
        progress={{ current: 5, total: TOTAL }}
        heading="5. Evidence FOR the thought"
        sub="Concrete, observable facts that support the thought. No opinions, no interpretations — just what would hold up in court."
        value={evidenceFor}
        onChange={setEvidenceFor}
        example={EXAMPLES.evidenceFor}
        placeholder="The facts on this side…"
        onNext={() => setStepIdx(5)}
      />
    );

  if (stepIdx === 5)
    return (
      <FieldScreen
        toolName="Thought Record"
        progress={{ current: 6, total: TOTAL }}
        heading="6. Evidence AGAINST the thought"
        sub="Same rules — concrete facts only. What contradicts the thought? What's it missing? What past examples don't match it?"
        value={evidenceAgainst}
        onChange={setEvidenceAgainst}
        example={EXAMPLES.evidenceAgainst}
        placeholder="What the thought leaves out…"
        onNext={() => setStepIdx(6)}
      />
    );

  if (stepIdx === 6)
    return (
      <FieldScreen
        toolName="Thought Record"
        progress={{ current: 7, total: TOTAL }}
        heading="7. A balanced thought"
        sub="Not a positive lie. A truer story — one that honors both columns of evidence."
        value={balanced}
        onChange={setBalanced}
        example={EXAMPLES.balanced}
        placeholder="A truer version…"
        onNext={() => setStepIdx(7)}
      />
    );

  // stepIdx === 7 — re-rate
  return (
    <Shell
      toolName="Thought Record"
      toolSlug="thought-record"
      progress={{ current: 8, total: TOTAL }}
    >
      <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold mb-2 text-center">
        8. Re-rate
      </p>
      <h1 className="font-serif text-2xl md:text-3xl text-white font-light leading-tight mb-3 text-center">
        Where is {emotionLabel ? `"${emotionLabel}"` : "the feeling"} now?
      </h1>
      <p className="text-white/65 font-light leading-relaxed mb-10 text-center text-sm">
        You started at {emotionStart}. Don&rsquo;t force the number — be honest about where it actually sits.
      </p>

      <IntensitySlider
        value={emotionEnd}
        onChange={setEmotionEnd}
        min={0}
        max={100}
        leftLabel="0"
        rightLabel="100"
      />

      <div className="mt-12">
        <PrimaryButton onClick={() => setStepIdx(8)}>Finish →</PrimaryButton>
      </div>
    </Shell>
  );
}

/* ─── Field screen with example toggle ────────────────────────── */

function FieldScreen({
  toolName,
  progress,
  heading,
  sub,
  value,
  onChange,
  example,
  placeholder,
  rows = 5,
  onNext,
}: {
  toolName: string;
  progress: { current: number; total: number };
  heading: string;
  sub: string;
  value: string;
  onChange: (s: string) => void;
  example: string;
  placeholder: string;
  rows?: number;
  onNext: () => void;
}) {
  const [showExample, setShowExample] = useState(false);

  return (
    <Shell toolName={toolName} toolSlug="thought-record" progress={progress}>
      <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold mb-2">
        Step {progress.current} of {progress.total}
      </p>
      <h1 className="font-serif text-2xl md:text-3xl text-white font-light leading-tight mb-3">
        {heading}
      </h1>
      <p className="text-white/75 font-light leading-relaxed mb-4 text-sm">
        {sub}
      </p>

      <button
        type="button"
        onClick={() => setShowExample((s) => !s)}
        className="text-xs text-btf-gold-light hover:text-btf-gold underline underline-offset-4 mb-3 inline-block"
      >
        {showExample ? "Hide example" : "Show me an example"}
      </button>

      {showExample && (
        <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 mb-5">
          <p className="text-[10px] tracking-[0.2em] uppercase text-btf-gold-light/80 font-semibold mb-2">
            Example
          </p>
          <p className="text-white/85 font-light leading-relaxed text-sm italic">
            {example}
          </p>
        </div>
      )}

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoFocus
        rows={rows}
        placeholder={placeholder}
        className="w-full rounded-2xl bg-white/10 border-2 border-white/20 focus:border-btf-gold focus:outline-none px-5 py-4 text-base text-white font-light leading-relaxed resize-y placeholder:text-white/40 placeholder:italic transition-colors mb-8"
      />

      <PrimaryButton onClick={onNext} disabled={value.trim().length === 0}>
        Next →
      </PrimaryButton>
    </Shell>
  );
}

/* ─── Before/after chart ──────────────────────────────────────── */

function BeforeAfterChart({
  start,
  end,
  label,
}: {
  start: number;
  end: number;
  label: string;
}) {
  const delta = start - end;
  return (
    <div className="bg-white/5 border border-white/15 rounded-2xl px-5 py-6">
      <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold mb-4 text-center">
        {label || "Emotion"} · 0–100
      </p>
      <div className="grid grid-cols-3 gap-3 items-end mb-2">
        <div className="text-center">
          <p className="font-serif text-5xl text-white/70 font-light">
            {start}
          </p>
          <p className="text-[10px] tracking-[0.2em] uppercase text-white/55 mt-2">
            Start
          </p>
        </div>
        <div className="text-center">
          <p
            className={
              "font-serif text-4xl font-light " +
              (delta > 0
                ? "text-btf-gold"
                : delta < 0
                  ? "text-red-300"
                  : "text-white/55")
            }
          >
            {delta > 0 ? `−${delta}` : delta < 0 ? `+${Math.abs(delta)}` : "0"}
          </p>
          <p className="text-[10px] tracking-[0.2em] uppercase text-white/55 mt-2">
            Delta
          </p>
        </div>
        <div className="text-center">
          <p className="font-serif text-5xl text-white font-light">{end}</p>
          <p className="text-[10px] tracking-[0.2em] uppercase text-white/55 mt-2">
            After
          </p>
        </div>
      </div>
      <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden relative">
        <div
          className="absolute inset-y-0 left-0 bg-white/35"
          style={{ width: `${start}%` }}
        />
        <div
          className="absolute inset-y-0 left-0 bg-btf-gold"
          style={{ width: `${end}%` }}
        />
      </div>
    </div>
  );
}
