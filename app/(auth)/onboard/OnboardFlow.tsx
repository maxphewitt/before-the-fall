"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createUser, type ProfileData } from "../../actions/createUser";
import { lookupLovedOneIntake } from "../../actions/lovedOne";

// ============================================
// Value mappings — UI labels are human; stored values are normalized
// ============================================

type Option<T extends string = string> = { value: T; label: string; description?: string };

/* Repositioned 2026-09-21 (vault: 07 - Content / 2026-09-21 The Great
   Repositioning — Spec v1). The front door now welcomes the skeptical,
   the curious, and the returning — not only the struggling. Question
   order: faith first. The populations question survives (it still
   drives habit defaults, safety scanning, and collections — stored
   values UNCHANGED) but is optional, softened, and skippable via
   "Mostly I'm here to explore" (stores ["other"]). support_level is no
   longer asked; it defaults to self_guided. Old accounts' answers were
   remapped by scripts/task-56-repositioning.sql. */

const Q1_FAITH: Option[] = [
  {
    value: "secular",
    label: "Skeptical — but something made me open this",
    description: "Start with the practical tools and wisdom library; the faith side waits until you want it",
  },
  {
    value: "open",
    label: "On the fence — curious, asking questions",
    description: "Explore prayer, Scripture, and what Catholics actually believe, with nothing assumed",
  },
  {
    value: "growing_closer",
    label: "New to it, coming back, or ready to go deeper",
    description: "Whether it's been twenty years or twenty minutes since you last prayed",
  },
];

const Q2_DREW: Option[] = [
  { value: "understand_beliefs", label: "I want to understand what Catholics actually believe" },
  { value: "learn_pray", label: "I want to learn to pray" },
  { value: "something_missing", label: "Something is missing and I'm trying to name it" },
  { value: "carrying_something", label: "I'm carrying something I want to lay down" },
  { value: "invited", label: "Someone invited me to look" },
];

const Q3_POPULATIONS: Option[] = [
  { value: "porn", label: "A habit or compulsion I can't shake loose" },
  { value: "substance", label: "Drinking or substance use" },
  { value: "self_harm", label: "Dark or hopeless thoughts" },
  { value: "relationship_abuse", label: "Hurt happening at home" },
  { value: "depression_anxiety", label: "Anxiety, or a low that won't lift" },
  { value: "other", label: "Something else, or I'd rather not say right now" },
];

const Q4_HOPE: Option[] = [
  { value: "understand_faith", label: "Understanding the faith well enough to decide for myself" },
  { value: "prayer_life", label: "A real prayer life" },
  { value: "peace_with_past", label: "Peace with something in my past" },
  { value: "back_to_sacraments", label: "Getting back to the sacraments" },
  { value: "dont_know", label: "I honestly don't know yet — that's why I'm here" },
];

const Q5_DURATION: Option[] = [
  { value: "recent", label: "This is new — something just happened" },
  { value: "months", label: "A few months" },
  { value: "year_or_two", label: "A year or two" },
  { value: "many_years", label: "Many years" },
  { value: "forever", label: "Most of my life" },
];

const Q6_DISCOVERY: Option[] = [
  { value: "searching", label: "I was searching and found Before the Fall" },
  { value: "referral", label: "Someone I trust pointed me here" },
  { value: "trigger_event", label: "Something just happened that made me look" },
  { value: "thinking_about_it", label: "I've been circling this for a while" },
  { value: "unsure", label: "I'm not sure — I just needed to do something" },
];

// ============================================
// Step ordering
// ============================================
// 0  welcome
// 1  Q1 faith (loved-one link routes out from here)
// 2  Q2 what drew you
// 3  Q3 carrying something (optional — explore skip)
// 4  Q4 what a good outcome looks like
// 5  Q5 how long you've been circling this
// 6  Q6 discovery
// 7  privacy disclosure
// 8  submit & code reveal

const TOTAL_QUESTIONS = 6; // for the progress bar

// ============================================
// Page component
// ============================================

export default function OnboardPage() {
  return (
    <Suspense fallback={null}>
      <OnboardFlow />
    </Suspense>
  );
}

function OnboardFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<ProfileData>({
    framing: "",
    here_for: "self",
    populations: [],
    emotional_state: "",
    faith_role: "",
    // The support-level question was retired in the 2026-09-21
    // repositioning; everyone starts self-guided and discovers the
    // rest inside.
    support_level: "self_guided",
    duration: "",
    discovery: "",
    display_name: "",
  });
  const [recoveryCode, setRecoveryCode] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // "Keep me logged in on this device." Default on. When off, the
  // session cookie is dropped when the browser window closes.
  const [keepLoggedIn, setKeepLoggedIn] = useState(true);
  // Loved-one referral state.
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [referralApplied, setReferralApplied] = useState(false);
  const referralLookupAttempted = useRef(false);

  // If ?code= is present, look it up server-side and pre-fill the
  // populations/duration/faith_role fields. Stays best-effort — if the
  // code is invalid or expired we silently fall through to a normal
  // onboarding.
  useEffect(() => {
    const raw = searchParams.get("code");
    if (!raw || referralLookupAttempted.current) return;
    referralLookupAttempted.current = true;
    (async () => {
      try {
        const res = await lookupLovedOneIntake(raw);
        if (!res.success) return;
        const answers = res.data;
        // CSO faith_context → onboard faith_role mapping.
        const faithRole = (() => {
          switch (answers.faithContext) {
            case "catholic_active":
            case "catholic_lapsed":
              return "growing_closer";
            case "other_faith":
              return "open";
            case "secular":
              return "secular";
            default:
              return "";
          }
        })();
        setProfile((p) => ({
          ...p,
          populations: answers.populations.length > 0 ? answers.populations : p.populations,
          duration: answers.duration || p.duration,
          faith_role: faithRole || p.faith_role,
        }));
        setReferralCode(raw);
        setReferralApplied(true);
      } catch (err) {
        console.warn("Referral code lookup failed:", err);
      }
    })();
  }, [searchParams]);

  function advance() {
    setStep((s) => s + 1);
  }

  function togglePopulation(value: string) {
    setProfile((p) => {
      const has = p.populations.includes(value);
      return {
        ...p,
        populations: has
          ? p.populations.filter((v) => v !== value)
          : [...p.populations, value],
      };
    });
  }

  async function submit() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await createUser(profile, {
        ...(referralCode ? { lovedOneCode: referralCode } : {}),
        persist: keepLoggedIn,
      });
      if (res.success) {
        setRecoveryCode(res.recoveryCode);
        setStep(8);
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

  // Progress: 0 on welcome, 1/6 after Q1, ..., 6/6 on privacy/reveal.
  const questionStep = step === 0 ? 0 : Math.min(step - 1, TOTAL_QUESTIONS);

  return (
    <main className="min-h-screen bg-btf-off-white px-6 py-10 sm:py-14">
      <div className="max-w-2xl mx-auto">
        {/* Referral pre-fill banner — only shown when a valid ?code= was applied. */}
        {referralApplied && step > 0 && step < 7 && (
          <div
            role="status"
            className="rounded-2xl bg-btf-gold-pale/60 border border-btf-gold/40 px-5 py-4 mb-6"
          >
            <p className="text-[10px] tracking-[0.25em] uppercase text-btf-sky-deep font-semibold mb-1">
              Someone who cares about you helped set this up
            </p>
            <p className="text-sm text-btf-text-mid font-light leading-relaxed">
              A few of these answers are pre-filled based on what they shared. They can&rsquo;t see your answers, only the platform can &mdash; and you can change anything below.
            </p>
          </div>
        )}

        {/* Progress bar (hidden on welcome and final reveal) */}
        {step > 0 && step < 7 && (
          <div className="h-1 bg-btf-sky-pale rounded-full mb-10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-btf-sky to-btf-gold rounded-full transition-all duration-500"
              style={{ width: `${(questionStep / TOTAL_QUESTIONS) * 100}%` }}
            />
          </div>
        )}

        {step === 0 && <Welcome onNext={() => setStep(1)} />}

        {step === 1 && (
          <Question
            label="Step 1 of 6"
            question="Where are you with faith right now?"
            sub="There's no wrong answer, and nothing here signs you up for anything."
          >
            <Options
              options={Q1_FAITH}
              selected={profile.faith_role}
              onSelect={(v) => {
                setProfile((p) => ({ ...p, faith_role: v, here_for: "self" }));
                advance();
              }}
            />
            <button
              type="button"
              onClick={() => router.push("/loved-one")}
              className="mt-6 mx-auto block text-sm text-btf-sky underline underline-offset-4 font-light hover:text-btf-sky-deep"
            >
              Here for someone you love? There&rsquo;s a path for that.
            </button>
          </Question>
        )}

        {step === 2 && (
          <Question
            label="Step 2 of 6"
            question="What drew you here?"
            sub="Pick the one closest to the truth today."
          >
            <Options
              options={Q2_DREW}
              selected={profile.framing}
              onSelect={(v) => {
                setProfile((p) => ({ ...p, framing: v }));
                advance();
              }}
            />
          </Question>
        )}

        {step === 3 && (
          <Question
            label="Step 3 of 6"
            question="Are you carrying something you'd like help with?"
            sub="Optional. If anything fits, choosing it helps us put the right things in front of you. We never share this."
          >
            <Options
              options={Q3_POPULATIONS}
              selected={profile.populations}
              onSelect={togglePopulation}
              multi
            />
            <ContinueButton
              disabled={profile.populations.length === 0}
              onClick={advance}
            >
              Continue
            </ContinueButton>
            <button
              type="button"
              onClick={() => {
                setProfile((p) => ({ ...p, populations: ["other"] }));
                advance();
              }}
              className="mt-4 mx-auto block text-sm text-btf-sky underline underline-offset-4 font-light hover:text-btf-sky-deep"
            >
              Mostly I&rsquo;m here to explore &mdash; skip this
            </button>
          </Question>
        )}

        {step === 4 && (
          <Question
            label="Step 4 of 6"
            question="What would a good outcome look like for you?"
          >
            <Options
              options={Q4_HOPE}
              selected={profile.emotional_state}
              onSelect={(v) => {
                setProfile((p) => ({ ...p, emotional_state: v }));
                advance();
              }}
            />
          </Question>
        )}

        {step === 5 && (
          <Question
            label="Step 5 of 6"
            question="How long have you been circling this?"
          >
            <Options
              options={Q5_DURATION}
              selected={profile.duration}
              onSelect={(v) => {
                setProfile((p) => ({ ...p, duration: v }));
                advance();
              }}
            />
          </Question>
        )}

        {step === 6 && (
          <Question
            label="Step 6 of 6"
            question="What brought you to us today?"
            sub="This helps us know how people find us — and how to reach others like you."
          >
            <Options
              options={Q6_DISCOVERY}
              selected={profile.discovery}
              onSelect={(v) => {
                setProfile((p) => ({ ...p, discovery: v }));
                advance();
              }}
            />
          </Question>
        )}

        {step === 7 && (
          <PrivacyDisclosure
            onContinue={submit}
            submitting={submitting}
            error={error}
            keepLoggedIn={keepLoggedIn}
            onKeepLoggedInChange={setKeepLoggedIn}
            displayName={profile.display_name ?? ""}
            onDisplayNameChange={(v) =>
              setProfile((p) => ({ ...p, display_name: v }))
            }
          />
        )}

        {step === 8 && recoveryCode && (
          <CodeReveal
            code={recoveryCode}
            onDone={() => router.push("/home")}
          />
        )}
      </div>
    </main>
  );
}

