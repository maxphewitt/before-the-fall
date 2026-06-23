import { redirect } from "next/navigation";
import { getCurrentUserId } from "../../../lib/session";
import DailyJournal from "./DailyJournal";

export const dynamic = "force-dynamic";

export default async function DailyJournalPage() {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/return");
  return <DailyJournal />;
}
