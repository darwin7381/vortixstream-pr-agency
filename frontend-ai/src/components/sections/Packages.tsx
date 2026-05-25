const PACKAGES = [
  {
    tier: "Starter",
    price: "$2,500",
    cadence: "/mo",
    summary: "Essential narrative shaping and targeted distribution for early-stage builders.",
    inclusions: [
      "5 guaranteed placements / mo",
      "Narrative & release copywriting",
      "Curated media list building",
      "Monthly impact & reach reports",
      "Vortix portal dashboard access",
    ],
  },
  {
    tier: "Growth",
    price: "$5,000",
    cadence: "/mo",
    summary: "Comprehensive multi-region campaigns and active positioning for scaling teams.",
    inclusions: [
      "15 guaranteed placements / mo",
      "Deep-dive narrative strategy",
      "Founder media training & prep",
      "Global & Asia local distribution",
      "Lyro AI narrative optimizer",
      "Weekly custom impact analytics",
    ],
    featured: true,
  },
  {
    tier: "Scale",
    price: "$10,000",
    cadence: "/mo",
    summary: "All-inclusive priority media management and strategic execution for global leaders.",
    inclusions: [
      "30+ guaranteed placements / mo",
      "Dedicated strategic director",
      "Global multi-region campaigns",
      "Launch & event orchestration",
      "Priority platform & live tracker",
      "Crisis comms & NDA protection",
    ],
  },
];

export default function Packages() {
  return (
    <section
      id="packages"
      aria-labelledby="packages-title"
      className="relative section-pad-strip-top text-[var(--paper)] scroll-mt-[120px]"
    >
      <div className="section-container">
        <p className="eyebrow">
          <span className="eyebrow-num">04</span>
          <span>Packages</span>
        </p>
        <div className="eyebrow-line-draw max-w-[80px] mt-2" />
        <h2 id="packages-title" className="t-h2 max-w-[16ch]" style={{ textShadow: "0 1px 30px rgba(0,0,0,0.5)" }}>
          Pick a <span className="italic">starting point.</span>
        </h2>
        <p className="t-lead">
          Designed for AI startups, product launches, and teams shipping fast.
          Start with a package and customize based on your distribution needs.
        </p>

        {/* Pricing CARDS — horizontal swipe on mobile, ASYMMETRIC BENTO on desktop
            (Growth col-span-6 featured, Starter/Scale col-span-3 each — breaks
            BANNED 3-equal-column grid per design-taste-frontend skill rule).
            pt-8 leaves headroom so "Most chosen" badge floating isn't clipped. */}
        <div className="mt-12 -mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto overflow-y-visible pb-6 pl-6 pr-6 pt-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mt-16 sm:-mx-10 sm:gap-7 sm:pl-10 sm:pr-10 lg:mx-0 lg:grid lg:grid-cols-12 lg:items-start lg:gap-8 lg:overflow-visible lg:px-0 lg:pb-0 lg:pt-10">
          {PACKAGES.map((p, i) => (
            <article
              key={p.tier}
              className={`relative flex w-[85%] flex-none snap-center flex-col rounded-[4px] border p-8 backdrop-blur-xl transition-all duration-[700ms] ease-[var(--ease-editorial)] sm:w-[68%] sm:p-10 lg:w-auto ${
                p.featured ? "lg:col-span-6" : "lg:col-span-3"
              } ${
                p.featured
                  ? "border-[var(--accent)] bg-[var(--ink)]/55 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)] lg:p-12 lg:-translate-y-6 hover:lg:-translate-y-8 hover:border-[var(--accent)]/90 hover:shadow-[0_45px_100px_-20px_rgba(213,138,77,0.18)]"
                  : "border-[var(--rule-strong)] bg-[var(--ink)]/40 hover:border-[var(--accent)]/50 hover:bg-[var(--ink)]/55 hover:lg:-translate-y-2 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.4)]"
              }`}
            >
              {p.featured && (
                <span className="absolute -top-3 left-8 inline-flex items-center gap-2 bg-[var(--accent)] px-3 py-1 font-mono text-[length:var(--text-meta)] uppercase tracking-[var(--tracking-widest)] text-[var(--paper)]">
                  Most chosen
                </span>
              )}
              <p className="font-mono text-[length:var(--text-meta)] uppercase tracking-[var(--tracking-widest)] text-[var(--paper-muted)]">
                Tier /{String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="t-h3 mt-2">
                {p.tier}
              </h3>
              <div className="mt-5 flex items-baseline gap-2 border-b border-[var(--rule)] pb-6">
                <p className={`t-num-display ${p.featured ? "text-[var(--gold)]" : "text-[var(--paper)]"}`}>
                  {p.price}
                </p>
                <p className="font-mono text-[length:var(--text-caption)] text-[var(--paper-muted)]">{p.cadence}</p>
              </div>
              <p className="t-body mt-5">
                {p.summary}
              </p>
              <ul className="mt-6 flex flex-col gap-2.5 text-[length:var(--text-caption)] text-[var(--paper)]/90">
                {p.inclusions.map((inc) => (
                  <li key={inc} className="flex items-baseline gap-3">
                    <span aria-hidden className={`font-mono text-xs ${p.featured ? "text-[var(--gold)]" : "text-[var(--paper-muted)]"}`}>—</span>
                    <span className="leading-[var(--leading-snug)]">{inc}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className={`mt-10 self-start ${p.featured ? "cta-primary" : "cta-outline"}`}
              >
                Get started <span aria-hidden className="arr">→</span>
              </a>
            </article>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-3 t-caption font-mono uppercase tracking-[var(--tracking-widest)] lg:hidden">
          <span aria-hidden>← swipe →</span>
        </div>

        <p className="mt-10 t-caption lg:mt-12">
          Building something custom?{" "}
          <a href="#contact" className="ml-2 cta-link">
            Talk to us <span aria-hidden className="arr">→</span>
          </a>
        </p>
      </div>
    </section>
  );
}
