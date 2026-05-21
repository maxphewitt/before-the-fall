/**
 * Logo component — Brand Identity v2 (locked 2026-05-19).
 *
 * Four variants:
 *   - primary    : stacked cross + wordmark (+ optional rule + tagline)
 *   - horizontal : cross + divider + wordmark + "Prevention Platform" sub
 *   - monogram   : B·T·F (Cinzel, with gold dot separators)
 *   - icon-mark  : circle with cross (favicon-style)
 *
 * Three background tones (drives color of cross + wordmark + rule):
 *   - on-light : default. Cross is gold, wordmark sky-deep.
 *   - on-dark  : cross is gold, wordmark white.
 *   - on-blue  : cross is gold, wordmark white, sub-line gold.
 *
 * The cross dimensions follow the brand spec exactly. Other elements
 * are built with Tailwind tokens that resolve to the brand palette.
 */

import { TaglineSize } from "./Logo.types";

type Variant = "primary" | "horizontal" | "monogram" | "icon-mark";
type Tone = "on-light" | "on-dark" | "on-blue";

type CommonProps = {
  tone?: Tone;
  className?: string;
};

type PrimaryProps = CommonProps & {
  variant: "primary";
  showTagline?: boolean;
  showRule?: boolean;
};

type HorizontalProps = CommonProps & {
  variant: "horizontal";
  showSub?: boolean;
};

type MonogramProps = CommonProps & {
  variant: "monogram";
  showSub?: boolean;
};

type IconMarkProps = CommonProps & {
  variant: "icon-mark";
  size?: "sm" | "md" | "lg"; // 32 / 48 / 64
  fill?: "filled-blue" | "filled-gold" | "outline-blue" | "outline-gold" | "outline-white";
};

export type LogoProps =
  | PrimaryProps
  | HorizontalProps
  | MonogramProps
  | IconMarkProps;

export default function Logo(props: LogoProps) {
  if (props.variant === "primary") return <Primary {...props} />;
  if (props.variant === "horizontal") return <Horizontal {...props} />;
  if (props.variant === "monogram") return <Monogram {...props} />;
  return <IconMark {...props} />;
}

// ─── Re-export of supplementary types (for callers that want size hints) ──
export type { TaglineSize };

// ─── Building blocks ──────────────────────────────────────────────────

function crossColor(tone: Tone): string {
  // The cross is always gold per brand spec. Tone affects wordmark/rule, not cross.
  return "bg-btf-gold";
}

function wordmarkColor(tone: Tone): string {
  switch (tone) {
    case "on-dark":
    case "on-blue":
      return "text-white";
    default:
      return "text-btf-sky-deep";
  }
}

function subColor(tone: Tone): string {
  switch (tone) {
    case "on-blue":
      return "text-btf-gold";
    case "on-dark":
      return "text-white/55";
    default:
      return "text-btf-gold";
  }
}

function ruleColor(tone: Tone): string {
  switch (tone) {
    case "on-dark":
    case "on-blue":
      return "bg-white/40";
    default:
      return "bg-btf-gold/60";
  }
}

/**
 * The gold cross, sized per brand spec.
 * lg = 44×52 (primary lockup)
 * md = 28×34 (horizontal lockup)
 */
function Cross({ size, tone }: { size: "lg" | "md"; tone: Tone }) {
  if (size === "lg") {
    return (
      <div className="relative w-11 h-13" style={{ width: "44px", height: "52px" }} aria-hidden>
        <div
          className={`${crossColor(tone)} rounded-sm absolute`}
          style={{ width: "7px", height: "52px", left: "50%", transform: "translateX(-50%)" }}
        />
        <div
          className={`${crossColor(tone)} rounded-sm absolute`}
          style={{ width: "44px", height: "7px", top: "13px", left: 0 }}
        />
      </div>
    );
  }
  return (
    <div className="relative" style={{ width: "28px", height: "34px" }} aria-hidden>
      <div
        className={`${crossColor(tone)} rounded-sm absolute`}
        style={{ width: "5px", height: "34px", left: "50%", transform: "translateX(-50%)" }}
      />
      <div
        className={`${crossColor(tone)} rounded-sm absolute`}
        style={{ width: "28px", height: "5px", top: "8px", left: 0 }}
      />
    </div>
  );
}

// ─── 1. Primary ──────────────────────────────────────────────────────

