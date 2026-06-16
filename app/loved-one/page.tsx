import Link from "next/link";
import { cookies } from "next/headers";

/**
 * /loved-one — public landing for the Concerned Significant Other (CSO)
 * flow. This explainer page is OPEN (no account) so anyone can read what
 * the "bridge" program is. The quiz, results, and resources beneath it
 * (/loved-one/quiz, /result, /resources) are gated and require an
 * account — per the 2026-06-15 decision that CSOs create accounts so
 * each is real, countable data for grant reporting.
 *
 * Research grounding: CRAFT (Community Reinforcement and Family
 * Training, Meyers et al.) — when CSOs are trained in evidence-based
 * engagement, 60–70% of their struggling person enters treatment
 * within 6 months, versus <30% for traditional approaches.
 *
 * NOTE (flagged for clinical-advisor review): requiring the CSO to
 * create an account is in tension with the CRAFT framing below
 * ("You're not the user, you're the bridge"). Account-gating is a
 * product/grant decision; the copy and a dedicated CSO onboarding flow
 * should be revisited with the clinical advisor before public launch.
 *
 * DRAFT v1 — pending clinical advisor review (see
 * Clinical Advisor Pre-Launch Checklist in the Vault).
 */
export const dynamic = "force-dynamic";

export default async function LovedOneLandingPage() {
  const signedIn = !!(await cookies()).get("btf_user_id");
  // Logged-out CSOs create an account first (so they're counted);
  // logged-in CSOs go straight to the quiz.
  const startHref = signedIn ? "/loved-one/quiz" : "/onboard";

  return (
    <main className="min-h-screen">
      <section className="relative bg-gradient-to-b from-btf-sky-deep via-btf-sky-deep to-btf-sky text-white py-16 px-6 overflow-hidden">
        <div
          className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[500px] h-[400px] rounded-full bg-btf-gold/25 blur-3xl pointer-events-none"
          aria-hidden
        />

        <div className="relative max-w-2xl mx-auto text-center">
          <Link
            href="/"
            className="text-white/60 hover:text-white text-xs mb-8 inline-flex items-center gap-2 transition-colors uppercase tracking-[0.25em]"
          >
            <span aria-hidden>&larr;</span> Home
          </Link>

          <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold mb-3 mt-4">
            For the bridge
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-light leading-[1.15] mb-5">
            You&rsquo;re not the user.
            <br />
            <span className="italic text-btf-gold-light">
              You&rsquo;re the bridge.
            </span>
          </h1>
          <p className="font-serif italic text-lg md:text-xl text-white/85 font-light mb-8 max-w-xl mx-auto text-balance">
            The clinical research is clear: when someone close to a struggling person learns how to support them well, the chance they actually get help <em>doubles</em>.
          </p>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-6 py-10 sm:py-14">
        <section className="mb-10">
          <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold font-semibold mb-3">
            How this works
          </p>
          <h2 className="font-serif text-2xl text-btf-sky-deep font-light mb-4">
            Three steps. About three minutes.
          </h2>

          <ol className="space-y-4">
            <li className="rounded-2xl bg-white border-2 border-btf-sky-pale/60 p-5 flex gap-4">
              <span
                aria-hidden
                className="flex-shrink-0 w-9 h-9 rounded-full bg-btf-sky-pale text-btf-sky-deep font-medium text-sm flex items-center justify-center mt-0.5"
              >
                1
              </span>
              <div>
                <p className="font-medium text-btf-sky-deep mb-1">
                  Tell us what you&rsquo;re noticing
                </p>
                <p className="text-sm text-btf-text-mid font-light leading-relaxed">
                  Eight short questions about your loved one and how you&rsquo;re doing. Nothing identifying. We won&rsquo;t share this with anyone.
                </p>
              </div>
            </li>
            <li className="rounded-2xl bg-white border-2 border-btf-sky-pale/60 p-5 flex gap-4">
              <span
                aria-hidden
                className="flex-shrink-0 w-9 h-9 rounded-full bg-btf-sky-pale text-btf-sky-deep font-medium text-sm flex items-center justify-center mt-0.5"
              >
                2
              </span>
              <div>
                <p className="font-medium text-btf-sky-deep mb-1">
                  Get resources for you
                </p>
                <p className="text-sm text-btf-text-mid font-light leading-relaxed">
                  Three short reads on what helps and what doesn&rsquo;t &mdash; the first conversation, what not to say, how to take care of yourself in the middle of this. Grounded in the CRAFT clinical model.
                </p>
              </div>
            </li>
            <li className="rounded-2xl bg-white border-2 border-btf-gold/30 p-5 flex gap-4">
              <span
                aria-hidden
                className="flex-shrink-0 w-9 h-9 rounded-full bg-btf-gold-pale text-btf-sky-deep font-medium text-sm flex items-center justify-center mt-0.5"
              >
                3
              </span>
              <div>
                <p className="font-medium text-btf-sky-deep mb-1">
                  Hand them a referral code
                </p>
                <p className="text-sm text-btf-text-mid font-light leading-relaxed">
                  You&rsquo;ll get a short, shareable code like <code className="bg-btf-gold-pale/60 px-2 py-0.5 rounded text-xs font-mono">amber-river-quiet-stone</code>. When they sign up at beforethefall.app, they enter the code and the platform skips ahead to what they actually need &mdash; based on what you told us.
                </p>
                <p className="text-xs text-btf-text-light font-light leading-relaxed mt-2 italic">
                  They never see your answers, only smarter defaults. They have to take the step themselves — that&rsquo;s the only way it works long-term.
                </p>
              </div>
            </li>
          </ol>
        </section>

        <div className="mb-10">
          <Link
            href={startHref}
            className="block w-full text-center bg-gradient-to-br from-btf-sky to-btf-sky-deep text-white font-medium px-8 py-4 rounded-full shadow-lg hover:-translate-y-0.5 transition-transform"
          >
            {signedIn ? "Start the quiz →" : "Create an account to start →"}
          </Link>
          {!signedIn && (
            <p className="text-center text-xs text-btf-text-light font-light mt-3 leading-relaxed">
              A free, pseudonymous account takes about two minutes and never
              asks your name. It&rsquo;s how we keep your place and how this
              program is funded.{" "}
              <Link
                href="/return"
                className="text-btf-sky-deep underline underline-offset-2 hover:text-btf-sky"
              >
                Already have one? Log in
              </Link>
              .
            </p>
          )}
        </div>

        <section className="rounded-2xl bg-btf-off-white border border-btf-text-light/15 p-5 mb-10">
          <p className="text-[10px] tracking-[0.2em] uppercase text-btf-text-light font-semibold mb-2">
            If it&rsquo;s urgent right now
          </p>
          <p className="text-sm text-btf-text-mid font-light leading-relaxed">
            If you&rsquo;re afraid for someone&rsquo;s immediate safety, this quiz isn&rsquo;t the right place. Call <a href="tel:988" className="text-btf-sky-deep underline underline-offset-4 font-medium">988</a> for crisis support, or <a href="tel:18007997233" className="text-btf-sky-deep underline underline-offset-4 font-medium">1-800-799-7233</a> for domestic violence. The crisis button at the bottom of every page has more options.
          </p>
        </section>

        <div className="rounded-xl bg-btf-gold-pale/40 border border-btf-gold/30 text-btf-text-mid text-xs font-light p-4 leading-relaxed">
          <span className="font-medium text-btf-sky-deep">
            Draft v1 &middot; closed beta:
          </span>{" "}
          this flow is grounded in the CRAFT protocol (Meyers et al., 1995–2004). Clinical advisor review pending before public launch &mdash; if anything feels off, tell Max.
        </div>
      </div>
    </main>
  );
}
