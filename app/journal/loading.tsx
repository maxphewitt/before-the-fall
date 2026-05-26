/**
 * Skeleton loader for /journal while entries decrypt and group.
 */
export default function JournalLoading() {
  return (
    <main className="min-h-screen bg-btf-off-white px-6 py-10 sm:py-14">
      <div className="max-w-2xl mx-auto animate-pulse">
        <div className="h-4 w-16 bg-btf-sky-pale/60 rounded mb-6" />
        <div className="h-3 w-16 bg-btf-gold-pale rounded mb-3" />
        <div className="h-9 w-40 bg-btf-sky-pale/60 rounded mb-3" />
        <div className="h-4 w-full bg-btf-sky-pale/40 rounded mb-8" />

        <div className="flex gap-3 mb-10">
          <div className="h-11 w-32 bg-btf-sky-pale/60 rounded-full" />
          <div className="h-11 w-44 bg-btf-sky-pale/40 rounded-full" />
        </div>

        {/* Two groups */}
        {[1, 2].map((i) => (
          <div key={i} className="mb-10">
            <div className="h-3 w-32 bg-btf-gold-pale rounded mb-4" />
            <ul className="space-y-3">
              {Array.from({ length: 2 }).map((_, j) => (
                <li
                  key={j}
                  className="rounded-2xl bg-white border-2 border-btf-sky-pale/60 p-5 h-24"
                />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </main>
  );
}
