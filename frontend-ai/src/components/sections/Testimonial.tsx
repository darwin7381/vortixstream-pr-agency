import Image from "next/image";

export default function Testimonial() {
  return (
    <section
      aria-labelledby="testimonial-title"
      className="relative min-h-[90vh] w-full overflow-hidden bg-[var(--ink)] text-[var(--paper)]"
    >
      <Image
        src="/img/gemini-wlgc.png"
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-[center_70%] opacity-80"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[var(--ink)]/55"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[var(--ink)] to-transparent"
      />

      <div className="relative z-10 mx-auto flex min-h-[90vh] w-full max-w-[100rem] flex-col justify-end px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
        <p className="font-mono text-[length:var(--text-meta)] uppercase tracking-[var(--tracking-widest)] text-[var(--highlight)]">
          <span aria-hidden className="mr-2">§</span>09 / Field note
        </p>
        <blockquote
          id="testimonial-title"
          className="mt-8 max-w-[58rem] text-[var(--paper)]"
          style={{
            fontFamily: "var(--font-fraunces), Georgia, serif",
            fontSize: "clamp(2rem, 4.2vw, 4rem)",
            lineHeight: "var(--leading-tight)",
            letterSpacing: "var(--tracking-tighter)",
            textWrap: "balance",
            fontOpticalSizing: "auto",
            textShadow:
              "0 1px 30px rgba(0,0,0,0.35), 0 2px 6px rgba(0,0,0,0.45)",
          }}
        >
          <span aria-hidden className="text-[var(--highlight)]">&ldquo;</span>
          We tried three other agencies before VortixPR.{" "}
          <span className="italic font-light">
            They were the first team that named the angle before we did
          </span>{" "}
          — and they placed the launch in The Information twelve days ahead of
          our investors' meeting.
          <span aria-hidden className="text-[var(--highlight)]">&rdquo;</span>
        </blockquote>
        <footer className="mt-10 flex flex-col gap-2 border-t border-[var(--paper)]/15 pt-5 font-mono text-[length:var(--text-meta)] uppercase tracking-[var(--tracking-widest)] text-[var(--paper)]/75 sm:flex-row sm:items-center sm:gap-6">
          <span className="text-[var(--paper)]">M. Tanaka</span>
          <span className="hidden h-[1px] w-8 bg-[var(--paper)]/35 sm:block" />
          <span>Founder · Atlas Reasoning</span>
          <span className="hidden h-[1px] w-8 bg-[var(--paper)]/35 sm:block" />
          <span>Series A · Coverage Q1 2026</span>
        </footer>
      </div>
    </section>
  );
}
