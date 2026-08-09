import { notFound, redirect } from "next/navigation";
import { getCurrentUserId } from "../../../lib/session";
import { getCurrentUserFaithRole } from "../../../lib/profile";
import OnboardingRequired from "../../../components/OnboardingRequired";
import { listStartHereCompletions } from "../../../actions/startHere";
import { resolveCitationVerses } from "../../../lib/scriptureCitation";
import {
  FOUNDER_NOTE_PLACEHOLDER,
  getCatholicStartHereSession,
  getSecularStartHereSession,
  startHereSessionCount,
  startHereTrackForRole,
} from "../../../lib/startHere";
import StartHereWalker, { type WalkerReading } from "../StartHereWalker";

/**
 * /start-here/[n] — one Start Here session. Server-side we pick the
 * track from faith_role, enforce sequential unlock (locked sessions
 * redirect to the landing list), resolve Catholic scripture citations
 * to Douay-Rheims text (lib/scriptureCitation, same as the Hours), and
 * hide the founder-note placeholder until Max writes the real note.
 */
export const dynamic = "force-dynamic";

/** DR Lamentations keeps the acrostic letter markers ("Nun. ...") —
 *  documented quirk. Strip a leading marker for this module's display. */
const ACROSTIC =
  /^(Aleph|Beth|Ghimel|Daleth|He|Vau|Zain|Heth|Teth|Jod|Caph|Lamed|Mem|Nun|Samech|Ain|Phe|Sade|Coph|Res|Sin|Thau)\.\s+/;

export default async function StartHereSessionPage({
  params,
}: {
  params: Promise<{ n: string }>;
}) {
  const userId = await getCurrentUserId();
  if (!userId) return <OnboardingRequired returnTo="/start-here" />;

  const { n: nRaw } = await params;
  const n = parseInt(nRaw, 10);
  if (!Number.isInteger(n) || n < 1) notFound();

  // Role + completions in parallel (perf plan #6: no serial round trips).
  const [faithRole, completedRes] = await Promise.all([
    getCurrentUserFaithRole(),
    listStartHereCompletions(),
  ]);
  const track = startHereTrackForRole(faithRole);
  const total = startHereSessionCount(track);
  if (n > total) notFound();

  // Sequential unlock: session n needs n-1 completed. Locked → back to
  // the list (never an error — the list explains itself).
  if (n > 1) {
    const completed = new Set(
      completedRes.success
        ? completedRes.data.filter((r) => r.track === track).map((r) => r.sessionN)
        : []
    );
    if (!completed.has(n - 1)) redirect("/start-here");
  }

  let title: string;
  let teaching: string[];
  let aspiration: string;
  let closing: string;
  const readings: WalkerReading[] = [];

  if (track === "catholic") {
    const session = getCatholicStartHereSession(n);
    if (!session) notFound();
    title = session.title;
    teaching = session.teaching.filter((t) => t !== FOUNDER_NOTE_PLACEHOLDER);
    aspiration = session.aspiration;
    closing = session.closingPrayer;
    for (const sc of session.scriptures) {
      const resolved = await resolveCitationVerses(sc.citation);
      if (!resolved) continue; // drop unresolvable rather than crash
      readings.push({
        ref: `${sc.citation} (Douay-Rheims)`,
        text: resolved.text.replace(ACROSTIC, ""),
        context: sc.context,
      });
    }
  } else {
    const session = getSecularStartHereSession(n);
    if (!session) notFound();
    title = session.title;
    teaching = session.teaching.filter((t) => t !== FOUNDER_NOTE_PLACEHOLDER);
    aspiration = session.practice;
    closing = session.closingThought;
    for (const r of session.readings) {
      readings.push({ ref: r.ref, text: r.text, context: r.context });
    }
  }

  return (
    <StartHereWalker
      track={track}
      sessionN={n}
      sessionTotal={total}
      title={title}
      readings={readings}
      teaching={teaching}
      aspiration={aspiration}
      closing={closing}
      nextHref={n < total ? `/start-here/${n + 1}` : null}
    />
  );
}
