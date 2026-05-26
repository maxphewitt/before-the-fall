"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  createLovedOneIntake,
  type LovedOneAnswers,
} from "../../actions/lovedOne";

/**
 * /loved-one/quiz — 8-question Concerned Significant Other quiz.
 *
 * One question per screen. Mirrors the UX pattern of /onboard. On
 * submission, creates a loved_one_intake row with a fresh referral
 * code and routes to /loved-one/result?code=XXX.
 *
 * All copy is CRAFT-informed (Meyers et al.). The frame is "we're
 * helping you help them," not "we're helping them through you." The
 * CSO is the user of this flow.
 *
 * DRAFT v1 — see Vault Clinical Advisor Pre-Launch Checklist; the
 * DV safeguard is the first item there and is NOT in this v1.
 */

type Option = { value: string; label: string; description?: string };

const Q1_RELATIONSHIP: Option[] = [
  { value: "parent", label: "Their parent" },
  { value: "spouse", label: "Their spouse or partner" },
  { value: "ex_partner", label: "Their former spouse or partner" },
  { value: "sibling", label: "Their sibling" },
  { value: "child", label: "Their adult child" },
  { value: "friend", label: "Their friend" },
  { value: "clergy", label: "Their priest, pastor, or spiritual director" },
  { value: "other", label: "Something else" },
];

const Q2_POPULATIONS: Option[] = [
  { value: "porn", label: "Pornography or sexual compulsion" },
  { value: "substance", label: "Substance use" },
  { value: "self_harm", label: "Self-harm or thoughts of suicide" },
  { value: "relationship_abuse", label: "Abuse in a relationship — giving or receiving" },
  { value: "depression_anxiety", label: "Depression or anxiety" },
  { value: "other", label: "Something else, or I'm not sure" },
];

const Q3_DURATION: Option[] = [
  { value: "recent", label: "Recently — it just escalated" },
  { value: "months", label: "A few months" },
  { value: "year_or_two", label: "A year or two" },
  { value: "many_years", label: "Many years" },
];

const Q4_SIGNALS: Option[] = [
  { value: "isolation", label: "They're isolating from family or friends" },
  { value: "mood", label: "Their mood has visibly changed" },
  { value: "physical", label: "I see physical changes — weight, sleep, appearance" },
  { value: "financial", label: "Financial trouble I think is connected" },
  { value: "legal", label: "Legal trouble or job trouble" },
  { value: "hidden", label: "They're hiding behavior I notice indirectly" },
  { value: "direct", label: "They've told me directly something is wrong" },
  { value: "safety", label: "I'm afraid for their safety, or someone else's" },
];

const Q5_CONVERSATION: Option[] = [
  { value: "engaged", label: "Yes — they engaged with the conversation" },
  { value: "deflected", label: "Yes — they deflected or shut down" },
  { value: "defensive", label: "Yes — they got defensive or angry" },
  { value: "afraid", label: "No — I'm afraid of how they'd react" },
  { value: "not_yet", label: "No — I'm still figuring out how" },
];

const Q6_FAITH: Option[] = [
  { value: "catholic_active", label: "Catholic, and actively practicing" },
  { value: "catholic_lapsed", label: "Catholic background, but not practicing" },
  { value: "other_faith", label: "Another faith tradition" },
  { value: "secular", label: "Not religious" },
  { value: "unsure", label: "I’m not sure" },
];

const Q7_CSO_STATE: Option[] = [
  { value: "managing", label: "Managing, but heavy" },
  { value: "exhausted", label: "Exhausted — this has been going on a long time" },
  { value: "scared", label: "Scared. I don’t know what they’ll do" },
  { value: "hopeless", label: "Hopeless. I’ve tried so much" },
  { value: "angry", label: "Angry. And ashamed of being angry" },
];

const Q8_GOAL: Option[] = [
  { value: "learn", label: "I just want to learn how to support them" },
  { value: "encourage", label: "I want to give them a code and encourage them to use this" },
  { value: "both", label: "Both" },
];

