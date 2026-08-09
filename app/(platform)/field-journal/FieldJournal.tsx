"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CONTEXTS,
  OUTCOMES,
  HALT_STATES,
  XP_PER_LOG,
  contextLabel,
  recommend,
  type Outcome,
  type Recommendation,
} from "../../lib/fieldJournalContent";
import {
  logUrge,
  addSituation,
  type FieldHome,
  type RecentLog,
} from "../../actions/fieldJournal";

/**
 * Field Journal — home + the sub-10s "log an urge" flow.
 *
 * Honesty over outcome (XP constant), forgiving streak, non-shaming
 * ("gave in" is neutral slate, never red), severity surfaces warm
 * support never an alarm. Calm dark surface in the BTF brand.
 */

type View = "home" | "log";
type Step = "context" | "intensity" | "outcome" | "detail" | "halt" | "confirm" | "next";

type Draft = {
  context: string;
  contextLabel: string;
  intensity: number;
  outcome: Outcome | null;
  detail: string;
  haltState: string | null;
};
const EMPTY: Draft = {
  context: "",
  contextLabel: "",
  intensity: 5,
  outcome: null,
  detail: "",
  haltState: null,
};

function outcomeTone(o: Outcome): string {
  // surf = gold, left = sky-light, slip = neutral muted (never red)
  if (o === "surfed") return "text-btf-gold-light";
  if (o === "left_scene") return "text-btf-sky-light";
  return "text-[#9fb6c8]";
}

export default function FieldJournal({ initial }: { initial: FieldHome }) {
  const [home, setHome] = useState<FieldHome>(initial);
  const [view, setView] = useState<View>("home");
  const [step, setStep] = useState<Step>("context");
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [addingOwn, setAddingOwn] = useState(false);
  const [ownInput, setOwnInput] = useState("");
  const [situations, setSituations] = useState<string[]>(initial.situations);
  const [result, setResult] = useState<
    { totalXp: number; currentStreak: number; contextCount: number; severity: { flag: boolean; urgent: boolean } } | null
  >(null);
  const [saving, setSaving] = useState(false);

  function startLog() {
    setDraft(EMPTY);
    setResult(null);
    setStep("context");
    setView("log");
  }
  function backHome() {
    setView("home");
    setStep("context");
    setDraft(EMPTY);
    setResult(null);
  }

  if (view === "home") {
    return <Home home={home} situations={situations} onLog={startLog} />;
  }

  return (
    <LogFlow
      step={step}
      setStep={setStep}
      draft={draft}
      setDraft={setDraft}
      situations={situations}
      addingOwn={addingOwn}
      setAddingOwn={setAddingOwn}
      ownInput={ownInput}
      setOwnInput={setOwnInput}
      onAddOwn={async () => {
        const v = ownInput.trim();
        if (!v) {
          setAddingOwn(false);
          return;
        }
        const res = await addSituation(v);
        if (res.ok) setSituations((s) => (s.includes(res.label) ? s : [...s, res.label]));
        setDraft((d) => ({ ...d, context: res.label, contextLabel: res.label }));
        setOwnInput("");
        setAddingOwn(false);
        setStep("intensity");
      }}
      saving={saving}
      result={result}
      onCommit={async (d) => {
        setSaving(true);
        const now = new Date();
        const localDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
        const res = await logUrge({
          context: d.context,
          intensity: d.intensity,
          outcome: d.outcome as Outcome,
          localDate,
          localHour: now.getHours(),
          localDow: now.getDay(),
          detail: d.detail || undefined,
          haltState: d.haltState || undefined,
        });
        setSaving(false);
        if (res.success) {
          setResult({
            totalXp: res.totalXp,
            currentStreak: res.currentStreak,
            contextCount: res.contextCount,
            severity: res.severity,
          });
          // optimistic home update
          setHome((h) => ({
            ...h,
            totalXp: res.totalXp,
            currentStreak: res.currentStreak,
            longestStreak: Math.max(h.longestStreak, res.currentStreak),
            recent: [
              {
                context: d.context,
                intensity: d.intensity,
                outcome: d.outcome as Outcome,
                detail: d.detail || null,
                loggedAt: new Date().toISOString(),
              },
              ...h.recent,
            ].slice(0, 5),
            rank: rankFromXp(res.totalXp),
          }));
          setStep("confirm");
        } else {
          setStep("confirm"); // confirm screen will show a gentle fallback
        }
      }}
      onDone={backHome}
    />
  );
}

