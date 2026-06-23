"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { HABITS, type HabitSlug } from "../../../lib/habits";
import { addUserHabit, removeUserHabit } from "../../../actions/habits";

/**
 * Client subcomponent for /today/edit.
 *
 * Renders the grouped habit catalog with a toggle per habit. Each row
 * expands to show the "why this is recommended" copy. Toggle calls a
 * server action and optimistically updates UI state.
 */
export default function HabitEditClient({
  initialActiveSlugs,
  groups,
}: {
  initialActiveSlugs: HabitSlug[];
  groups: { category: string; slugs: HabitSlug[] }[];
}) {
  const router = useRouter();
  const [active, setActive] = useState<Set<HabitSlug>>(
    new Set(initialActiveSlugs)
  );
  const [expanded, setExpanded] = useState<HabitSlug | null>(null);
  const [pending, setPending] = useState<HabitSlug | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  async function toggle(slug: HabitSlug) {
    if (pending) return;
    setError(null);
    setPending(slug);

    const wasActive = active.has(slug);
    // Optimistic update
    setActive((prev) => {
      const next = new Set(prev);
      if (wasActive) next.delete(slug);
      else next.add(slug);
      return next;
    });

    try {
      const res = wasActive
        ? await removeUserHabit(slug)
        : await addUserHabit(slug);
      if (!res.success) {
        // Revert
        setActive((prev) => {
          const next = new Set(prev);
          if (wasActive) next.add(slug);
          else next.delete(slug);
          return next;
        });
        setError(res.error);
      } else {
        startTransition(() => {
          router.refresh();
        });
      }
    } catch (err) {
      console.error(err);
      setError("Unexpected error. Please try again.");
      setActive((prev) => {
        const next = new Set(prev);
        if (wasActive) next.add(slug);
        else next.delete(slug);
        return next;
      });
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="space-y-8">
      {error && (
        <div
          role="alert"
          className="rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm p-4"
        >
          {error}
        </div>
      )}

      {groups.map((group) => (
        <section key={group.category}>
          <p className="text-[10px] tracking-[0.25em] uppercase text-btf-text-light font-semibold mb-3">
            {group.category}
          </p>
          <ul className="space-y-2">
            {group.slugs.map((slug) => {
              const def = HABITS[slug];
              const isActive = active.has(slug);
              const isExpanded = expanded === slug;
              const isPending = pending === slug;
              return (
                <li
                  key={slug}
                  className={
                    "rounded-2xl border-2 transition-all " +
                    (isActive
                      ? "bg-btf-sky-pale/40 border-btf-sky-light"
                      : "bg-white border-btf-sky-pale/60")
                  }
                >
                  <div className="flex items-start gap-3 p-4">
                    <button
                      type="button"
                      onClick={() => toggle(slug)}
                      disabled={isPending}
                      aria-pressed={isActive}
                      aria-label={`${isActive ? "Remove" : "Add"} ${def.label} habit`}
                      className={
                        "flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all disabled:opacity-50 " +
                        (isActive
                          ? "bg-btf-sky-deep border-btf-sky-deep text-white"
                          : "bg-white border-btf-text-light/40 hover:border-btf-sky-light")
                      }
                    >
                      {isActive && (
                        <svg
                          aria-hidden
                          width={16}
                          height={16}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={3}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-btf-sky-deep">
                        {def.label}
                      </p>
                      <p className="text-xs text-btf-text-mid font-light leading-relaxed mt-0.5">
                        {def.description}
                      </p>
                      <button
                        type="button"
                        onClick={() => setExpanded(isExpanded ? null : slug)}
                        className="text-[11px] text-btf-sky-deep underline underline-offset-4 mt-2 hover:text-btf-sky"
                      >
                        {isExpanded ? "Hide why" : "Why this is recommended"}
                      </button>
                      {isExpanded && (
                        <p className="text-xs text-btf-text-mid font-light leading-relaxed mt-3 pt-3 border-t border-btf-sky-pale/60 italic">
                          {def.why}
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
