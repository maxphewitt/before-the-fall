import { notFound } from "next/navigation";
import BackLink from "../../_nav/BackLink";
import { getCurrentUserId } from "../../../lib/session";
import { getCurrentUserFaithRole } from "../../../lib/profile";
import OnboardingRequired from "../../../components/OnboardingRequired";
import {
  templateForKind,
  todayISOFrom,
  type SeasonKind,
} from "../../../lib/fastingSeasons";
import NewSeasonForm from "./NewSeasonForm";

/**
 * /seasons/new — set up one season. ?kind= picks the template
 * (lent | st-michaels-lent | advent | custom); secular presets pass
 * ?days= (+ optional ?preset= label) and always build custom seasons.
 * For liturgical kinds we resolve the NEXT window that hasn't ended.
 */
export const dynamic = "force-dynamic";

const VALID: SeasonKind[] = ["lent", "st-michaels-lent", "advent", "custom"];

export default async function NewSeasonPage({
  searchParams,
}: {
  searchParams: Promise<{ kind?: string; days?: string; preset?: string }>;
}) {
  const userId = await getCurrentUserId();
  if (!userId) return <OnboardingRequired returnTo="/seasons" />;

  const params = await searchParams;
  const faithRole = await getCurrentUserFaithRole();
  const secular = faithRole === "secular";

  // Secular users always build custom seasons; a liturgical kind in the
  // URL is ignored for them rather than erroring.
  const requested = (params.kind ?? "custom") as SeasonKind;
  const kind: SeasonKind = secular ? "custom" : VALID.includes(requested) ? requested : "custom";

  const todayISO = todayISOFrom(new Date());
  const template = templateForKind(kind);

  let fixedStart: string | undefined;
  let fixedEnd: string | undefined;
  if (kind !== "custom") {
    const year = parseInt(todayISO.slice(0, 4), 10);
    for (const y of [year, year + 1]) {
      const w = template.windowForYear?.(y);
      if (w && todayISO <= w.end) {
        fixedStart = w.start;
        fixedEnd = w.end;
        break;
      }
    }
    if (!fixedStart || !fixedEnd) notFound(); // outside the feast table
  }

  const presetDays = Math.max(1, Math.min(365, parseInt(params.days ?? "", 10) || 30));
  const heading =
    kind !== "custom"
      ? template.label
      : params.preset
        ? params.preset
        : secular
          ? "Your challenge"
          : "Your own season";

  return (
    <main className="min-h-screen">
      <div className="max-w-xl mx-auto px-6 py-10 sm:py-14">
        <BackLink
          fallbackHref="/seasons"
          label="Seasons"
          className="text-white/60 hover:text-white text-xs inline-flex items-center gap-2 transition-colors uppercase tracking-[0.25em]"
        />
        <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold mb-2 mt-8">
          {secular ? "New challenge" : "New season"}
        </p>
        <h1 className="font-serif text-3xl md:text-4xl font-light leading-tight mb-3">{heading}</h1>
        {kind !== "custom" && (
          <p className="text-[14px] text-[#9fb6c8] font-light leading-relaxed mb-7">
            {template.blurb}
          </p>
        )}
        {kind === "custom" && (
          <p className="text-[14px] text-[#9fb6c8] font-light leading-relaxed mb-7">
            {secular
              ? "Write it down, set the length, and the count starts today."
              : "Write it down, set the length, and the season starts today. If it's a serious vow you're weighing rather than a season, talk with a priest first — this tool is for practices, not vows."}
          </p>
        )}

        <NewSeasonForm
          kind={kind}
          label={template.label}
          fixedStart={fixedStart}
          fixedEnd={fixedEnd}
          defaultDays={presetDays}
          todayISO={todayISO}
          secular={secular}
        />
      </div>
    </main>
  );
}
