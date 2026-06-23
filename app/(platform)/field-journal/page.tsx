import { redirect } from "next/navigation";
import { getCurrentUserId } from "../../lib/session";
import { getFieldHome } from "../../actions/fieldJournal";
import { rankFor, ENDOWED_XP } from "../../lib/fieldJournalContent";
import FieldJournal from "./FieldJournal";

/**
 * /field-journal — the Field Journal home + log flow.
 *
 * Self-monitoring with honesty XP and a forgiving streak. Gated; the
 * Daily Journal write view reuses the existing /journal system. The
 * weekly Examen review + the freeform analyzer are phase 2.
 */
export const dynamic = "force-dynamic";

export default async function FieldJournalPage() {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/return");

  const home =
    (await getFieldHome()) ?? {
      totalXp: ENDOWED_XP,
      currentStreak: 0,
      longestStreak: 0,
      rank: rankFor(ENDOWED_XP),
      recent: [],
      situations: [],
    };

  return <FieldJournal initial={home} />;
}