export default function LovedOneQuizPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const TOTAL = 8;

  const [answers, setAnswers] = useState<LovedOneAnswers>({
    relationship: "",
    populations: [],
    duration: "",
    severitySignals: [],
    attemptedConversation: "",
    faithContext: "",
    csoState: "",
    goal: "",
  });

  function pickSingle<K extends keyof LovedOneAnswers>(
    key: K,
    value: string
  ) {
    setAnswers((a) => ({ ...a, [key]: value } as LovedOneAnswers));
  }

  function toggleMulti(key: "populations" | "severitySignals", value: string) {
    setAnswers((a) => {
      const cur = a[key];
      const has = cur.includes(value);
      return {
        ...a,
        [key]: has ? cur.filter((v) => v !== value) : [...cur, value],
      };
    });
  }

  function advance() {
    setError(null);
    if (step < TOTAL) setStep(step + 1);
    else onSubmit();
  }

  async function onSubmit() {
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await createLovedOneIntake(answers);
      if (res.success) {
        router.push(`/loved-one/result?code=${encodeURIComponent(res.code)}`);
      } else {
        setError(res.error);
      }
    } catch (err) {
      console.error(err);
      setError("Unexpected error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const canAdvance = (() => {
    switch (step) {
      case 1: return answers.relationship !== "";
      case 2: return answers.populations.length > 0;
      case 3: return answers.duration !== "";
      case 4: return answers.severitySignals.length > 0;
      case 5: return answers.attemptedConversation !== "";
      case 6: return answers.faithContext !== "";
      case 7: return answers.csoState !== "";
      case 8: return answers.goal !== "";
      default: return false;
    }
  })();

  return (
    <main className="min-h-screen bg-btf-off-white px-6 py-10 sm:py-14">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/loved-one"
            className="text-btf-text-light hover:text-btf-sky-deep text-sm inline-flex items-center gap-2 transition-colors"
          >
            <span aria-hidden>&larr;</span> Back
          </Link>
          <span className="text-[10px] tracking-[0.25em] uppercase text-btf-text-light font-semibold">
            {step} of {TOTAL}
          </span>
        </div>

        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={TOTAL}
          aria-valuenow={step}
          className="w-full h-1 bg-btf-sky-pale/60 rounded-full overflow-hidden mb-8"
        >
          <div
            className="h-full bg-gradient-to-r from-btf-sky to-btf-sky-deep transition-all duration-500"
            style={{ width: `${Math.round((step / TOTAL) * 100)}%` }}
          />
        </div>

        {step === 1 && (
          <Question
            label={`Step 1 of ${TOTAL}`}
            question="Who is the person you&rsquo;re worried about, to you?"
            sub="No names, no details. Just the kind of relationship."
          >
            <Options
              options={Q1_RELATIONSHIP}
              selected={answers.relationship}
              onSelect={(v) => pickSingle("relationship", v)}
            />
          </Question>
        )}

        {step === 2 && (
          <Question
            label={`Step 2 of ${TOTAL}`}
            question="What are you seeing them struggle with?"
            sub="Pick anything that fits. You can choose more than one. If you&rsquo;re not sure, pick &lsquo;Something else&rsquo; &mdash; that&rsquo;s a useful answer."
          >
            <Options
              options={Q2_POPULATIONS}
              selected={answers.populations}
              onSelect={(v) => toggleMulti("populations", v)}
              multi
            />
          </Question>
        )}

        {step === 3 && (
          <Question
            label={`Step 3 of ${TOTAL}`}
            question="How long have you been worried?"
            sub="A rough sense is fine."
          >
            <Options
              options={Q3_DURATION}
              selected={answers.duration}
              onSelect={(v) => pickSingle("duration", v)}
            />
          </Question>
        )}

        {step === 4 && (
          <Question
            label={`Step 4 of ${TOTAL}`}
            question="What have you been noticing?"
            sub="Pick anything that matches. These signals help the platform meet them at the right place when they sign up."
          >
            <Options
              options={Q4_SIGNALS}
              selected={answers.severitySignals}
              onSelect={(v) => toggleMulti("severitySignals", v)}
              multi
            />
          </Question>
        )}

        {step === 5 && (
          <Question
            label={`Step 5 of ${TOTAL}`}
            question="Have you tried talking to them about it?"
            sub="There&rsquo;s no wrong answer. The honest one is the useful one."
          >
            <Options
              options={Q5_CONVERSATION}
              selected={answers.attemptedConversation}
              onSelect={(v) => pickSingle("attemptedConversation", v)}
            />
          </Question>
        )}

        {step === 6 && (
          <Question
            label={`Step 6 of ${TOTAL}`}
            question="What&rsquo;s their faith background, if any?"
            sub="The platform has a Catholic Path that&rsquo;s optional. Knowing whether faith would land for them helps us choose what to show first."
          >
            <Options
              options={Q6_FAITH}
              selected={answers.faithContext}
              onSelect={(v) => pickSingle("faithContext", v)}
            />
          </Question>
        )}

        {step === 7 && (
          <Question
            label={`Step 7 of ${TOTAL}`}
            question="How are you holding up?"
            sub="This question is for you. Caring for someone in trouble has its own weight."
          >
            <Options
              options={Q7_CSO_STATE}
              selected={answers.csoState}
              onSelect={(v) => pickSingle("csoState", v)}
            />
          </Question>
        )}

        {step === 8 && (
          <Question
            label={`Step 8 of ${TOTAL}`}
            question="What do you most want from this today?"
            sub="Whichever fits — both is a normal answer."
          >
            <Options
              options={Q8_GOAL}
              selected={answers.goal}
              onSelect={(v) => pickSingle("goal", v)}
            />
          </Question>
        )}

        {error && (
          <div
            role="alert"
            className="mt-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm p-4"
          >
            {error}
          </div>
        )}

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              disabled={submitting}
              className="flex-1 bg-white border-2 border-btf-text-light/30 text-btf-text-mid font-medium px-8 py-3.5 rounded-full hover:bg-btf-off-white transition-colors"
            >
              &larr; Back
            </button>
          )}
          <button
            type="button"
            onClick={advance}
            disabled={!canAdvance || submitting}
            className="flex-[2] bg-gradient-to-br from-btf-sky to-btf-sky-deep text-white font-medium px-8 py-3.5 rounded-full shadow-lg disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-0.5 transition-transform"
          >
            {step === TOTAL
              ? submitting
                ? "Generating your code…"
                : "Finish &rarr;"
              : "Next →"}
          </button>
        </div>
      </div>
    </main>
  );
}

