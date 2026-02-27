import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { TextureLoader } from "three";
import { useTheme } from "next-themes";
import { heroVertexShader, heroFragmentShader } from "../shader-effects/shaders";
import heroImage from "@/assets/hero-image.jpg";

interface ShaderBackgroundProps {
  mouse: React.MutableRefObject<{ x: number; y: number }>;
  scroll: number;
}

// const ShaderBackground = ({ mouse, scroll }: ShaderBackgroundProps) => {
//   const meshRef = useRef<THREE.Mesh>(null);
//   const themeTarget = useRef(0);

//   const { viewport, size, gl } = useThree();
//   const { theme, resolvedTheme } = useTheme();
//   const isDark = (theme || resolvedTheme) === "dark";
//   const texture = useLoader(TextureLoader, heroImage);

//   // Texture Setup
//   useEffect(() => {
//     texture.colorSpace = THREE.SRGBColorSpace;
//     // texture.minFilter = THREE.LinearFilter;
//     // texture.magFilter = THREE.LinearFilter;
//     texture.generateMipmaps = false;
//     texture.anisotropy = gl.capabilities.getMaxAnisotropy();
//     texture.wrapS = THREE.RepeatWrapping;
//     texture.wrapT = THREE.ClampToEdgeWrapping;
//     texture.needsUpdate = true;
//   }, [texture, gl]);

//   // // Update theme target when toggled
//   // useEffect(() => {
//   //   themeTarget.current = isDark ? 1 : 0;
//   // }, [isDark]);

//   // True CSS "cover"
// useEffect(() => {
//   if (!meshRef.current || !texture.image) return;

//   const imageAspect =
//     texture.image.width / texture.image.height;

//   const screenAspect =
//     viewport.width / viewport.height;

//   if (screenAspect < imageAspect) {
//     meshRef.current.scale.set(
//       imageAspect / screenAspect,
//       1,
//       1
//     );
//   } else {
//     meshRef.current.scale.set(
//       1,
//       screenAspect / imageAspect,
//       1
//     );
//   }
// }, [ texture]);

//   const uniforms = useMemo(
//     () => ({
//       uTime: { value: 0 },
//       uMouse: { value: new THREE.Vector2(0.5, 0.5) },
//       uScroll: { value: 0 },
//       uResolution: { value: new THREE.Vector2(size.width, size.height) },
//       uTheme: { value: 0 },
//       uTexture: { value: texture },
//     }),
//     [texture]
//   );

//   useFrame((state) => {
//     if (!meshRef.current) return;

//     const material =
//       meshRef.current.material as THREE.ShaderMaterial;

//     material.uniforms.uTime.value =
//       state.clock.elapsedTime;

//     material.uniforms.uMouse.value.set(
//       mouse.current.x * 0.5 + 0.5,
//       mouse.current.y * 0.5 + 0.5
//     );

//     material.uniforms.uScroll.value = scroll;

//     material.uniforms.uResolution.value.set(
//       size.width,
//       size.height
//     );

//     // // 🔥 Smooth theme interpolation
//     const current = material.uniforms.uTheme.value;
//     const target = themeTarget.current;

//     material.uniforms.uTheme.value +=
//       (target - current) * 0.06;
//   });

//   return (
//     <mesh ref={meshRef} position={[0, 0, -1]}>
//       <planeGeometry
//         args={[viewport.width, viewport.height, 64, 64]}
//       />
//       <shaderMaterial
//         vertexShader={heroVertexShader}
//         fragmentShader={heroFragmentShader}
//         uniforms={uniforms}
//       />
//     </mesh>
//   );
// };

// export default ShaderBackground;

const ShaderBackground = ({ mouse, scroll }: ShaderBackgroundProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();
  const { theme, resolvedTheme } = useTheme();
  const isDark = (theme || resolvedTheme) === "dark";

  // 🔥 Load image texture
  const texture = useLoader(TextureLoader, heroImage);

  texture.colorSpace = THREE.SRGBColorSpace;
  // texture.flipY = false;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;

  useEffect(() => {
    if (!meshRef.current || !texture.image) return;

    const imageAspect =
      texture.image.width / texture.image.height;

    const screenAspect =
      viewport.width / viewport.height;

    if (screenAspect < imageAspect) {
      meshRef.current.scale.set(
        imageAspect / screenAspect,
        1,
        1
      );
    } else {
      meshRef.current.scale.set(
        1,
        screenAspect / imageAspect,
        1
      );
    }
  }, [texture]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uScroll: { value: 0 },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      uTheme: { value: 0 },
      uTexture: { value: texture },
    }),
    [texture]
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
    material.uniforms.uTheme.value = isDark ? 1 : 0;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -1]}>
      <planeGeometry args={[viewport.width, viewport.height, 64, 64]} />
      <shaderMaterial
        vertexShader={heroVertexShader}
        fragmentShader={heroFragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
};

export default ShaderBackground;