function rankFromXp(xp: number) {
  // local mirror to avoid an extra import cycle
  const RANKS = [
    { name: "Keeping watch", at: 0 },
    { name: "Steady hand", at: 300 },
    { name: "Well-worn path", at: 1000 },
    { name: "Quiet strength", at: 2200 },
  ];
  let i = 0;
  RANKS.forEach((r, idx) => {
    if (xp >= r.at) i = idx;
  });
  const rank = RANKS[i];
  const next = RANKS[i + 1] ?? null;
  const pct = next ? Math.min(100, ((xp - rank.at) / (next.at - rank.at)) * 100) : 100;
  return { name: rank.name, next: next ? next.name : null, toNext: next ? next.at - xp : 0, pct: Math.round(pct) };
}

/* ─── Home ─── */
function Home({ home, situations, onLog }: { home: FieldHome; situations: string[]; onLog: () => void }) {
  void situations;
  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-10 sm:py-14">
      <div>
        <Link href="/tools" className="text-white/70 hover:text-white text-sm mb-6 inline-flex items-center gap-2 transition-colors">
          <span aria-hidden>←</span> Tools
        </Link>

        <p className="text-[11px] tracking-[0.25em] text-btf-gold uppercase font-semibold mb-2">
          Field Journal
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-white font-light leading-tight mb-6">
          Naming it is the work.
        </h1>

        {/* Rank + XP */}
        <div className="rounded-2xl bg-white/[0.055] border border-white/[0.09] p-6 btf-fade-up">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-white/70 font-semibold">
                Where you stand
              </p>
              <p className="font-serif text-2xl text-white mt-1">{home.rank.name}</p>
            </div>
            <div className="text-right">
              <p className="font-serif text-3xl text-btf-gold-light font-medium tabular-nums">{home.totalXp}</p>
              <p className="text-[10px] tracking-[0.2em] uppercase text-white/70 font-semibold">honesty</p>
            </div>
          </div>
          <div className="h-2 bg-white/[0.08] rounded-full mt-4 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-btf-sky to-btf-gold rounded-full transition-all" style={{ width: `${home.rank.pct}%` }} />
          </div>
          <p className="text-sm text-white/70 font-light mt-2">
            {home.rank.next ? `${home.rank.toNext} more toward “${home.rank.next}”` : "Steady as she goes."}
          </p>
        </div>

        {/* Streak */}
        <div className="rounded-2xl bg-white/[0.055] border border-white/[0.09] p-5 mt-4 flex items-center justify-between btf-fade-up btf-d-1">
          <div>
            <p className="font-serif text-2xl text-white">
              {home.currentStreak} {home.currentStreak === 1 ? "day" : "days"} kept
            </p>
            <p className="text-sm text-white/70 font-light">
              Days you showed up — a logged slip keeps it.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 mt-5 btf-fade-up btf-d-2">
          <button
            onClick={onLog}
            className="btf-rise rounded-2xl bg-gradient-to-b from-btf-gold-light to-btf-gold text-[#2a2008] font-bold px-5 py-5 text-left cursor-pointer shadow-[0_10px_24px_-10px_rgba(201,168,76,0.8)]"
          >
            <span className="block text-lg">+ Log an urge</span>
            <span className="block text-xs text-[#2a2008]/70 font-medium mt-1">Under ten seconds.</span>
          </button>
          <Link
            href="/field-journal/daily"
            className="btf-rise rounded-2xl bg-white/[0.055] border border-white/[0.09] hover:border-btf-gold/40 hover:bg-white/[0.08] transition-all px-5 py-5 text-left"
          >
            <span className="block text-lg text-[#e9f1f8] font-medium">Daily journal</span>
            <span className="block text-xs text-white/70 font-light mt-1">Write it out, and read it back.</span>
          </Link>
        </div>

        <div className="mt-3 flex justify-center gap-6">
          <Link href="/field-journal/week" className="text-sm text-btf-gold-light font-medium hover:text-white underline underline-offset-2">
            See this week →
          </Link>
          <Link href="/journal" className="text-sm text-btf-gold-light font-medium hover:text-white underline underline-offset-2">
            Past entries →
          </Link>
        </div>

        {/* Recent */}
        {home.recent.length > 0 && (
          <div className="mt-8">
            <p className="text-[11px] tracking-[0.25em] text-btf-gold uppercase font-semibold mb-3">Recent</p>
            <ul className="space-y-2">
              {home.recent.map((l, i) => (
                <RecentRow key={i} log={l} />
              ))}
            </ul>
          </div>
        )}

        <p className="text-xs text-white/70 font-light mt-8 leading-relaxed">
          A self-awareness habit, not a diagnosis.
        </p>
      </div>
    </main>
  );
}

