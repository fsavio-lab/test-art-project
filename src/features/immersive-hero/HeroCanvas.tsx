import { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr } from '@react-three/drei';
import ShaderBackground from './ShaderBackground';
import LogoParticles from './LogoParticles';
import FluidSculpture from './FluidSculpture';

const HeroCanvas = () => {
  const mouse = useRef({ x: 0, y: 0 });
  const [scroll, setScroll] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const handleScroll = () => {
      const s = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      setScroll(Math.min(s, 1));
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 3], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          toneMapping: 3,
          toneMappingExposure: 1.2,
        }}
      >
        <AdaptiveDpr pixelated />
        <fog attach="fog" args={['#fdfbf7', 3, 8]} />
        <ambientLight intensity={0.5} color="#b08d57" />
        <pointLight position={[2, 3, 2]} intensity={0.7} color="#c56a2d" />
        <pointLight position={[-2, -1, 1]} intensity={0.3} color="#b08d57" />
        <Suspense fallback={null}>
          <ShaderBackground mouse={mouse} scroll={scroll} />
          {/* <FluidSculpture mouse={mouse} scroll={scroll} /> */}
          {/* <LogoParticles /> */}
        </Suspense>
      </Canvas>
    </div>
  );
};

export default HeroCanvas;
