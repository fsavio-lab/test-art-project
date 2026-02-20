import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { heroVertexShader, heroFragmentShader } from '../shader-effects/shaders';

interface ShaderBackgroundProps {
  mouse: React.MutableRefObject<{ x: number; y: number }>;
  scroll: number;
}

const ShaderBackground = ({ mouse, scroll }: ShaderBackgroundProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uScroll: { value: 0 },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    }),
    []
  );

  useFrame((state) => {
    if (!meshRef.current) return;
    const material = meshRef.current.material as THREE.ShaderMaterial;
    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uMouse.value.set(
      mouse.current.x * 0.5 + 0.5,
      mouse.current.y * 0.5 + 0.5
    );
    material.uniforms.uScroll.value = scroll;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -1]}>
      <planeGeometry args={[viewport.width * 1.2, viewport.height * 1.2, 64, 64]} />
      <shaderMaterial
        vertexShader={heroVertexShader}
        fragmentShader={heroFragmentShader}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  );
};

export default ShaderBackground;
