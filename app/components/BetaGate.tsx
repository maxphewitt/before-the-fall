import BetaGateForm from "./BetaGateForm";

/**
 * BetaGate — closed-beta entry rendered by the home page when
 * BETA_GATE_ENABLED=true and the visitor has no btf_beta_access
 * cookie.
 *
 * Why this lives at `/` (not at `/beta-access`):
 *   - Middleware always lets `/` through, no matter what.
 *   - A visitor with no cookie still reaches the site, sees a sensible
 *     gate, and gets crisis numbers directly even without a code.
 *   - When BETA_GATE_ENABLED is flipped off at public launch, the home
 *     page returns to its normal hero with zero residue — no orphan
 *     `/beta-access` route, no dead links, no extra surface area.
 *
 * Crisis numbers are surfaced inline so anyone in immediate distress
 * can call 988 / DV / Crisis Text Line without redeeming a code first.
 * This is non-negotiable per [[Anonymous First Access]].
 */
export default function BetaGate({
  redirectTo = "/",
}: {
  redirectTo?: string;
}) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-btf-sky-deep via-btf-sky-deep to-btf-sky text-white">
      <div className="max-w-xl mx-auto px-6 py-14 sm:py-20">
        {/* Cross */}
        <div className="relative w-12 h-12 mx-auto mb-10" aria-hidden>
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-1.5 h-12 bg-btf-gold rounded-sm" />
          <div className="absolute left-1/2 top-3 -translate-x-1/2 w-9 h-1.5 bg-btf-gold rounded-sm" />
        </div>

        <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold mb-3 text-center">
          Closed beta
        </p>
        <h1 className="font-serif text-3xl md:text-4xl font-light leading-tight mb-4 text-center">
          Before the Fall is in early testing.
        </h1>
        <p className="font-serif italic text-base text-white/85 font-light leading-relaxed mb-10 text-center">
          We&rsquo;re running a small invite-only beta while we finish content review with our clinical advisor and Father Murphy. If you have an access code, enter it below.
        </p>

        <BetaGateForm redirectTo={redirectTo} />

        {/* Crisis numbers — always visible on this page, code or no. */}
        <section className="mt-12 rounded-2xl bg-white/10 border border-white/15 p-5">
          <p className="text-[10px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold mb-3 text-center">
            If you&rsquo;re in crisis right now
          </p>
          <p className="text-sm text-white/80 font-light leading-relaxed text-center mb-4">
            You don&rsquo;t need an access code to reach help. These numbers work right now.
          </p>
          <ul className="space-y-2">
            <li>
              <a
                href="tel:988"
                className="block bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl px-4 py-3 transition-colors text-center"
              >
                <p className="text-[10px] tracking-[0.25em] uppercase text-btf-gold-light font-semibold mb-1">
                  988 Suicide &amp; Crisis Lifeline
                </p>
                <p className="font-serif text-base text-white">Call or text 988</p>
              </a>
            </li>
            <li>
              <a
                href="tel:18007997233"
                className="block bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl px-4 py-3 transition-colors text-center"
              >
                <p className="text-[10px] tracking-[0.25em] uppercase text-btf-gold-light font-semibold mb-1">
                  National DV Hotline
                </p>
                <p className="font-serif text-base text-white">1-800-799-7233</p>
              </a>
            </li>
            <li>
              <a
                href="sms:741741&body=HOME"
                className="block bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl px-4 py-3 transition-colors text-center"
              >
                <p className="text-[10px] tracking-[0.25em] uppercase text-btf-gold-light font-semibold mb-1">
                  Crisis Text Line
                </p>
                <p className="font-serif text-base text-white">Text HOME to 741741</p>
              </a>
            </li>
          </ul>
        </section>

        <p className="text-xs text-white/55 font-light text-center mt-10">
          Public launch coming after closed beta wraps. If you want a code, reach out to Max directly.
        </p>
      </div>
    </main>
  );
}
