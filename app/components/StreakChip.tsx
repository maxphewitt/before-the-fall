import Link from "next/link";
import type { DisplayStreak } from "../lib/streakTypes";

/**
 * The single surfaced streak/momentum chip, with the gold cross above it.
 * Tapping it opens the grove (the full progress page). Tone adapts to the
 * surface: "dark" on the tool-flow completion screens, "light" on the
 * grove. No streak is ever framed as a breakable chain.
 *
 * Plain (server-safe) component so it can render in both server pages and
 * client tool flows.
 */
export default function StreakChip({
  streak,
  href = "/today/grove",
  tone = "dark",
}: {
  streak: DisplayStreak;
  /** Pass null to render a non-interactive banner (e.g. on the grove itself). */
  href?: string | null;
  tone?: "light" | "dark";
}) {
  const isDark = tone === "dark";
  const labelColor = isDark ? "text-white" : "text-btf-sky-deep";
  const subColor = isDark ? "text-white/60" : "text-btf-text-mid";
  const base =
    "flex flex-col items-center gap-2 rounded-3xl border px-7 py-5 transition-all ";
  const ring = isDark
    ? "bg-white/5 border-white/15"
    : "bg-white border-btf-sky-deep/10 shadow-sm";
  const hover =
    href !== null
      ? isDark
        ? " hover:bg-white/10 hover:border-white/30"
        : " hover:border-btf-gold/50"
      : "";

  const inner = (
    <>
      <GoldCross />
      <span className={"font-serif text-2xl font-light leading-none " + labelColor}>
        {streak.label}
      </span>
      <span className={"text-xs font-light " + subColor}>{streak.sublabel}</span>
    </>
  );

  if (href === null) {
    return <div className={base + ring}>{inner}</div>;
  }

  return (
    <Link
      href={href}
      aria-label={`${streak.label}. ${streak.sublabel}. View your grove.`}
      className={base + ring + hover}
    >
      {inner}
    </Link>
  );
}

function GoldCross() {
  return <GoldCrossIcon width={22} />;
}

/**
 * Brand cross, gold, inline SVG (no emoji/dingbats). Shared placeholder
 * marker for every milestone we track — the advertising team will swap in
 * bespoke per-milestone icons later, so for now they're all this cross.
 * `width` drives the size; height keeps the cross proportions.
 */
export function GoldCrossIcon({
  width = 22,
  glow = true,
}: {
  width?: number;
  glow?: boolean;
}) {
  const height = Math.round((width * 28) / 22);
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 22 28"
      fill="none"
      aria-hidden
      className={glow ? "drop-shadow-[0_0_10px_rgba(201,168,76,0.55)]" : ""}
    >
      <rect x="9" y="0" width="4" height="28" rx="1.5" fill="var(--color-btf-gold, #c9a84c)" />
      <rect x="0" y="7" width="22" height="4" rx="1.5" fill="var(--color-btf-gold, #c9a84c)" />
    </svg>
  );
}
