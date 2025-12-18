import { useState, useEffect, useRef } from 'react';

// Premium Check Icon
const CheckIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 6L9 17L4 12" stroke="#FF7400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default function LyroSection() {
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
        <section ref={sectionRef} className="relative w-full overflow-hidden py-section-large">

            {/* --- INJECTED STYLES: PREMIUM BLUR MOTION --- */}
            <style>{`
                @keyframes blur-slide-up {
                    0% { opacity: 0; transform: translateY(20px); filter: blur(10px); }
                    100% { opacity: 1; transform: translateY(0); filter: blur(0); }
                }
                @keyframes float-slow {
                    0% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0); }
                }
                .animate-reveal { animation: blur-slide-up 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
                .delay-100 { animation-delay: 100ms; }
                .delay-200 { animation-delay: 200ms; }
                .delay-300 { animation-delay: 300ms; }
                .delay-500 { animation-delay: 500ms; }
                .delay-700 { animation-delay: 700ms; }
            `}</style>

            {/* --- BACKGROUND: EXACT MATCH TO SERVICES SECTION --- */}
            {/* Extended Cosmic Background with Smooth Transition */}
            <div
                className="absolute inset-0 opacity-100"
                style={{
                    background: `
                    radial-gradient(circle at 15% 20%, rgba(29, 53, 87, 0.18) 0%, transparent 45%),
                    radial-gradient(circle at 85% 30%, rgba(255, 116, 0, 0.12) 0%, transparent 50%),
                    radial-gradient(circle at 50% 40%, rgba(29, 53, 87, 0.15) 0%, transparent 35%),
                    radial-gradient(circle at 30% 70%, rgba(255, 116, 0, 0.08) 0%, transparent 40%),
                    linear-gradient(135deg, #000000 0%, #16213e 15%, #1a1a2e 30%, #0f0f23 45%, #1a1a2e 60%, #161616 75%, #191919 90%, #191919 100%)
                  `
                }}
            />
            {/* Floating Particles (Atmosphere) */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(25)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            opacity: Math.random() * 0.2,
                            animation: `float-slow ${4 + Math.random() * 4}s ease-in-out infinite`,
                            animationDelay: `${Math.random() * 3}s`
                        }}
                    />
                ))}
            </div>
            {/* Grid Overlay (Structure) */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: `
                    linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
                  `,
                    backgroundSize: '60px 60px',
                    opacity: 0.6,
                    mask: 'radial-gradient(circle at center, white 0%, transparent 80%)',
                    WebkitMask: 'radial-gradient(circle at center, white 0%, transparent 80%)'
                }}
            />


            {/* --- CONTENT CONTAINER --- */}
            <div className="relative z-10 container-global">
                <div className="container-large">

                    {/* Header */}
                    <div className={`mb-12 md:mb-16 opacity-0 ${isVisible ? 'animate-reveal' : ''}`}>
                        <div className="inline-flex items-center gap-3 mb-4">
                            <div className="w-2 h-2 rounded-full bg-[#FF7400] shadow-[0_0_10px_#FF7400] animate-pulse"></div>
                            <span className="text-[14px] text-[#FF7400] font-mono tracking-widest uppercase font-bold">
                                #lyro
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium text-white font-['Space_Grotesk:Medium'] tracking-tight">
                            Lyro — Al Narrative Engine <span className="text-gray-500 font-light text-3xl md:text-4xl lg:text-5xl ml-2 opacity-80">(Coming Soon)</span>
                        </h2>
                    </div>

                    {/* Split Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">

                        {/* Left: Paragraph */}
                        <div className={`prose prose-lg prose-invert text-gray-200 opacity-0 ${isVisible ? 'animate-reveal delay-200' : ''}`}>
                            <p className="text-xl md:text-2xl font-['Noto_Sans:Regular'] leading-relaxed opacity-90">
                                Lyro is our internal AI tool that analyzes your announcement before distribution. It checks for clarity, angle suitability, and how well LLMs can surface your story in search, news, and AI feeds.
                            </p>
                        </div>

                        {/* Right: Bullets */}
                        <div className="flex flex-col gap-8 opacity-0" style={{ animation: isVisible ? 'blur-slide-up 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards 400ms' : 'none' }}>
                            <div className="relative">
                                {/* Label */}
                                <h3 className="text-sm font-mono text-gray-400 uppercase tracking-widest mb-6 border-b border-white/10 pb-2 w-fit">
                                    System Capabilities
                                </h3>

                                <ul className="space-y-6">
                                    {[
                                        "Narrative optimization",
                                        "Media angle suggestions",
                                        "LLM visibility forecasting",
                                        "Asia geo-angle adjustments"
                                    ].map((item, index) => (
                                        <li
                                            key={index}
                                            className="group flex items-center gap-4 text-lg md:text-xl text-white font-['Space_Grotesk:Medium'] tracking-wide opacity-0"
                                            style={{
                                                animation: isVisible ? `blur-slide-up 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards ${600 + (index * 100)}ms` : 'none'
                                            }}
                                        >
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#FF7400]/10 flex items-center justify-center border border-[#FF7400]/20 transition-all duration-300 group-hover:bg-[#FF7400]/20 group-hover:border-[#FF7400]">
                                                <CheckIcon />
                                            </div>
                                            <span className="transition-all duration-300 group-hover:text-gray-100">{item}</span>
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
