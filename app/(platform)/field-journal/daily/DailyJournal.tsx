"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { EXERCISES } from "../../../lib/tools";
import { createEntry } from "../../../actions/journal";
import { getDisplayStreak } from "../../../actions/streaks";
import StreakChip from "../../../components/StreakChip";
import type { DisplayStreak } from "../../../lib/streakTypes";

/**
 * Daily Journal — freeform write + optional "Reflect on this" (the
 * server-side analyzer, /api/reflect). Reflect-first; resources come as
 * company, not correction. "Just save" stores the entry (encrypted, via
 * the existing journal) without analysis, for when someone only wants to
 * vent.
 */

type Analysis = {
  reflection: string;
  themes: string[];
  tools: { id: string; label: string; why: string }[];
  scriptures: { ref: string; text: string; why: string }[];
  roleModels: { name: string; note: string; passage: string }[];
  severity: { flag: boolean; urgent: boolean };
  promptBack: string;
};

const TYPES = ["Daily", "Reflection", "Note", "Intention"] as const;

// Real tools the analyzer may recommend (id = route slug).
const AVAILABLE_TOOLS = [
  ...EXERCISES.map((e) => ({ id: e.slug, label: e.name })),
  { id: "field-journal", label: "Field Journal" },
];
function toolHref(id: string): string {
  return id === "field-journal" ? "/field-journal" : `/tools/${id}/start`;
}

export default function DailyJournal() {
  const [type, setType] = useState<(typeof TYPES)[number]>("Daily");
  const [text, setText] = useState("");
  const [busy, setBusy] = useState<"reflect" | "save" | null>(null);
  const [insight, setInsight] = useState<Analysis | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function persist(): Promise<boolean> {
    const res = await createEntry(text.trim(), type.toLowerCase() as never);
    if (!res.success) {
      setError(res.error);
      return false;
    }
    setSaved(true);
    return true;
  }

  async function onReflect() {
    if (!text.trim() || busy) return;
    setBusy("reflect");
    setError(null);
    try {
      await persist();
      const res = await fetch("/api/reflect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim(), entryType: type, availableTools: AVAILABLE_TOOLS }),
      });
      const data = (await res.json()) as Analysis | { error: string };
      if ("error" in data) setError(data.error);
      else setInsight(data);
    } catch {
      setError("Couldn't read that back just now. Your entry is saved.");
    } finally {
      setBusy(null);
    }
  }

  async function onJustSave() {
    if (!text.trim() || busy) return;
    setBusy("save");
    setError(null);
    await persist();
    setBusy(null);
  }

  if (insight) {
    return <Insight insight={insight} />;
  }

  // Completion window for the "just save" path (no reflection requested).
  if (saved && !error && busy === null) {
    return <SavedComplete />;
  }

  return (
    <main className="min-h-screen bg-btf-off-white px-6 py-10 sm:py-14">
      <div className="max-w-2xl mx-auto">
        <Link href="/field-journal" className="text-btf-text-light hover:text-btf-sky-deep text-sm mb-6 inline-flex items-center gap-2 transition-colors">
          <span aria-hidden>←</span> Field Journal
        </Link>

        <h1 className="font-serif text-3xl md:text-4xl text-btf-sky-deep font-light leading-tight mb-2">
          Whatever you need to say.
        </h1>
        <p className="text-btf-text-mid font-light leading-relaxed mb-6 text-sm">
          Encrypted before it touches the database. You can write and{" "}
          <em>just save</em>, or ask for a gentle reflection back.
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={
                "rounded-full px-4 py-2 text-sm font-medium border transition-colors cursor-pointer " +
                (type === t ? "bg-btf-sky text-white border-btf-sky" : "bg-white border-btf-sky-pale text-btf-text-mid hover:border-btf-sky")
              }
            >
              {t}
            </button>
          ))}
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={10}
          placeholder="Start anywhere. There's no wrong way to do this."
          className="w-full rounded-2xl bg-white border border-btf-sky-pale focus:border-btf-sky focus:outline-none px-5 py-4 text-btf-text-dark leading-relaxed resize-none"
        />

        {error && (
          <p className="text-sm text-btf-text-mid font-light mt-3">{error}</p>
        )}
        {saved && !error && (
          <p className="text-sm text-btf-sky font-medium mt-3">Saved to your journal</p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 mt-5">
          <button
            onClick={onReflect}
            disabled={!text.trim() || busy !== null}
            className="flex-1 rounded-full bg-gradient-to-br from-btf-sky to-btf-sky-deep text-white font-medium py-3.5 disabled:opacity-40 transition-all hover:-translate-y-0.5 cursor-pointer"
          >
            {busy === "reflect" ? "Reading it back…" : "Reflect on this →"}
          </button>
          <button
            onClick={onJustSave}
            disabled={!text.trim() || busy !== null}
            className="flex-1 rounded-full bg-white border-2 border-btf-sky-pale text-btf-text-mid font-medium py-3.5 disabled:opacity-40 hover:border-btf-sky transition-colors cursor-pointer"
          >
            {busy === "save" ? "Saving…" : "Just save"}
          </button>
        </div>
      </div>
    </main>
  );
}

