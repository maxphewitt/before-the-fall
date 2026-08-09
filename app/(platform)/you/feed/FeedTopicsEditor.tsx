"use client";

import { useState, useTransition } from "react";
import { updateFeedTopics } from "../../../actions/profile";
import { ALL_THEMES } from "../../../lib/recommend";

const LABELS: Record<string, string> = {
  comfort: "Comfort",
  trust: "Trust",
  hope: "Hope",
  mercy: "Mercy",
  surrender: "Surrender / letting go",
  healing: "Healing",
  conversion: "Change & fresh starts",
  discernment: "Discernment",
  suffering: "Suffering",
  thanksgiving: "Gratitude",
};

/**
 * Lets the user pick extra themes their daily Scripture/prayer feed should
 * draw from, on top of the defaults inferred from their onboarding. Chips
 * toggle; Save persists via updateFeedTopics.
 */
export default function FeedTopicsEditor({ initial }: { initial: string[] }) {
  const [selected, setSelected] = useState<string[]>(initial);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function toggle(t: string) {
    setSaved(false);
    setSelected((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));
  }

  function save() {
    setError(null);
    startTransition(async () => {
      const res = await updateFeedTopics(selected);
      if (res.success) setSaved(true);
      else setError(res.error);
    });
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2.5">
        {ALL_THEMES.map((t) => {
          const on = selected.includes(t);
          return (
            <button
              key={t}
              type="button"
              onClick={() => toggle(t)}
              aria-pressed={on}
              className={
                "text-sm px-4 py-2 rounded-full border transition-colors " +
                (on
                  ? "bg-btf-gold/15 border-btf-gold/50 text-btf-gold-light"
                  : "bg-white/[0.06] border-white/12 text-[#cfe0ee] hover:border-btf-gold/40")
              }
            >
              {LABELS[t] ?? t}
            </button>
          );
        })}
      </div>

      {error && <p className="text-[#e8b3b3] text-xs mt-4">{error}</p>}

      <div className="flex items-center gap-3 mt-6">
        <button
          type="button"
          onClick={save}
          disabled={pending}
          className="rounded-full bg-gradient-to-b from-btf-gold-light to-btf-gold text-[#2a2008] font-semibold text-sm px-5 py-2.5 disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save"}
        </button>
        {saved && !pending && (
          <span className="text-[13px] text-btf-gold-light inline-flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e8cc7a" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
            Saved
          </span>
        )}
      </div>
    </div>
  );
}