function RecentRow({ log }: { log: RecentLog }) {
  return (
    <li className="rounded-xl bg-white/[0.055] border border-white/[0.09] px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="flex-1 text-[#e9f1f8]">{contextLabel(log.context)}</span>
        <span className="text-sm text-white/70">intensity {log.intensity}</span>
        <span className={"text-sm font-medium w-24 text-right " + outcomeTone(log.outcome)}>
          {OUTCOMES[log.outcome].label}
        </span>
      </div>
      {log.detail && (
        <p className="text-sm text-white/70 font-light italic mt-1">&ldquo;{log.detail}&rdquo;</p>
      )}
    </li>
  );
}

/* ─── Log flow ─── */
function LogFlow(props: {
  step: Step;
  setStep: (s: Step) => void;
  draft: Draft;
  setDraft: React.Dispatch<React.SetStateAction<Draft>>;
  situations: string[];
  addingOwn: boolean;
  setAddingOwn: (b: boolean) => void;
  ownInput: string;
  setOwnInput: (s: string) => void;
  onAddOwn: () => void;
  saving: boolean;
  result: { totalXp: number; currentStreak: number; contextCount: number; severity: { flag: boolean; urgent: boolean } } | null;
  onCommit: (d: Draft) => void;
  onDone: () => void;
}) {
  const { step, setStep, draft, setDraft, situations, addingOwn, setAddingOwn, ownInput, setOwnInput, onAddOwn, saving, result, onCommit, onDone } = props;

  // commit once when we reach confirm-by-way-of nothing — we commit explicitly
  // from detail/halt instead. (No effect needed.)

  return (
    <main className="mx-auto w-full max-w-xl px-6 py-10 sm:py-14">
      <div>
        <button onClick={onDone} className="text-white/70 hover:text-white text-sm mb-8 inline-flex items-center gap-2 cursor-pointer">
          <span aria-hidden>←</span> Cancel
        </button>

        {step === "context" && (
          <Stepped eyebrow="New entry" title="What was going on?" sub="Tap the closest one. There&rsquo;s no wrong answer.">
            <div className="flex flex-wrap gap-2">
              {Object.keys(CONTEXTS).map((k) => (
                <Chip key={k} onClick={() => { setDraft((d) => ({ ...d, context: k, contextLabel: CONTEXTS[k] })); setStep("intensity"); }}>
                  {CONTEXTS[k]}
                </Chip>
              ))}
              {situations.map((label) => (
                <Chip key={label} onClick={() => { setDraft((d) => ({ ...d, context: label, contextLabel: label })); setStep("intensity"); }}>
                  {label}
                </Chip>
              ))}
              {!addingOwn ? (
                <Chip onClick={() => setAddingOwn(true)} ghost>+ Add your own</Chip>
              ) : (
                <span className="inline-flex gap-2">
                  <input
                    autoFocus
                    value={ownInput}
                    onChange={(e) => setOwnInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); onAddOwn(); } }}
                    placeholder="your situation"
                    className="rounded-full bg-white/[0.06] border border-white/15 focus:border-btf-gold/50 focus:outline-none px-4 py-2 text-sm text-[#e9f1f8] placeholder:text-[#9fb6c8]"
                  />
                  <button onClick={onAddOwn} className="rounded-full bg-gradient-to-b from-btf-gold-light to-btf-gold text-[#2a2008] font-bold px-4 text-sm cursor-pointer">Add</button>
                </span>
              )}
            </div>
          </Stepped>
        )}

        {step === "intensity" && (
          <Stepped eyebrow="New entry" title="How strong is it?" sub="Trust your gut. There is no wrong number.">
            <div className="grid grid-cols-5 gap-3 max-w-sm">
              {Array.from({ length: 10 }).map((_, idx) => {
                const n = idx + 1;
                return (
                  <button
                    key={n}
                    onClick={() => { setDraft((d) => ({ ...d, intensity: n })); setStep("outcome"); }}
                    className="aspect-square rounded-xl border border-white/[0.09] bg-white/[0.055] hover:border-btf-gold/40 hover:bg-white/[0.08] text-[#e9f1f8] font-serif text-xl transition-colors cursor-pointer"
                  >
                    {n}
                  </button>
                );
              })}
            </div>
          </Stepped>
        )}

        {step === "outcome" && (
          <Stepped eyebrow="New entry" title="What happened?" sub="Every answer earns the same. Honesty is the whole point.">
            <div className="space-y-3">
              {(Object.keys(OUTCOMES) as Outcome[]).map((o) => (
                <button
                  key={o}
                  onClick={() => { setDraft((d) => ({ ...d, outcome: o })); setStep("detail"); }}
                  className="btf-rise w-full text-left rounded-2xl bg-white/[0.055] border border-white/[0.09] hover:border-btf-gold/40 hover:bg-white/[0.08] transition-all p-5 cursor-pointer"
                >
                  <span className={"block font-medium text-lg " + outcomeTone(o)}>{OUTCOMES[o].label}</span>
                  <span className="block text-sm text-white/70 font-light mt-0.5">{OUTCOMES[o].sub}</span>
                </button>
              ))}
            </div>
          </Stepped>
        )}

        {step === "detail" && (
          <Stepped
            eyebrow="New entry"
            title={draft.outcome === "gave_in" ? "What did you give in to — and how?" : draft.outcome === "surfed" ? "How did you stand firm?" : "What was going on?"}
            sub="A line is plenty. This becomes part of your map — and your playbook."
          >
            <textarea
              value={draft.detail}
              onChange={(e) => setDraft((d) => ({ ...d, detail: e.target.value }))}
              rows={3}
              placeholder="in your own words…"
              className="w-full rounded-xl bg-white/[0.06] border border-white/15 focus:border-btf-gold/50 focus:outline-none px-4 py-3 text-[#e9f1f8] placeholder:text-[#9fb6c8] resize-none"
            />
            <div className="flex gap-3 mt-5">
              <button onClick={() => { if (draft.intensity >= 7) setStep("halt"); else onCommit(draft); }} className="flex-1 rounded-full bg-white/[0.06] border border-white/15 text-[#e9f1f8] py-3 text-sm font-medium hover:border-btf-gold/40 hover:bg-white/[0.08] transition-colors cursor-pointer">
                Skip for now
              </button>
              <button onClick={() => { if (draft.intensity >= 7) setStep("halt"); else onCommit(draft); }} className="flex-1 rounded-full bg-gradient-to-b from-btf-gold-light to-btf-gold text-[#2a2008] py-3 text-sm font-bold cursor-pointer">
                Continue
              </button>
            </div>
          </Stepped>
        )}

        {step === "halt" && (
          <Stepped eyebrow="One quick check" title="What else is true right now?" sub="A self-check used in recovery — not a test. Pick one, or skip.">
            <div className="flex flex-wrap gap-2">
              {HALT_STATES.map((h) => (
                <Chip key={h} onClick={() => { const d = { ...draft, haltState: h }; setDraft(d); onCommit(d); }}>{h}</Chip>
              ))}
            </div>
            <button onClick={() => onCommit(draft)} className="mt-5 text-sm text-white/70 hover:text-white underline underline-offset-2 cursor-pointer">
              Skip
            </button>
          </Stepped>
        )}

        {step === "confirm" && (
          <ConfirmScreen draft={draft} saving={saving} result={result} onDone={onDone} onNext={() => setStep("next")} />
        )}

        {step === "next" && result && (
          <NextStep draft={draft} result={result} onDone={onDone} />
        )}
      </div>
    </main>
  );
}

