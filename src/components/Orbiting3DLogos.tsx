import React, { useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

// 單個 3D Logo 組件
function Logo3D({ url, name, position, index }: any) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  // 使用 drei 的 useTexture 加載紋理（需要 CORS 支持）
  const texture = useTexture(url);
  
  // 動畫：環繞旋轉
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      const speed = 0.2 + index * 0.03;
      const radius = position.radius;
      const angle = position.startAngle + time * speed;
      
      // 計算 3D 位置
      meshRef.current.position.x = Math.cos(angle) * radius;
      meshRef.current.position.z = Math.sin(angle) * radius;
      meshRef.current.position.y = 0;
      
      // Billboard 效果：永遠面向相機
      meshRef.current.lookAt(0, 0, 0);
      meshRef.current.rotateY(Math.PI);
      
      // Hover 效果：平滑縮放
      const targetScale = hovered ? 1.2 : 1;
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale), 
        0.1
      );
    }
  });

  return (
    <mesh
      ref={meshRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <planeGeometry args={[2.2, 0.7]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={0.9}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// Fallback Logo（加載中顯示）
function FallbackLogo({ position, index }: any) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      const speed = 0.2 + index * 0.03;
      const radius = position.radius;
      const angle = position.startAngle + time * speed;
      
      meshRef.current.position.x = Math.cos(angle) * radius;
      meshRef.current.position.z = Math.sin(angle) * radius;
      meshRef.current.position.y = 0;
      
      meshRef.current.lookAt(0, 0, 0);
      meshRef.current.rotateY(Math.PI);
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2.2, 0.7]} />
      <meshBasicMaterial color="#333333" opacity={0.3} transparent />
    </mesh>
  );
}

// 3D Logo 雲場景
function LogoCloud() {
  const mediaLogos = useMemo(() => [
    { url: 'https://img.vortixpr.com/VortixPR_Website/For%20media%20cloud%20(hero)/blocktempo%20logo_white_%E6%A9%AB.png', name: 'BlockTempo', radius: 4, startAngle: 0 },
    { url: 'https://img.vortixpr.com/VortixPR_Website/For%20media%20cloud%20(hero)/image-removebg-preview%20(57).png', name: 'The Block', radius: 4.5, startAngle: Math.PI / 4 },
    { url: 'https://img.vortixpr.com/VortixPR_Website/For%20media%20cloud%20(hero)/Logo.png', name: 'Investing.com', radius: 3.8, startAngle: Math.PI / 2 },
    { url: 'https://img.vortixpr.com/VortixPR_Website/For%20media%20cloud%20(hero)/image-removebg-preview%20(58).png', name: 'CoinTelegraph', radius: 5, startAngle: 3 * Math.PI / 4 },
    { url: 'https://img.vortixpr.com/VortixPR_Website/For%20media%20cloud%20(hero)/image-removebg-preview%20(59).png', name: 'CoinDesk', radius: 4.2, startAngle: Math.PI },
    { url: 'https://img.vortixpr.com/VortixPR_Website/For%20media%20cloud%20(hero)/image-removebg-preview%20(60).png', name: 'Decrypt', radius: 3.9, startAngle: 5 * Math.PI / 4 },
    { url: 'https://img.vortixpr.com/VortixPR_Website/For%20media%20cloud%20(hero)/image-removebg-preview%20(61).png', name: 'Bitcoin Mag', radius: 4.6, startAngle: 3 * Math.PI / 2 },
    { url: 'https://img.vortixpr.com/VortixPR_Website/For%20media%20cloud%20(hero)/output-onlinepngtools%20(9).png', name: 'Bitcoin.com', radius: 4.3, startAngle: 7 * Math.PI / 4 },
  ], []);

  return (
    <>
      <ambientLight intensity={0.8} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      
      {/* 每個 logo 獨立 Suspense，避免單一失敗影響整體 */}
      {mediaLogos.map((logo, index) => (
        <Suspense key={index} fallback={<FallbackLogo position={logo} index={index} />}>
          <Logo3D
            url={logo.url}
            name={logo.name}
            position={logo}
            index={index}
          />
        </Suspense>
      ))}
    </>
  );
}

// Loading Placeholder
function LoadingPlaceholder() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-white/30 text-sm">Loading 3D Scene...</div>
    </div>
  );
}

// Error Boundary
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('3D Canvas Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <LoadingPlaceholder />;
    }
    return this.props.children;
  }
}

// 主要的 3D 環繞 Logo 組件
// ⚠️ 注意：需要 CORS 設定才能正常運作
export function Orbiting3DLogos() {
  return (
    <ErrorBoundary fallback={<LoadingPlaceholder />}>
      <div className="absolute inset-0 pointer-events-auto">
        <Suspense fallback={<LoadingPlaceholder />}>
          <Canvas
            camera={{ position: [0, 0, 12], fov: 50 }}
            style={{ background: 'transparent' }}
            gl={{ 
              antialias: true, 
              alpha: true,
              preserveDrawingBuffer: true 
            }}
            onCreated={({ gl }) => {
              gl.setClearColor(0x000000, 0);
            }}
          >
            <LogoCloud />
          </Canvas>
        </Suspense>
      </div>
    </ErrorBoundary>
  );
}
