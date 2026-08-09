import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUserId } from "../../../lib/session";
import { getWeeklyDebrief } from "../../../actions/fieldJournal";
import { contextLabel } from "../../../lib/fieldJournalContent";

/**
 * /field-journal/week — the weekly "Examen": what the week's data says,
 * framed as company and insight, never a scorecard. Calm dark glass, never red.
 */
export const dynamic = "force-dynamic";

function hour12(h: number): string {
  const am = h < 12;
  const hr = h % 12 === 0 ? 12 : h % 12;
  return `${hr} ${am ? "am" : "pm"}`;
}

export default async function WeeklyReviewPage() {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/return");
  const d = await getWeeklyDebrief(7);

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-10 sm:py-14">
      <div>
        <Link href="/field-journal" className="text-white/70 hover:text-white text-sm mb-6 inline-flex items-center gap-2 transition-colors">
          <span aria-hidden>←</span> Field Journal
        </Link>

        <p className="text-[11px] tracking-[0.25em] text-btf-gold uppercase font-semibold mb-2">
          Your week, in review
        </p>

        {!d || d.totalLogs === 0 ? (
          <>
            <h1 className="font-serif text-3xl text-white font-light leading-tight mb-3">
              Nothing logged yet this week.
            </h1>
            <p className="text-white/70 font-light leading-relaxed">
              Log a few urges and this page turns them into a picture &mdash; your
              most-tested hour, what&rsquo;s been helping, and what&rsquo;s been
              catching you.
            </p>
          </>
        ) : (
          <>
            <h1 className="font-serif text-3xl md:text-4xl text-white font-light leading-tight mb-6">
              {d.mostTestedHour !== null ? (
                <>Your most-tested hour was <span className="text-btf-gold-light">{hour12(d.mostTestedHour)}</span>.</>
              ) : (
                <>Here&rsquo;s what this week held.</>
              )}
            </h1>

            <div className="grid grid-cols-3 gap-3 mb-6">
              <Stat label="Logged" value={`${d.totalLogs}`} />
              <Stat label="Stayed / left" value={`${d.surfRatePct}%`} />
              <Stat label="Top context" value={d.topContexts[0] ? contextLabel(d.topContexts[0].context) : "—"} small />
            </div>

            {d.helping.length > 0 && (
              <section className="rounded-2xl bg-white/[0.055] border border-white/[0.09] p-5 mb-4">
                <p className="text-[11px] tracking-[0.2em] uppercase text-btf-sky-light font-semibold mb-2">
                  What&rsquo;s been helping you
                </p>
                <ul className="space-y-2">
                  {d.helping.map((h, i) => (
                    <li key={i} className="text-white/70 font-light italic">&ldquo;{h}&rdquo;</li>
                  ))}
                </ul>
              </section>
            )}

            {d.catchingContext && (
              <section className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-5 mb-4">
                <p className="text-[11px] tracking-[0.2em] uppercase text-white/70 font-semibold mb-2">
                  What&rsquo;s been catching you
                </p>
                <p className="text-white/70 font-light leading-relaxed">
                  Most slips this week came around{" "}
                  <span className="font-medium text-[#e9f1f8]">{contextLabel(d.catchingContext)}</span>. A guard-rail
                  for next time: when you notice it starting, log it first and decide second &mdash; that pause is where
                  the choice lives.
                </p>
              </section>
            )}

            {d.topContexts.length > 0 && (
              <section className="rounded-2xl bg-white/[0.055] border border-white/[0.09] p-5 mb-4">
                <p className="text-[11px] tracking-[0.2em] uppercase text-btf-sky-light font-semibold mb-3">Where it showed up</p>
                <ul className="space-y-2">
                  {d.topContexts.map((c) => (
                    <li key={c.context} className="flex items-center gap-3 text-sm">
                      <span className="flex-1 text-[#e9f1f8]">{contextLabel(c.context)}</span>
                      <span className="text-white/70">{c.logs} {c.logs === 1 ? "time" : "times"}</span>
                      <span className="text-btf-gold-light font-medium w-20 text-right">{c.surfRatePct}% stayed</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="rounded-2xl border border-btf-gold/30 bg-[radial-gradient(120%_120%_at_50%_0%,rgba(201,168,76,0.14),transparent_60%)] text-[#e9f1f8] p-6">
              <p className="text-[11px] tracking-[0.2em] uppercase text-btf-gold-light font-semibold mb-2">
                The Examen
              </p>
              <p className="font-serif italic text-lg leading-relaxed">
                Look back over the week with gratitude, not judgment. Where were you met?
                Where did you meet yourself with grace? Carry what helped into the days ahead.
              </p>
            </section>
          </>
        )}

        <p className="text-xs text-white/70 font-light mt-8">
          A reflection on your own data &mdash; not a diagnosis or a score.
        </p>
      </div>
    </main>
  );
}

function Stat({ label, value, small }: { label: string; value: string; small?: boolean }) {
  return (
    <div className="rounded-xl bg-white/[0.055] border border-white/[0.09] p-3 text-center">
      <p className={(small ? "text-base" : "font-serif text-2xl") + " text-[#e9f1f8] font-medium leading-tight"}>{value}</p>
      <p className="text-[10px] tracking-[0.15em] uppercase text-white/70 font-semibold mt-1">{label}</p>
    </div>
  );
}
