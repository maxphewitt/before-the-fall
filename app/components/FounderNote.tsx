export default function FounderNote() {
  const showNote = process.env.NEXT_PUBLIC_SHOW_FOUNDER_NOTE === "true";

  if (!showNote) {
    return (
      <section className="bg-btf-gold-pale/40 border border-btf-gold/30 rounded-2xl p-6 sm:p-8">
        <p className="text-[11px] tracking-[0.25em] text-btf-gold uppercase font-semibold mb-2">
          A note from our founder
        </p>
        <h2 className="font-serif text-2xl text-btf-sky-deep mb-3 font-light">
          Coming soon.
        </h2>
        <p className="text-btf-text-mid font-light leading-relaxed text-sm">
          A personal note from the founder of Before the Fall is being prepared. It will appear here once it&rsquo;s ready.
        </p>
      </section>
    );
  }

  return (
    <section className="bg-white border-2 border-btf-gold/40 rounded-2xl p-6 sm:p-8 shadow-sm">
      <p className="text-[11px] tracking-[0.25em] text-btf-gold uppercase font-semibold mb-2">
        A note from our founder
      </p>
      <h2 className="font-serif text-2xl text-btf-sky-deep mb-5 font-light">
        Why Before the Fall exists.
      </h2>
      <div className="text-btf-text-mid font-light leading-relaxed space-y-4 text-sm sm:text-base">
        <p>
          I struggled with porn and sex addiction from a young age. For a long time I thought it was normal &mdash; most boys my age dealt with the same thing. Over the years it stopped being a habit and became an addiction. It got into my relationships, and it made me cheat &mdash; even though cheating wasn&rsquo;t who I wanted to be. Morally, I felt like I never could. But lust corrupts the mind and the soul. It&rsquo;s a drug harder than heroin, and for a decade I let it run my life.
        </p>
        <p>
          It also took God from me. I stopped going to Church. Christmas and Easter at most. I lived godlessly, and the cost eventually came back and hit me square in the face.
        </p>
        <p>
          This time, instead of running, I went looking for help. It took months. I tried therapy, talked to friends and family, searched online for resources I didn&rsquo;t know existed. When I finally found a few, I could see how invisible they were &mdash; the kind of organizations that help nobody finds. None of it reached me. What finally did was the Church. One Monday evening I walked into my parish for Confession. I was too late, but I stayed for Mass. The next day I came back and confessed. The morning after that I called the parish office and asked to meet with the priest. I told him everything. He pointed me toward a new path. From that moment forward I could feel God&rsquo;s warmth, and the evil pushing back against it. So I bought a Rosary, and I&rsquo;m trying to pray it every day.
        </p>
        <p>
          I built Before the Fall because I want to reach one man before he does what he can&rsquo;t take back &mdash; and bring him home to God in the process. If the platform does that for even one person, it&rsquo;s worth all of it.
        </p>
      </div>
      <p className="font-serif italic text-base text-btf-sky-deep mt-6">
        &mdash; Max Hewitt, Founder
      </p>
    </section>
  );
}
