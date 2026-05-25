"use client";

import { useState } from "react";

const SERVICES = [
  {
    roman: "I.",
    name: "Global press distribution",
    body: "Distribution across AI, tech, startup, and global media outlets — pitched to reporters who already cover your space, not a spray-and-pray wire.",
    tag: "TIER-1 PLACEMENT",
    code: "PL-T1",
  },
  {
    roman: "II.",
    name: "PR & narrative strategy",
    body: "We shape your story so it's clear, relevant, and picked up by media. Positioning before pitching — every time.",
    tag: "NARRATIVE",
    code: "STR-N",
  },
  {
    roman: "III.",
    name: "Asia localization & outreach",
    body: "Regional distribution across CN, KR, JP, and SEA with localized messaging — not Google-translated press kits.",
    tag: "REGIONAL",
    code: "REG-A",
  },
  {
    roman: "IV.",
    name: "Founder & personal branding",
    body: "Build credibility through interviews, articles, and thought leadership. Long-lead features that turn founders into category protagonists.",
    tag: "FOUNDER",
    code: "FND-B",
  },
];

export default function Services() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section
      id="services"
      aria-labelledby="services-title"
      className="relative section-pad-strip-bottom text-[var(--paper)] scroll-mt-[120px]"
    >
      <div className="section-container">
        
        {/* Full-width editorial header row */}
        <div className="flex flex-col border-b border-[var(--rule)] pb-10 mb-16 rise delay-1">
          <p className="eyebrow">
            <span className="eyebrow-num">03</span>
            <span>Services</span>
          </p>
          <div className="eyebrow-line-draw max-w-[80px] mt-2 h-[1px] bg-[var(--gold)]" />
          
          <h2 id="services-title" className="t-h2 mt-6 lg:mt-8">
            How it <span className="italic text-[var(--accent)]">works.</span>
          </h2>
          
          <p className="t-lead mt-6">
            Whether you&apos;re shipping fast, experimenting, or vibe coding your
            next idea, Vortix helps your story reach the right audience.
          </p>
          
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <a href="#packages" className="cta-primary">
              View packages <span aria-hidden className="arr">→</span>
            </a>
            <a href="#contact" className="cta-link">
              Talk to a specialist <span aria-hidden className="arr">→</span>
            </a>
          </div>
        </div>

        {/* WIDESCREEN EDITORIAL DOSSIER PANELS */}
        <div className="flex flex-col border-b border-[var(--rule)] rise delay-2">
          {SERVICES.map((service, index) => {
            const isHovered = hoveredIndex === index;
            
            return (
              <article
                key={service.code}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="group relative w-full border-t border-[var(--rule)] py-12 px-6 sm:px-8 lg:px-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8 cursor-pointer overflow-hidden transition-all duration-deliberate ease-editorial"
              >
                {/* Cinematic Left-edge Aperture Border */}
                <div 
                  className={`absolute left-0 top-0 bottom-0 w-[3px] bg-[var(--accent)] origin-center transition-transform duration-deliberate ease-editorial ${
                    isHovered ? "scale-y-100" : "scale-y-0"
                  }`} 
                />

                {/* Cinematic Painterly Ambient Glow */}
                <div 
                  className={`absolute inset-0 bg-gradient-to-r from-[rgba(213,138,77,0.03)] to-transparent pointer-events-none transition-opacity duration-deliberate ease-editorial ${
                    isHovered ? "opacity-100" : "opacity-0"
                  }`} 
                />

                {/* 1. Meta / Structural Column */}
                <div className="flex items-baseline gap-4 lg:w-[15%] select-none">
                  <span className="t-num-display text-[var(--paper-faint)] group-hover:text-[var(--accent)] group-hover:translate-x-1 transition-all duration-deliberate ease-editorial">
                    {service.roman}
                  </span>
                  <span className="font-mono text-[10px] text-[var(--gold)] opacity-60 group-hover:opacity-100 transition-opacity duration-deliberate uppercase tracking-[var(--tracking-wide)]">
                    [{service.code}]
                  </span>
                </div>

                {/* 2. Core Service Heading Column */}
                <div className="flex flex-col lg:w-[38%]">
                  <span className="font-mono text-[length:var(--text-meta)] text-[var(--gold)] uppercase tracking-[var(--tracking-widest)] mb-2 block">
                    {service.tag}
                  </span>
                  <h3 className="t-h3 font-display italic text-[var(--paper)] group-hover:text-[var(--accent)] transition-colors duration-deliberate ease-editorial">
                    {service.name}
                  </h3>
                </div>

                {/* 3. Detailed Prose Description Column */}
                <div className="flex items-center justify-between lg:w-[47%]">
                  <p className="t-body text-[var(--paper-muted)] group-hover:text-[var(--paper)] transition-colors duration-deliberate ease-editorial leading-relaxed max-w-[48ch]">
                    {service.body}
                  </p>
                  
                  {/* Subtle Interactive Arrow Indicator */}
                  <span className="font-mono text-[var(--gold)] opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-deliberate ease-editorial hidden lg:inline-block ml-8 select-none">
                    [ → ]
                  </span>
                </div>

              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
}
