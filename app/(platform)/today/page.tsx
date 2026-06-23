import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUserId } from "../../lib/session";
import { getTodaySummary } from "../../actions/habits";
import { HABITS, type HabitSlug } from "../../lib/habits";

/**
 * /today — the habit tracker home.
 *
 * Server component. Reads getTodaySummary() which returns:
 *   - the user's active habits with today's completion state
 *   - currentStreak / longestStreak / timesCameBack metrics
 *   - the 7-day week strip
 *
 * Headline metric is "Times you came back" — the retention-oriented
 * counter that rewards return after a missed day. Streak counts are
 * displayed but secondary.
 *
 * No client subcomponent for the main page — completion state is
 * derived from the database at request time. Force-dynamic so the
 * "today" framing always reflects the actual request date.
 */
export const dynamic = "force-dynamic";

export default async function TodayPage() {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/return");

  const result = await getTodaySummary();

  return (
    <main className="min-h-screen bg-btf-off-white px-6 py-10 sm:py-14">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="text-btf-text-light hover:text-btf-sky-deep text-sm inline-flex items-center gap-2 transition-colors"
          >
            <span aria-hidden>&larr;</span> Home
          </Link>
          <div className="flex items-center flex-wrap justify-end gap-x-4 gap-y-1">
            <Link
              href="/today/grove"
              className="text-xs text-btf-sky-deep underline underline-offset-4 hover:text-btf-sky"
            >
              Your grove
            </Link>
            <Link
              href="/today/waves"
              className="text-xs text-btf-sky-deep underline underline-offset-4 hover:text-btf-sky"
            >
              Waves you rode
            </Link>
            <Link
              href="/today/edit"
              className="text-xs text-btf-sky-deep underline underline-offset-4 hover:text-btf-sky"
            >
              Manage habits
            </Link>
          </div>
        </div>

        <p className="text-[11px] tracking-[0.25em] text-btf-gold uppercase font-semibold mb-3">
          Today
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-btf-sky-deep font-light leading-tight mb-3">
          {greeting()}
        </h1>
        <p className="text-btf-text-mid font-light leading-relaxed mb-8">
          One row per habit. Tap Begin and the platform will guide you. Nothing here judges a missed day — coming back is the work.
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
          <>
            {/* Headline metric — TIMES YOU CAME BACK */}
            <section
              aria-labelledby="metrics-heading"
              className="rounded-2xl bg-gradient-to-br from-btf-sky-deep to-btf-sky text-white p-6 sm:p-7 mb-8"
            >
              <p
                id="metrics-heading"
                className="text-[10px] tracking-[0.25em] uppercase text-btf-gold-light/80 font-semibold mb-2"
              >
                Times you came back
              </p>
              <p className="font-serif text-5xl sm:text-6xl text-white font-light leading-none mb-2">
                {result.data.timesCameBack}
              </p>
              <p className="text-sm text-white/75 font-light leading-relaxed mt-4 max-w-md">
                Every return after a missed day. This is the number that matters. Streaks come and go.
              </p>

              <div className="mt-6 pt-5 border-t border-white/15 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] tracking-[0.25em] uppercase text-btf-gold-light/80 font-semibold mb-1">
                    Days in a row
                  </p>
                  <p className="font-serif text-2xl text-white font-light">
                    {result.data.currentStreak}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] tracking-[0.25em] uppercase text-btf-gold-light/80 font-semibold mb-1">
                    Longest run
                  </p>
                  <p className="font-serif text-2xl text-white font-light">
                    {result.data.longestStreak}
                  </p>
                </div>
              </div>

              {/* Week strip */}
              <div className="mt-6 pt-5 border-t border-white/15">
                <p className="text-[10px] tracking-[0.25em] uppercase text-btf-gold-light/80 font-semibold mb-3">
                  This week
                </p>
                <div className="flex items-center justify-between gap-2">
                  {result.data.weekStrip.map((d, i) => {
                    const isToday = i === result.data.weekStrip.length - 1;
                    return (
                      <div key={d.date} className="flex flex-col items-center gap-1">
                        <span
                          aria-label={`${d.date} ${d.completed ? "completed" : "no completion"}`}
                          className={
                            "block rounded-full transition-all " +
                            (d.completed
                              ? "w-5 h-5 bg-btf-gold"
                              : "w-4 h-4 border-2 border-white/30")
                          }
                        />
                        <span
                          className={
                            "text-[10px] uppercase tracking-[0.2em] " +
                            (isToday ? "text-white font-semibold" : "text-white/45")
                          }
                        >
                          {weekdayShort(d.date)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-white/15">
                <Link
                  href="/today/journey"
                  className="text-xs text-btf-gold-light hover:text-btf-gold underline underline-offset-4 inline-flex items-center gap-1"
                >
                  See your 90-day journey &rarr;
                </Link>
              </div>
            </section>

            {/* Habits */}
            <section aria-labelledby="habits-heading">
              <p
                id="habits-heading"
                className="text-[11px] tracking-[0.25em] text-btf-gold uppercase font-semibold mb-4"
              >
                {result.data.habits.length}{" "}
                {result.data.habits.length === 1 ? "habit" : "habits"}
              </p>

              {result.data.habits.length === 0 ? (
                <div className="rounded-2xl bg-white border-2 border-btf-sky-pale/60 p-6 text-center">
                  <p className="text-btf-text-mid font-light leading-relaxed mb-4">
                    You haven&rsquo;t set any habits yet. Pick a few that match what you&rsquo;re working on.
                  </p>
                  <Link
                    href="/today/edit"
                    className="inline-block bg-gradient-to-br from-btf-sky to-btf-sky-deep text-white font-medium px-6 py-3 rounded-full shadow-lg hover:-translate-y-0.5 transition-transform"
                  >
                    Set up habits &rarr;
                  </Link>
                </div>
              ) : (
                <ul className="space-y-3">
                  {result.data.habits.map(({ habit, completedAt }) => {
                    const def = HABITS[habit.habitSlug as HabitSlug];
                    if (!def) return null;
                    return (
                      <li key={habit.id}>
                        <HabitRow
                          slug={habit.habitSlug as HabitSlug}
                          label={def.label}
                          description={def.description}
                          beginHref={def.beginHref}
                          completedAt={completedAt}
                        />
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>

            {/* Beta feedback ramp */}
            <div className="rounded-xl bg-btf-gold-pale/40 border border-btf-gold/30 text-btf-text-mid text-xs font-light p-4 mt-10 leading-relaxed text-center">
              <span className="font-medium text-btf-sky-deep">
                Beta &middot; closed:
              </span>{" "}
              the habit tracker is brand new. If something feels off, drop a note to Max &mdash; tester feedback is what makes the v1.1 better than the v1.
            </div>
          </>
        )}
      </div>
    </main>
  );
}

function HabitRow({
  slug,
  label,
  description,
  beginHref,
  completedAt,
}: {
  slug: HabitSlug;
  label: string;
  description: string;
  beginHref: string;
  completedAt: string | null;
}) {
  const completed = completedAt !== null;
  if (completed) {
    return (
      <div className="rounded-2xl bg-btf-sky-pale/40 border-2 border-btf-sky-pale p-5 flex items-center gap-4">
        <span
          aria-hidden
          className="flex-shrink-0 w-8 h-8 rounded-full bg-btf-sky-deep text-white flex items-center justify-center"
        >
          <svg
            width={18}
            height={18}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-btf-sky-deep">{label}</p>
          <p className="text-xs text-btf-text-mid font-light leading-relaxed">
            Completed at {formatTime(completedAt)}
          </p>
        </div>
      </div>
    );
  }
  return (
    <Link
      href={beginHref}
      className="block rounded-2xl bg-white border-2 border-btf-sky-pale/60 hover:border-btf-sky-light hover:shadow-md p-5 transition-all"
      data-habit-slug={slug}
    >
      <div className="flex items-center gap-4">
        <span
          aria-hidden
          className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-btf-text-light/40"
        />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-btf-sky-deep">{label}</p>
          <p className="text-xs text-btf-text-mid font-light leading-relaxed">
            {description}
          </p>
        </div>
        <span className="flex-shrink-0 text-xs text-btf-sky-deep font-medium px-3 py-1.5 bg-btf-gold/10 border border-btf-gold/30 rounded-full">
          Begin &rarr;
        </span>
      </div>
    </Link>
  );
}

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return "Late night.";
  if (h < 12) return "Good morning.";
  if (h < 17) return "Good afternoon.";
  if (h < 21) return "Good evening.";
  return "Late night.";
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

function weekdayShort(isoDate: string): string {
  const d = new Date(isoDate + "T12:00:00Z");
  return d.toLocaleDateString(undefined, { weekday: "short" }).slice(0, 1);
}
