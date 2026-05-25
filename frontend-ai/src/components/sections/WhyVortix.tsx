import Counter from "@/components/layout/Counter";

const STATS = [
  { n: "947", label: "Publications" },
  { n: "312", label: "Teams" },
  { n: "24", label: "Countries" },
  { n: "142M+", label: "Reach" },
];

export default function WhyVortix() {
  return (
    <section
      id="why"
      aria-labelledby="why-title"
      className="relative section-pad-strip-top text-[var(--paper)]"
    >
      <div className="section-container">
        <p className="eyebrow">
          <span className="eyebrow-num">02</span>
          <span>Why Vortix</span>
        </p>
        <div className="eyebrow-line-draw max-w-[80px] mt-2" />

        <h2 id="why-title" className="t-h2 max-w-[22ch]" style={{ textShadow: "0 1px 30px rgba(0,0,0,0.5)" }}>
          Built for teams shipping fast —{" "}
          <span className="italic">where distribution</span>{" "}
          is the real bottleneck.
        </h2>

        <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-12 border-t border-[var(--rule)] pt-12 sm:mt-16 sm:gap-x-12 lg:grid-cols-4 lg:pt-16">
          {STATS.map((s, i) => (
            <article
              key={s.label}
              className={`relative flex flex-col justify-between pl-5 sm:pl-7 group/stat transition-transform duration-500 hover:translate-y-[-4px] ${
                i > 0 ? "lg:border-l lg:border-[var(--rule)]" : ""
              } ${i % 2 !== 0 ? "border-l border-[var(--rule)] sm:border-none" : ""}`}
            >
              <div>
                <p
                  className="t-num-display text-[var(--gold)] transition-colors duration-300 group-hover/stat:text-[var(--accent)]"
                  style={{ fontStyle: "italic" }}
                >
                  <Counter value={s.n} />
                </p>
                <p className="mt-4 font-mono text-[length:var(--text-meta)] uppercase tracking-[var(--tracking-widest)] text-[var(--paper-muted)] transition-colors duration-300 group-hover/stat:text-[var(--paper)]">
                  {s.label}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
