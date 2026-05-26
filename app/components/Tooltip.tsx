"use client";

import { useState } from "react";

/**
 * Minimal hover/focus/touch tooltip.
 *
 * Wraps any child element. Shows a small dark tooltip above (or below
 * if anchored to the top of the page) on hover, focus, or touch.
 * Auto-dismisses on blur or after 2 seconds on touch.
 *
 * Pattern: <Tooltip text="Copy code">{button}</Tooltip>
 */
export default function Tooltip({
  text,
  children,
  side = "top",
}: {
  text: string;
  children: React.ReactNode;
  side?: "top" | "bottom";
}) {
  const [visible, setVisible] = useState(false);

  function show() {
    setVisible(true);
  }
  function hide() {
    setVisible(false);
  }
  function touchShow() {
    setVisible(true);
    setTimeout(() => setVisible(false), 2000);
  }

  const sidePos =
    side === "top"
      ? "bottom-full mb-2 left-1/2 -translate-x-1/2"
      : "top-full mt-2 left-1/2 -translate-x-1/2";

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      onTouchStart={touchShow}
    >
      {children}
      <span
        role="tooltip"
        aria-hidden={!visible}
        className={
          "pointer-events-none absolute z-30 whitespace-nowrap rounded-md bg-btf-sky-deep px-2 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-white shadow-lg transition-opacity duration-150 " +
          sidePos +
          " " +
          (visible ? "opacity-100" : "opacity-0")
        }
      >
        {text}
      </span>
    </span>
  );
}
