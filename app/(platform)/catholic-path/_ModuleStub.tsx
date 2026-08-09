import BackLink from "../_nav/BackLink";

/**
 * Shared layout for Catholic Path module pages that are stubbed for now.
 * Real content lands in follow-up sessions; this exists so the landing
 * page's tiles all route somewhere coherent today.
 */
export default function ModuleStub({
  title,
  description,
  whatItWillOffer,
}: {
  title: string;
  description: string;
  whatItWillOffer: string[];
}) {
  return (
    <main className="min-h-screen px-6 py-10 sm:py-14">
      <div className="max-w-2xl mx-auto">
        <BackLink
          fallbackHref="/catholic-path"
          label="Catholic Path"
          className="text-white/70 hover:text-white text-sm mb-6 inline-flex items-center gap-2 transition-colors"
        />

        <p className="text-[11px] tracking-[0.25em] text-btf-gold uppercase font-semibold mb-3">
          Catholic Path
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-[#e9f1f8] font-light leading-tight mb-3">
          {title}
        </h1>
        <p className="text-white/70 font-light leading-relaxed mb-8">
          {description}
        </p>

        <section className="rounded-2xl bg-white/[0.055] border border-white/[0.09] p-6 mb-6">
          <p className="text-[10px] tracking-[0.2em] uppercase text-btf-gold font-semibold mb-4">
            What this will offer
          </p>
          <ul className="space-y-3">
            {whatItWillOffer.map((line, i) => (
              <li
                key={i}
                className="flex gap-3 text-sm text-white/70 font-light leading-relaxed"
              >
                <svg
                  aria-hidden
                  className="text-btf-gold flex-shrink-0 mt-1"
                  width={12}
                  height={12}
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z" />
                </svg>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="rounded-xl bg-white/[0.04] border border-btf-gold/25 text-white/70 text-xs font-light p-4 leading-relaxed">
          <span className="font-medium text-[#e9f1f8]">Coming soon:</span>{" "}
          content for this module is being prepared and reviewed by Father
          Murphy before going live. If you came here looking for help right
          now, the crisis button at the bottom of the screen stays available
          on every page.
        </div>
      </div>
    </main>
  );
}