function ConfirmScreen({
  draft,
  saving,
  result,
  onDone,
  onNext,
}: {
  draft: Draft;
  saving: boolean;
  result: { totalXp: number; currentStreak: number; contextCount: number; severity: { flag: boolean; urgent: boolean } } | null;
  onDone: () => void;
  onNext: () => void;
}) {
  if (saving || !result) {
    return (
      <div className="text-center pt-16">
        <p className="text-white/70 font-light">Recording…</p>
      </div>
    );
  }
  const sev = result.severity;
  return (
    <div className="text-center pt-8 btf-fade-up">
      <p className="font-serif text-6xl text-btf-gold-light font-medium">+{XP_PER_LOG}</p>
      <p className="text-lg text-white mt-1">Recorded, in honesty.</p>
      <p className="text-white/70 font-light mt-3 leading-relaxed">
        {draft.contextLabel} &middot; intensity {draft.intensity} &middot;{" "}
        <span className={outcomeTone(draft.outcome as Outcome)}>{OUTCOMES[draft.outcome as Outcome].label}</span>
        <br />
        Your streak holds. The pattern grows a little clearer.
      </p>

      {sev.urgent ? (
        <div className="mt-6 rounded-2xl bg-btf-gold/[0.10] border border-btf-gold/40 p-4 text-left">
          <p className="text-sm text-[#e9f1f8] font-light leading-relaxed">
            That sounds like a heavy one. You don&rsquo;t have to carry it alone tonight.
          </p>
          <a href="tel:988" className="inline-block mt-2 text-btf-gold-light font-medium underline underline-offset-2">
            Reach a person now — call or text 988
          </a>
        </div>
      ) : sev.flag ? (
        <p className="mt-5 text-sm text-white/70 font-light leading-relaxed">
          That was a strong one. Take a breath — the next screen has something that might help.
        </p>
      ) : null}

      <div className="flex gap-3 mt-8 justify-center">
        <button onClick={onDone} className="rounded-full bg-white/[0.06] border border-white/15 text-[#e9f1f8] px-6 py-3 text-sm font-medium hover:border-btf-gold/40 hover:bg-white/[0.08] transition-colors cursor-pointer">
          Done
        </button>
        <button onClick={onNext} className="rounded-full bg-gradient-to-b from-btf-gold-light to-btf-gold text-[#2a2008] px-6 py-3 text-sm font-bold cursor-pointer">
          {sev.flag ? "See support →" : "What&rsquo;s next →"}
        </button>
      </div>
    </div>
  );
}

