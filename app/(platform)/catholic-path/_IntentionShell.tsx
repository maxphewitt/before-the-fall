"use client";

import { useEffect, useState, useTransition } from "react";
import { listIntentions, createEntry } from "../../actions/journal";

/**
 * Wraps a prayer walker (Rosary or guided prayer) with an intention step.
 *
 * Before the prayer begins, the user can:
 *   - search + pick an intention they've already logged (their Prayer
 *     Intentions), or
 *   - write a new one, which is used for this prayer AND saved to their
 *     Prayer Intentions (encrypted journal), or
 *   - skip (just press Begin with nothing chosen).
 *
 * The chosen intention then rides along in a small bubble on screen while
 * they pray. Non-destructive: the walker itself is passed as children and
 * left untouched.
 *
 * `beginLabel` is the exact text of the gold Begin button (e.g. "Begin
 * Prayer" for guided prayers, "Begin the Rosary" for the Rosary).
 */
export default function IntentionShell({
  beginLabel,
  children,
}: {
  beginLabel: string;
  children: React.ReactNode;
}) {
  const [phase, setPhase] = useState<"gate" | "praying">("gate");
  const [intention, setIntention] = useState("");
  const [existing, setExisting] = useState<{ id: string; text: string }[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    let active = true;
    listIntentions().then((res) => {
      if (!active) return;
      if (res.success) setExisting(res.data.map((i) => ({ id: i.id, text: i.text })));
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const q = query.trim().toLowerCase();
  const filtered = q
    ? existing.filter((e) => e.text.toLowerCase().includes(q))
    : existing;

  const chosenText = selectedId
    ? existing.find((e) => e.id === selectedId)?.text ?? ""
    : draft.trim();

  function begin() {
    const text = chosenText;
    startTransition(async () => {
      // A newly-written intention is saved to their Prayer Intentions so it's
      // reusable next time. Best-effort — never blocks praying.
      if (!selectedId && text.length > 0) {
        try {
          await createEntry(text, "intention");
        } catch {
          /* ignore */
        }
      }
      setIntention(text);
      setPhase("praying");
    });
  }

  if (phase === "praying") {
    return (
      <>
        {children}
        {intention && <IntentionBubble text={intention} />}
      </>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-btf-deep-night via-btf-sky-deep to-btf-sky text-white">
      <div className="max-w-xl mx-auto px-6 py-10 sm:py-14 min-h-screen flex flex-col">
        <div className="relative w-10 h-10 mb-7" aria-hidden>
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-1.5 h-10 bg-btf-gold rounded-sm" />
          <div className="absolute left-1/2 top-2.5 -translate-x-1/2 w-7 h-1.5 bg-btf-gold rounded-sm" />
        </div>

        <p className="text-[11px] tracking-[0.25em] text-btf-gold-light uppercase font-semibold mb-3">
          Before you begin
        </p>
        <h1 className="font-serif text-3xl md:text-4xl font-light leading-tight mb-3">
          Set an intention
        </h1>
        <p className="text-white/75 font-light leading-relaxed mb-7">
          Bring someone or something to this prayer — a person, a fear, a hope.
          It stays with you while you pray. This is optional.
        </p>

        {/* Search + pick an existing intention */}
        {existing.length > 0 && (
          <div className="mb-6">
            <p className="text-[11px] tracking-[0.2em] uppercase text-white/60 font-semibold mb-3">
              Pray for one you&rsquo;ve logged
            </p>
            <div className="flex items-center gap-2.5 rounded-2xl bg-white/[0.06] border border-white/15 px-3.5 py-2.5 mb-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9fb6c8" strokeWidth={1.8} strokeLinecap="round">
                <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
              </svg>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search your intentions…"
                className="flex-1 bg-transparent outline-none text-[#e9f1f8] placeholder:text-[#9fb6c8] text-sm"
              />
            </div>

            <div className="space-y-2.5 max-h-[40vh] overflow-y-auto">
              {filtered.map((e) => {
                const active = selectedId === e.id;
                return (
                  <button
                    key={e.id}
                    type="button"
                    onClick={() => {
                      setSelectedId(active ? null : e.id);
                      setDraft("");
                    }}
                    className={
                      "w-full text-left rounded-2xl px-4 py-3 border transition-colors " +
                      (active
                        ? "bg-btf-gold/15 border-btf-gold/50"
                        : "bg-white/[0.055] border-white/[0.09] hover:border-btf-gold/40")
                    }
                  >
                    <span className="text-sm text-white/90 line-clamp-2">{e.text}</span>
                  </button>
                );
              })}
              {filtered.length === 0 && (
                <p className="text-[13px] text-[#9fb6c8] px-1 py-2">
                  No match — add it as a new intention below.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Add a new one (used now + saved to Prayer Intentions) */}
        <p className="text-[11px] tracking-[0.2em] uppercase text-white/60 font-semibold mb-3">
          {existing.length > 0 ? "Or add a new intention" : "Add an intention"}
        </p>
        <textarea
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            if (e.target.value) setSelectedId(null);
          }}
          rows={3}
          placeholder="e.g. For my mother's health…"
          className="w-full rounded-2xl bg-white/[0.06] border border-white/15 px-4 py-3 text-[#e9f1f8] placeholder:text-[#9fb6c8] outline-none focus:border-btf-gold/50 resize-none"
        />
        {draft.trim().length > 0 && (
          <p className="text-[12px] text-white/60 mt-2 flex items-center gap-1.5">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#e8cc7a" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
            Used now and saved to your Prayer Intentions (encrypted).
          </p>
        )}

        <div className="mt-auto pt-8">
          <button
            type="button"
            onClick={begin}
            disabled={pending || loading}
            className="w-full inline-flex items-center justify-center rounded-full py-3.5 px-6 font-semibold text-[#2a2008] bg-gradient-to-b from-btf-gold-light to-btf-gold disabled:opacity-60 transition-transform hover:-translate-y-0.5"
          >
            {pending ? "Beginning…" : beginLabel}
          </button>
        </div>
      </div>
    </main>
  );
}

function IntentionBubble({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setOpen((o) => !o)}
      aria-label="Your prayer intention"
      className="fixed top-[68px] left-1/2 -translate-x-1/2 z-40 max-w-[calc(100%-2.5rem)] sm:max-w-md rounded-2xl bg-[rgba(8,20,34,0.82)] backdrop-blur-md border border-btf-gold/30 px-4 py-2.5 shadow-[0_10px_28px_-12px_rgba(0,0,0,0.8)] text-left"
    >
      <span className="flex items-center gap-2">
        <svg width="13" height="16" viewBox="0 0 13 16" fill="none" className="flex-none" aria-hidden>
          <path d="M5.2 1.4h2.6v4.2H12v2.6H7.8V15H5.2V8.2H1V5.6h4.2V1.4z" fill="#e8cc7a" />
        </svg>
        <span className="min-w-0">
          <span className="block text-[9px] tracking-[0.18em] uppercase text-btf-gold-light/90 font-semibold leading-none mb-0.5">
            Praying for
          </span>
          <span className={"block text-[13px] text-white/90 " + (open ? "" : "truncate")}>
            {text}
          </span>
        </span>
      </span>
    </button>
  );
}
