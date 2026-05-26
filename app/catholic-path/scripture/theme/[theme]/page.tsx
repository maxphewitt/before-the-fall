import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getPassagesByTheme,
  THEME_LABELS,
  THEME_BLURBS,
  type ScriptureTheme,
} from "../../../../lib/scripture";

const VALID_THEMES: ScriptureTheme[] = [
  "comfort",
  "mercy",
  "trust",
  "suffering",
  "hope",
  "discernment",
  "surrender",
  "healing",
  "conversion",
  "thanksgiving",
];

export const dynamic = "force-static";

export function generateStaticParams() {
  return VALID_THEMES.map((t) => ({ theme: t }));
}

export default async function ScriptureThemePage({
  params,
}: {
  params: Promise<{ theme: string }>;
}) {
  const { theme } = await params;
  if (!VALID_THEMES.includes(theme as ScriptureTheme)) {
    notFound();
  }
  const t = theme as ScriptureTheme;
  const passages = getPassagesByTheme(t);

  return (
    <main className="min-h-screen bg-btf-off-white">
      <div className="max-w-2xl mx-auto px-6 py-10 sm:py-14">
        <Link
          href="/catholic-path/scripture"
          className="text-btf-text-light hover:text-btf-sky-deep text-sm mb-6 inline-flex items-center gap-2 transition-colors"
        >
          <span aria-hidden>&larr;</span> Daily Scripture
        </Link>

        <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold font-semibold mb-3">
          Scripture &middot; Theme
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-btf-sky-deep font-light leading-tight mb-3">
          {THEME_LABELS[t]}
        </h1>
        <p className="text-btf-text-mid font-light leading-relaxed mb-8">
          {THEME_BLURBS[t]}
        </p>

        {passages.length === 0 ? (
          <p className="text-sm text-btf-text-mid font-light italic">
            No passages yet under this theme. More coming.
          </p>
        ) : (
          <ul className="space-y-3">
            {passages.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/catholic-path/scripture/${p.id}`}
                  className="block rounded-2xl bg-white border-2 border-btf-sky-pale/60 hover:border-btf-sky-light hover:shadow-md p-5 transition-all"
                >
                  <p className="font-medium text-btf-sky-deep mb-1">
                    {p.title}
                  </p>
                  <p className="text-xs text-btf-text-light font-light mb-2">
                    {p.citation} &middot; {p.translation}
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
