/**
 * Skeleton loader shown while /today is streaming.
 *
 * Approximates the real page's layout so the perceived load is smooth.
 * Pulse animation is from Tailwind's animate-pulse.
 */
export default function TodayLoading() {
  return (
    <main className="min-h-screen px-6 py-10 sm:py-14">
      <div className="max-w-2xl mx-auto animate-pulse">
        <div className="h-4 w-16 bg-white/10 rounded mb-6" />
        <div className="h-3 w-12 bg-btf-gold/20 rounded mb-3" />
        <div className="h-8 w-48 bg-white/10 rounded mb-3" />
        <div className="h-4 w-full bg-white/[0.06] rounded mb-2" />
        <div className="h-4 w-3/4 bg-white/[0.06] rounded mb-8" />

        {/* Metrics card */}
        <div className="rounded-2xl bg-white/[0.06] p-7 mb-8 h-64" />

        {/* Habit rows */}
        <div className="h-3 w-20 bg-btf-gold/20 rounded mb-4" />
        <ul className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <li
              key={i}
              className="rounded-2xl bg-white/[0.055] border border-white/[0.09] p-5 h-20"
            />
          ))}
        </ul>
      </div>
    </main>
  );
}
