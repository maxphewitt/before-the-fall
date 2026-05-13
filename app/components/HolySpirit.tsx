type Props = {
  /** Optional className passed to the wrapper. Use for color (e.g. "text-btf-gold"), spacing, etc. */
  className?: string;
  /** Size in px. The dove is wider than tall but the wrapper is square. Default 72. */
  size?: number;
  /** Set false to hide the soft gold halo behind the dove. Default true. */
  halo?: boolean;
};

/**
 * Holy Spirit — line-art dove with olive branch.
 *
 * Design intent: modern, minimalist, warm. Recognizable Holy-Spirit-with-olive-branch
 * iconography but rendered with thin gold strokes rather than heavy mosaic detail.
 * The platform's audience is allergic to "we are an institution coming for you"
 * imagery, so this mark stays quiet and welcoming.
 *
 * Color is controlled via Tailwind text-* classes (uses currentColor for strokes/fill).
 */
export default function HolySpirit({ className = "", size = 72, halo = true }: Props) {
  return (
    <div
      className={`relative inline-block ${className}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      {halo && (
        <div
          className="absolute inset-0 rounded-full bg-btf-gold/25 blur-2xl scale-150 pointer-events-none"
        />
      )}

      <svg
        viewBox="0 0 100 80"
        className="relative w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Body — horizontal pear, beak on the right */}
          <path d="M 18,42 Q 22,32 38,30 Q 60,28 76,33 L 84,36 L 76,40 Q 60,44 38,42 Q 22,42 18,42 Z" />

          {/* Tail feathers — three strokes fanning back-left */}
          <path d="M 18,42 L 6,36" />
          <path d="M 18,42 L 4,42" />
          <path d="M 18,42 L 6,48" />

          {/* Wing — arcing up from the middle of the back, swooping forward */}
          <path d="M 36,32 Q 36,10 50,8 Q 66,10 70,28" />

          {/* Olive branch — small sprig curving up and forward from the beak */}
          <path d="M 84,36 Q 89,32 95,32" />
          <path d="M 86,32 Q 88,28 90,30" />
          <path d="M 90,30 Q 92,27 94,29" />
          <path d="M 93,32 Q 95,33 97,36" />
        </g>

        {/* Eye — single small dot */}
        <circle cx="76" cy="34" r="0.9" fill="currentColor" />
      </svg>
    </div>
  );
}
