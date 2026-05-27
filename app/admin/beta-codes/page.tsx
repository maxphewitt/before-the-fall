import { redirect } from "next/navigation";
import { getCurrentAdminId } from "../../lib/adminSession";
import { listBetaCodes } from "../../actions/betaCodes";
import BetaCodesClient from "./BetaCodesClient";
import AdminNav from "../AdminNav";

/**
 * /admin/beta-codes — closed-beta access-code management.
 *
 * Admin-gated. Lists active and deactivated codes with usage metrics,
 * mints new codes with a label, allows deactivation, and exports a
 * CSV for the future daily-reporting agent.
 *
 * The middleware allows /admin/* through the beta gate so the admin
 * can manage codes even without a beta cookie of their own.
 */
export const metadata = {
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function BetaCodesPage() {
  const adminId = await getCurrentAdminId();
  if (!adminId) redirect("/");

  const res = await listBetaCodes();

  return (
    <main className="min-h-screen bg-btf-off-white px-6 py-10 sm:py-14">
      <div className="max-w-3xl mx-auto">
        <AdminNav current="beta-codes" />

        <p className="text-[11px] tracking-[0.25em] text-btf-gold uppercase font-semibold mb-3">
          Admin &middot; beta access
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-btf-sky-deep font-light leading-tight mb-3">
          Beta access codes
        </h1>
        <p className="text-btf-text-mid font-light leading-relaxed mb-8 text-sm">
          Mint one code per tester with a label so you know who has which. The plaintext code is shown to you ONCE after minting — copy it and send it to the tester. The platform stores only the SHA-256 hash. Set <code className="bg-btf-sky-pale/60 px-1.5 py-0.5 rounded text-xs">BETA_GATE_ENABLED=true</code> on Vercel to enforce the gate; remove or set to false to open the site to the public.
        </p>

        {!res.success && (
          <div
            role="alert"
            className="rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm p-4 mb-6"
          >
            {res.error}
          </div>
        )}

        {res.success && <BetaCodesClient initialCodes={res.data} />}
      </div>
    </main>
  );
}
