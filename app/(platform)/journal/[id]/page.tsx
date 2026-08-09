import { redirect, notFound } from "next/navigation";
import BackLink from "../../_nav/BackLink";
import { getCurrentUserId } from "../../../lib/session";
import { getEntry } from "../../../actions/journal";
import EntryEditor from "./EntryEditor";

/**
 * /journal/[id] — view a single decrypted entry, with edit and soft-delete
 * affordances. Server component handles auth + fetch; the editor is a
 * client subcomponent for the interactive parts.
 *
 * In Next 15+, dynamic route `params` is a Promise. Await it.
 */
export default async function JournalEntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const userId = await getCurrentUserId();
  if (!userId) redirect("/return");

  const result = await getEntry(id);
  if (!result.success) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-10 sm:py-14">
      <div>
        <BackLink
          fallbackHref="/journal"
          label="Journal"
          className="text-white/70 hover:text-white text-sm mb-6 inline-flex items-center gap-2 transition-colors"
        />

        <EntryEditor entry={result.data} />
      </div>
    </main>
  );
}
