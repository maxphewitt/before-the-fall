import { notFound } from "next/navigation";
import { getPrayerById, PRAYERS } from "../../../../../lib/prayers";
import PrayerWalker from "./PrayerWalker";

/**
 * /catholic-path/prayers/[id]/pray — guided "Pray this" walker.
 *
 * Server component handles lookup. The walker itself is client-only
 * because it manages step state, optional intention text, and a
 * server-action save at the end.
 *
 * No auth gate — anyone can pray. The intention save at the end IS
 * auth-gated (createEntry requires a session cookie); if not signed
 * in, the walker shows a soft "sign in to save" prompt instead of
 * erroring.
 */

export const dynamic = "force-static";

export function generateStaticParams() {
  return PRAYERS.map((p) => ({ id: p.id }));
}

export default async function PrayerWalkerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const prayer = getPrayerById(id);
  if (!prayer) notFound();

  // Derive lines from full_text if explicit `lines` isn't provided.
  const lines =
    prayer.lines && prayer.lines.length > 0
      ? prayer.lines
      : prayer.full_text.split("\n\n").map((s) => s.trim()).filter(Boolean);

  return (
    <PrayerWalker
      prayerId={prayer.id}
      title={prayer.title}
      lines={lines}
      author={prayer.author}
    />
  );
}
