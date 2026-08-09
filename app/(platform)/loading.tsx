/**
 * Default streaming skeleton for the platform group.
 *
 * Next.js wraps each platform page in a <Suspense> with this fallback, so a
 * navigation paints a calm shell instantly instead of blocking on per-user
 * data (see vault: 06 - Operations / Next.js Performance — Findings & Plan).
 * Segment-specific skeletons (today, journal) override this.
 */
export default function PlatformLoading() {
  return (
    <main className="mx-auto w-full max-w-[480px] md:max-w-[600px] px-[18px]" aria-hidden>
      <div className="animate-pulse">
        <div className="pt-6 pb-3.5">
          <div className="h-7 w-40 rounded-md bg-white/10" />
          <div className="h-3 w-28 rounded bg-white/[0.07] mt-2.5" />
        </div>
        <div className="mt-1.5 h-44 rounded-[24px] bg-white/[0.06] border border-white/[0.08]" />
        <div className="mt-7 flex gap-3 overflow-hidden">
          <div className="h-[120px] w-[152px] rounded-[18px] bg-white/[0.05] border border-white/[0.08]" />
          <div className="h-[120px] w-[152px] rounded-[18px] bg-white/[0.05] border border-white/[0.08]" />
          <div className="h-[120px] w-[152px] rounded-[18px] bg-white/[0.05] border border-white/[0.08]" />
        </div>
        <div className="mt-7 h-40 rounded-[20px] bg-white/[0.04] border border-white/[0.08]" />
      </div>
    </main>
  );
}
