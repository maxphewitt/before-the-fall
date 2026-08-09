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
    <main className="mx-auto w-full max-w-2xl px-6 py-10 sm:py-14">
      <div>
        <Link href="/field-journal" className="text-white/70 hover:text-white text-sm mb-6 inline-flex items-center gap-2 transition-colors">
          <span aria-hidden>←</span> Field Journal
        </Link>

        <h1 className="font-serif text-3xl md:text-4xl text-white font-light leading-tight mb-2">
          Whatever you need to say.
        </h1>
        <p className="text-white/70 font-light leading-relaxed mb-6 text-sm">
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
                (type === t ? "bg-btf-gold/[0.14] text-[#e9f1f8] border-btf-gold/50" : "bg-white/[0.055] border-white/[0.09] text-white/70 hover:border-btf-gold/40 hover:bg-white/[0.08]")
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
          className="w-full rounded-2xl bg-white/[0.06] border border-white/15 focus:border-btf-gold/50 focus:outline-none px-5 py-4 text-[#e9f1f8] placeholder:text-[#9fb6c8] leading-relaxed resize-none"
        />

        {error && (
          <p className="text-sm text-white/70 font-light mt-3">{error}</p>
        )}
        {saved && !error && (
          <p className="text-sm text-btf-gold-light font-medium mt-3">Saved to your journal</p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 mt-5">
          <button
            onClick={onReflect}
            disabled={!text.trim() || busy !== null}
            className="flex-1 rounded-full bg-gradient-to-b from-btf-gold-light to-btf-gold text-[#2a2008] font-bold py-3.5 disabled:opacity-40 transition-all hover:-translate-y-0.5 cursor-pointer shadow-[0_10px_24px_-10px_rgba(201,168,76,0.8)]"
          >
            {busy === "reflect" ? "Reading it back…" : "Reflect on this →"}
          </button>
          <button
            onClick={onJustSave}
            disabled={!text.trim() || busy !== null}
            className="flex-1 rounded-full bg-white/[0.06] border border-white/15 text-[#e9f1f8] font-medium py-3.5 disabled:opacity-40 hover:border-btf-gold/40 hover:bg-white/[0.08] transition-colors cursor-pointer"
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
    <main className="mx-auto w-full max-w-2xl px-6 py-10 sm:py-14">
      <div>
        <Link href="/field-journal" className="text-white/70 hover:text-white text-sm mb-6 inline-flex items-center gap-2 transition-colors">
          <span aria-hidden>←</span> Field Journal
        </Link>

        {streak && (
          <div className="flex justify-center mb-8">
            <StreakChip streak={streak} tone="dark" />
          </div>
        )}

        <p className="text-[11px] tracking-[0.25em] text-btf-gold uppercase font-semibold mb-3 btf-fade-up">
          Read back, with care
        </p>
        <p className="font-serif text-2xl md:text-3xl text-white font-light leading-snug mb-2 btf-fade-up btf-d-1">
          {insight.reflection}
        </p>

        {insight.themes.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4 btf-fade-up btf-d-2">
            {insight.themes.map((t) => (
              <span key={t} className="text-xs bg-white/[0.08] text-[#e9f1f8] rounded-full px-3 py-1 capitalize">{t}</span>
            ))}
          </div>
        )}

        {insight.severity.flag && (
          <div className="mt-6 rounded-2xl bg-btf-gold/[0.10] border border-btf-gold/40 p-5 btf-fade-up">
            <p className="text-[#e9f1f8] font-light leading-relaxed">
              You don&rsquo;t carry this alone. If it feels heavier than a passing wave,
              reaching a real person helps more than anything here.
            </p>
            <a href="tel:988" className="inline-block mt-2 text-btf-gold-light font-medium underline underline-offset-2">
              Call or text 988
            </a>
          </div>
        )}

        {insight.tools.length > 0 && (
          <Block title="Something that might help">
            <div className="space-y-2">
              {insight.tools.map((t) => (
                <Link key={t.id} href={toolHref(t.id)} className="btf-rise block rounded-2xl bg-white/[0.055] border border-white/[0.09] p-4 hover:border-btf-gold/40 hover:bg-white/[0.08] transition-all">
                  <p className="font-medium text-[#e9f1f8]">{t.label} →</p>
                  <p className="text-sm text-white/70 font-light mt-0.5">{t.why}</p>
                </Link>
              ))}
            </div>
          </Block>
        )}

        {insight.scriptures.length > 0 && (
          <Block title="A word for it">
            {insight.scriptures.map((s, i) => (
              <div key={i} className="mb-3">
                <p className="font-serif italic text-lg text-[#e9f1f8]">&ldquo;{s.text}&rdquo;</p>
                <p className="text-sm text-btf-gold-light font-medium mt-1">{s.ref}</p>
                {s.why && <p className="text-sm text-white/70 font-light mt-0.5">{s.why}</p>}
              </div>
            ))}
          </Block>
        )}

        {insight.roleModels.length > 0 && (
          <Block title="You're in good company">
            {insight.roleModels.map((r, i) => (
              <div key={i} className="mb-3">
                <p className="font-medium text-[#e9f1f8]">{r.name}</p>
                <p className="text-sm text-white/70 font-light">{r.note}</p>
                <p className="text-xs text-[#9fb6c8] mt-0.5">Read: {r.passage}</p>
              </div>
            ))}
          </Block>
        )}

        {insight.promptBack && (
          <Block title="To carry into tomorrow">
            <p className="font-serif italic text-lg text-[#e9f1f8]">{insight.promptBack}</p>
          </Block>
        )}

        <Link
          href="/field-journal"
          className="mt-8 inline-block rounded-full bg-gradient-to-b from-btf-gold-light to-btf-gold text-[#2a2008] px-6 py-3 text-sm font-bold cursor-pointer"
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
    <main className="mx-auto w-full max-w-2xl px-6 py-10 sm:py-14">
      <div className="text-center">
        {streak && (
          <div className="flex justify-center mb-8">
            <StreakChip streak={streak} tone="dark" />
          </div>
        )}

        <p className="text-[11px] tracking-[0.25em] text-btf-gold uppercase font-semibold mb-3">
          Saved
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-white font-light leading-tight mb-3">
          It&rsquo;s down on paper.
        </h1>
        <p className="font-serif italic text-lg text-white/70 font-light leading-relaxed mb-8 max-w-md mx-auto">
          Naming it is the work. It&rsquo;s encrypted and kept — yours to look back on.
        </p>

        <div className="space-y-3 text-left max-w-md mx-auto">
          <Link
            href="/tools/grounding/start"
            className="block rounded-2xl bg-btf-gold/[0.14] border border-btf-gold/50 hover:bg-btf-gold/20 px-5 py-4 transition-all"
          >
            <p className="text-[10px] tracking-[0.25em] uppercase text-btf-gold-light font-semibold mb-1">
              Recommended next
            </p>
            <p className="font-medium text-[#e9f1f8]">5-4-3-2-1 Grounding →</p>
            <p className="text-xs text-white/70 font-light mt-1 leading-relaxed">
              Come back into the room one sense at a time.
            </p>
          </Link>
          <Link
            href="/today/grove"
            className="block rounded-2xl bg-white/[0.055] border border-white/[0.09] hover:border-btf-gold/40 hover:bg-white/[0.08] px-5 py-4 transition-all"
          >
            <p className="font-medium text-[#e9f1f8]">See your grove →</p>
            <p className="text-xs text-white/70 font-light mt-1 leading-relaxed">
              Your journey, your moments, all in one place.
            </p>
          </Link>
          <Link
            href="/field-journal"
            className="block rounded-2xl bg-white/[0.055] border border-white/[0.09] hover:border-btf-gold/40 hover:bg-white/[0.08] px-5 py-4 transition-all"
          >
            <p className="font-medium text-[#e9f1f8]">Back to Field Journal</p>
          </Link>
        </div>
      </div>
    </main>
  );
}