function Question({
  label,
  question,
  sub,
  children,
}: {
  label: string;
  question: string;
  sub?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold font-semibold mb-3">
        {label}
      </p>
      <h1 className="font-serif text-2xl md:text-3xl text-btf-sky-deep font-light leading-tight mb-3">
        {question}
      </h1>
      {sub && (
        <p className="text-btf-text-mid font-light leading-relaxed mb-6 text-sm">
          {sub}
        </p>
      )}
      <div>{children}</div>
    </div>
  );
}

function Options({
  options,
  selected,
  onSelect,
  multi,
}: {
  options: Option[];
  selected: string | string[];
  onSelect: (v: string) => void;
  multi?: boolean;
}) {
  const isSelected = (v: string) =>
    multi
      ? (selected as string[]).includes(v)
      : selected === v;

  return (
    <ul className="space-y-2">
      {options.map((opt) => {
        const sel = isSelected(opt.value);
        return (
          <li key={opt.value}>
            <button
              type="button"
              onClick={() => onSelect(opt.value)}
              aria-pressed={sel}
              className={
                "w-full text-left rounded-2xl border-2 px-4 py-3 transition-all " +
                (sel
                  ? "border-btf-sky bg-btf-sky-pale/40 text-btf-sky-deep shadow-sm"
                  : "border-btf-sky-pale/60 bg-white text-btf-text-mid hover:border-btf-sky-light")
              }
            >
              <span className="block font-medium">{opt.label}</span>
              {opt.description && (
                <span className="block text-[11px] font-light text-btf-text-light mt-0.5">
                  {opt.description}
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
