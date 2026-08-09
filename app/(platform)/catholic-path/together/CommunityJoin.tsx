"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { joinCommunity } from "../../../actions/community";

/**
 * Join-and-begin button for a community novena or seasonal challenge.
 * Enrolls the user (for the communal count) then opens the prayer.
 */
export default function CommunityJoin({
  itemId,
  href,
  joined,
  label,
  disabled,
}: {
  itemId: string;
  href: string;
  joined: boolean;
  label?: string;
  disabled?: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function go() {
    startTransition(async () => {
      if (!joined) await joinCommunity(itemId);
      router.push(href);
    });
  }

  if (disabled) {
    return (
      <span className="inline-flex items-center justify-center rounded-full py-2.5 px-5 text-sm font-medium text-[#9fb6c8] bg-white/[0.06] border border-white/12">
        Opens in season
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={go}
      disabled={pending}
      className="inline-flex items-center justify-center rounded-full py-2.5 px-5 text-sm font-semibold text-[#2a2008] bg-gradient-to-b from-btf-gold-light to-btf-gold disabled:opacity-60 transition-transform hover:-translate-y-0.5"
    >
      {pending ? "Joining…" : label ?? (joined ? "Continue" : "Join & begin")}
    </button>
  );
}