function NextStep({
  draft,
  result,
  onDone,
}: {
  draft: Draft;
  result: { contextCount: number };
  onDone: () => void;
}) {
  const rec: Recommendation = recommend(
    { context: draft.context, intensity: draft.intensity, outcome: draft.outcome as Outcome, detail: draft.detail },
    result.contextCount,
    draft.contextLabel
  );
  return (
    <div className="pt-6 btf-fade-up">
      <p className="text-[11px] tracking-[0.25em] text-btf-gold uppercase font-semibold mb-2">Your next move</p>
      <h2 className="font-serif text-2xl text-white font-light mb-3">{rec.title}</h2>
      <p className="text-white/70 font-light leading-relaxed">{rec.body}</p>
      {rec.plan && (
        <div className="mt-4 rounded-2xl bg-white/[0.055] border border-white/[0.09] p-4">
          <p className="text-[10px] tracking-[0.2em] uppercase text-btf-sky-light font-semibold mb-1">A plan, ready for next time</p>
          <p className="text-[#e9f1f8] font-light italic">{rec.plan}</p>
        </div>
      )}
      <div className="flex flex-col sm:flex-row gap-3 mt-7">
        <Link href={rec.cta.href} className="flex-1 text-center rounded-full bg-gradient-to-b from-btf-gold-light to-btf-gold text-[#2a2008] py-3.5 font-bold cursor-pointer">
          {rec.cta.label}
        </Link>
        <button onClick={onDone} className="flex-1 rounded-full bg-white/[0.06] border border-white/15 text-[#e9f1f8] py-3.5 text-sm font-medium hover:border-btf-gold/40 hover:bg-white/[0.08] transition-colors cursor-pointer">
          Back to journal
        </button>
      </div>
    </div>
  );
}

/* ─── small UI ─── */
function Stepped({ eyebrow, title, sub, children }: { eyebrow: string; title: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="btf-fade-up">
      <p className="text-[11px] tracking-[0.25em] text-btf-gold uppercase font-semibold mb-2">{eyebrow}</p>
      <h1 className="font-serif text-2xl md:text-3xl text-white font-light leading-tight mb-2">{title}</h1>
      {sub && <p className="text-white/70 font-light leading-relaxed mb-7 text-sm">{sub}</p>}
      {children}
    </div>
  );
}

function Chip({ children, onClick, ghost }: { children: React.ReactNode; onClick: () => void; ghost?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={
        "rounded-full px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer border " +
        (ghost
          ? "bg-transparent border-dashed border-btf-gold/40 text-btf-gold-light hover:bg-white/[0.06]"
          : "bg-white/[0.055] border-white/[0.09] text-[#e9f1f8] hover:border-btf-gold/40 hover:bg-white/[0.08]")
      }
    >
      {children}
    </button>
  );
}