// ============================================
// Sub-components
// ============================================

function Welcome({ onNext }: { onNext: () => void }) {
  return (
    <div className="pt-2 pb-4">
      {/* Cross — same as home hero so the visual register carries over. */}
      <div className="relative w-10 h-10 mb-7" aria-hidden>
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-1.5 h-10 bg-btf-gold rounded-sm" />
        <div className="absolute left-1/2 top-2.5 -translate-x-1/2 w-7 h-1.5 bg-btf-gold rounded-sm" />
      </div>

      <p className="text-[11px] tracking-[0.25em] text-btf-gold uppercase font-semibold mb-3">
        Welcome
      </p>
      <h1 className="font-serif text-3xl md:text-4xl text-btf-sky-deep font-light leading-tight mb-4">
        You&rsquo;re here. That&rsquo;s enough to start.
      </h1>
      <p className="font-serif italic text-base text-btf-text-mid font-light leading-relaxed mb-8">
        Skeptical, curious, coming home, or just looking &mdash; you&rsquo;re welcome exactly as you are. Take it at your own pace.
      </p>

      {/* Gold divider — visual breath between intro and the substance. */}
      <div className="w-16 h-px my-8 bg-gradient-to-r from-btf-gold/0 via-btf-gold to-btf-gold/0" aria-hidden />

      {/* Three reassurances — what we don't ask, what we don't store, what we don't sell. */}
      <div className="space-y-3 mb-8">
        <Reassurance
          title="No name. No email. No phone."
          body="You&rsquo;ll get a 12-word recovery code instead. That&rsquo;s how you come back. We never know who you are."
        />
        <Reassurance
          title="You can leave at any time."
          body="Nothing follows you. No tracking, no third-party analytics, no advertisers, ever."
        />
        <Reassurance
          title="What you write here is yours."
          body="Journal entries are encrypted with a key we don&rsquo;t share. Only you can read them."
        />
      </div>

      <div className="w-16 h-px my-8 bg-gradient-to-r from-btf-gold/0 via-btf-gold to-btf-gold/0" aria-hidden />

      {/* What we'll ask — sets the expectation so the seven questions don't feel like a wall. */}
      <div className="rounded-2xl bg-white border border-btf-sky-pale/70 p-5 sm:p-6 mb-8 shadow-sm">
        <p className="text-[10px] tracking-[0.25em] uppercase text-btf-sky font-semibold mb-3">
          Six questions. About two minutes.
        </p>
        <p className="text-sm text-btf-text-mid font-light leading-relaxed mb-4">
          They&rsquo;re only asked once, and there are no wrong answers. They tell us how to meet you well &mdash; where to start you, what to put in front of you, and what to leave until you ask.
        </p>
        <ul className="space-y-1.5 text-sm text-btf-text-dark font-light">
          <QuestionPreview n={1} text="Where you are with faith right now." />
          <QuestionPreview n={2} text="What drew you here." />
          <QuestionPreview n={3} text="Whether you&rsquo;re carrying something. (Optional.)" />
          <QuestionPreview n={4} text="What a good outcome would look like." />
          <QuestionPreview n={5} text="How long you&rsquo;ve been circling this." />
          <QuestionPreview n={6} text="How you found us." />
        </ul>
      </div>

      <button
        onClick={onNext}
        className="w-full max-w-md mx-auto bg-gradient-to-br from-btf-sky to-btf-sky-deep text-white font-medium px-8 py-3.5 rounded-full shadow-lg hover:-translate-y-0.5 transition-transform block"
      >
        Begin
      </button>
      <p className="text-center text-xs text-btf-text-light font-light mt-4">
        If you&rsquo;re in crisis right now, the button at the bottom of every screen is for you.
      </p>
    </div>
  );
}

