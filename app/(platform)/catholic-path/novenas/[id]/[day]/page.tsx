import { notFound } from "next/navigation";
import { NOVENAS, getNovenaById, novenaDayScreens } from "../../../../../lib/novenas";
import NovenaDayView from "./NovenaDayView";

/**
 * /catholic-path/novenas/[id]/[day] — a single day's prayer content.
 *
 * Pure content lookup from the local NOVENAS data (no cookies/Supabase
 * read — per-user progress lives on the listing/detail pages, not here).
 * Statically generated for every real (id, day) pair (2026-08-09, perf
 * backlog #13 audit): this page had `force-dynamic` with nothing on it
 * that actually required per-request rendering, so it never got a build-
 * time-cached, instant-TTFB version. Auth for the whole (platform) route
 * group is still enforced by middleware (proxy.ts) regardless of whether
 * a given page is static — see the layout's "defense-in-depth" comment.
 * Unknown ids/days still 404 on-demand (dynamicParams defaults to true).
 */
export function generateStaticParams() {
  return NOVENAS.flatMap((novena) =>
    novena.days.map((d) => ({ id: novena.id, day: String(d.day) }))
  );
}

export default async function NovenaDayPage({
  params,
}: {
  params: Promise<{ id: string; day: string }>;
}) {
  const { id, day } = await params;
  const novena = getNovenaById(id);
  if (!novena) notFound();

  const dayNum = Number(day);
  const dayData = novena.days.find((d) => d.day === dayNum);
  if (!dayData) notFound();

  const screens = novenaDayScreens(novena, dayData);

  return (
    <NovenaDayView
      novenaId={novena.id}
      novenaTitle={novena.title}
      dayNumber={dayData.day}
      total={novena.days.length}
      dayTitle={dayData.title}
      meditation={screens.meditation}
      prayer={screens.prayer}
      repeat={screens.repeat}
      closing={screens.closing}
    />
  );
}
