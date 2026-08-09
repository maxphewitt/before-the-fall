"use client";

import { useState, useTransition } from "react";
import { createEntry } from "../../../actions/journal";

type Intention = { id: string; text: string; createdAt: string };

/**
 * Prayer Intentions manager — log a new intention and view past ones, in a
 * space of their own (separate from the general Journal). New intentions are
 * saved as encrypted journal entries of type "intention" so they also appear
 * in the pre-prayer intention picker.
 */
export default function IntentionsManager({ initial }: { initial: Intention[] }) {
  const [list, setList] = useState<Intention[]>(initial);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function add() {
    const text = draft.trim();
    if (!text) return;
    setError(null);
    startTransition(async () => {
      const res = await createEntry(text, "intention");
      if (res.success) {
        setList((cur) => [
          { id: res.data.id, text, createdAt: new Date().toISOString() },
          ...cur,
        ]);
        setDraft("");
      } else {
        setError(res.error);
      }
    });
  }

  return (
    <div>
      {/* Add a new intention */}
      <section className="rounded-2xl bg-white/[0.055] border border-white/[0.09] p-5 mb-8">
        <p className="text-[10px] tracking-[0.2em] uppercase text-btf-gold font-semibold mb-3">
          Add an intention
        </p>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={3}
          placeholder="e.g. For my mother's health, for patience this week…"
          className="w-full rounded-2xl bg-white/[0.06] border border-white/15 px-4 py-3 text-[#e9f1f8] placeholder:text-[#9fb6c8] outline-none focus:border-btf-gold/50 resize-none"
        />
        {error && <p className="text-[#e8b3b3] text-xs mt-2">{error}</p>}
        <div className="flex items-center justify-between mt-3">
          <p className="text-[11px] text-[#9fb6c8] font-light">Encrypted, and just for you.</p>
          <button
            type="button"
            onClick={add}
            disabled={pending || draft.trim().length === 0}
            className="rounded-full bg-gradient-to-b from-btf-gold-light to-btf-gold text-[#2a2008] font-semibold text-sm px-5 py-2.5 disabled:opacity-50"
          >
            {pending ? "Saving…" : "Save intention"}
          </button>
        </div>
      </section>

      {/* Past intentions */}
      <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold font-semibold mb-4">
        {list.length > 0 ? `${list.length} intention${list.length === 1 ? "" : "s"}` : "Your intentions"}
      </p>
      {list.length === 0 ? (
        <p className="text-sm text-white/70 font-light leading-relaxed">
          Nothing here yet. What you write above stays here, and you can carry any
          of these into the Rosary or a guided prayer.
        </p>
      ) : (
        <ul className="space-y-3">
          {list.map((it) => (
            <li
              key={it.id}
              className="rounded-2xl bg-white/[0.045] border border-white/[0.08] p-4"
            >
              <p className="text-sm text-white/90 font-light leading-relaxed whitespace-pre-wrap">
                {it.text}
              </p>
              <p className="text-[11px] text-[#8aa0b0] mt-2">{formatDate(it.createdAt)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
