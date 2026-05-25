"use client";

import { useEffect, useRef, useState } from "react";

const PUBLICATIONS = ["TechCrunch", "WIRED", "VentureBeat", "Product Hunt", "ars Technica", "IEEE", "MIT Tech Review"];

export default function LogoStrip() {
  const ticker = [...PUBLICATIONS, ...PUBLICATIONS, ...PUBLICATIONS];
  const trackRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const x = useRef(0);
  const currentSpeed = useRef(1);

  useEffect(() => {
    let active = true;
    const track = trackRef.current;
    if (!track) return;

    // We calculate a baseline step increment.
    // 0.65px per frame moves the track at a steady premium speed.
    const step = () => {
      if (!active) return;

      const targetSpeed = isHovered ? 1.18 : 1.0;
      // Lerp transition (0.05 factor gives a beautifully smooth 1-second slide to accelerated speed)
      currentSpeed.current += (targetSpeed - currentSpeed.current) * 0.05;

      x.current -= 0.65 * currentSpeed.current;

      const totalWidth = track.scrollWidth;
      const thirdWidth = totalWidth / 3;
      if (Math.abs(x.current) >= thirdWidth) {
        x.current = 0;
      }

      track.style.transform = `translate3d(${x.current}px, 0, 0)`;
      requestAnimationFrame(step);
    };

    requestAnimationFrame(step);

    return () => {
      active = false;
    };
  }, [isHovered]);

  return (
    <section
      aria-label="As seen in"
      className="relative overflow-hidden bg-[var(--ink)] py-14 sm:py-16"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="mx-auto mb-8 w-full max-w-[100rem] px-6 sm:px-10 lg:px-16">
        <p className="font-mono text-[length:var(--text-meta)] uppercase tracking-[var(--tracking-widest)] text-[var(--paper-muted)]">
          As seen in
        </p>
      </div>

      <div className="relative overflow-hidden border-y border-[var(--rule)] py-8 sm:py-10">
        {/* Side fades */}
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-[var(--ink)] to-transparent" />
        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-[var(--ink)] to-transparent" />

        <div
          ref={trackRef}
          className="flex w-max items-center gap-14 sm:gap-20"
          style={{ willChange: "transform" }}
        >
          {ticker.map((name, i) => (
            <span key={`${name}-${i}`} className="flex items-center gap-14 sm:gap-20">
              <span
                className="t-quote text-[var(--paper)] opacity-80 sm:text-[2rem] tracking-[var(--tracking-tight)] italic"
                style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontOpticalSizing: "auto" }}
              >
                {name}
              </span>
              <span aria-hidden className="text-[var(--accent)]/40 text-2xl">·</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
