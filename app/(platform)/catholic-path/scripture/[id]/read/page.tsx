import { notFound } from "next/navigation";
import { getPassageById, PASSAGES } from "../../../../../lib/scripture";
import ScriptureWalker from "./ScriptureWalker";

/**
 * /catholic-path/scripture/[id]/read — verse-by-verse walker.
 *
 * Server component handles lookup. The walker itself is a client
 * component because it manages step state and an optional reflection
 * save at the end (writes a journal entry with journal_type='reflection').
 *
 * No auth required to read scripture. The reflection save is gated
 * (createEntry requires session); the walker shows a soft "sign in to
 * save" prompt rather than erroring.
 */
export const dynamic = "force-static";

export function generateStaticParams() {
  return PASSAGES.map((p) => ({ id: p.id }));
}

export default async function ScriptureReadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const passage = getPassageById(id);
  if (!passage) notFound();

  return (
    <ScriptureWalker
      passageId={passage.id}
      title={passage.title}
      citation={passage.citation}
      translation={passage.translation}
      verses={passage.verses}
      reflectionPrompt={passage.reflection_prompt}
    />
  );
}
