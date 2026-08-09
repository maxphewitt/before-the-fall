"use client";

import { useState, useTransition } from "react";
import { postCommunityIntention, prayForIntention, type WallIntention } from "../../../actions/community";

/**
 * The anonymous intentions wall. Post an intention (safety-scanned; flagged
 * posts are kept private, never broadcast) and tap "I'll pray for this" on
 * others'. Communal, never competitive.
 */
export default function IntentionsWall({ initial }: { initial: WallIntention[] }) {
  const [list, setList] = useState<WallIntention[]>(initial);
  const [draft, setDraft] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function post() {
    const body = draft.trim();
    if (!body) return;
    setError(null);
    setNotice(null);
    startTransition(async () => {
      const res = await postCommunityIntention(body);
      if (!res.success) {
        setError(res.error);
        return;
      }
      setDraft("");
      if (res.data.hidden) {
        setNotice(
          "Thank you for sharing. This one is kept private and not posted publicly — if you're carrying something heavy, please reach out to the support resources on this page."
        );
      } else {
        // Optimistic: show it at the top (server has the real row).
        setList((cur) => [
          {
            id: `local-${Date.now()}`,
            body,
            prayerCount: 0,
            prayed: false,
            createdAt: new Date().toISOString(),
          },
          ...cur,
        ]);
        setNotice("Your intention is on the wall. Others can now pray for it.");
      }
    });
  }

  function pray(id: string) {
    setList((cur) =>
      cur.map((i) =>
        i.id === id && !i.prayed
          ? { ...i, prayed: true, prayerCount: i.prayerCount + 1 }
          : i
      )
    );
    startTransition(async () => {
      await prayForIntention(id);
    });
  }

  return (
    <div>
      {/* Post box */}
      <div className="rounded-2xl bg-white/[0.055] border border-white/[0.09] p-4 mb-6">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={2}
          maxLength={280}
          placeholder="Share an intention for others to pray for… (anonymous)"
          className="w-full rounded-xl bg-white/[0.06] border border-white/15 px-3.5 py-2.5 text-[#e9f1f8] placeholder:text-[#9fb6c8] outline-none focus:border-btf-gold/50 resize-none text-sm"
        />
        <div className="flex items-center justify-between mt-2.5">
          <span className="text-[11px] text-[#9fb6c8]">Anonymous. Be kind; keep it prayerful.</span>
          <button
            type="button"
            onClick={post}
            disabled={pending || draft.trim().length === 0}
            className="rounded-full bg-gradient-to-b from-btf-gold-light to-btf-gold text-[#2a2008] font-semibold text-sm px-4 py-2 disabled:opacity-50"
          >
            Share
          </button>
        </div>
        {notice && <p className="text-[12px] text-btf-gold-light mt-2 leading-relaxed">{notice}</p>}
        {error && <p className="text-[12px] text-[#e8b3b3] mt-2">{error}</p>}
      </div>

      {/* Wall */}
      {list.length === 0 ? (
        <p className="text-sm text-white/70 font-light">
          No intentions yet. Be the first to share one, and others will pray for it.
        </p>
      ) : (
        <ul className="space-y-3">
          {list.map((it) => (
            <li key={it.id} className="rounded-2xl bg-white/[0.045] border border-white/[0.08] p-4">
              <p className="text-sm text-white/90 font-light leading-relaxed whitespace-pre-wrap mb-3">
                {it.body}
              </p>
              <button
                type="button"
                onClick={() => pray(it.id)}
                disabled={it.prayed}
                className={
                  "inline-flex items-center gap-1.5 text-[12px] rounded-full px-3 py-1.5 border transition-colors " +
                  (it.prayed
                    ? "bg-btf-gold/15 border-btf-gold/40 text-btf-gold-light"
                    : "bg-white/[0.06] border-white/12 text-[#cfe0ee] hover:border-btf-gold/40")
                }
              >
                <svg width="13" height="16" viewBox="0 0 13 16" fill="none" aria-hidden>
                  <path d="M5.2 1.4h2.6v4.2H12v2.6H7.8V15H5.2V8.2H1V5.6h4.2V1.4z" fill="#e8cc7a" />
                </svg>
                {it.prayed ? "Praying" : "I'll pray for this"}
                {it.prayerCount > 0 && <span className="text-[#9fb6c8]">· {it.prayerCount}</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