function Insight({ insight }: { insight: Analysis }) {
  const streak = useStreak();
  return (
    <main className="min-h-screen bg-btf-off-white px-6 py-10 sm:py-14">
      <div className="max-w-2xl mx-auto">
        <Link href="/field-journal" className="text-btf-text-light hover:text-btf-sky-deep text-sm mb-6 inline-flex items-center gap-2 transition-colors">
          <span aria-hidden>←</span> Field Journal
        </Link>

        {streak && (
          <div className="flex justify-center mb-8">
            <StreakChip streak={streak} tone="light" />
          </div>
        )}

        <p className="text-[11px] tracking-[0.25em] text-btf-gold uppercase font-semibold mb-3 btf-fade-up">
          Read back, with care
        </p>
        <p className="font-serif text-2xl md:text-3xl text-btf-sky-deep font-light leading-snug mb-2 btf-fade-up btf-d-1">
          {insight.reflection}
        </p>

        {insight.themes.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4 btf-fade-up btf-d-2">
            {insight.themes.map((t) => (
              <span key={t} className="text-xs bg-btf-sky-pale/60 text-btf-sky-deep rounded-full px-3 py-1 capitalize">{t}</span>
            ))}
          </div>
        )}

        {insight.severity.flag && (
          <div className="mt-6 rounded-2xl bg-btf-gold-pale/50 border border-btf-gold/40 p-5 btf-fade-up">
            <p className="text-btf-text-dark font-light leading-relaxed">
              You don&rsquo;t carry this alone. If it feels heavier than a passing wave,
              reaching a real person helps more than anything here.
            </p>
            <a href="tel:988" className="inline-block mt-2 text-btf-sky-deep font-medium underline underline-offset-2">
              Call or text 988
            </a>
          </div>
        )}

        {insight.tools.length > 0 && (
          <Block title="Something that might help">
            <div className="space-y-2">
              {insight.tools.map((t) => (
                <Link key={t.id} href={toolHref(t.id)} className="btf-rise block rounded-2xl bg-white border border-btf-sky-pale p-4 hover:border-btf-sky">
                  <p className="font-medium text-btf-sky-deep">{t.label} →</p>
                  <p className="text-sm text-btf-text-mid font-light mt-0.5">{t.why}</p>
                </Link>
              ))}
            </div>
          </Block>
        )}

        {insight.scriptures.length > 0 && (
          <Block title="A word for it">
            {insight.scriptures.map((s, i) => (
              <div key={i} className="mb-3">
                <p className="font-serif italic text-lg text-btf-text-dark">&ldquo;{s.text}&rdquo;</p>
                <p className="text-sm text-btf-gold font-medium mt-1">{s.ref}</p>
                {s.why && <p className="text-sm text-btf-text-mid font-light mt-0.5">{s.why}</p>}
              </div>
            ))}
          </Block>
        )}

        {insight.roleModels.length > 0 && (
          <Block title="You're in good company">
            {insight.roleModels.map((r, i) => (
              <div key={i} className="mb-3">
                <p className="font-medium text-btf-sky-deep">{r.name}</p>
                <p className="text-sm text-btf-text-mid font-light">{r.note}</p>
                <p className="text-xs text-btf-text-light mt-0.5">Read: {r.passage}</p>
              </div>
            ))}
          </Block>
        )}

        {insight.promptBack && (
          <Block title="To carry into tomorrow">
            <p className="font-serif italic text-lg text-btf-text-dark">{insight.promptBack}</p>
          </Block>
        )}

        <Link
          href="/field-journal"
          className="mt-8 inline-block rounded-full bg-btf-sky text-white px-6 py-3 text-sm font-medium cursor-pointer"
        >
          Done
        </Link>
      </div>
    </main>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6 btf-fade-up">
      <p className="text-[11px] tracking-[0.25em] text-btf-gold uppercase font-semibold mb-2">{title}</p>
      {children}
    </section>
  );
}

