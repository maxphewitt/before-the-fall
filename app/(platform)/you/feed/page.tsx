import { redirect } from "next/navigation";
import BackLink from "../../_nav/BackLink";
import { getCurrentUserId } from "../../../lib/session";
import { getCurrentUserFeedTopics } from "../../../lib/profile";
import FeedTopicsEditor from "./FeedTopicsEditor";

/**
 * /you/feed — customize what the daily Scripture/prayer feed recommends.
 *
 * Defaults come from the user's onboarding struggles; here they can add
 * more themes they'd like to read on. Purely additive personalization.
 */
export const dynamic = "force-dynamic";

export default async function FeedTopicsPage() {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/return");

  const topics = await getCurrentUserFeedTopics();

  return (
    <main className="mx-auto w-full max-w-[480px] md:max-w-[600px] px-[18px]">
      <header className="pt-6 pb-4 px-0.5">
        <BackLink fallbackHref="/you" label="You" className="text-white/70 hover:text-white text-sm inline-flex items-center gap-2" />
        <h1 className="font-serif text-[26px] font-medium leading-tight mt-4">
          Customize your feed
        </h1>
        <p className="text-sm text-white/70 font-light leading-relaxed mt-1.5">
          Your daily Scripture and prayer are already shaped by what you told us
          you&rsquo;re working through. Add any themes you&rsquo;d also like to
          read on — your recommendations draw from these too.
        </p>
      </header>

      <FeedTopicsEditor initial={topics} />
    </main>
  );
}
