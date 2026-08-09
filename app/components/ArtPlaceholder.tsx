/**
 * ArtPlaceholder — reserved illustration area (2026-07-28, Max's request:
 * Hallow-style artwork slots before real art exists).
 *
 * TO ADD REAL ARTWORK: place the image in public/art/... and drop
 *   <img src="/art/..." alt="" className="absolute inset-0 h-full w-full object-cover" />
 * as the FIRST child of the same relative container, keeping the scrim
 * that follows it — titles stay legible. Then delete this placeholder.
 *
 * Until then: brand gradient + a faint radiant mark so the space feels
 * intentional, not broken.
 */
export default function ArtPlaceholder({ className = "" }: { className?: string }) {
  return (
    <div
      className={
        "relative overflow-hidden bg-[radial-gradient(120%_100%_at_50%_0%,rgba(201,168,76,0.18),transparent_60%),linear-gradient(160deg,rgba(26,111,168,0.5),rgba(10,26,42,0.85))] " +
        className
      }
      aria-hidden
    >
      {/* Faint radiant mark, centered */}
      <svg
        className="absolute inset-0 m-auto opacity-[0.16]"
        width="96"
        height="96"
        viewBox="0 0 96 96"
        fill="none"
        stroke="#e8cc7a"
        strokeWidth={2}
        strokeLinecap="round"
      >
        <circle cx="48" cy="48" r="17" />
        <path d="M48 8v14M48 74v14M8 48h14M74 48h14" />
        <path d="M20 20l10 10M76 20l-10 10M20 76l10-10M76 76l-10-10" opacity={0.7} />
      </svg>
    </div>
  );
}
