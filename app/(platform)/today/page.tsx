import { redirect } from "next/navigation";

/**
 * /today — retired as a page (redesign 2026-06-28).
 *
 * The habit-tracker home moved to /home (the new daily hub). This route
 * is kept only as a permanent redirect so old links, bookmarks, and the
 * PWA start_url keep working. /today/grove, /today/edit, etc. are
 * unaffected — only the index moved.
 */
export const dynamic = "force-dynamic";

export default function TodayIndexRedirect() {
  redirect("/home");
}
