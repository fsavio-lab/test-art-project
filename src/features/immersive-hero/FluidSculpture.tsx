import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useTheme } from "next-themes";
import * as THREE from 'three';
import { sculptureVertexShader, sculptureFragmentShader } from '../shader-effects/sculptureShaders';

interface FluidSculptureProps {
  mouse: React.MutableRefObject<{ x: number; y: number }>;
  scroll: number;
}

const FluidSculpture = ({ mouse, scroll }: FluidSculptureProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  const { theme, resolvedTheme } = useTheme();
  const isDark = (theme || resolvedTheme) === "dark";

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uScroll: { value: 0 },
      uDarkMode: { value: isDark ? 1 : 0 },
    }),
    []
  );

  useEffect(() => {
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.ShaderMaterial;
      // We'll let useFrame handle the smooth transition (lerp)
    }
  }, [isDark]);

  useFrame((state) => {
    if (!meshRef.current) return;



    const mat = meshRef.current.material as THREE.ShaderMaterial;
    const target = isDark ? 1.0 : 0.0;
    mat.uniforms.uDarkMode.value = THREE.MathUtils.lerp(
      mat.uniforms.uDarkMode.value,
      target,
      0.1
    );
    mat.uniforms.uTime.value = state.clock.elapsedTime;
    mat.uniforms.uMouse.value.set(mouse.current.x, mouse.current.y);
    mat.uniforms.uScroll.value = scroll;

    // Slow breathing rotation
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.08;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1;
  });

  // Scale based on viewport
  const scale = Math.min(viewport.width, viewport.height) * 0.28;

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <icosahedronGeometry args={[scale, 128]} />
      <shaderMaterial
        vertexShader={sculptureVertexShader}
        fragmentShader={sculptureFragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

export default FluidSculpture;