function Reassurance({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl bg-white border border-btf-sky-pale/60 px-5 py-4 shadow-sm">
      <p className="text-sm font-medium text-btf-sky-deep mb-1">{title}</p>
      <p className="text-sm text-btf-text-mid font-light leading-relaxed">{body}</p>
    </div>
  );
}

function QuestionPreview({ n, text }: { n: number; text: string }) {
  return (
    <li className="flex items-baseline gap-3">
      <span className="text-[10px] tracking-[0.18em] uppercase text-btf-gold font-semibold w-6 shrink-0">
        {String(n).padStart(2, "0")}
      </span>
      <span className="text-btf-text-mid font-light leading-relaxed">{text}</span>
    </li>
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
      <p className="text-[11px] tracking-[0.25em] text-btf-gold uppercase font-semibold mb-3">
        {label}
      </p>
      <h2 className="font-serif text-2xl md:text-3xl text-btf-sky-deep font-light leading-tight mb-3">
        {question}
      </h2>
      {sub && (
        <p className="text-sm text-btf-text-mid font-light leading-relaxed mb-8">
          {sub}
        </p>
      )}
      {!sub && <div className="mb-6" />}
      {children}
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
  onSelect: (value: string) => void;
  multi?: boolean;
}) {
  function isSelected(value: string) {
    if (Array.isArray(selected)) return selected.includes(value);
    return selected === value;
  }

  return (
    <div className="space-y-3">
      {options.map((opt) => {
        const sel = isSelected(opt.value);
        return (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className={`w-full text-left p-5 rounded-2xl border-2 transition-all ${
              sel
                ? "border-btf-sky bg-btf-sky-pale shadow-sm"
                : "border-btf-sky-pale/60 bg-white hover:border-btf-sky-light hover:shadow-md"
            }`}
          >
            <p
              className={`font-medium ${
                sel ? "text-btf-sky-deep" : "text-btf-text-dark"
              }`}
            >
              {opt.label}
            </p>
            {opt.description && (
              <p className="text-xs text-btf-text-mid font-light mt-1">
                {opt.description}
              </p>
            )}
            {multi && sel && (
              <p className="text-[10px] tracking-widest uppercase text-btf-sky font-semibold mt-2">
                Selected
              </p>
            )}
          </button>
        );
      })}
    </div>
  );
}

