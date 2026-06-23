import { redirect } from "next/navigation";

/**
 * "Waves you rode" now lives in the consolidated grove (Waves tab), so
 * everything's on one page. This route redirects there.
 */
export const dynamic = "force-dynamic";

export default async function WavesPage() {
  redirect("/today/grove");
}
