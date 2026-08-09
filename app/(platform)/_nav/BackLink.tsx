"use client";

import { useRouter } from "next/navigation";

/**
 * History-aware back control. Returns the user to wherever they actually came
 * from (e.g. Explore or Home) instead of always jumping to a fixed parent.
 * Falls back to `fallbackHref` when there's no in-app history (deep link, PWA
 * cold start, refresh) so it never dead-ends or exits the app.
 */
export default function BackLink({
  fallbackHref,
  label,
  className,
}: {
  fallbackHref: string;
  label: string;
  className?: string;
}) {
  const router = useRouter();

  function goBack() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  }

  return (
    <button
      type="button"
      onClick={goBack}
      className={
        className ??
        "text-white/70 hover:text-white text-sm inline-flex items-center gap-2 transition-colors"
      }
    >
      <span aria-hidden>&larr;</span> {label}
    </button>
  );
}
