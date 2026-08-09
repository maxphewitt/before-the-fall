/**
 * Olive branch — the secular pathway's mark (vault rule 2026-07-21: the
 * secular hub must not be covered in crosses; olive branches instead).
 * Two exports mirror the GoldCross / GoldCrossIcon APIs so swapping is a
 * one-line conditional wherever faith_role === "secular".
 */

/** className-sized variant (mirrors GoldCross). */
export function OliveBranch({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 22 28" fill="none" aria-hidden>
      <OliveBranchPaths />
    </svg>
  );
}

/** width-sized variant (mirrors GoldCrossIcon). */
export function OliveBranchIcon({
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
      <OliveBranchPaths />
    </svg>
  );
}

function OliveBranchPaths() {
  const gold = "var(--color-btf-gold, #c9a84c)";
  return (
    <>
      {/* Stem */}
      <path
        d="M11 26.5C10.2 20 11.8 9.5 11 1.8"
        stroke={gold}
        strokeWidth={1.7}
        strokeLinecap="round"
      />
      {/* Leaf pairs, alternating up the stem */}
      <path d="M10.7 22.4c-3.9-.4-6-2.8-6.6-5.7 2.9.2 5.5 2.4 6.6 5.7z" fill={gold} />
      <path d="M11.3 17.6c3.9-.4 6-2.8 6.6-5.7-2.9.2-5.5 2.4-6.6 5.7z" fill={gold} />
      <path d="M10.8 12.6C7.3 12.2 5.4 10 4.9 7.4c2.6.2 4.9 2.2 5.9 5.2z" fill={gold} />
      <path d="M11.2 7.8c3.5-.4 5.4-2.6 5.9-5.2-2.6.2-4.9 2.2-5.9 5.2z" fill={gold} />
      {/* Olives at the base */}
      <circle cx="8.3" cy="25" r="1.7" fill={gold} />
      <circle cx="13.7" cy="24.4" r="1.7" fill={gold} />
    </>
  );
}
