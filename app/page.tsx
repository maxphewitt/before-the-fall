import Link from "next/link";
import { getCurrentUserId } from "./lib/session";
import { shouldShowCatholicPath } from "./lib/profile";
import { signOutUser } from "./actions/userSession";
import LovedOneCodeAffordance from "./components/LovedOneCodeAffordance";
export default async function Home() {
  const userId = await getCurrentUserId();
  const signedIn = userId !== null;
  const showCatholicPath = await shouldShowCatholicPath();
  return (
    <main className="min-h-screen">
      {/* ─────────── HERO ─────────── */}
      <section className="relative bg-gradient-to-b from-btf-sky-deep via-btf-sky to-btf-sky-light text-white py-20 px-6 overflow-hidden">
        {/* Golden glow */}
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-btf-gold/20 blur-3xl pointer-events-none" aria-hidden />

        {/* Top-of-page header — journal entry (signed in) or sign in (signed out). */}
        <div className="absolute top-0 right-0 left-0 px-6 py-5 z-10 flex justify-end items-center gap-3">
          {signedIn ? (
            <>
              <form action={signOutUser}>
                <button
                  type="submit"
                  className="text-white/70 hover:text-white text-[10px] sm:text-xs tracking-[0.25em] uppercase font-medium transition-colors"
                >
                  Sign out
                </button>
              </form>
              <Link
                href="/journal"
                className="text-white/90 hover:text-white bg-white/10 hover:bg-white/20 border border-white/25 backdrop-blur-sm text-[10px] sm:text-xs tracking-[0.25em] uppercase font-medium px-4 py-2 rounded-full transition-colors"
              >
                Journal
              </Link>
              <Link
                href="/today"
                className="text-btf-sky-deep bg-btf-gold hover:bg-btf-gold-light text-[10px] sm:text-xs tracking-[0.25em] uppercase font-medium px-4 py-2 rounded-full transition-colors shadow-sm"
              >
                Today →
              </Link>
            </>
          ) : (
            <Link
              href="/return"
              className="text-white/90 hover:text-white bg-white/10 hover:bg-white/20 border border-white/25 backdrop-blur-sm text-[10px] sm:text-xs tracking-[0.25em] uppercase font-medium px-4 py-2 rounded-full transition-colors"
            >
              I already have a code →
            </Link>
          )}
        </div>

        <div className="relative max-w-3xl mx-auto text-center">
          {/* Cross */}
          <div className="relative w-12 h-12 mx-auto mb-10" aria-hidden>
            <div className="absolute left-1/2 top-0 -translate-x-1/2 w-1.5 h-12 bg-btf-gold rounded-sm" />
            <div className="absolute left-1/2 top-3 -translate-x-1/2 w-9 h-1.5 bg-btf-gold rounded-sm" />
          </div>

          {/* Eyebrow scripture */}
          <p className="font-serif italic text-base md:text-lg text-btf-gold-light/95 leading-relaxed mb-3 px-4">
            &ldquo;For the Son of Man has come to seek and to save what was lost.&rdquo;
          </p>
          <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold/80 mb-10">
            Luke 19:10
          </p>

          {/* Headline */}
          <h1 className="font-serif text-4xl md:text-6xl font-light leading-[1.15] mb-8">
            You are not a monster.
            <br />
            <span className="italic text-btf-gold-light">
              You don&rsquo;t have to become one.
            </span>
          </h1>

          {/* Gold divider */}
          <div className="w-16 h-px mx-auto my-8 bg-gradient-to-r from-transparent via-btf-gold to-transparent" aria-hidden />

          {/* Subhead */}
          <p className="font-serif italic text-lg md:text-xl text-white/85 font-light mb-12">
            Built for the moment before the fall.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
          <Link href="/onboard" className="flex-1 flex items-center justify-center bg-gradient-to-br from-btf-gold to-btf-gold-light text-btf-sky-deep font-medium px-8 py-4 rounded-full shadow-lg shadow-btf-gold/30 hover:-translate-y-0.5 transition-transform">
          Get help now
         </Link>
         <Link href="/loved-one" className="flex-1 flex items-center justify-center bg-white/10 border border-white/30 text-white/90 font-light px-6 py-4 rounded-full backdrop-blur-sm hover:bg-white/20 transition-colors">
         Worried about someone you love?
         </Link>
          </div>

          {/* Quiet handoff back to CSO resources for returning CSOs — only renders if localStorage has a stored code. */}
          <LovedOneCodeAffordance />

          {/* Identity / disclosure footer */}
          <p className="mt-10 text-xs tracking-widest text-white/55 uppercase">
            Pseudonymous &middot; Built with safeguards &middot; No judgment
          </p>
          <p className="mt-3 text-xs text-white/45">
            In immediate crisis? Call or text 988.
          </p>
        </div>
      </section>

      {/* ─────────── MISSION ─────────── */}
      <section className="py-16 px-6 bg-btf-off-white">
        <div className="max-w-2xl mx-auto">
          <p className="text-btf-text-mid text-base md:text-lg leading-relaxed font-light">
            Before the Fall is for the moment before a crime, a relapse, or a life-ending decision &mdash; the moment most prevention systems never reach. Almost every tool in this country activates after harm has already happened. We exist for the window before that. The shame, the urge, the escalation, the spiral. The space where someone is still reachable, if anyone shows up.
          </p>
          <p className="text-btf-text-mid text-base md:text-lg leading-relaxed font-light mt-6">
            We show up. Without asking you to be ready or fixed. Whatever brought you here, you can stay. You can come back. You can keep going.
          </p>
        </div>
      </section>

      {/* ─────────── FOUR TIERS ─────────── */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-[11px] tracking-[0.25em] text-btf-gold uppercase font-medium mb-3">
            How we help
          </p>
          <h2 className="text-center font-serif text-3xl md:text-4xl text-btf-sky-deep font-light mb-12">
            Four tiers. One door.
          </h2>

          <div className="grid md:grid-cols-2 gap-5">
            {/* Tier 1 ACTIVE — clickable entry point to /tools */}
            <Link
              href="/tools"
              className="group rounded-2xl p-6 bg-btf-sky-pale/40 border-2 border-btf-sky/30 hover:border-btf-sky hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col"
            >
              <div className="flex items-start gap-4 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-btf-sky-light to-btf-sky flex items-center justify-center text-xl flex-shrink-0 text-white">
                  ✦
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-btf-sky font-semibold">Tier 1 &middot; Available now</p>
                  <h3 className="font-serif text-xl text-btf-sky-deep mt-1">Self-help</h3>
                </div>
              </div>
              <p className="text-sm text-btf-text-mid font-light leading-relaxed flex-1">
                Anonymous tools you can use right now. Urge control, grounding, journaling, optional Catholic prayer and Rosary. Used by you, for you, on your own.
              </p>
              <p className="text-[10px] uppercase tracking-[0.25em] text-btf-sky font-semibold mt-4 group-hover:translate-x-1 transition-transform">
                Open the tools →
              </p>
            </Link>

            {/* Tier 2 */}
            <div className="rounded-2xl p-6 bg-white border border-btf-text-light/20 relative">
              <span className="absolute top-3 right-3 text-[10px] uppercase tracking-[0.2em] text-btf-text-light bg-btf-off-white px-2.5 py-1 rounded-full font-medium">Coming soon</span>
              <div className="flex items-start gap-4 mb-3">
                <div className="w-12 h-12 rounded-xl bg-btf-off-white flex items-center justify-center text-xl flex-shrink-0 text-btf-text-light/70">
                  ◯
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-btf-text-light font-semibold">Tier 2</p>
                  <h3 className="font-serif text-xl text-btf-sky-deep/70 mt-1">Peer community</h3>
                </div>
              </div>
              <p className="text-sm text-btf-text-mid/80 font-light leading-relaxed">
                Anonymous, moderated community of others walking the same road. Launches once trained moderators are in place.
              </p>
            </div>

            {/* Tier 3 */}
            <div className="rounded-2xl p-6 bg-white border border-btf-text-light/20 relative">
              <span className="absolute top-3 right-3 text-[10px] uppercase tracking-[0.2em] text-btf-text-light bg-btf-off-white px-2.5 py-1 rounded-full font-medium">Coming soon</span>
              <div className="flex items-start gap-4 mb-3">
                <div className="w-12 h-12 rounded-xl bg-btf-off-white flex items-center justify-center text-xl flex-shrink-0 text-btf-text-light/70">
                  ◇
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-btf-text-light font-semibold">Tier 3</p>
                  <h3 className="font-serif text-xl text-btf-sky-deep/70 mt-1">Clinician referrals</h3>
                </div>
              </div>
              <p className="text-sm text-btf-text-mid/80 font-light leading-relaxed">
                Vetted, faith-aware therapists when self-help isn&rsquo;t enough. Our credentialing standards, your choice.
              </p>
            </div>

            {/* Tier 4 */}
            <div className="rounded-2xl p-6 bg-white border border-btf-text-light/20 relative">
              <span className="absolute top-3 right-3 text-[10px] uppercase tracking-[0.2em] text-btf-text-light bg-btf-off-white px-2.5 py-1 rounded-full font-medium">Coming soon</span>
              <div className="flex items-start gap-4 mb-3">
                <div className="w-12 h-12 rounded-xl bg-btf-off-white flex items-center justify-center text-xl flex-shrink-0 text-btf-text-light/70">
                  △
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-btf-text-light font-semibold">Tier 4</p>
                  <h3 className="font-serif text-xl text-btf-sky-deep/70 mt-1">Crisis routing</h3>
                </div>
              </div>
              <p className="text-sm text-btf-text-mid/80 font-light leading-relaxed">
                Documented routing to 988, NCMEC, the Domestic Violence Hotline. The crisis exit ramp at the bottom of every page is live today.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────── CATHOLIC PATH ─────────── */}
      {showCatholicPath && (
      <section className="py-16 px-6 bg-gradient-to-b from-white to-btf-gold-pale/40">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-[11px] tracking-[0.25em] text-btf-gold uppercase font-medium mb-3">
            The Faith-Based Pathway
          </p>
          <h2 className="text-center font-serif text-3xl md:text-4xl text-btf-sky-deep font-light mb-3">
            Catholic Path
          </h2>
          <p className="text-center text-btf-text-mid font-light text-base max-w-xl mx-auto mb-10">
            A parallel daily walk in scripture and Catholic teaching, alongside whichever tier you&rsquo;re in. Opt in any time.
          </p>

          <Link
            href="/catholic-path"
            className="group block rounded-2xl p-8 md:p-10 bg-white border-2 border-btf-gold/40 shadow-sm hover:border-btf-gold hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            <div className="flex items-center gap-4 mb-8 justify-center">
              <div className="w-10 h-10 relative" aria-hidden>
                <div className="absolute left-1/2 top-0 -translate-x-1/2 w-1.5 h-10 bg-btf-gold rounded-sm" />
                <div className="absolute left-1/2 top-2.5 -translate-x-1/2 w-7 h-1.5 bg-btf-gold rounded-sm" />
              </div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-btf-gold font-semibold">Available now</span>
            </div>

            <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-5 max-w-2xl mx-auto">
              <li className="flex gap-3 text-sm text-btf-text-mid font-light leading-relaxed">
                <span className="text-btf-gold flex-shrink-0 mt-0.5">✦</span>
                <span><span className="font-medium text-btf-sky-deep">Daily scripture</span> from a Catholic translation (NABRE / RSV-2CE / Douay-Rheims), tailored to what you&rsquo;re working through.</span>
              </li>
              <li className="flex gap-3 text-sm text-btf-text-mid font-light leading-relaxed">
                <span className="text-btf-gold flex-shrink-0 mt-0.5">✦</span>
                <span><span className="font-medium text-btf-sky-deep">Guided reflection</span> on each day&rsquo;s scripture, written for the moment you&rsquo;re in.</span>
              </li>
              <li className="flex gap-3 text-sm text-btf-text-mid font-light leading-relaxed">
                <span className="text-btf-gold flex-shrink-0 mt-0.5">✦</span>
                <span><span className="font-medium text-btf-sky-deep">Weekly teaching videos</span> from priests and Catholic clinicians.</span>
              </li>
              <li className="flex gap-3 text-sm text-btf-text-mid font-light leading-relaxed">
                <span className="text-btf-gold flex-shrink-0 mt-0.5">✦</span>
                <span><span className="font-medium text-btf-sky-deep">Parish finder</span> &mdash; addresses, Mass times, confession schedules, and pastor contact for parishes near you.</span>
              </li>
              <li className="flex gap-3 text-sm text-btf-text-mid font-light leading-relaxed sm:col-span-2 sm:justify-self-center sm:max-w-md">
                <span className="text-btf-gold flex-shrink-0 mt-0.5">✦</span>
                <span><span className="font-medium text-btf-sky-deep">Rosary &amp; prayer library</span> &mdash; guided walkthroughs of all four mysteries, plus the prayers Catholics have leaned on for centuries in moments like this.</span>
              </li>
            </ul>

            <p className="text-center text-[10px] uppercase tracking-[0.25em] text-btf-gold font-semibold mt-8 group-hover:translate-x-1 transition-transform">
              Open Catholic Path →
            </p>
          </Link>
        </div>
      </section>
      )}

      {/* ─────────── WHAT THIS IS / WHAT THIS ISN'T ─────────── */}
      <section className="py-16 px-6 bg-btf-off-white">
        <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-10">
          <div>
            <p className="text-[11px] tracking-[0.25em] text-btf-gold uppercase font-medium mb-4">What this is</p>
            <ul className="space-y-3 text-btf-text-mid font-light text-sm leading-relaxed">
              <li>Pseudonymous &mdash; we don&rsquo;t ask for your name.</li>
              <li>Free, always. We are a Texas-based nonprofit initiative.</li>
              <li>Catholic faith content is opt-in. The rest works for anyone.</li>
              <li>Every clinical exercise is sourced from peer-reviewed literature.</li>
            </ul>
          </div>
          <div>
            <p className="text-[11px] tracking-[0.25em] text-btf-text-light uppercase font-medium mb-4">What this isn&rsquo;t</p>
            <ul className="space-y-3 text-btf-text-mid font-light text-sm leading-relaxed">
              <li>Not therapy. Not a replacement for a clinician.</li>
              <li>Not the confessional. Not a replacement for a priest.</li>
              <li>Not an emergency room. If you&rsquo;re in immediate danger, call 911 or 988.</li>
              <li>Not zero-knowledge anonymous. We keep enough records to honor the law and protect lives.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ─────────── FOOTER ─────────── */}
      <footer className="py-10 px-6 bg-btf-sky-deep text-white/65 text-center text-xs">
        <nav className="mb-5 flex justify-center gap-6 text-[10px] uppercase tracking-[0.25em] font-medium">
          <a href="/about" className="text-white/70 hover:text-white transition-colors">About</a>
        </nav>
        <p className="font-serif italic text-base text-white/85 mb-2">
          &ldquo;Reaching the lost before they become unreachable.&rdquo;
        </p>
        <p className="mt-3">
          &copy; 2026 Before the Fall. A Texas-based nonprofit initiative.
        </p>
        <p className="mt-2 text-white/55">
          In crisis? Call or text <span className="text-btf-gold-light">988</span>.
        </p>
      </footer>
    </main>
  );
}