/* ─── Saved completion (the "just save" path) ─────────────────────── */

function useStreak(): DisplayStreak | null {
  const [streak, setStreak] = useState<DisplayStreak | null>(null);
  useEffect(() => {
    let on = true;
    getDisplayStreak()
      .then((v) => {
        if (on) setStreak(v);
      })
      .catch(() => {});
    return () => {
      on = false;
    };
  }, []);
  return streak;
}

function SavedComplete() {
  const streak = useStreak();
  return (
    <main className="min-h-screen bg-btf-off-white px-6 py-10 sm:py-14">
      <div className="max-w-2xl mx-auto text-center">
        {streak && (
          <div className="flex justify-center mb-8">
            <StreakChip streak={streak} tone="light" />
          </div>
        )}

        <p className="text-[11px] tracking-[0.25em] text-btf-gold uppercase font-semibold mb-3">
          Saved
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-btf-sky-deep font-light leading-tight mb-3">
          It&rsquo;s down on paper.
        </h1>
        <p className="font-serif italic text-lg text-btf-text-mid font-light leading-relaxed mb-8 max-w-md mx-auto">
          Naming it is the work. It&rsquo;s encrypted and kept — yours to look back on.
        </p>

        <div className="space-y-3 text-left max-w-md mx-auto">
          <Link
            href="/tools/grounding/start"
            className="block rounded-2xl bg-btf-gold/15 border border-btf-gold/50 hover:bg-btf-gold/20 px-5 py-4 transition-all"
          >
            <p className="text-[10px] tracking-[0.25em] uppercase text-btf-gold font-semibold mb-1">
              Recommended next
            </p>
            <p className="font-medium text-btf-sky-deep">5-4-3-2-1 Grounding →</p>
            <p className="text-xs text-btf-text-mid font-light mt-1 leading-relaxed">
              Come back into the room one sense at a time.
            </p>
          </Link>
          <Link
            href="/today/grove"
            className="block rounded-2xl bg-white border border-btf-sky-deep/10 hover:border-btf-gold/50 px-5 py-4 transition-all shadow-sm"
          >
            <p className="font-medium text-btf-sky-deep">See your grove →</p>
            <p className="text-xs text-btf-text-mid font-light mt-1 leading-relaxed">
              Your journey, your moments, all in one place.
            </p>
          </Link>
          <Link
            href="/field-journal"
            className="block rounded-2xl bg-white border border-btf-sky-deep/10 hover:border-btf-gold/50 px-5 py-4 transition-all shadow-sm"
          >
            <p className="font-medium text-btf-sky-deep">Back to Field Journal</p>
          </Link>
        </div>
      </div>
    </main>
  );
}
