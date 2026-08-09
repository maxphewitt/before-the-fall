import Link from "next/link";
import { getCurrentUserId } from "../../../lib/session";
import BackLink from "../../_nav/BackLink";
import { NOVENAS } from "../../../lib/novenas";
import { listNovenaProgress } from "../../../actions/novenas";
import OnboardingRequired from "../../../components/OnboardingRequired";

/**
 * /catholic-path/novenas — the novena library.
 *
 * Nine-day prayer journeys to surrender a problem to God, ask for mercy, and
 * pray through a struggle. Progress is per-user and forgiving.
 */
export const dynamic = "force-dynamic";

const PAGE_SIZE = 6; // 2 columns x 3 rows

export default async function NovenasPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const userId = await getCurrentUserId();
  if (!userId) return <OnboardingRequired returnTo="/catholic-path/novenas" />;

  const progressRes = await listNovenaProgress();
  const progress = new Map(
    (progressRes.success ? progressRes.data : []).map((p) => [p.novenaId, p])
  );

  const { page: pageParam } = await searchParams;
  const totalPages = Math.max(1, Math.ceil(NOVENAS.length / PAGE_SIZE));
  const page = Math.min(totalPages, Math.max(1, Number(pageParam) || 1));
  const pageItems = NOVENAS.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <main className="min-h-screen">
      <section className="relative bg-gradient-to-b from-btf-sky-deep via-btf-sky-deep to-btf-sky text-white py-14 px-6 overflow-hidden">
        <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[500px] h-[400px] rounded-full bg-btf-gold/25 blur-3xl pointer-events-none" aria-hidden />
        <div className="relative max-w-3xl mx-auto text-center">
          <BackLink fallbackHref="/catholic-path" label="Catholic Path" className="text-white/60 hover:text-white text-xs mb-8 inline-flex items-center gap-2 transition-colors uppercase tracking-[0.25em]" />
          <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold mb-3 mt-4">
            Novenas
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-light leading-[1.15] mb-5">
            Nine days, one intention.
          </h1>
          <p className="font-serif italic text-lg md:text-xl text-white/85 font-light mb-2 max-w-xl mx-auto text-balance">
            A novena is nine days of steady prayer. Bring one thing to God and stay with it — at your own pace.
          </p>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-6 py-10 sm:py-14">
        {/* 2-column square grid. Cards are ready for a background image later:
            drop an <img className="absolute inset-0 h-full w-full object-cover" />
            just before the scrim and it will sit behind the title. */}
        <div className="grid grid-cols-2 gap-3">
          {pageItems.map((n) => {
            const p = progress.get(n.id);
            const status = p?.completed
              ? "Completed"
              : p
                ? `Day ${Math.min(p.currentDay, 9)} of 9`
                : "Begin";
            const label = n.title.replace(/^Novena to (the )?/, "");
            return (
              <Link
                key={n.id}
                href={`/catholic-path/novenas/${n.id}`}
                className="group relative aspect-square rounded-2xl overflow-hidden border border-white/[0.09] hover:border-btf-gold/40 transition-colors flex flex-col justify-end p-4 bg-gradient-to-br from-btf-sky-deep/70 to-btf-deep-night/85"
              >
                {/* scrim keeps the title legible once a background image is added */}
                <span className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" aria-hidden />
                <span className="absolute top-3 right-3 z-10 text-[9px] uppercase tracking-[0.16em] font-semibold px-2 py-0.5 rounded-full bg-btf-gold/20 text-btf-gold-light border border-btf-gold/30 backdrop-blur-sm">
                  {status}
                </span>
                <h2 className="relative z-10 font-serif text-[18px] leading-tight text-white">
                  {label}
                </h2>
              </Link>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            {page > 1 ? (
              <Link href={`/catholic-path/novenas?page=${page - 1}`} className="text-sm text-btf-gold-light inline-flex items-center gap-1.5">
                <span aria-hidden>&larr;</span> Previous
              </Link>
            ) : (
              <span />
            )}
            <span className="text-xs text-[#9fb6c8] tracking-[0.06em]">Page {page} of {totalPages}</span>
            {page < totalPages ? (
              <Link href={`/catholic-path/novenas?page=${page + 1}`} className="text-sm text-btf-gold-light inline-flex items-center gap-1.5">
                Next <span aria-hidden>&rarr;</span>
              </Link>
            ) : (
              <span />
            )}
          </div>
        )}

        <div className="rounded-xl bg-white/[0.04] border border-btf-gold/25 text-white/70 text-xs font-light p-4 mt-10 leading-relaxed">
          <span className="font-medium text-[#e9f1f8]">Draft v1 &middot; closed beta:</span>{" "}
          novena content is pending Fr. Murphy&rsquo;s review before public launch. Some texts are our own faithful compositions; the authentic Surrender and Divine Mercy prayers will be finalised with permission before launch.
        </div>
      </div>
    </main>
  );
}
