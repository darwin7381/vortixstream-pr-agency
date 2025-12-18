import { useState, useRef, useMemo, Suspense, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// 3D Neural Network (Clean & Premium)
function NeuralNetwork({ count = 100 }) { // Increased count for density, better "cloud" look
    const pointsRef = useRef<THREE.Points>(null);
    const linesRef = useRef<THREE.LineSegments>(null);

    // Generate Points & Connections
    const { positions, linePositions } = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const r = 8; // Wider spread to fill the container naturally
        const vectors = [];

        for (let i = 0; i < count; i++) {
            const theta = THREE.MathUtils.randFloatSpread(360);
            const phi = THREE.MathUtils.randFloatSpread(360);
            const x = r * Math.sin(theta) * Math.cos(phi);
            const y = r * Math.sin(theta) * Math.sin(phi);
            const z = r * Math.cos(theta);

            pos[i * 3] = x;
            pos[i * 3 + 1] = y;
            pos[i * 3 + 2] = z;
            vectors.push(new THREE.Vector3(x, y, z));
        }

        const linePos = [];
        // Slightly increased connection distance for more "network" feel without clutter
        const distanceThreshold = 4.5;

        for (let i = 0; i < count; i++) {
            for (let j = i + 1; j < count; j++) {
                if (vectors[i].distanceTo(vectors[j]) < distanceThreshold) {
                    linePos.push(vectors[i].x, vectors[i].y, vectors[i].z);
                    linePos.push(vectors[j].x, vectors[j].y, vectors[j].z);
                }
            }
        }

        return {
            positions: pos,
            linePositions: new Float32Array(linePos)
        };
    }, [count]);

    useFrame((state, delta) => {
        // Slower, more elegant rotation
        if (pointsRef.current) {
            pointsRef.current.rotation.y -= delta / 15;
            pointsRef.current.rotation.x -= delta / 30;
        }
        if (linesRef.current) {
            linesRef.current.rotation.y -= delta / 15;
            linesRef.current.rotation.x -= delta / 30;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            {/* Main Points - Violet */}
            <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color="#A78BFA"
                    size={0.15}
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={1}
                />
            </Points>

            {/* Accent Points - Orange - Less quantity but bright */}
            <Points positions={positions} stride={3} frustumCulled={false} scale={1.1}>
                <PointMaterial
                    transparent
                    color="#FB923C"
                    size={0.1}
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={0.8}
                />
            </Points>

            {/* Network Lines - Subtle but visible */}
            <lineSegments ref={linesRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={linePositions.length / 3}
                        array={linePositions}
                        itemSize={3}
                    />
                </bufferGeometry>
                <lineBasicMaterial
                    color="#8B5CF6"
                    transparent
                    opacity={0.15} // Reduced from 0.3 for subtler premium look
                    depthWrite={false}
                />
            </lineSegments>
        </group>
    );
}

// "Glass" Card (Refined - No grid borders)
const FeatureCard = ({ number, title, desc, delay }: any) => (
    <div
        className="group relative flex flex-col md:flex-row items-start gap-5 p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md hover:border-[#FF7400]/50 hover:bg-[#FF7400]/5 transition-all duration-500 overflow-hidden"
        style={{ animationDelay: delay }}
    >
        <div className="relative w-12 h-12 shrink-0 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center group-hover:bg-[#FF7400] group-hover:border-[#FF7400] transition-all duration-300">
            <span className="text-xl font-mono font-bold text-white group-hover:text-white transition-colors duration-300">{number}</span>
        </div>

        <div className="relative z-10">
            <h3 className="text-xl text-white font-['Space_Grotesk:Medium'] tracking-tight group-hover:text-[#FF7400] transition-colors duration-300">
                {title}
            </h3>
            <p className="text-sm text-gray-200 font-['Noto_Sans:Regular'] mt-2 leading-relaxed font-medium">
                {desc}
            </p>
        </div>

        {/* Soft Glow only - No jagged corners */}
        <div className="absolute -right-20 -top-20 w-40 h-40 bg-[#8B5CF6]/10 blur-[60px] group-hover:bg-[#FF7400]/10 transition-colors duration-500 pointer-events-none" />
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
            { threshold: 0.1 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    // Clean, Deep Background
    const backgroundGradient = `
        radial-gradient(circle at 10% 20%, rgba(139, 92, 246, 0.08) 0%, transparent 40%),
        radial-gradient(circle at 90% 80%, rgba(255, 116, 0, 0.05) 0%, transparent 40%),
        linear-gradient(180deg, #000000 0%, #050508 100%)
    `;

    return (
        <section
            ref={sectionRef}
            className="relative w-full py-24 lg:py-32 bg-black text-white overflow-hidden"
        >
            <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: backgroundGradient }}
            />

            <div className="relative z-10 container-global">
                <div className="container-large">

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">

                        {/* LEFT: Text Content */}
                        <div className={`flex flex-col items-start space-y-8 transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>

                            {/* Badge - Clean */}
                            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#FF7400] animate-pulse"></div>
                                <span className="text-[#FF7400] font-mono text-xs tracking-widest uppercase font-bold">Vortix Intelligence</span>
                            </div>

                            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white font-['Space_Grotesk:Medium'] tracking-tight leading-[1.0] drop-shadow-xl text-left">
                                Lyro AI <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA]">
                                    Narrative Engine
                                </span>
                            </h2>

                            <div className="border-l-4 border-[#8B5CF6] pl-6 py-1">
                                <p className="text-xl text-gray-200 font-['Noto_Sans:Regular'] leading-relaxed max-w-lg text-left font-medium">
                                    Not just distribution—<span className="text-[#FF7400] font-bold">engineering</span>. Lyro acts as your pre-flight check, analyzing sentiment, clarity, and angle before your story ever hits the wire.
                                </p>
                            </div>

                            <div className="grid gap-6 mt-6 w-full max-w-xl">
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

                        {/* RIGHT: 3D Visualization - Clear View */}
                        <div className={`h-[600px] w-full relative transition-all duration-1000 delay-300 ease-out z-0 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>

                            <Canvas camera={{ position: [0, 0, 14], fov: 35 }} gl={{ antialias: true, alpha: true }}>
                                <ambientLight intensity={1} />
                                <pointLight position={[10, 10, 10]} intensity={2} color="#8B5CF6" />
                                <pointLight position={[-10, -5, 5]} intensity={2} color="#FF7400" />
                                <Suspense fallback={null}>
                                    <NeuralNetwork />
                                </Suspense>
                            </Canvas>

                            {/* Removed all clutter overlays. Just pure code driven art. */}
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