function Primary({
  tone = "on-light",
  showTagline = false,
  showRule = false,
  className = "",
}: PrimaryProps) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <Cross size="lg" tone={tone} />
      <div
        className={`mt-4 font-serif font-light uppercase ${wordmarkColor(tone)}`}
        style={{ fontSize: "32px", letterSpacing: "0.12em", lineHeight: 1 }}
      >
        Before the Fall
      </div>
      {showRule && (
        <div className={`w-full ${ruleColor(tone)} my-2.5`} style={{ height: "1px" }} aria-hidden />
      )}
      {showTagline && (
        <div
          className={`${subColor(tone)} font-sans font-light uppercase`}
          style={{ fontSize: "8.5px", letterSpacing: "0.22em" }}
        >
          Reaching the lost before they become unreachable
        </div>
      )}
    </div>
  );
}

// ─── 2. Horizontal ───────────────────────────────────────────────────

function Horizontal({
  tone = "on-light",
  showSub = true,
  className = "",
}: HorizontalProps) {
  return (
    <div className={`flex items-center gap-5 ${className}`}>
      <Cross size="md" tone={tone} />
      <div
        className={`${ruleColor(tone)}`}
        style={{ width: "1px", height: "38px" }}
        aria-hidden
      />
      <div className="flex flex-col">
        <div
          className={`font-serif uppercase ${wordmarkColor(tone)}`}
          style={{ fontSize: "24px", fontWeight: 400, letterSpacing: "0.1em", lineHeight: 1 }}
        >
          Before the Fall
        </div>
        {showSub && (
          <div
            className={`${subColor(tone)} font-sans font-light uppercase mt-1`}
            style={{ fontSize: "7.5px", letterSpacing: "0.2em" }}
          >
            Prevention Platform
          </div>
        )}
      </div>
    </div>
  );
}

// ─── 3. Monogram (B·T·F) ─────────────────────────────────────────────

function Monogram({ tone = "on-light", showSub = true, className = "" }: MonogramProps) {
  const lettersColor =
    tone === "on-dark"
      ? "text-white"
      : tone === "on-blue"
        ? "text-btf-gold"
        : "text-btf-sky-deep";

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div
        className={`${lettersColor}`}
        style={{
          fontFamily: "var(--font-cinzel), serif",
          fontSize: "28px",
          fontWeight: 500,
          letterSpacing: "0.25em",
          lineHeight: 1,
        }}
      >
        B<span className="text-btf-gold" style={{ fontSize: "20px", margin: "0 2px" }}>·</span>
        T<span className="text-btf-gold" style={{ fontSize: "20px", margin: "0 2px" }}>·</span>F
      </div>
      <div className={`${ruleColor(tone)}`} style={{ width: "48px", height: "1px" }} aria-hidden />
      {showSub && (
        <div
          className={`${subColor(tone)} font-sans font-light uppercase`}
          style={{ fontSize: "7px", letterSpacing: "0.28em" }}
        >
          Before the Fall
        </div>
      )}
    </div>
  );
}

// ─── 4. Icon Mark (cross in circle) ──────────────────────────────────

function IconMark({
  size = "md",
  fill = "filled-blue",
  className = "",
}: IconMarkProps) {
  const dim = size === "sm" ? 32 : size === "lg" ? 64 : 48;
  const crossW = size === "sm" ? 10 : size === "lg" ? 20 : 15;
  const crossH = Math.round(crossW * 1.2);
  const bar = Math.max(2, Math.round(crossW * 0.18));
  const horizTop = Math.round(crossH * 0.25);

  const bgClass =
    fill === "filled-blue"
      ? "bg-btf-sky-deep"
      : fill === "filled-gold"
        ? "bg-btf-gold"
        : "bg-transparent";

  const borderClass =
    fill === "outline-blue"
      ? "border-2 border-btf-sky-deep"
      : fill === "outline-gold"
        ? "border-2 border-btf-gold"
        : fill === "outline-white"
          ? "border-2 border-white/60"
          : "";

  const crossFill =
    fill === "filled-gold"
      ? "bg-btf-sky-deep"
      : fill === "outline-blue"
        ? "bg-btf-sky-deep"
        : fill === "outline-gold"
          ? "bg-btf-gold"
          : fill === "outline-white"
            ? "bg-white"
            : "bg-btf-gold-light";

  return (
    <div
      className={`${bgClass} ${borderClass} rounded-full flex items-center justify-center ${className}`}
      style={{ width: `${dim}px`, height: `${dim}px` }}
      aria-hidden
    >
      <div className="relative" style={{ width: `${crossW}px`, height: `${crossH}px` }}>
        <div
          className={`${crossFill} rounded-sm absolute`}
          style={{ width: `${bar}px`, height: `${crossH}px`, left: "50%", transform: "translateX(-50%)" }}
        />
        <div
          className={`${crossFill} rounded-sm absolute`}
          style={{ width: `${crossW}px`, height: `${bar}px`, top: `${horizTop}px`, left: 0 }}
        />
      </div>
    </div>
  );
}
