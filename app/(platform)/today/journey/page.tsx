import { redirect } from "next/navigation";

/**
 * The 90-day journey now lives in the consolidated grove (Journey tab), so
 * everything's on one page. This route redirects there.
 */
export const dynamic = "force-dynamic";

export default async function JourneyPage() {
  redirect("/today/grove");
}
