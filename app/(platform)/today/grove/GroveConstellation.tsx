"use client";

import { useState } from "react";
import type { ToolMoment } from "../../../lib/journalTypes";

/**
 * The grove's night-sky panel: one light per grounding moment, newest
 * highlighted. Tapping a light opens that moment's own words + its
 * optional before/after note. Positions are derived deterministically
 * from the moment id so the constellation is stable across renders.
 *
 * This is the META layer — it never appears during the acute drill. No
 * streaks, no scores; just a browsable archive of times the person came
 * back to the present.
 */

function hashToUnit(seed: string, salt: number): number {
  let h = 2166136261 ^ salt;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  // Map to 0..1
  return ((h >>> 0) % 1000) / 1000;
}

function formatWhen(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function GroveConstellation({
  moments,
}: {
  moments: ToolMoment[];
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const open = moments.find((m) => m.id === openId) ?? null;

  return (
    <div>
      <div
        className="relative w-full rounded-3xl overflow-hidden border border-btf-sky-deep/15 shadow-inner"
        style={{
          height: "20rem",
          background:
            "radial-gradient(120% 90% at 50% 120%, #15324a 0%, #0a1a2a 60%)",
        }}
      >
        {moments.map((m, i) => {
          // Keep lights off the very edges (8%..92%).
          const x = 8 + hashToUnit(m.id, 1) * 84;
          const y = 10 + hashToUnit(m.id, 2) * 76;
          const isNewest = i === 0;
          const eased =
            m.before !== undefined &&
            m.after !== undefined &&
            m.after < m.before;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setOpenId(m.id)}
              aria-label={`Moment from ${formatWhen(m.completedAt)}`}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform hover:scale-125 focus-visible:scale-125"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <span
                className="block rounded-full"
                style={{
                  width: isNewest ? 16 : 12,
                  height: isNewest ? 16 : 12,
                  background: isNewest
                    ? "radial-gradient(circle, #e8cc7a, #c9a84c 70%)"
                    : eased
                      ? "radial-gradient(circle, #a4cfc2, #7cbaa8 70%)"
                      : "radial-gradient(circle, #cfe0ef, #8aa0b0 70%)",
                  boxShadow: isNewest
                    ? "0 0 16px rgba(232,204,122,0.7)"
                    : "0 0 12px rgba(124,186,168,0.5)",
                }}
              />
            </button>
          );
        })}

        {open && (
          <div className="absolute left-3 right-3 bottom-3 rounded-2xl bg-white/95 backdrop-blur border border-btf-sky-deep/10 p-4 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <p className="text-[11px] tracking-[0.2em] uppercase text-btf-text-light font-semibold">
                {formatWhen(open.completedAt)}
              </p>
              <button
                type="button"
                onClick={() => setOpenId(null)}
                aria-label="Close"
                className="text-btf-text-light hover:text-btf-sky-deep text-sm leading-none"
              >
                Close
              </button>
            </div>
            {open.words.length > 0 ? (
              <p className="text-btf-text-dark font-light leading-relaxed mt-2">
                {open.words.join(" · ")}
              </p>
            ) : (
              <p className="text-btf-text-light font-light italic mt-2">
                A quiet moment — you came back without needing words.
              </p>
            )}
            {open.before !== undefined && open.after !== undefined && (
              <p className="text-sm text-btf-sky-deep font-light mt-2">
                You noted {open.before} → {open.after}
                {open.after < open.before ? " — it eased" : ""}.
              </p>
            )}
          </div>
        )}
      </div>

      <p className="text-xs text-btf-text-light font-light text-center mt-4">
        Tap any light to revisit that moment. No streaks. No scores. Just proof,
        in your own words.
      </p>
    </div>
  );
}
