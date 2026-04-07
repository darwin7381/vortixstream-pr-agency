import React, { useEffect, useRef, useState } from 'react';
import {
    DollarSign,
    TrendingUp,
    ShieldCheck,
    Globe2
} from 'lucide-react';

export default function WhyPartnerSection() {
    const [isVisible, setIsVisible] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);
    const sectionRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

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

    // Mouse tracking for dynamic effects
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setMousePosition({
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                });
            }
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener('mousemove', handleMouseMove);
            return () => container.removeEventListener('mousemove', handleMouseMove);
        }
    }, []);

    const features = [
        {
            title: "Monetize Your Content",
            description: "Generate revenue through our premium content syndication network with competitive payout rates.",
            icon: DollarSign,
            color: "#FF7400",
            gradient: "from-[#FF7400] to-[#E6690A]",
            delay: "200ms"
        },
        {
            title: "Boost Your Reach",
            description: "Access high-quality news content that keeps your audience engaged and coming back for more.",
            icon: TrendingUp,
            color: "#8B5CF6",
            gradient: "from-[#8B5CF6] to-[#7C3AED]",
            delay: "300ms"
        },
        {
            title: "Quality Assurance",
            description: "All content goes through our rigorous editorial review process to ensure accuracy and relevance.",
            icon: ShieldCheck,
            color: "#10B981",
            gradient: "from-[#10B981] to-[#059669]",
            delay: "400ms"
        },
        {
            title: "Global Network",
            description: "Join a worldwide network of trusted publishers and media organizations.",
            icon: Globe2,
            color: "#1D3557",
            gradient: "from-[#1D3557] to-[#0F1E2E]",
            delay: "500ms"
        }
    ];

    return (
        <section ref={sectionRef} className="relative w-full py-24 lg:py-32 bg-black overflow-hidden">
            {/* Enhanced CSS Animations */}
            <style>{`
                @keyframes float-in-up {
                    0% { 
                        opacity: 0; 
                        transform: translateY(50px) scale(0.95);
                        filter: blur(10px);
                    }
                    60% {
                        opacity: 0.8;
                        transform: translateY(-5px) scale(1.01);
                    }
                    100% { 
                        opacity: 1; 
                        transform: translateY(0) scale(1);
                        filter: blur(0);
                    }
                }
                
                @keyframes card-glow-pulse {
                    0%, 100% { 
                        box-shadow: 0 0 20px rgba(255,116,0,0.1), 0 0 40px rgba(255,116,0,0.05);
                    }
                    50% { 
                        box-shadow: 0 0 30px rgba(255,116,0,0.2), 0 0 60px rgba(255,116,0,0.1), 0 0 80px rgba(255,116,0,0.05);
                    }
                }
                
                @keyframes icon-float {
                    0%, 100% {
                        transform: translateY(0px) rotate(0deg);
                    }
                    25% {
                        transform: translateY(-4px) rotate(2deg);
                    }
                    50% {
                        transform: translateY(-8px) rotate(0deg);
                    }
                    75% {
                        transform: translateY(-4px) rotate(-2deg);
                    }
                }
                
                @keyframes particle-drift {
                    0% {
                        transform: translate(0, 0) scale(1);
                        opacity: 0;
                    }
                    20% {
                        opacity: 1;
                    }
                    80% {
                        opacity: 1;
                    }
                    100% {
                        transform: translate(var(--tx), var(--ty)) scale(0.8);
                        opacity: 0;
                    }
                }
                
                @keyframes gradient-shift {
                    0%, 100% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                }
                
                @keyframes border-dance {
                    0%, 100% {
                        background-position: 0% 0%;
                    }
                    50% {
                        background-position: 100% 100%;
                    }
                }
                
                .fancy-card {
                    position: relative;
                    transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                
                .fancy-card::before {
                    content: '';
                    position: absolute;
                    inset: -2px;
                    border-radius: 1.25rem;
                    padding: 2px;
                    background: linear-gradient(135deg, transparent, rgba(255,116,0,0.3), transparent);
                    background-size: 200% 200%;
                    -webkit-mask: 
                        linear-gradient(#fff 0 0) content-box, 
                        linear-gradient(#fff 0 0);
                    -webkit-mask-composite: xor;
                    mask-composite: exclude;
                    opacity: 0;
                    transition: opacity 0.5s;
                    animation: border-dance 3s linear infinite;
                }
                
                .fancy-card:hover::before {
                    opacity: 1;
                }
                
                .fancy-card:hover {
                    transform: translateY(-12px) scale(1.02);
                }
                
                .fancy-card:hover .icon-orb {
                    animation: icon-float 3s ease-in-out infinite;
                }
                
                .fancy-card.is-hovered {
                    animation: card-glow-pulse 2s ease-in-out infinite;
                }
                
                .connection-line {
                    position: absolute;
                    height: 2px;
                    background: linear-gradient(90deg, transparent, rgba(255,116,0,0.4), transparent);
                    transform-origin: left center;
                    opacity: 0;
                    transition: opacity 0.3s;
                }
                
                .fancy-card:hover ~ .connection-line {
                    opacity: 1;
                }
            `}</style>

            {/* Dynamic Background System */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Animated Grid */}
                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(255,116,0,0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,116,0,0.5) 1px, transparent 1px)
                        `,
                        backgroundSize: '60px 60px',
                        backgroundPosition: 'center center'
                    }}
                />
                
                {/* Dynamic Gradient Orbs */}
                <div 
                    className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full blur-[150px] opacity-20"
                    style={{
                        background: 'radial-gradient(circle, #FF7400 0%, transparent 70%)',
                        animation: 'gradient-shift 8s ease-in-out infinite',
                        backgroundSize: '200% 200%'
                    }}
                />
                <div 
                    className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-[130px] opacity-15"
                    style={{
                        background: 'radial-gradient(circle, #8B5CF6 0%, transparent 70%)',
                        animation: 'gradient-shift 10s ease-in-out infinite reverse',
                        backgroundSize: '200% 200%'
                    }}
                />
                <div 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px] opacity-10"
                    style={{
                        background: 'radial-gradient(circle, #1D3557 0%, transparent 70%)',
                        animation: 'gradient-shift 12s ease-in-out infinite',
                        backgroundSize: '200% 200%'
                    }}
                />
                
                {/* Floating Particles */}
                {isVisible && [...Array(30)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            opacity: Math.random() * 0.5,
                            '--tx': `${(Math.random() - 0.5) * 200}px`,
                            '--ty': `${(Math.random() - 0.5) * 200}px`,
                            animation: `particle-drift ${8 + Math.random() * 8}s ease-in-out infinite`,
                            animationDelay: `${Math.random() * 5}s`
                        } as React.CSSProperties}
                    />
                ))}
            </div>

            <div 
                ref={containerRef}
                className="container relative z-10 px-6 mx-auto max-w-[1280px]"
            >
                {/* Enhanced Header */}
                <div className="max-w-3xl mx-auto text-center mb-20">
                    <h2
                        className="text-4xl md:text-5xl lg:text-6xl font-medium font-heading text-white tracking-tight mb-6 relative"
                        style={{
                            animation: isVisible ? 'float-in-up 1s ease-out forwards' : 'none',
                            opacity: 0
                        }}
                    >
                        <span className="relative inline-block">
                            Why Partner with{' '}
                            <span 
                                className="relative inline-block"
                                style={{
                                    background: 'linear-gradient(135deg, #FF7400 0%, #E6690A 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text'
                                }}
                            >
                                VortixPR
                            </span>
                            ?
                            {/* Decorative glow */}
                            <div 
                                className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FF7400] to-transparent opacity-50 blur-sm"
                                style={{
                                    animation: isVisible ? 'gradient-shift 3s ease-in-out infinite' : 'none',
                                    backgroundSize: '200% 100%'
                                }}
                            />
                        </span>
                    </h2>
                    <p
                        className="text-lg md:text-xl text-white/70 font-sans leading-relaxed max-w-2xl mx-auto"
                        style={{
                            animation: isVisible ? 'float-in-up 1s ease-out forwards 300ms' : 'none',
                            opacity: 0
                        }}
                    >
                        Join our premium content syndication network and unlock new revenue streams while expanding your global reach.
                    </p>
                </div>

                {/* Enhanced Feature Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className={`fancy-card group ${hoveredCard === index ? 'is-hovered' : ''}`}
                            style={{
                                animation: isVisible ? `float-in-up 1s ease-out forwards ${feature.delay}` : 'none',
                                opacity: 0
                            }}
                            onMouseEnter={() => setHoveredCard(index)}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            {/* Card Background with Gradient */}
                            <div className="relative p-8 lg:p-10 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] via-white/[0.02] to-transparent backdrop-blur-sm overflow-hidden">
                                
                                {/* Dynamic Hover Glow */}
                                <div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                                    style={{
                                        background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, ${feature.color}20, transparent 50%)`
                                    }}
                                />
                                
                                {/* Animated Border Gradient */}
                                <div
                                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                    style={{
                                        background: `linear-gradient(135deg, transparent, ${feature.color}30, transparent)`,
                                        backgroundSize: '200% 200%',
                                        animation: 'gradient-shift 3s linear infinite'
                                    }}
                                />
                                
                                {/* Content */}
                                <div className="relative z-10 flex flex-col items-start gap-6">
                                    {/* Enhanced Icon Container */}
                                    <div className="relative">
                                        {/* Icon Background Glow */}
                                        <div 
                                            className="icon-orb absolute inset-0 rounded-2xl opacity-50 blur-xl group-hover:opacity-80 transition-opacity duration-500"
                                            style={{
                                                background: `linear-gradient(135deg, ${feature.color}, transparent)`,
                                            }}
                                        />
                                        
                                        {/* Icon Container */}
                                        <div
                                            className={`icon-orb relative w-16 h-16 rounded-2xl flex items-center justify-center border border-white/20 bg-gradient-to-br ${feature.gradient} group-hover:scale-110 transition-all duration-500 shadow-lg`}
                                        >
                                            <feature.icon 
                                                className="w-8 h-8 text-white relative z-10" 
                                                strokeWidth={2}
                                            />
                                        </div>
                                        
                                        {/* Orbiting Particles */}
                                        {hoveredCard === index && (
                                            <>
                                                <div 
                                                    className="absolute w-2 h-2 rounded-full"
                                                    style={{
                                                        background: feature.color,
                                                        animation: 'particle-orbit-1 3s linear infinite',
                                                        top: '50%',
                                                        left: '50%',
                                                        marginLeft: '-4px',
                                                        marginTop: '-4px'
                                                    }}
                                                />
                                                <div 
                                                    className="absolute w-1.5 h-1.5 rounded-full"
                                                    style={{
                                                        background: feature.color,
                                                        animation: 'particle-orbit-2 4s linear infinite',
                                                        top: '50%',
                                                        left: '50%',
                                                        marginLeft: '-3px',
                                                        marginTop: '-3px'
                                                    }}
                                                />
                                            </>
                                        )}
                                    </div>

                                    {/* Text Content */}
                                    <div className="space-y-3">
                                        <h3 
                                            className="text-2xl lg:text-3xl font-medium font-heading text-white group-hover:text-[#FF7400] transition-colors duration-300"
                                        >
                                            {feature.title}
                                        </h3>
                                        <p className="text-base lg:text-lg text-white/70 leading-relaxed font-sans group-hover:text-white/90 transition-colors duration-300">
                                            {feature.description}
                                        </p>
                                    </div>
                                    
                                    {/* Hover Arrow Indicator */}
                                    <div className="mt-2 flex items-center gap-2 text-[#FF7400] opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-2 transition-all duration-300">
                                        <span className="text-sm font-medium font-sans">Learn more</span>
                                        <svg 
                                            className="w-4 h-4" 
                                            fill="none" 
                                            viewBox="0 0 24 24" 
                                            stroke="currentColor"
                                        >
                                            <path 
                                                strokeLinecap="round" 
                                                strokeLinejoin="round" 
                                                strokeWidth={2} 
                                                d="M13 7l5 5m0 0l-5 5m5-5H6" 
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA - Optional */}
                <div 
                    className="mt-20 text-center"
                    style={{
                        animation: isVisible ? 'float-in-up 1s ease-out forwards 800ms' : 'none',
                        opacity: 0
                    }}
                >
                    <p className="text-white/60 font-sans mb-6">
                        Ready to amplify your content reach?
                    </p>
                    <button 
                        className="group relative px-8 py-4 bg-gradient-to-r from-[#FF7400] to-[#E6690A] rounded-xl text-white font-semibold font-sans overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,116,0,0.4)]"
                    >
                        <span className="relative z-10">Become a Publisher Partner</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-[#E6690A] to-[#FF7400] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>
                </div>
            </div>
        </section>
    );
}
