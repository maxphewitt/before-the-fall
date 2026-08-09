import Link from "next/link";
import { notFound } from "next/navigation";
import BackLink from "../../../_nav/BackLink";
import { getCurrentUserId } from "../../../../lib/session";
import { getNovenaById } from "../../../../lib/novenas";
import { getNovenaProgress } from "../../../../actions/novenas";
import OnboardingRequired from "../../../../components/OnboardingRequired";

export const dynamic = "force-dynamic";

export default async function NovenaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const novena = getNovenaById(id);
  if (!novena) notFound();

  const userId = await getCurrentUserId();
  if (!userId) return <OnboardingRequired returnTo={`/catholic-path/novenas/${id}`} />;

  const progress = await getNovenaProgress(id);
  const nextDay = progress ? Math.min(progress.currentDay, 9) : 1;
  const ctaLabel = !progress
    ? "Begin Day 1"
    : progress.completed
      ? "Pray it again"
      : `Continue — Day ${nextDay}`;
  const ctaDay = progress?.completed ? 1 : nextDay;

  return (
    <main className="min-h-screen">
      <div className="max-w-2xl mx-auto px-6 py-10 sm:py-14">
        <BackLink fallbackHref="/catholic-path/novenas" label="Novenas" className="text-white/70 hover:text-white text-sm mb-6 inline-flex items-center gap-2 transition-colors" />

        <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold font-semibold mb-3">
          {novena.intercessor ? `Through ${novena.intercessor}` : `To ${novena.addressedTo}`}
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-[#e9f1f8] font-light leading-tight mb-3">
          {novena.title}
        </h1>
        <p className="text-white/85 font-light leading-relaxed mb-6">{novena.summary}</p>

        {novena.refrain && (
          <p className="font-serif italic text-lg text-btf-gold-light font-light mb-6">
            &ldquo;{novena.refrain}&rdquo;
          </p>
        )}

        <div className="mb-8">
          <Link
            href={`/catholic-path/novenas/${novena.id}/${ctaDay}`}
            className="block w-full text-center bg-gradient-to-b from-btf-gold-light to-btf-gold text-[#2a2008] font-bold px-8 py-4 rounded-full shadow-lg hover:-translate-y-0.5 transition-transform"
          >
            {ctaLabel}
          </Link>
          {progress && !progress.completed && (
            <p className="text-xs text-[#9fb6c8] font-light text-center mt-2">
              {progress.completedDays} of 9 days prayed. A missed day never resets your novena.
            </p>
          )}
        </div>

        {/* The nine days */}
        <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold font-semibold mb-3">The nine days</p>
        <ol className="space-y-2">
          {novena.days.map((d) => {
            const done = progress ? d.day <= progress.completedDays : false;
            return (
              <li key={d.day}>
                <Link
                  href={`/catholic-path/novenas/${novena.id}/${d.day}`}
                  className="flex items-center gap-3 rounded-xl bg-white/[0.045] border border-white/[0.08] hover:border-btf-gold/40 p-3.5 transition-colors"
                >
                  <span className={"flex-none w-7 h-7 rounded-full grid place-items-center text-[12px] font-semibold " + (done ? "bg-btf-gold text-[#2a2008]" : "bg-white/[0.08] text-[#9fb6c8]")}>
                    {done ? (
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2a2008" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                    ) : (
                      d.day
                    )}
                  </span>
                  <span className="text-sm text-[#e9f1f8]">{d.title}</span>
                </Link>
              </li>
            );
          })}
        </ol>

        <p className="text-[11px] text-[#8aa0b0] font-light mt-6 leading-relaxed">{novena.approvalNote}</p>
      </div>
    </main>
  );
}
