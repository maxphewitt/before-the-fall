/**
 * Skeleton loader for /admin/analytics while the aggregate queries run.
 * Several queries fan out, so the wait can be a second or two.
 */
export default function AnalyticsLoading() {
  return (
    <main className="min-h-screen bg-btf-off-white px-6 py-10 sm:py-14">
      <div className="max-w-3xl mx-auto animate-pulse">
        <div className="h-4 w-32 bg-btf-sky-pale/60 rounded mb-6" />
        <div className="h-3 w-32 bg-btf-gold-pale rounded mb-3" />
        <div className="h-9 w-72 bg-btf-sky-pale/60 rounded mb-3" />
        <div className="h-4 w-full bg-btf-sky-pale/40 rounded mb-8" />

        {/* Top-line numbers — 4 then 6 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white border-2 border-btf-sky-pale/60 h-24"
            />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 mb-10">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white border-2 border-btf-sky-pale/60 h-24"
            />
          ))}
        </div>

        {/* Breakdown sections */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="mb-10">
            <div className="h-3 w-40 bg-btf-gold-pale rounded mb-4" />
            <ul className="space-y-2">
              {Array.from({ length: 5 }).map((_, j) => (
                <li
                  key={j}
                  className="rounded-xl bg-white border border-btf-sky-pale/60 h-12"
                />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </main>
  );
}
