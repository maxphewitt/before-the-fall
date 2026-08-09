"use client";

import { useState, useTransition } from "react";
import { updateDisplayName } from "../../actions/profile";

/**
 * Inline editor for the chosen display name / nickname on the You page.
 * Optional and freely changeable — not identity. Shows the current name (or
 * a gentle prompt to add one) and an edit affordance; saving calls the
 * updateDisplayName server action.
 */
export default function NameEditor({ initialName }: { initialName: string | null }) {
  const [name, setName] = useState(initialName ?? "");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(initialName ?? "");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function save() {
    const next = draft.trim().slice(0, 40);
    setError(null);
    startTransition(async () => {
      const res = await updateDisplayName(next);
      if (res.success) {
        setName(next);
        setEditing(false);
      } else {
        setError(res.error);
      }
    });
  }

  if (editing) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <input
            autoFocus
            value={draft}
            maxLength={40}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") save();
              if (e.key === "Escape") { setDraft(name); setEditing(false); }
            }}
            placeholder="A name or nickname"
            className="bg-white/[0.06] border border-white/15 rounded-lg px-3 py-1.5 text-[#e9f1f8] placeholder:text-[#9fb6c8] outline-none focus:border-btf-gold/50 w-[190px] font-sans text-base"
          />
          <button
            onClick={save}
            disabled={pending}
            className="rounded-lg bg-gradient-to-b from-btf-gold-light to-btf-gold text-[#2a2008] font-semibold text-sm px-3.5 py-1.5 disabled:opacity-60"
          >
            {pending ? "Saving…" : "Save"}
          </button>
          <button
            onClick={() => { setDraft(name); setEditing(false); setError(null); }}
            className="text-[#9fb6c8] text-sm px-1"
          >
            Cancel
          </button>
        </div>
        {error && <span className="text-[#e8b3b3] text-xs">{error}</span>}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2.5">
      <div className="font-serif text-[26px] font-medium leading-tight">
        {name || "You"}
      </div>
      <button
        onClick={() => { setDraft(name); setEditing(true); }}
        className="text-btf-gold-light/90 hover:text-btf-gold-light"
        aria-label="Edit your name"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
        </svg>
      </button>
    </div>
  );
}
