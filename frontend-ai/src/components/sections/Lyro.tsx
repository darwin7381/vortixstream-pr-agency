import Image from "next/image";

const LYRO_FEATURES = [
  "Narrative clarity optimization",
  "Media angle suggestions",
  "LLM visibility improvement",
  "Regional positioning insights",
];

export default function Lyro() {
  return (
    <section
      id="lyro"
      aria-labelledby="lyro-title"
      className="relative w-full overflow-hidden bg-[var(--ink)] text-[var(--paper)]"
    >
      {/* Mobile: stacked (image full-width on top, copy below). sm+: side-by-side */}
      <div className="grid w-full grid-cols-1 sm:grid-cols-12">
        <div className="relative col-span-1 min-h-[22rem] sm:col-span-7 sm:min-h-[34rem] lg:col-span-6 lg:min-h-[90vh] overflow-hidden">
          <Image
            src="/img/cat-astronot.jpeg"
            alt="Vortix astronaut cat — recurring brand character"
            fill
            priority
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 58vw, 50vw"
            className="object-cover object-[58%_30%] lyro-breath"
          />
          {/* Mobile: bottom fade into dark copy bg below */}
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-1/3 sm:hidden"
            style={{ background: "linear-gradient(0deg, rgba(14,14,16,0.85) 0%, transparent 100%)" }}
          />
          {/* sm+: right fade so copy edge blends */}
          <div
            aria-hidden
            className="absolute inset-y-0 right-0 hidden w-1/3 sm:block"
            style={{ background: "linear-gradient(270deg, rgba(14,14,16,0.5) 0%, transparent 100%)" }}
          />
        </div>

        <div className="col-span-1 flex flex-col justify-center px-6 py-12 sm:col-span-5 sm:px-6 sm:py-16 lg:col-span-6 lg:px-14 lg:py-24">
          <p className="eyebrow">
            <span className="eyebrow-num">06</span>
            <span className="hidden sm:inline">AI narrative engine</span>
            <span className="sm:hidden">AI engine</span>
          </p>
          <div className="eyebrow-line-draw max-w-[80px] mt-2" />
          <h2 id="lyro-title" className="t-h2">
            <span className="italic">Lyro</span>
          </h2>
          <p className="mt-2 font-mono text-[length:var(--text-meta)] uppercase tracking-[var(--tracking-widest)] text-[var(--paper-muted)]">
            Built into Vortix Platform
          </p>

          <p className="t-body mt-5 sm:mt-7" style={{ color: "rgba(244,239,229,0.85)" }}>
            Lyro helps refine your announcement before distribution, improving
            clarity, strengthening your angle, and increasing how well your
            story surfaces across media, search, and AI systems.
          </p>

          <ul className="mt-6 grid grid-cols-1 gap-0 border-t border-[var(--rule)] sm:mt-8">
            {LYRO_FEATURES.map((f, i) => {
              const roman = ["i", "ii", "iii", "iv"][i];
              return (
                <li
                  key={f}
                  className="group/lyro flex items-baseline gap-4 border-b border-[var(--rule)] py-3.5 transition-all duration-300 hover:border-[var(--rule-strong)] hover:pl-2"
                >
                  <span
                    aria-hidden
                    className="font-serif text-xs italic text-[var(--accent)] flex-none w-6 transition-all duration-300 group-hover/lyro:text-[var(--gold)] group-hover/lyro:scale-110"
                    style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
                  >
                    {roman}.
                  </span>
                  <span className="t-body transition-transform duration-300 group-hover/lyro:translate-x-1" style={{ color: "var(--paper)" }}>
                    {f}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
