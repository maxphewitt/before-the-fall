import { notFound } from "next/navigation";
import { getMysteryBySlug, MYSTERIES, generateRosary } from "../../../lib/rosary";
import RosaryWalker from "./RosaryWalker";
import BumpActivity from "../../../components/BumpActivity";

// Activity tracking requires request context (cookies), so this
// route renders per-request. generateStaticParams stays for routing
// hints / sitemap.
export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return MYSTERIES.map((m) => ({ mystery: m.slug }));
}

export default async function RosaryMysteryPage({
  params,
}: {
  params: Promise<{ mystery: string }>;
}) {
  const { mystery: slug } = await params;
  const mystery = getMysteryBySlug(slug);
  if (!mystery) notFound();

  const steps = generateRosary(mystery);

  return (
    <>
      <BumpActivity />
      <RosaryWalker mysteryName={mystery.name} steps={steps} />
    </>
  );
}
