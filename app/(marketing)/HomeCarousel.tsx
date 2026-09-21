"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { Article } from "../lib/articles";

/**
 * Homepage hero carousel.
 *
 * Curated editorial slides cycle on the dark sky canvas with the
 * drifting "light that seeks" motif:
 *   1. Welcome  — "Come and see" (John 1:39) + Learn more
 *   2. Inside   — the faith library at a glance
 *   3. How it works — skeptic / curious / coming-home on-ramps
 *   4–5. News + Blog — the newest articles (getLatestArticles) when
 *        they exist, otherwise two "coming soon" intro slides.
 *
 * Loved-one and account-creation entries live in the header, keeping
 * the landing calm. Autoplay pauses on hover and is disabled entirely
 * under prefers-reduced-motion (CSS handles the orbs/entrances).
 */
const ROTATE_MS = 9000;

type Slide =
  | { kind: "welcome" }
  | { kind: "tiers" }
  | { kind: "catholic" }
  | {
      kind: "editorial";
      eyebrow: string;
      title: string;
      body: string;
      cta?: { label: string; href: string };
      date?: string;
    };

export default function HomeCarousel({ articles }: { articles: Article[] }) {
  const slides: Slide[] = [{ kind: "welcome" }, { kind: "tiers" }, { kind: "catholic" }];

  if (articles.length) {
    for (const a of articles) {
      slides.push({
        kind: "editorial",
        eyebrow: a.source ?? "Latest from Before the Fall",
        title: a.title,
        body: a.excerpt,
        cta: a.url ? { label: "Read more", href: a.url } : undefined,
        date: a.publishedAt,
      });
    }
  } else {
    slides.push({
      kind: "editorial",
      eyebrow: "News & insight",
      title: "Stories from the work.",
      body: "Soon this space carries the newest articles and news relevant to Before the Fall — what we're learning, where we're headed, and how the mission is moving.",
      cta: { label: "What we offer", href: "/what-we-offer" },
    });
    slides.push({
      kind: "editorial",
      eyebrow: "From the blog",
      title: "Reflections for the road.",
      body: "Short, honest writing for anyone finding the way back — the skeptical, the curious, and the people who love them. Check back as the first pieces go up.",
      cta: { label: "Who we are", href: "/who-we-are" },
    });
  }

  const total = slides.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback(
    (next: number) => setIndex(((next % total) + total) % total),
    [total]
  );

  useEffect(() => {
    if (total <= 1 || paused) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % total), ROTATE_MS);
    return () => clearInterval(t);
  }, [total, paused]);

  const slide = slides[index];

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Welcome and what we offer"
      className="relative bg-btf-sky-deep text-white overflow-hidden btf-grain"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="btf-aurora" aria-hidden>
        <div className="btf-orb btf-orb--gold" />
        <div className="btf-orb btf-orb--sky" />
        <div className="btf-orb btf-orb--sky-2" />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 min-h-[82vh] sm:min-h-[76vh] flex items-center justify-center py-24">
        <div key={index} className="w-full">
          {slide.kind === "welcome" && <WelcomeSlide />}
          {slide.kind === "tiers" && <TiersSlide />}
          {slide.kind === "catholic" && <CatholicSlide />}
          {slide.kind === "editorial" && <EditorialSlide slide={slide} />}
        </div>
      </div>

      {total > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => go(index - 1)}
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-colors cursor-pointer"
          >
            <svg
              aria-hidden
              width={18}
              height={18}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => go(index + 1)}
            className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-colors cursor-pointer"
          >
            <svg
              aria-hidden
              width={18}
              height={18}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index}
                onClick={() => go(i)}
                className={
                  "h-2 rounded-full transition-all cursor-pointer " +
                  (i === index ? "w-6 bg-btf-gold" : "w-2 bg-white/40 hover:bg-white/70")
                }
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

/* ─── Slides ─────────────────────────────────────────────────────── */

function WelcomeSlide() {
  return (
    <div className="relative text-center">
      <div className="relative w-12 h-12 mx-auto mb-9 btf-fade-up" aria-hidden>
        <div className="btf-breathe absolute inset-0">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-1.5 h-12 bg-btf-gold rounded-sm shadow-[0_0_24px_rgba(201,168,76,0.7)]" />
          <div className="absolute left-1/2 top-3 -translate-x-1/2 w-9 h-1.5 bg-btf-gold rounded-sm shadow-[0_0_24px_rgba(201,168,76,0.7)]" />
        </div>
      </div>

      <p className="font-serif italic text-base md:text-lg text-btf-gold-light/95 leading-relaxed mb-3 px-4 btf-fade-up btf-d-1">
        &ldquo;Come and see.&rdquo;
      </p>
      <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold/80 mb-9 btf-fade-up btf-d-1">
        John 1:39
      </p>

      <h1 className="font-serif text-4xl md:text-6xl font-light leading-[1.15] mb-7 btf-fade-up btf-d-2">
        Curious? Skeptical?
        <br />
        <span className="italic text-btf-gold-light">Halfway home?</span>
      </h1>

      <p className="font-serif italic text-lg md:text-xl text-white/85 font-light mb-10 btf-fade-up btf-d-3">
        A free, anonymous place to explore the faith at your own pace &mdash;
        no sign-up sheet, no commitment, no one watching over your shoulder.
      </p>

      <div className="btf-fade-up btf-d-4">
        <Link
          href="/what-we-offer"
          className="inline-flex items-center justify-center bg-btf-gold hover:bg-btf-gold-light text-btf-sky-deep font-medium px-10 py-4 rounded-full shadow-lg shadow-btf-gold/30 transition-all hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer"
        >
          Learn more →
        </Link>
      </div>

      <p className="mt-10 text-xs text-white/45 btf-fade-up btf-d-5">
        In immediate crisis? Call or text 988.
      </p>
    </div>
  );
}

