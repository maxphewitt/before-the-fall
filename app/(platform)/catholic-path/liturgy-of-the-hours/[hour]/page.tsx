import { notFound } from "next/navigation";
import {
  HOURS,
  getHourBySlug,
  type HourSlug,
  type HourStep,
} from "../../../../lib/liturgyOfHours";
import { resolveCitationVerses } from "../../../../lib/scriptureCitation";
import HourWalker, { type ResolvedStep } from "./HourWalker";

/**
 * /catholic-path/liturgy-of-the-hours/[hour] — one Hour, resolved and
 * walked step by step. Citation-based steps (versicle/psalmody/
 * canticle/reading/Compline's responsory) are expanded to real
 * Douay-Rheims text here, server-side, via resolveCitationVerses() —
 * see lib/liturgyOfHours.ts for why every citation is trustworthy.
 */
export const dynamic = "force-static";

export function generateStaticParams() {
  return HOURS.map((h) => ({ hour: h.slug }));
}

async function resolveStep(step: HourStep): Promise<ResolvedStep | null> {
  switch (step.kind) {
    case "note":
    case "doxology":
    case "intercessions":
    case "ourFather":
    case "hailHolyQueen":
    case "signOfTheCross":
    case "collect":
    case "dismissal":
      return step;

    case "versicle": {
      const resolved = await resolveCitationVerses(step.citation);
      if (!resolved) return null;
      return { kind: "versicle", text: resolved.text };
    }

    case "psalmody":
    case "canticle": {
      const resolved = await resolveCitationVerses(step.citation);
      if (!resolved) return null;
      return { kind: step.kind, label: step.label, antiphon: step.antiphon, verses: resolved.verses };
    }

    case "reading": {
      const resolved = await resolveCitationVerses(step.citation);
      if (!resolved) return null;
      return { kind: "reading", label: step.label, text: resolved.text };
    }

    case "responsory": {
      if (step.lines) return { kind: "responsory", lines: step.lines };
      if (step.citation) {
        const resolved = await resolveCitationVerses(step.citation);
        if (!resolved) return null;
        return { kind: "responsory", lines: [resolved.text] };
      }
      return null;
    }

    default:
      return null;
  }
}

export default async function HourReadPage({
  params,
}: {
  params: Promise<{ hour: string }>;
}) {
  const { hour } = await params;
  const office = getHourBySlug(hour);
  if (!office) notFound();

  const resolvedSteps = (await Promise.all(office.steps.map(resolveStep))).filter(
    (s): s is ResolvedStep => s !== null
  );
  if (resolvedSteps.length === 0) notFound();

  const order: HourSlug[] = [
    "office-of-readings",
    "morning-prayer",
    "daytime-prayer",
    "evening-prayer",
    "night-prayer",
  ];
  const idx = order.indexOf(office.slug);
  const next = HOURS.find((h) => h.slug === order[(idx + 1) % order.length])!;

  return (
    <HourWalker
      hourLabel={office.label}
      hourSubtitle={office.subtitle}
      steps={resolvedSteps}
      nextHourHref={`/catholic-path/liturgy-of-the-hours/${next.slug}`}
      nextHourLabel={next.label}
    />
  );
}
