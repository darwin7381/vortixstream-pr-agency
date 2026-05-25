const FAQS = [
  {
    q: "What kind of teams is Vortix for?",
    a: "Vortix works with startups, builders, and companies launching AI products, tools, and emerging technologies. We support both early-stage teams and larger organizations.",
  },
  {
    q: "What do you provide in your service?",
    a: "We handle end-to-end PR — from narrative strategy and press release drafting to media outreach, journalist relationships, and coverage tracking across global and Asia markets.",
  },
  {
    q: "Are placements guaranteed?",
    a: "We don't guarantee specific outlets, but our track record speaks for itself. Most clients see coverage within the first 2-4 weeks of working together.",
  },
  {
    q: "How long does a campaign take?",
    a: "Most campaigns run 3-6 months for sustained coverage. Launch-specific campaigns can be as short as 4-6 weeks with focused media pushes.",
  },
  {
    q: "What is Vortix Platform?",
    a: "Vortix Platform is our proprietary tool that brings together distribution tracking, journalist insights, embargo management, and AI-assisted narrative optimization — all in one place.",
  },
];

export default function FAQ() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="relative section-pad-strip-bottom text-[var(--paper)]"
    >
      <div className="section-container">
        <p className="eyebrow">
          <span className="eyebrow-num">09</span>
          <span>FAQ</span>
        </p>
        <div className="eyebrow-line-draw max-w-[80px] mt-2" />
        <h2 id="faq-title" className="t-h2">
          Common <span className="italic">questions.</span>
        </h2>
        <p className="t-lead">
          Get answers from AI founders about working with VortixPR.
        </p>

        <dl className="mt-10 border-t border-[var(--rule)]">
          {FAQS.map((f, i) => (
            <details
              key={f.q}
              className="group border-b border-[var(--rule)] py-7 transition-colors duration-300 [&[open]>summary>span.indicator]:rotate-45"
            >
              <summary className="group/sum flex cursor-pointer list-none [&::-webkit-details-marker]:hidden items-baseline justify-between gap-6 py-1 select-none">
                <span className="flex items-baseline gap-5">
                  <span className="font-mono text-[length:var(--text-caption)] text-[var(--gold)] transition-colors duration-300 group-hover/sum:text-[var(--accent)]">{String(i + 1).padStart(2, "0")}</span>
                  <span className="t-quote text-[var(--paper)] transition-all duration-300 group-hover/sum:translate-x-1 group-open:opacity-90">
                    {f.q}
                  </span>
                </span>
                <span
                  aria-hidden
                  className="indicator inline-block flex-none translate-y-1 font-mono text-2xl text-[var(--paper-muted)] transition-all duration-500 ease-[var(--ease-editorial)] group-hover/sum:text-[var(--paper)]"
                >
                  +
                </span>
              </summary>
              <p className="t-body mt-4 pl-9 details-content" style={{ color: "rgba(244,239,229,0.82)", maxWidth: "44rem" }}>
                {f.a}
              </p>
            </details>
          ))}
        </dl>

        <p className="mt-12 t-caption">
          Still thinking about it?{" "}
          <a href="#contact" className="ml-2 text-[var(--paper)] border-b border-[var(--paper)]/40 pb-0.5 hover:border-[var(--paper)]">Schedule a call</a>
          <span className="mx-2">or</span>
          <a href="#contact" className="text-[var(--paper)] border-b border-[var(--paper)]/40 pb-0.5 hover:border-[var(--paper)]">send us a note →</a>
        </p>
      </div>
    </section>
  );
}