/** "What's inside" — the faith library is the headline now; the old
 *  four-tier clinical pitch is retired from public marketing
 *  (repositioning, 2026-09-21). */
function TiersSlide() {
  return (
    <div className="relative text-center max-w-2xl mx-auto">
      <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold mb-3 btf-fade-up">
        What&rsquo;s inside
      </p>
      <h2 className="font-serif text-3xl md:text-5xl font-light leading-tight mb-4 btf-fade-up btf-d-1">
        Everything you need to begin.
      </h2>
      <p className="text-white/85 font-light leading-relaxed mb-8 btf-fade-up btf-d-2">
        Daily Scripture and the full Bible. The Rosary, prayers, and novenas,
        guided step by step. Honest journaling that stays yours. Learning
        modules that assume no background at all. And quiet, practical tools
        for the hard days.
      </p>
      <div className="flex flex-wrap justify-center gap-2 mb-9 btf-fade-up btf-d-3">
        {[
          "Daily Scripture",
          "Guided Rosary",
          "Prayer library",
          "Learning modules",
          "Private journal",
          "A community praying with you",
        ].map((chip) => (
          <span
            key={chip}
            className="text-xs font-light text-white/85 bg-white/8 border border-white/15 rounded-full px-3.5 py-1.5"
          >
            {chip}
          </span>
        ))}
      </div>

      <div className="btf-fade-up btf-d-4">
        <Link
          href="/onboard"
          className="inline-flex items-center justify-center bg-btf-gold hover:bg-btf-gold-light text-btf-sky-deep font-medium px-9 py-3.5 rounded-full shadow-lg shadow-btf-gold/30 transition-all hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer"
        >
          Create your free account
        </Link>
        <Link
          href="/what-we-offer"
          className="ml-3 inline-flex items-center justify-center text-white/85 hover:text-white border border-white/25 hover:bg-white/10 font-light px-6 py-3.5 rounded-full transition-colors cursor-pointer"
        >
          See the details
        </Link>
      </div>
    </div>
  );
}

function CatholicSlide() {
  return (
    <div className="relative text-center max-w-2xl mx-auto">
      <div className="relative w-10 h-10 mx-auto mb-7 btf-fade-up" aria-hidden>
        <div className="btf-breathe absolute inset-0">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-1.5 h-10 bg-btf-gold rounded-sm" />
          <div className="absolute left-1/2 top-2.5 -translate-x-1/2 w-7 h-1.5 bg-btf-gold rounded-sm" />
        </div>
      </div>
      <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold mb-3 btf-fade-up btf-d-1">
        How it works
      </p>
      <h2 className="font-serif text-3xl md:text-5xl font-light leading-tight mb-4 btf-fade-up btf-d-1">
        At your pace. On your terms.
      </h2>
      <p className="text-white/85 font-light leading-relaxed mb-7 btf-fade-up btf-d-2">
        Skeptical? Start with the practical tools and the wisdom library, and
        go no further until you want to. Curious? Walk through prayer,
        Scripture, and the Mass with guides that assume nothing. Coming home
        after years away? Pick up right where you are. You choose the depth
        &mdash; the door is the same.
      </p>
      <div className="flex flex-wrap justify-center gap-2 mb-9 btf-fade-up btf-d-3">
        {[
          "Daily scripture",
          "Guided reflection",
          "Rosary & prayers",
          "Parish finder",
          "Teaching videos",
        ].map((chip) => (
          <span
            key={chip}
            className="text-xs font-light text-white/85 bg-white/8 border border-white/15 rounded-full px-3.5 py-1.5"
          >
            {chip}
          </span>
        ))}
      </div>
      <div className="btf-fade-up btf-d-4">
        <Link
          href="/onboard"
          className="inline-flex items-center justify-center bg-btf-gold hover:bg-btf-gold-light text-btf-sky-deep font-medium px-9 py-3.5 rounded-full shadow-lg shadow-btf-gold/30 transition-all hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer"
        >
          Open a free account to begin
        </Link>
      </div>
    </div>
  );
}

function EditorialSlide({
  slide,
}: {
  slide: Extract<Slide, { kind: "editorial" }>;
}) {
  const dateLabel = (() => {
    if (!slide.date) return null;
    const d = new Date(slide.date);
    return isNaN(d.getTime())
      ? null
      : d.toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
  })();

  return (
    <div className="relative text-center max-w-2xl mx-auto">
      <p className="text-[11px] tracking-[0.25em] uppercase text-btf-gold-light/90 font-semibold mb-4 btf-fade-up">
        {slide.eyebrow}
      </p>
      <h2 className="font-serif text-3xl md:text-5xl font-light leading-[1.15] mb-5 btf-fade-up btf-d-1">
        {slide.title}
      </h2>
      <p className="font-light text-base md:text-lg text-white/85 leading-relaxed mb-8 btf-fade-up btf-d-2">
        {slide.body}
      </p>
      {slide.cta && (
        <div className="btf-fade-up btf-d-3">
          <Link
            href={slide.cta.href}
            className="inline-flex items-center justify-center bg-white/10 border border-white/30 text-white/90 font-light px-8 py-3.5 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
          >
            {slide.cta.label} →
          </Link>
        </div>
      )}
      {dateLabel && (
        <p className="mt-8 text-xs text-white/45 uppercase tracking-[0.2em] btf-fade-up btf-d-4">
          {dateLabel}
        </p>
      )}
    </div>
  );
}
