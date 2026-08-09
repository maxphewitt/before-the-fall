import BackLink from "../../_nav/BackLink";
import { getCurrentUserId } from "../../../lib/session";
import { listIntentions } from "../../../actions/journal";
import OnboardingRequired from "../../../components/OnboardingRequired";
import IntentionsManager from "./IntentionsManager";

/**
 * /catholic-path/intentions — the Prayer Intentions tool.
 *
 * A home of its own, separate from the general Journal: log a new intention
 * and view past ones. Intentions are stored as encrypted journal entries of
 * type "intention", so they also feed the pre-prayer intention picker.
 */
export const dynamic = "force-dynamic";

export default async function IntentionsPage() {
  const userId = await getCurrentUserId();
  if (!userId) return <OnboardingRequired returnTo="/catholic-path/intentions" />;

  const res = await listIntentions();
  const intentions = res.success ? res.data : [];

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-b from-btf-sky-deep via-btf-sky-deep to-btf-sky text-white py-14 px-6 overflow-hidden">
        <div
          className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[500px] h-[400px] rounded-full bg-btf-gold/25 blur-3xl pointer-events-none"
          aria-hidden
        />
        <div className="relative max-w-3xl mx-auto text-center">
          <BackLink
            fallbackHref="/catholic-path"
            label="Catholic Path"
            className="text-white/60 hover:text-white text-xs mb-8 inline-flex items-center gap-2 transition-colors uppercase tracking-[0.25em]"
          />
          <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold mb-3 mt-4">
            Prayer Intentions
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-light leading-[1.15] mb-5">
            What you&rsquo;re carrying to God.
          </h1>
          <p className="font-serif italic text-lg md:text-xl text-white/85 font-light mb-2 max-w-xl mx-auto text-balance">
            Write it down, keep it, and carry any of these into a prayer when you&rsquo;re ready.
          </p>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-6 py-10 sm:py-14">
        <IntentionsManager initial={intentions} />
      </div>
    </main>
  );
}
