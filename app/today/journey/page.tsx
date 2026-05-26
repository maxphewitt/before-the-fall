import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUserId } from "../../lib/session";
import { getJourney } from "../../actions/habits";

/**
 * /today/journey — 90-day habit completion heatmap.
 *
 * The "look at the journey" surface — calendar grid where each cell
 * shades by completion count. Lets users see their own pattern over
 * time: the falls, the returns, the slow build. Research on habit
 * tracker retention shows this kind of "see yourself" view is the
 * single strongest predictor of long-term use.
 */
export const dynamic = "force-dynamic";

export default async function JourneyPage() {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/return");

  const result = await getJourney(90);

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
          Your journey
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-btf-sky-deep font-light leading-tight mb-3">
          The last 90 days.
        </h1>
        <p className="text-btf-text-mid font-light leading-relaxed mb-8">
          Each square is a day. Brighter means more habits completed. The empty squares are the missed days. None of them are failures — they&rsquo;re information.
        </p>

        {!result.success && (
          <div
            role="alert"
            className="rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm p-4"
          >
            {result.error}
          </div>
        )}

        {result.success && <Heatmap days={result.data} />}

        <div className="rounded-xl bg-btf-gold-pale/40 border border-btf-gold/30 text-btf-text-mid text-xs font-light p-4 mt-10 leading-relaxed">
          <span className="font-medium text-btf-sky-deep">A note:</span> tools like this fail 90% of users in 30 days because they shame people for missing. This page exists to do the opposite &mdash; to make the dot you fill in two weeks from now feel like a victory, not the catching-up of a broken streak.
        </div>
      </div>
    </main>
  );
}

function Heatmap({ days }: { days: { date: string; completions: number }[] }) {
  // Render as a grid of weeks. Pad the first column so each row is a
  // calendar week (Sun-Sat). The dataset is the last 90 days.
  if (days.length === 0) {
    return (
      <p className="text-sm text-btf-text-mid font-light italic">
        Nothing recorded yet. Start with one habit on /today.
      </p>
    );
  }

  // Group into weeks. Each week starts on Sunday.
  const weeks: { date: string; completions: number; weekday: number }[][] = [];
  let currentWeek: { date: string; completions: number; weekday: number }[] = [];
  for (const d of days) {
    const dt = new Date(d.date + "T12:00:00Z");
    const weekday = dt.getUTCDay(); // 0 = Sun
    if (currentWeek.length === 0 && weekday !== 0) {
      // Pad start of week with empty cells (real dates we just don't show).
      for (let i = 0; i < weekday; i++) {
        currentWeek.push({ date: "", completions: -1, weekday: i });
      }
    }
    currentWeek.push({ ...d, weekday });
    if (weekday === 6) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  if (currentWeek.length > 0) weeks.push(currentWeek);

  const maxCompletions = Math.max(1, ...days.map((d) => d.completions));

  function shade(n: number): string {
    if (n < 0) return "bg-transparent"; // padding
    if (n === 0) return "bg-btf-text-light/15";
    if (n <= maxCompletions * 0.33) return "bg-btf-gold/30";
    if (n <= maxCompletions * 0.66) return "bg-btf-gold/65";
    return "bg-btf-gold";
  }

  return (
    <div className="rounded-2xl bg-white border-2 border-btf-sky-pale/60 p-5 sm:p-6">
      <div className="flex gap-1 overflow-x-auto pb-2" aria-label="90-day completion heatmap">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1 flex-shrink-0">
            {Array.from({ length: 7 }).map((_, di) => {
              const cell = week[di];
              if (!cell || cell.completions < 0) {
                return (
                  <div key={di} className="w-4 h-4 sm:w-5 sm:h-5 bg-transparent" />
                );
              }
              const label = `${cell.date}: ${cell.completions} completion${cell.completions === 1 ? "" : "s"}`;
              return (
                <div
                  key={di}
                  className={`w-4 h-4 sm:w-5 sm:h-5 rounded-sm ${shade(cell.completions)}`}
                  title={label}
                  aria-label={label}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-end gap-2 mt-4 text-[10px] tracking-[0.2em] uppercase text-btf-text-light">
        <span>Less</span>
        <span className="w-3 h-3 rounded-sm bg-btf-text-light/15" />
        <span className="w-3 h-3 rounded-sm bg-btf-gold/30" />
        <span className="w-3 h-3 rounded-sm bg-btf-gold/65" />
        <span className="w-3 h-3 rounded-sm bg-btf-gold" />
        <span>More</span>
      </div>
    </div>
  );
}
