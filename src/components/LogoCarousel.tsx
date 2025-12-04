import svgPaths from "../imports/svg-f7gq800qcd";

export default function LogoCarousel() {
  const PlaceholderLogo = ({ variant }: { variant: 'a' | 'b' }) => (
    <div className="h-12 md:h-14 w-[120px] md:w-[140px] flex-shrink-0">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 140 56">
        {variant === 'a' ? (
          <g>
            <path
              clipRule="evenodd"
              d={svgPaths.pa2af180}
              fill="white"
              fillRule="evenodd"
            />
            <path d={svgPaths.p17de2200} fill="white" />
            <path
              clipRule="evenodd"
              d={svgPaths.p13bdce00}
              fill="white"
              fillRule="evenodd"
            />
            <path d={svgPaths.p28c4400} fill="white" />
            <path
              clipRule="evenodd"
              d={svgPaths.p240e7470}
              fill="white"
              fillRule="evenodd"
            />
            <path d={svgPaths.p29af83f0} fill="white" />
            <path
              clipRule="evenodd"
              d={svgPaths.p3e155c00}
              fill="white"
              fillRule="evenodd"
            />
            <path d={svgPaths.p2759ce70} fill="white" />
          </g>
        ) : (
          <path
            clipRule="evenodd"
            d={svgPaths.p36cda200}
            fill="white"
            fillRule="evenodd"
          />
        )}
      </svg>
    </div>
  );

  // Create the logo sequence that will repeat
  const logoSequence = [
    { variant: 'a' as const, text: 'Webflow' },
    { variant: 'b' as const, text: 'Relume' },
    { variant: 'a' as const, text: 'Webflow' },
    { variant: 'b' as const, text: 'Relume' },
    { variant: 'a' as const, text: 'Webflow' },
    { variant: 'b' as const, text: 'Relume' },
    { variant: 'a' as const, text: 'Webflow' }
  ];

  return (
    <section className="relative w-full overflow-hidden py-8 md:py-12">
      {/* Subtle Cosmic Background for Continuity */}
      <div 
        className="absolute inset-0 opacity-60"
        style={{
          background: `
            radial-gradient(circle at 25% 30%, rgba(255, 116, 0, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 75% 70%, rgba(29, 53, 87, 0.12) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(255, 116, 0, 0.05) 0%, transparent 40%),
            linear-gradient(135deg, #000000 0%, #1a1a2e 30%, #16213e 50%, #1a1a2e 70%, #000000 100%)
          `
        }}
      />
      
      {/* Light Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-15"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float-particle ${4 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>
      
      {/* Very Subtle Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-3"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Small Subtitle - Following Project Design Pattern */}
        <div className="text-center mb-6 md:mb-8 px-5 md:px-16">
          <p className="text-[11px] md:text-[16px] text-white/70 font-['Noto_Sans:Regular'] leading-[1.4]">
            Selected crypto, tech, AI and regional outlets we work with.
          </p>
        </div>
        
        {/* Full Width Carousel Container */}
        <div className="relative w-full overflow-hidden">
          {/* Carousel Track */}
          <div 
            className="flex items-center gap-8 md:gap-12"
            style={{
              animation: 'logo-scroll 30s linear infinite',
              width: 'max-content'
            }}
          >
            {/* First set of logos */}
            {logoSequence.map((logo, index) => (
              <div key={`set1-${index}`} className="flex items-center gap-8 md:gap-12">
                <PlaceholderLogo variant={logo.variant} />
              </div>
            ))}
            
            {/* Second set of logos (duplicate for seamless loop) */}
            {logoSequence.map((logo, index) => (
              <div key={`set2-${index}`} className="flex items-center gap-8 md:gap-12">
                <PlaceholderLogo variant={logo.variant} />
              </div>
            ))}
            
            {/* Third set of logos (duplicate for seamless loop) */}
            {logoSequence.map((logo, index) => (
              <div key={`set3-${index}`} className="flex items-center gap-8 md:gap-12">
                <PlaceholderLogo variant={logo.variant} />
              </div>
            ))}
          </div>
        </div>
        
        {/* Gradient Overlays to fade edges */}
        <div className="absolute top-0 left-0 w-32 md:w-48 h-full bg-gradient-to-r from-black via-black/50 to-transparent pointer-events-none z-20" />
        <div className="absolute top-0 right-0 w-32 md:w-48 h-full bg-gradient-to-l from-black via-black/50 to-transparent pointer-events-none z-20" />
      </div>
    </section>
  );
}