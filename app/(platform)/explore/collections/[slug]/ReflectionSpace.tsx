"use client";

import { useState, useTransition } from "react";
import {
  heartReflection,
  postCollectionReflection,
  type CollectionReflection,
} from "../../../../actions/collectionReflections";

/**
 * Shared reflection space at the bottom of a collection page. Write what
 * the collection stirred, then either share it anonymously (fades after
 * 7 days) or keep it private (saved to the encrypted journal). Others can
 * tap a small heart — "With you" — on shared reflections. No names,
 * anywhere: attribution is always "Someone walking this too".
 */

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(ms / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="13" height="12" viewBox="0 0 24 22" aria-hidden>
      <path
        d="M12 20.5S2.2 14 2.2 7.8C2.2 4.3 4.8 1.8 7.9 1.8c1.7 0 3.3.8 4.1 2.2.8-1.4 2.4-2.2 4.1-2.2 3.1 0 5.7 2.5 5.7 6C21.8 14 12 20.5 12 20.5z"
        fill={filled ? "#e8cc7a" : "none"}
        stroke="#e8cc7a"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export default function ReflectionSpace({
  slug,
  initial,
}: {
  slug: string;
  initial: CollectionReflection[];
}) {
  const [list, setList] = useState<CollectionReflection[]>(initial);
  const [draft, setDraft] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function post(isPublic: boolean) {
    const body = draft.trim();
    if (!body) return;
    setError(null);
    setNotice(null);
    startTransition(async () => {
      const res = await postCollectionReflection(slug, body, isPublic);
      if (!res.success) {
        setError(res.error);
        return;
      }
      setDraft("");
      if (!isPublic) {
        setNotice("Saved to your journal, just for you.");
      } else if (res.data.savedTo === "journal") {
        // Safety scan hit: never broadcast; kept in the private journal.
        setNotice(
          "Thank you for writing this. It's been kept in your private journal rather than shared — if you're carrying something heavy, please reach out to someone you trust."
        );
      } else {
        // Optimistic: show it at the top (server has the real row).
        setList((cur) => [
          {
            id: `local-${Date.now()}`,
            body,
            createdAt: new Date().toISOString(),
            hearts: 0,
            hearted: false,
            mine: true,
          },
          ...cur,
        ]);
        setNotice("Shared anonymously. It will fade after 7 days.");
      }
    });
  }

  function heart(id: string) {
    setList((cur) =>
      cur.map((r) =>
        r.id === id && !r.hearted && !r.mine
          ? { ...r, hearted: true, hearts: r.hearts + 1 }
          : r
      )
    );
    startTransition(async () => {
      await heartReflection(id);
    });
  }

  return (
    <div>
      <h2 className="text-[11px] tracking-[0.2em] uppercase text-btf-gold font-semibold mb-2">
        Reflections
      </h2>
      <p className="text-[12px] text-[#9fb6c8] font-light leading-snug mb-3">
        Write what this stirred. Share it anonymously so someone else knows
        they&apos;re not alone, or keep it just for you. Shared reflections
        fade after 7 days.
      </p>

      {/* Write box */}
      <div className="rounded-2xl bg-white/[0.055] border border-white/[0.09] p-4 mb-5">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={3}
          maxLength={500}
          placeholder="What did this stir in you?"
          className="w-full rounded-xl bg-white/[0.06] border border-white/15 px-3.5 py-2.5 text-[#e9f1f8] placeholder:text-[#9fb6c8] outline-none focus:border-btf-gold/50 resize-none text-sm"
        />
        <div className="flex gap-2 mt-2.5">
          <button
            type="button"
            onClick={() => post(true)}
            disabled={pending || draft.trim().length === 0}
            className="flex-1 rounded-full bg-gradient-to-b from-btf-gold-light to-btf-gold text-[#2a2008] font-semibold text-[13px] px-4 py-2 disabled:opacity-50"
          >
            Share anonymously
          </button>
          <button
            type="button"
            onClick={() => post(false)}
            disabled={pending || draft.trim().length === 0}
            className="flex-1 rounded-full bg-white/[0.06] border border-white/15 text-[#cfe0ee] text-[13px] px-4 py-2 disabled:opacity-50 hover:border-btf-gold/40 transition-colors"
          >
            Keep private
          </button>
        </div>
        {notice && (
          <p className="text-[12px] text-btf-gold-light mt-2 leading-relaxed">{notice}</p>
        )}
        {error && <p className="text-[12px] text-[#e8b3b3] mt-2">{error}</p>}
      </div>

      {/* Shared reflections */}
      {list.length === 0 ? (
        <p className="text-sm text-white/70 font-light">
          Nothing shared here yet. Whatever you write first might be exactly
          what the next person needed to read.
        </p>
      ) : (
        <ul className="space-y-3">
          {list.map((r) => (
            <li
              key={r.id}
              className="rounded-2xl bg-white/[0.045] border border-white/[0.08] p-4"
            >
              <p className="text-sm text-white/90 font-light leading-relaxed whitespace-pre-wrap mb-2.5">
                {r.body}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#8aa0b0] font-light">
                  {r.mine ? "You" : "Someone walking this too"} · {timeAgo(r.createdAt)}
                </span>
                <button
                  type="button"
                  onClick={() => heart(r.id)}
                  disabled={r.hearted || r.mine}
                  className={
                    "inline-flex items-center gap-1.5 text-[12px] rounded-full px-3 py-1.5 border transition-colors " +
                    (r.hearted || r.mine
                      ? "bg-btf-gold/15 border-btf-gold/40 text-btf-gold-light"
                      : "bg-white/[0.06] border-white/12 text-[#cfe0ee] hover:border-btf-gold/40")
                  }
                >
                  <HeartIcon filled={r.hearted} />
                  With you
                  {r.hearts > 0 && <span className="text-[#9fb6c8]">· {r.hearts}</span>}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
