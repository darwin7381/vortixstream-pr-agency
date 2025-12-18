import { useState, useEffect, useRef } from 'react';

// Premium Check Icon
const CheckIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 6L9 17L4 12" stroke="#FF7400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default function LyroSection() {
    // Kept for corner animations, but content is safe now
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsVisible(true);
            },
            { threshold: 0.1 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section ref={sectionRef} className="relative w-full overflow-hidden py-section-large bg-[#050508]">

            {/* --- INJECTED STYLES: TECH DECOR ONLY (Safe) --- */}
            <style>{`
                @keyframes rotate-slow {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes scan-flash {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 1; }
                }
                .tech-ring {
                    border: 1px dashed rgba(255, 255, 255, 0.08);
                    border-radius: 50%;
                }
            `}</style>

            {/* --- BACKGROUND STACK (Verified Services Gradient) --- */}
            <div
                className="absolute inset-0 opacity-100"
                style={{
                    background: `
                    radial-gradient(circle at 15% 20%, rgba(29, 53, 87, 0.18) 0%, transparent 45%),
                    radial-gradient(circle at 85% 30%, rgba(255, 116, 0, 0.12) 0%, transparent 50%),
                    radial-gradient(circle at 50% 40%, rgba(29, 53, 87, 0.15) 0%, transparent 35%),
                    linear-gradient(135deg, #000000 0%, #16213e 15%, #1a1a2e 30%, #0f0f23 45%, #1a1a2e 60%, #161616 75%, #191919 90%, #191919 100%)
                  `
                }}
            />

            {/* THE ENGINE (Tech Rings) - Kept as they work well */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none opacity-100">
                <div
                    className="absolute inset-0 tech-ring"
                    style={{ animation: 'rotate-slow 60s linear infinite' }}
                />
                <div
                    className="absolute inset-[15%] tech-ring"
                    style={{ animation: 'rotate-slow 40s linear infinite reverse' }}
                />
            </div>
            {/* Right Side Ring */}
            <div className="absolute top-1/2 -right-[200px] -translate-y-1/2 w-[600px] h-[600px] pointer-events-none opacity-100">
                <div
                    className="absolute inset-0 tech-ring opacity-50"
                    style={{ animation: 'rotate-slow 50s linear infinite' }}
                />
            </div>

            {/* Grid Overlay */}
            <div className="absolute inset-0 pointer-events-none">
                <div
                    className="absolute inset-0 pointer-events-none opacity-40"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
                        backgroundSize: '60px 60px',
                        mask: 'radial-gradient(circle at center, white 0%, transparent 80%)',
                        WebkitMask: 'radial-gradient(circle at center, white 0%, transparent 80%)'
                    }}
                />
            </div>

            {/* --- CONTENT CONTAINER --- */}
            <div className="relative z-10 container-global">
                <div className="container-large relative">

                    {/* Header - SOLID WHITE (Fixed Visibility) */}
                    <div className="mb-12 md:mb-16">
                        <div className="inline-flex items-center gap-3 mb-4">
                            <div className="w-2 h-2 rounded-full bg-[#FF7400] shadow-[0_0_10px_#FF7400] animate-[scan-flash_3s_ease-in-out_infinite]"></div>
                            <span className="text-[14px] text-[#FF7400] font-mono tracking-widest uppercase font-bold">
                                #lyro_engine
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium text-white font-['Space_Grotesk:Medium'] tracking-tight">
                            Lyro — Al Narrative Engine
                            <span className="block mt-2 text-gray-500 font-light text-3xl md:text-4xl lg:text-5xl opacity-80">(Coming Soon)</span>
                        </h2>
                    </div>

                    {/* Split Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">

                        {/* Left: Paragraph - LIGHTER COLOR (Fixed Visibility) */}
                        <div className="prose prose-lg prose-invert text-gray-100">
                            <p className="text-xl md:text-2xl font-['Noto_Sans:Regular'] leading-relaxed opacity-100">
                                Lyro is our internal AI tool that analyzes your announcement before distribution. It checks for clarity, angle suitability, and how well LLMs can surface your story in search, news, and AI feeds.
                            </p>
                        </div>

                        {/* Right: Holographic Bullets - REMOVED OPACITY ENTRANCE */}
                        <div className="flex flex-col gap-8">
                            <div className="relative">
                                {/* Label */}
                                <h3 className="text-sm font-mono text-gray-500 uppercase tracking-widest mb-6 border-b border-white/5 pb-2 w-fit">
                                    System Capabilities ::
                                </h3>

                                <ul className="space-y-4">
                                    {[
                                        "Narrative optimization",
                                        "Media angle suggestions",
                                        "LLM visibility forecasting",
                                        "Asia geo-angle adjustments"
                                    ].map((item, index) => (
                                        <li
                                            key={index}
                                            className="group relative flex items-center gap-5 p-4 rounded-lg overflow-hidden transition-all duration-300 hover:bg-white/[0.03] hover:border-white/10 border border-transparent cursor-default"
                                        >
                                            {/* Hover Glow Background */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-[#FF7400]/0 via-[#FF7400]/0 to-[#FF7400]/0 group-hover:via-[#FF7400]/5 transition-all duration-500" />

                                            <div className="relative flex-shrink-0 w-8 h-8 rounded-full bg-[#FF7400]/10 flex items-center justify-center border border-[#FF7400]/20 transition-all duration-300 group-hover:bg-[#FF7400] group-hover:border-[#FF7400] group-hover:scale-110 group-hover:shadow-[0_0_15px_#FF7400]">
                                                <CheckIcon />
                                            </div>
                                            <span className="relative text-lg md:text-xl text-white font-['Space_Grotesk:Medium'] tracking-wide transition-all duration-300 group-hover:translate-x-1 group-hover:text-shadow-sm">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
}
