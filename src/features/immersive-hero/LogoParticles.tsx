import { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { particleVertexShader, particleFragmentShader } from '../shader-effects/particleShaders';
import logoSrc from '@/assets/logo_1200_dpi.jpg';

const SAMPLE_SIZE = 128; // Canvas resolution for sampling
const MAX_PARTICLES = 6000;

function sampleLogoPositions(): Promise<Float32Array[]> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = SAMPLE_SIZE;
      canvas.height = SAMPLE_SIZE;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, SAMPLE_SIZE, SAMPLE_SIZE);
      const data = ctx.getImageData(0, 0, SAMPLE_SIZE, SAMPLE_SIZE).data;

      const positions: number[] = [];
      const randoms: number[] = [];

      // Collect dark pixel positions (logo silhouette)
      const candidates: [number, number][] = [];
      for (let y = 0; y < SAMPLE_SIZE; y++) {
        for (let x = 0; x < SAMPLE_SIZE; x++) {
          const i = (y * SAMPLE_SIZE + x) * 4;
          const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
          if (brightness < 180) {
            candidates.push([x, y]);
          }
        }
      }

      // Sample up to MAX_PARTICLES
      const step = Math.max(1, Math.floor(candidates.length / MAX_PARTICLES));
      for (let i = 0; i < candidates.length && positions.length / 3 < MAX_PARTICLES; i += step) {
        const [x, y] = candidates[i];
        const nx = (x / SAMPLE_SIZE - 0.5) * 3;
        const ny = -(y / SAMPLE_SIZE - 0.5) * 3;
        const nz = (Math.random() - 0.5) * 0.3;
        positions.push(nx, ny, nz);
        randoms.push(Math.random());
      }

      resolve([new Float32Array(positions), new Float32Array(randoms)]);
    };
    img.src = logoSrc;
  });
}

const LogoParticles = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const [particleData, setParticleData] = useState<{ positions: Float32Array; randoms: Float32Array } | null>(null);

  useEffect(() => {
    sampleLogoPositions().then(([positions, randoms]) => {
      setParticleData({ positions, randoms });
    });
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uScroll: { value: 0 },
    }),
    []
  );

  useFrame((state) => {
    if (!pointsRef.current) return;
    const mat = pointsRef.current.material as THREE.ShaderMaterial;
    mat.uniforms.uTime.value = state.clock.elapsedTime;

    // Gentle rotation
    pointsRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
  });

  if (!particleData) return null;

  return (
    <points ref={pointsRef} position={[0, 0, 0.5]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleData.positions.length / 3}
          array={particleData.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aRandom"
          count={particleData.randoms.length}
          array={particleData.randoms}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={particleVertexShader}
        fragmentShader={particleFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export default LogoParticles;
