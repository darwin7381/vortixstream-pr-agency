const CLIENTS = [
  "OpenAI", "Anthropic", "Hugging Face", "Mistral",
  "Cohere", "Stability AI", "Runway", "Perplexity",
  "ElevenLabs", "Groq", "Scale", "LangChain",
];

export default function Trusted() {
  return (
    <section
      id="clients"
      aria-labelledby="trusted-title"
      className="relative section-pad-strip-top text-[var(--paper)]"
    >
      <div className="section-container">
        <p className="eyebrow">
          <span className="eyebrow-num">07</span>
          <span>Trusted by teams building and shipping fast</span>
        </p>
        <div className="eyebrow-line-draw max-w-[80px] mt-2" />
        <h2 id="trusted-title" className="t-h2 max-w-[24ch]">
          From early-stage builders to{" "}
          <span className="italic">global teams.</span>
        </h2>

        <ul className="mt-12 grid grid-cols-2 gap-0 border-t border-[var(--rule)] sm:mt-14 sm:grid-cols-3 lg:grid-cols-4">
          {CLIENTS.map((c, i) => (
            <li
              key={c}
              className={`group relative flex items-baseline gap-4 border-b border-[var(--rule)] py-7 transition-colors duration-500 hover:bg-[var(--paper)]/[0.03] ${
                (i + 1) % 4 !== 0 ? "lg:border-r lg:border-r-[var(--rule)] lg:pr-6" : "lg:border-r-0 lg:pr-0"
              } ${(i + 1) % 3 !== 0 ? "sm:border-r sm:border-r-[var(--rule)] sm:pr-6" : "sm:border-r-0 sm:pr-0"} ${(i + 1) % 2 !== 0 ? "border-r border-r-[var(--rule)] pr-5" : "border-r-0 pr-0"} pl-1 sm:pl-2`}
            >
              <span className="font-mono text-[length:var(--text-meta)] tracking-[var(--tracking-widest)] text-[var(--paper-faint)] transition-colors duration-300 group-hover:text-[var(--gold)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="t-quote flex-1 transition-all duration-300 group-hover:text-[var(--paper)] group-hover:translate-x-1 opacity-90 group-hover:opacity-100">
                {c}
              </span>
            </li>
          ))}
        </ul>

        <p className="mt-10 font-mono text-[length:var(--text-meta)] uppercase tracking-[var(--tracking-widest)] text-[var(--paper-muted)]">
          12 active engagements — additional partners under NDA.
        </p>
      </div>
    </section>
  );
}
