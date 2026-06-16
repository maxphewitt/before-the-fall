import Link from "next/link";

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
    <main className="min-h-screen bg-btf-off-white px-6 py-10 sm:py-14">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/catholic-path"
          className="text-btf-text-light hover:text-btf-sky-deep text-sm mb-6 inline-flex items-center gap-2 transition-colors"
        >
          <span aria-hidden>&larr;</span> Catholic Path
        </Link>

        <p className="text-[11px] tracking-[0.25em] text-btf-gold uppercase font-semibold mb-3">
          Catholic Path
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-btf-sky-deep font-light leading-tight mb-3">
          {title}
        </h1>
        <p className="text-btf-text-mid font-light leading-relaxed mb-8">
          {description}
        </p>

        <section className="rounded-2xl bg-white border-2 border-btf-gold/30 p-6 mb-6">
          <p className="text-[10px] tracking-[0.2em] uppercase text-btf-gold font-semibold mb-4">
            What this will offer
          </p>
          <ul className="space-y-3">
            {whatItWillOffer.map((line, i) => (
              <li
                key={i}
                className="flex gap-3 text-sm text-btf-text-mid font-light leading-relaxed"
              >
                <span aria-hidden className="text-btf-gold flex-shrink-0 mt-0.5">
                  ✦
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="rounded-xl bg-btf-gold-pale/60 border border-btf-gold/30 text-btf-text-mid text-xs font-light p-4 leading-relaxed">
          <span className="font-medium text-btf-sky-deep">Coming soon:</span>{" "}
          content for this module is being prepared and reviewed by Father
          Murphy before going live. If you came here looking for help right
          now, the crisis button at the bottom of the screen stays available
          on every page.
        </div>
      </div>
    </main>
  );
}
