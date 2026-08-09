import Link from "next/link";
import { notFound } from "next/navigation";
import BackLink from "../../../../_nav/BackLink";
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
    <main className="min-h-screen">
      <div className="max-w-2xl mx-auto px-6 py-10 sm:py-14">
        <BackLink
          fallbackHref="/catholic-path/prayers"
          label="Prayer Library"
          className="text-white/70 hover:text-white text-sm mb-6 inline-flex items-center gap-2 transition-colors"
        />

        <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold font-semibold mb-3">
          Prayer Library &middot; Category
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-[#e9f1f8] font-light leading-tight mb-3">
          {CATEGORY_LABELS[cat]}
        </h1>
        <p className="text-white/70 font-light leading-relaxed mb-8">
          {CATEGORY_BLURBS[cat]}
        </p>

        {prayers.length === 0 ? (
          <p className="text-sm text-white/70 font-light italic">
            No prayers yet in this category. More coming as Father Murphy reviews them.
          </p>
        ) : (
          <ul className="space-y-3">
            {prayers.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/catholic-path/prayers/${p.id}`}
                  className="block rounded-2xl bg-white/[0.055] border border-white/[0.09] hover:border-btf-gold/40 hover:bg-white/[0.08] p-5 transition-all"
                >
                  <p className="font-medium text-[#e9f1f8] mb-1">{p.title}</p>
                  <p className="text-xs text-[#9fb6c8] font-light mb-2">
                    {p.author}
                  </p>
                  <p className="text-sm text-white/70 font-light leading-relaxed">
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
