import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUserId } from "../../lib/session";
import { listUserHabits } from "../../actions/habits";
import { HABITS, HABIT_SLUGS, type HabitSlug } from "../../lib/habits";
import HabitEditClient from "./HabitEditClient";

/**
 * /today/edit — manage habits.
 *
 * Server component fetches current list + the catalog. The actual
 * add/remove buttons live in the client subcomponent.
 */
export const dynamic = "force-dynamic";

export default async function EditHabitsPage() {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/return");

  const result = await listUserHabits();
  const activeSlugs = new Set(
    result.success ? result.data.map((h) => h.habitSlug) : []
  );

  // Group the catalog by category for display.
  const groups: { category: string; slugs: HabitSlug[] }[] = [
    {
      category: "Tier 1 self-help tools",
      slugs: HABIT_SLUGS.filter((s) => HABITS[s].category === "tier-1"),
    },
    {
      category: "Journal",
      slugs: HABIT_SLUGS.filter((s) => HABITS[s].category === "journal"),
    },
    {
      category: "Catholic Path",
      slugs: HABIT_SLUGS.filter((s) => HABITS[s].category === "catholic-path"),
    },
  ];

  return (
    <main className="min-h-screen bg-btf-off-white px-6 py-10 sm:py-14">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/today"
          className="text-btf-text-light hover:text-btf-sky-deep text-sm mb-6 inline-flex items-center gap-2 transition-colors"
        >
          <span aria-hidden>&larr;</span> Today
        </Link>

        <p className="text-[11px] tracking-[0.25em] text-btf-gold uppercase font-semibold mb-3">
          Edit habits
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-btf-sky-deep font-light leading-tight mb-3">
          What are you tracking?
        </h1>
        <p className="text-btf-text-mid font-light leading-relaxed mb-8">
          Toggle habits on or off. Each has a short explanation of why it&rsquo;s recommended &mdash; click to expand.
        </p>

        {!result.success && (
          <div
            role="alert"
            className="rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm p-4 mb-8"
          >
            {result.error}
          </div>
        )}

        {result.success && (
          <HabitEditClient
            initialActiveSlugs={Array.from(activeSlugs)}
            groups={groups}
          />
        )}
      </div>
    </main>
  );
}
