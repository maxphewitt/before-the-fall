import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getPrayersByCategory,
  CATEGORY_LABELS,
  CATEGORY_BLURBS,
  type PrayerCategory,
} from "../../../../../lib/prayers";

const VALID_CATEGORIES: PrayerCategory[] = [
  "emergency",
  "daily",
  "situational",
  "patron-saints",
  "intercession",
  "liturgical",
];

export const dynamic = "force-static";

export function generateStaticParams() {
  return VALID_CATEGORIES.map((c) => ({ category: c }));
}

export default async function PrayerCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  if (!VALID_CATEGORIES.includes(category as PrayerCategory)) {
    notFound();
  }
  const cat = category as PrayerCategory;
  const prayers = getPrayersByCategory(cat);

  return (
    <main className="min-h-screen bg-btf-off-white">
      <div className="max-w-2xl mx-auto px-6 py-10 sm:py-14">
        <Link
          href="/catholic-path/prayers"
          className="text-btf-text-light hover:text-btf-sky-deep text-sm mb-6 inline-flex items-center gap-2 transition-colors"
        >
          <span aria-hidden>&larr;</span> Prayer Library
        </Link>

        <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold font-semibold mb-3">
          Prayer Library &middot; Category
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-btf-sky-deep font-light leading-tight mb-3">
          {CATEGORY_LABELS[cat]}
        </h1>
        <p className="text-btf-text-mid font-light leading-relaxed mb-8">
          {CATEGORY_BLURBS[cat]}
        </p>

        {prayers.length === 0 ? (
          <p className="text-sm text-btf-text-mid font-light italic">
            No prayers yet in this category. More coming as Father Murphy reviews them.
          </p>
        ) : (
          <ul className="space-y-3">
            {prayers.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/catholic-path/prayers/${p.id}`}
                  className="block rounded-2xl bg-white border-2 border-btf-sky-pale/60 hover:border-btf-sky-light hover:shadow-md p-5 transition-all"
                >
                  <p className="font-medium text-btf-sky-deep mb-1">{p.title}</p>
                  <p className="text-xs text-btf-text-light font-light mb-2">
                    {p.author}
                  </p>
                  <p className="text-sm text-btf-text-mid font-light leading-relaxed">
                    {p.when_to_use}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
