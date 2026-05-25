import Link from "next/link";
import InteractiveButton from "@/components/layout/InteractiveButton";

/**
 * Floating glass pill nav — rendered at root (outside any section with overflow-hidden
 * or its own stacking context) so it persists across the entire scroll, not just Hero.
 */
export default function FloatingNav() {
  return (
    <header className="fixed inset-x-0 top-4 z-[100] mx-auto flex w-[calc(100%-2rem)] max-w-[78rem] items-center justify-between gap-6 rounded-full border border-[var(--rule-strong)] bg-[var(--ink)]/55 px-5 py-3 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_8px_40px_-8px_rgba(0,0,0,0.6)] sm:px-7 sm:py-3.5">
      <Link href="/" className="text-base text-[var(--paper)]" style={{ fontFamily: "var(--font-onest), sans-serif" }}>
        <span aria-hidden className="mr-2 text-[var(--accent)] text-lg">❖</span>
        <span className="font-medium tracking-tight">vortix</span>
        <span className="ml-1 italic text-[var(--paper-muted)]" style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}>pr</span>
      </Link>
      <nav className="flex items-center gap-5 text-[length:var(--text-caption)] text-[var(--paper)] sm:gap-7" style={{ fontFamily: "var(--font-onest), sans-serif" }}>
        <Link href="#why" className="hidden text-[var(--paper-muted)] hover:text-[var(--paper)] transition-colors duration-300 ease-[var(--ease-editorial)] sm:inline relative group py-1">
          About
          <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[var(--accent)] transition-all duration-300 group-hover:w-full" />
        </Link>
        <Link href="#services" className="hidden text-[var(--paper-muted)] hover:text-[var(--paper)] transition-colors duration-300 ease-[var(--ease-editorial)] sm:inline relative group py-1">
          Services
          <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[var(--accent)] transition-all duration-300 group-hover:w-full" />
        </Link>
        <Link href="#packages" className="hidden text-[var(--paper-muted)] hover:text-[var(--paper)] transition-colors duration-300 ease-[var(--ease-editorial)] sm:inline relative group py-1">
          Packages
          <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[var(--accent)] transition-all duration-300 group-hover:w-full" />
        </Link>
        <Link href="#clients" className="hidden text-[var(--paper-muted)] hover:text-[var(--paper)] transition-colors duration-300 ease-[var(--ease-editorial)] sm:inline relative group py-1">
          Clients
          <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[var(--accent)] transition-all duration-300 group-hover:w-full" />
        </Link>
        <InteractiveButton
          href="#contact"
          className="cta-primary-sm"
          magnetic={true}
          glow={false}
        >
          Get started <span aria-hidden className="arr">→</span>
        </InteractiveButton>
      </nav>
    </header>
  );
}