function ContinueButton({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="mt-8 w-full max-w-md mx-auto bg-gradient-to-br from-btf-sky to-btf-sky-deep text-white font-medium px-8 py-3.5 rounded-full shadow-lg disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-0.5 transition-transform block"
    >
      {children}
    </button>
  );
}

function PrivacyDisclosure({
  onContinue,
  submitting,
  error,
  keepLoggedIn,
  onKeepLoggedInChange,
  displayName,
  onDisplayNameChange,
}: {
  onContinue: () => void;
  submitting: boolean;
  error: string | null;
  keepLoggedIn: boolean;
  onKeepLoggedInChange: (v: boolean) => void;
  displayName: string;
  onDisplayNameChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="text-[11px] tracking-[0.25em] text-btf-gold uppercase font-semibold mb-3">
        One last thing before we begin
      </p>
      <h2 className="font-serif text-2xl md:text-3xl text-btf-sky-deep font-light leading-tight mb-5">
        What we keep, and why.
      </h2>
      <div className="space-y-4 text-sm text-btf-text-mid font-light leading-relaxed mb-8">
        <p>
          We don&rsquo;t ask for your name, your email, or your phone number. But we are not zero-knowledge anonymous &mdash; because if we were, we couldn&rsquo;t respond when someone&rsquo;s life is in danger.
        </p>
        <p>Here is exactly what we keep:</p>
        <ul className="space-y-2 pl-4 list-disc marker:text-btf-gold">
          <li>Your recovery code, stored in a way only you can unlock.</li>
          <li>The answers you just gave us, so we can serve you well.</li>
          <li>
            Your IP address, hashed (one-way scrambled), and your timestamps &mdash; so we can respond to lawful subpoenas, dispatch a 988 response if your content suggests imminent self-harm, or report content covered by the National Center for Missing &amp; Exploited Children.
          </li>
          <li>
            Your journal entries, encrypted at rest. We automatically scan saved entries for words that signal imminent harm &mdash; to yourself or to another person. Only the category of signal is recorded, never the words themselves. A trained reviewer is alerted so we can offer support or contact the appropriate authority if you&rsquo;ve disclosed something that puts you or someone else in danger.
          </li>
          <li>
            We do not sell, trade, or share your data with advertisers, ever.
          </li>
        </ul>
      </div>
      {/* Optional chosen nickname. Framed carefully so it doesn't undercut
          the anonymity promise above — it's a name to be greeted by, not
          identity, and it's skippable + editable later. */}
      <div className="rounded-2xl bg-white border border-btf-sky-pale/70 p-4 mb-6">
        <label htmlFor="display_name" className="block text-sm font-medium text-btf-sky-deep mb-1">
          What should we call you?{" "}
          <span className="font-light text-btf-text-light">(optional)</span>
        </label>
        <p className="text-xs text-btf-text-light font-light leading-relaxed mb-3">
          A first name or nickname — whatever you like. Not your real name, and
          you can change or remove it any time.
        </p>
        <input
          id="display_name"
          type="text"
          value={displayName}
          maxLength={40}
          onChange={(e) => onDisplayNameChange(e.target.value)}
          disabled={submitting}
          placeholder="e.g. a nickname"
          className="w-full rounded-xl border-2 border-btf-sky-pale px-4 py-2.5 text-btf-sky-deep placeholder:text-btf-text-light/70 focus:border-btf-sky focus:outline-none"
        />
      </div>

      {/* Keep-me-logged-in choice. Off = session-only cookie, so a new
          window lands back on the home page to log in again. */}
      <label className="flex items-start gap-3 cursor-pointer select-none mb-6 rounded-2xl bg-white border border-btf-sky-pale/70 p-4">
        <input
          type="checkbox"
          checked={keepLoggedIn}
          onChange={(e) => onKeepLoggedInChange(e.target.checked)}
          disabled={submitting}
          className="mt-0.5 h-5 w-5 flex-shrink-0 rounded border-2 border-btf-sky-pale text-btf-sky focus:ring-btf-sky accent-btf-sky"
        />
        <span className="text-sm text-btf-text-mid font-light leading-relaxed">
          <span className="font-medium text-btf-sky-deep">
            Keep me logged in on this device.
          </span>
          <br />
          Leave this unchecked on a shared or borrowed device — you&rsquo;ll be
          signed out when you close the window and can log back in with your
          recovery code.
        </span>
      </label>
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm p-4 mb-6">
          {error}
        </div>
      )}
      <button
        onClick={onContinue}
        disabled={submitting}
        className="w-full max-w-md mx-auto bg-gradient-to-br from-btf-sky to-btf-sky-deep text-white font-medium px-8 py-3.5 rounded-full shadow-lg disabled:opacity-50 hover:-translate-y-0.5 transition-transform block"
      >
        {submitting ? "Creating your space…" : "I understand. Generate my code."}
      </button>
    </div>
  );
}

