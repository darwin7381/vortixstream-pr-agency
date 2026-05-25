import InteractiveButton from "@/components/layout/InteractiveButton";

export default function FinalCTA() {
  return (
    <section
      aria-labelledby="finalcta-title"
      className="relative section-pad-strip-bottom text-[var(--paper)]"
    >
      <div className="relative z-10 section-container border-t border-[var(--rule)] pt-16 sm:pt-20">
        <h2 id="finalcta-title" className="t-h2 max-w-[18ch]" style={{ textShadow: "0 1px 30px rgba(0,0,0,0.5)" }}>
          Ready to get your story{" "}
          <span className="italic">out there?</span>
        </h2>

        <p className="t-lead">
          From stealth to Series B — we get your story told in the publications
          that matter.
        </p>

        <InteractiveButton href="#contact" className="cta-primary mt-10 !px-8 !py-4 !text-base" magnetic={true} glow={true}>
          Schedule a consultation <span aria-hidden className="arr">→</span>
        </InteractiveButton>
      </div>
    </section>
  );
}
