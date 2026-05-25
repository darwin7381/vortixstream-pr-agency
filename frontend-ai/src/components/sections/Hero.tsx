import Image from "next/image";
import Link from "next/link";
import InteractiveButton from "@/components/layout/InteractiveButton";

const FEATURED = ["TechCrunch", "WIRED", "VentureBeat", "Product Hunt", "ars Technica", "IEEE", "MIT Tech Review"];

export default function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate min-h-[100dvh] w-full overflow-hidden bg-[var(--ink)] text-[var(--paper)]"
    >
      {/* Painterly cinematic backdrop */}
      <Image
        src="/img/hero-bg.jpeg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-[center_30%]"
      />

      {/* Layered gradient overlays — CodePen pattern */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,10,10,0.15) 0%, rgba(10,10,10,0.05) 20%, rgba(10,10,10,0.15) 50%, rgba(10,10,10,0.92) 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(10,10,10,0.7) 0%, rgba(10,10,10,0.45) 30%, rgba(10,10,10,0.1) 55%, rgba(0,0,0,0) 70%)",
        }}
      />

      {/* Nav has been moved out to page-level layout to avoid being trapped inside
          Hero's overflow-hidden / stacking-context scope. See app/layout.tsx → <FloatingNav /> */}

      {/* Hero body — bottom-left composition */}
      <div className="relative z-10 mx-auto flex w-full max-w-[100rem] flex-col justify-end px-6 pb-32 pt-28 sm:px-10 sm:pb-36 sm:pt-36 lg:px-16 lg:pb-40 lg:pt-44 min-h-[100dvh]">
        <div className="rise delay-2 mb-8 pb-4">
          <p className="font-mono text-[length:var(--text-meta)] uppercase tracking-[var(--tracking-widest)] text-[var(--paper-muted)]">
            PR & distribution for startups & emerging tech
          </p>
          <div className="eyebrow-line-draw" />
        </div>

        <h1 id="hero-title" className="t-display max-w-[18ch]">
          <span className="block overflow-hidden pb-1">
            <span className="inline-block animate-word-rise" style={{ animationDelay: "150ms" }}>Building&nbsp;</span>
            <span className="inline-block animate-word-rise" style={{ animationDelay: "220ms" }}>is&nbsp;</span>
            <span className="inline-block animate-word-rise" style={{ animationDelay: "290ms" }}>easy&nbsp;</span>
            <span className="inline-block animate-word-rise" style={{ animationDelay: "360ms" }}>now.</span>
          </span>
          <span className="block overflow-hidden pb-1">
            <span className="inline-block animate-word-rise italic" style={{ animationDelay: "500ms" }}>Distribution&nbsp;</span>
            <span className="inline-block animate-word-rise" style={{ animationDelay: "580ms" }}>isn&apos;t.</span>
          </span>
        </h1>

        <div className="mt-8 flex flex-col items-start gap-5 sm:mt-10 sm:flex-row sm:items-center sm:gap-6">
          <p className="rise delay-4 t-lead">
            AI has made it easier than ever to ship. We help you get seen —
            across global and Asia media.
          </p>
        </div>

        <div className="rise delay-5 mt-8 flex flex-wrap items-center gap-4 sm:mt-10">
          <InteractiveButton href="#packages" className="cta-primary" magnetic={true} glow={true}>
            View packages <span aria-hidden className="arr">→</span>
          </InteractiveButton>
          <InteractiveButton href="#platform" className="cta-outline" magnetic={true} glow={true}>
            Explore platform
          </InteractiveButton>
        </div>
        <div className="rise delay-6 mt-12 hidden items-center gap-3 md:flex">
          <span className="font-mono text-[10px] uppercase tracking-[var(--tracking-widest)] text-[var(--paper-muted)]">Scroll to begin</span>
          <span className="draw-line-v relative overflow-hidden block">
            <span className="absolute top-0 left-0 w-full h-[8px] bg-[var(--accent)] animate-scroll-line" />
          </span>
        </div>
      </div>

      {/* Bottom-right: "Get featured across" badge with publication ticker */}
      <div
        aria-label="Get featured across"
        className="absolute bottom-8 right-6 z-10 hidden max-w-[36rem] rounded-[4px] border border-[var(--rule-strong)] bg-[var(--ink)]/65 px-5 py-4 backdrop-blur-md sm:right-10 lg:bottom-10 lg:right-16 lg:block"
      >
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[var(--tracking-widest)] text-[var(--paper-muted)]">
          Get featured across
        </p>
        <div className="overflow-hidden">
          <div className="ticker-h flex w-max items-center gap-5 whitespace-nowrap">
            {[...FEATURED, ...FEATURED].map((name, i) => (
              <span key={`${name}-${i}`} className="flex items-center gap-5 text-sm text-[var(--paper)]">
                {name}
                <span aria-hidden className="inline-block h-[3px] w-[3px] rounded-full bg-[var(--accent)]/70" />
              </span>
            ))}
          </div>
        </div>
        <style>{`
          @keyframes ticker-h-scroll {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
          .ticker-h { animation: ticker-h-scroll 30s linear infinite; }
          @keyframes scroll-line-anim {
            0% { transform: translateY(-8px); }
            80%, 100% { transform: translateY(40px); }
          }
          .animate-scroll-line { animation: scroll-line-anim 2.5s cubic-bezier(0.32, 0.72, 0, 1) infinite; }
        `}</style>
      </div>
    </section>
  );
}