function CodeReveal({
  code,
  onDone,
}: {
  code: string;
  onDone: () => void;
}) {
  return (
    <div>
      <p className="text-[11px] tracking-[0.25em] text-btf-gold uppercase font-semibold mb-3">
        Your recovery code
      </p>
      <h2 className="font-serif text-2xl md:text-3xl text-btf-sky-deep font-light leading-tight mb-3">
        Save it now.
      </h2>
      <p className="text-sm text-btf-text-mid font-light leading-relaxed mb-6">
        Twelve words. Lowercase. In this exact order. Save it to a password manager (Apple Passwords, 1Password, Bitwarden), write it in a note on your phone, or screenshot this screen &mdash; whatever works. We will not show it again. If you lose it, we cannot recover your saved progress, because we don&rsquo;t know who you are. That&rsquo;s the cost of keeping you anonymous.
      </p>
      <div className="rounded-2xl bg-white border-2 border-btf-gold/40 p-6 sm:p-8 mb-8 shadow-sm">
        <p className="font-mono text-base sm:text-lg text-btf-sky-deep leading-relaxed break-words text-center tracking-wide">
          {code}
        </p>
      </div>
      <button
        onClick={() => {
          navigator.clipboard.writeText(code);
        }}
        className="w-full max-w-md mx-auto mb-3 bg-white border-2 border-btf-sky text-btf-sky-deep font-medium px-8 py-3 rounded-full hover:bg-btf-sky-pale/40 transition-colors block"
      >
        Copy to clipboard
      </button>
      <button
        onClick={onDone}
        className="w-full max-w-md mx-auto bg-gradient-to-br from-btf-sky to-btf-sky-deep text-white font-medium px-8 py-3.5 rounded-full shadow-lg hover:-translate-y-0.5 transition-transform block"
      >
        I&rsquo;ve saved it. Continue.
      </button>
    </div>
  );
}
