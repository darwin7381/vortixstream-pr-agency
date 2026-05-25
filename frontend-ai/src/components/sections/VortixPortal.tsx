const FEATURES = [
  "Live placement tracker across publications",
  "Journalist sentiment scoring",
  "Embargo calendar with reminders",
  "Media list builder filtered by AI beat",
  "One-click export for board decks",
];

export default function VortixPortal() {
  return (
    <section
      id="platform"
      aria-labelledby="platform-title"
      className="relative section-pad-strip-bottom text-[var(--paper)]"
    >
      <div className="section-container">
        <p className="eyebrow">
          <span className="eyebrow-num">05</span>
          <span>Vortix Platform</span>
        </p>
        <div className="eyebrow-line-draw max-w-[80px] mt-2" />
        <h2 id="platform-title" className="t-h2 max-w-[18ch]" style={{ textShadow: "0 1px 30px rgba(0,0,0,0.5)" }}>
          A <span className="italic">smarter way</span> to plan, distribute,
          and track PR.
        </h2>
        <p className="t-lead">
          Built for teams shipping fast. Vortix Platform brings together
          distribution, campaign visibility, and AI-assisted insights.
        </p>

        <ul className="mt-10 grid grid-cols-1 gap-x-12 gap-y-0 sm:grid-cols-2 lg:max-w-4xl">
          {FEATURES.map((f, i) => (
            <li key={f} className="group/item flex items-baseline gap-4 border-b border-[var(--rule)] py-4 transition-all duration-300 hover:border-[var(--rule-strong)] hover:pl-2">
              <span aria-hidden className="font-mono text-[10px] text-[var(--gold)]/80 uppercase tracking-widest transition-colors duration-300 group-hover/item:text-[var(--accent)]">
                {String(i + 1).padStart(2, "0")} /
              </span>
              <span className="flex-1 t-body transition-transform duration-300 group-hover/item:translate-x-1" style={{ color: "var(--paper)" }}>
                {f}
              </span>
            </li>
          ))}
        </ul>

        <a href="#contact" className="cta-primary mt-12">
          Get early access <span aria-hidden className="arr">→</span>
        </a>
      </div>
    </section>
  );
}
