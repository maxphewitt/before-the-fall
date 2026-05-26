"use client";

import { useState } from "react";
import Link from "next/link";

/**
 * Home-page affordance for returning CSOs.
 *
 * Renders nothing unless the visitor has a stored loved-one code in
 * localStorage. If they do, shows a small "Looking for your referral
 * code?" link that takes them back to /loved-one/result where their
 * code + resources live. Only the CSO who completed the quiz on this
 * device sees this — anyone else gets nothing.
 *
 * Lazy state initializer so SSR returns null and the client renders
 * the link on hydrate if applicable. Avoids the React 19
 * set-state-in-effect rule.
 */

const STORAGE_KEY = "btf:lovedOneCode";

function readStoredCode(): string {
  if (typeof window === "undefined") return "";
  try {
    return localStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

export default function LovedOneCodeAffordance() {
  const [hasCode] = useState<boolean>(() => readStoredCode().length > 0);

  if (!hasCode) return null;

  return (
    <div className="text-center mt-6">
      <Link
        href="/loved-one/result"
        className="inline-flex items-center gap-2 text-xs text-white/70 hover:text-white underline underline-offset-4"
      >
        Looking for your referral code? &rarr;
      </Link>
    </div>
  );
}
