const TESTIMONIALS = [
  {
    quote:
      "VortixPR got us into TechCrunch, VentureBeat, and The Verge the same morning. We went from zero to front page in 24 hours.",
    name: "Priya Nair",
    role: "Co-founder, Synthara AI",
    initials: "PN",
  },
  {
    quote:
      "They rewrote our entire narrative around the problem we're solving, not just the funding amount. The response from investors was night and day.",
    name: "Marcus Webb",
    role: "Founder, Contextual Labs",
    initials: "MW",
  },
  {
    quote:
      "Technical journalists actually understood what we were building. The media training made a massive difference for every interview.",
    name: "Akira Tanaka",
    role: "CTO, NeuroPipe",
    initials: "AT",
  },
];

export default function Publisher() {
  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-title"
      className="relative section-pad-strip-middle text-[var(--paper)]"
    >
      <div className="section-container">
        <p className="eyebrow">
          <span className="eyebrow-num">08</span>
          <span>What founders say</span>
        </p>
        <div className="eyebrow-line-draw max-w-[80px] mt-2" />
        <h2 id="testimonials-title" className="t-h2 max-w-[24ch]" style={{ textShadow: "0 1px 30px rgba(0,0,0,0.5)" }}>
          Trusted by the founders{" "}
          <span className="italic">building what comes next.</span>
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:mt-14 sm:gap-6 lg:grid-cols-12 lg:gap-7">
          {TESTIMONIALS.map((t, i) => (
            <article
              key={t.name}
              className={`relative flex flex-col rounded-[4px] border p-7 backdrop-blur-md sm:p-9 transition-all duration-[600ms] ease-[var(--ease-editorial)] ${
                i === 0
                  ? "lg:col-span-4 border-[var(--rule)] bg-[var(--ink)]/65 hover:lg:-translate-y-2 hover:border-[var(--accent)]/45 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.4)]"
                  : i === 1
                  ? "lg:col-span-5 border-[var(--gold)]/50 bg-[var(--ink)]/75 lg:-translate-y-4 hover:lg:-translate-y-6 hover:border-[var(--gold)] hover:shadow-[0_25px_60px_-15px_rgba(181,138,42,0.18)]"
                  : "lg:col-span-3 border-[var(--rule)] bg-[var(--ink)]/65 hover:lg:-translate-y-2 hover:border-[var(--accent)]/45 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.4)]"
              }`}
            >
              <blockquote className="t-quote flex-1 text-[var(--paper)]">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <footer className="mt-7 flex items-center gap-4 border-t border-[var(--rule)] pt-5">
                <span
                  aria-hidden
                  className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-[var(--paper)] font-mono text-[length:var(--text-meta)] uppercase tracking-[var(--tracking-widest)] text-[var(--ink)]"
                >
                  {t.initials}
                </span>
                <div>
                  <p className="text-[length:var(--text-body)] text-[var(--paper)]">
                    {t.name}
                  </p>
                  <p className="mt-0.5 font-mono text-[length:var(--text-meta)] uppercase tracking-[var(--tracking-widest)] text-[var(--paper-muted)]">
                    {t.role}
                  </p>
                </div>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
