import { useState, useRef, useMemo, Suspense, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// 3D Neural Network (Fixed & Optimized)
function NeuralNetwork({ count = 40 }) {
    const pointsRef = useRef<THREE.Points>(null);

    // Generate stable points
    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const r = 5;
        for (let i = 0; i < count; i++) {
            const theta = THREE.MathUtils.randFloatSpread(360);
            const phi = THREE.MathUtils.randFloatSpread(360);
            pos[i * 3] = r * Math.sin(theta) * Math.cos(phi);
            pos[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
            pos[i * 3 + 2] = r * Math.cos(theta);
        }
        return pos;
    }, [count]);

    useFrame((state, delta) => {
        if (pointsRef.current) {
            pointsRef.current.rotation.x -= delta / 15;
            pointsRef.current.rotation.y -= delta / 20;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color="#8B5CF6"
                    size={0.15}
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={0.8}
                />
            </Points>
            {/* Secondary Layer for Depth (Orange) */}
            <Points positions={positions} stride={3} frustumCulled={false} scale={0.8}>
                <PointMaterial
                    transparent
                    color="#FF7400"
                    size={0.08}
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={0.5}
                />
            </Points>
        </group>
    );
}

// Brand-Aligned Feature Card (No Silver!)
const FeatureCard = ({ number, title, desc, delay }: any) => (
    <div
        className="group relative flex items-start gap-5 p-5 rounded-2xl border border-[#8B5CF6]/20 bg-[#0A0A0F] hover:border-[#FF7400]/50 hover:bg-[#111116] transition-all duration-500 overflow-hidden"
        style={{ animationDelay: delay }}
    >
        {/* Number Badge */}
        <div className="w-10 h-10 rounded-lg bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6] font-mono font-bold group-hover:bg-[#FF7400] group-hover:text-white transition-all duration-300 shrink-0">
            {number}
        </div>

        <div className="relative z-10">
            <h3 className="text-xl text-white font-['Space_Grotesk:Medium'] group-hover:text-[#FF7400] transition-colors duration-300">
                {title}
            </h3>
            <p className="text-sm text-white/60 font-['Noto_Sans:Regular'] mt-2 leading-relaxed opacity-80 group-hover:opacity-100">
                {desc}
            </p>
        </div>

        {/* Brand Glow Effect */}
        <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-[#8B5CF6]/20 blur-[60px] group-hover:bg-[#FF7400]/20 transition-colors duration-500 pointer-events-none" />
    </div>
);

export default function LyroSection() {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsVisible(true);
            },
            { threshold: 0.15 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    // STRICT MATCH: HeroNewSection Background Gradients
    const backgroundGradient = `
        radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
        linear-gradient(135deg, #000000 0%, #0a0a0f 50%, #000000 100%)
    `;

    return (
        <section
            ref={sectionRef}
            className="relative w-full py-24 lg:py-32 bg-black overflow-hidden"
        >
            {/* Background Layer */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: backgroundGradient }}
            />
            {/* Grid Pattern */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            />

            {/* Container Strategy: container-global > container-large */}
            <div className="relative z-10 container-global">
                <div className="container-large">

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

                        {/* LEFT: Text Content */}
                        <div className={`space-y-8 transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
                            }`}>
                            <div className="inline-flex items-center gap-2 mb-4">
                                <div className="w-2 h-2 rounded-full bg-[#FF7400] animate-pulse"></div>
                                <span className="text-[#FF7400] font-mono text-xs tracking-widest uppercase">Proprietary Technology</span>
                            </div>

                            <h2 className="text-5xl md:text-6xl lg:text-7xl font-medium text-white font-['Space_Grotesk:Medium'] tracking-tight leading-[1.05]">
                                Lyro AI <br />
                                <span className="text-[#8B5CF6]">Narrative Engine</span>
                            </h2>

                            <p className="text-lg text-white/70 font-['Noto_Sans:Regular'] leading-relaxed max-w-lg border-l-2 border-[#8B5CF6] pl-6">
                                Not just distribution—engineering. Lyro acts as your pre-flight check, analyzing sentiment, clarity, and angle before your story ever hits the wire.
                            </p>

                            {/* Feature List (Interactive) */}
                            <div className="grid gap-4 mt-8">
                                <FeatureCard
                                    number="01"
                                    title="Narrative Optimization"
                                    desc="Semantic analysis ensures your story resonates with key audiences."
                                    delay="0.1s"
                                />
                                <FeatureCard
                                    number="02"
                                    title="Visibility Forecast"
                                    desc="Predicts how well LLMs and Search Engines will index your news."
                                    delay="0.2s"
                                />
                            </div>
                        </div>

                        {/* RIGHT: REAL 3D Animation (WebGL) */}
                        <div className={`h-[500px] w-full relative transition-all duration-1000 delay-300 ease-out ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
                            }`}>
                            {/* Canvas Container */}
                            <div className="absolute inset-0 z-10">
                                <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
                                    <ambientLight intensity={0.5} />
                                    <pointLight position={[10, 10, 10]} intensity={1.0} color="#8B5CF6" />
                                    <Suspense fallback={null}>
                                        <NeuralNetwork />
                                    </Suspense>
                                </Canvas>
                            </div>

                            {/* Decorative Rings (CSS Overlay for extra depth) */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-[#8B5CF6]/20 rounded-full animate-[spin_10s_linear_infinite] pointer-events-none" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] border border-[#FF7400]/20 rounded-full animate-[spin_15s_linear_infinite_reverse] pointer-events-none" />

                            {/* Center Glow */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-[#8B5CF6]/10 blur-[80px] pointer-events-none" />
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
