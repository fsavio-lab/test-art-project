export const sculptureVertexShader = `
  uniform float uTime;
  uniform float uScroll;
  uniform vec2 uMouse;
  
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;
  varying float vDisplacement;
  
  // Simplex noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
  
  void main() {
    vUv = uv;
    
    float t = uTime * 0.2;
    float scrollIntensity = 1.0 + uScroll * 1.5;
    
    // Multi-octave displacement — flowing silk / liquid saffron
    float n1 = snoise(normal * 1.5 + t) * 0.35 * scrollIntensity;
    float n2 = snoise(normal * 3.0 + t * 1.4 + 50.0) * 0.15;
    float n3 = snoise(normal * 6.0 + t * 0.8 + 100.0) * 0.08;
    
    float displacement = n1 + n2 + n3;
    
    // Mouse influence on morph
    float mouseInfluence = length(uMouse) * 0.15;
    displacement += mouseInfluence * snoise(normal * 2.0 + t * 2.0) * 0.2;
    
    vDisplacement = displacement;
    
    vec3 pos = position + normal * displacement;
    
    // Recalculate normal (approximate)
    float eps = 0.01;
    vec3 tangent1 = normalize(cross(normal, vec3(0.0, 1.0, 0.0)));
    vec3 tangent2 = cross(normal, tangent1);
    float d1 = snoise((normal + tangent1 * eps) * 1.5 + t) * 0.35 * scrollIntensity + snoise((normal + tangent1 * eps) * 3.0 + t * 1.4 + 50.0) * 0.15;
    float d2 = snoise((normal + tangent2 * eps) * 1.5 + t) * 0.35 * scrollIntensity + snoise((normal + tangent2 * eps) * 3.0 + t * 1.4 + 50.0) * 0.15;
    
    vec3 newPos1 = position + normal * d1 + tangent1 * eps;
    vec3 newPos2 = position + normal * d2 + tangent2 * eps;
    vNormal = normalize(cross(newPos1 - pos, newPos2 - pos));
    
    vPosition = (modelViewMatrix * vec4(pos, 1.0)).xyz;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

export const sculptureFragmentShader = `
  precision highp float;
  uniform float uTime;
  uniform float uDarkMode; // Receive the uniform

  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vDisplacement;

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(-vPosition);

    // --- PALETTES ---
    // Light Mode (Saffron Marble)
    vec3 lBase = vec3(0.95, 0.92, 0.88);       // Warm White
    vec3 lAccent = vec3(0.773, 0.416, 0.176); // Burnt Saffron
    vec3 lGold = vec3(0.69, 0.553, 0.341);    // Muted Gold

    // Dark Mode (Obsidian & Electric Gold)
    vec3 dBase = vec3(0.05, 0.05, 0.07);       // Deep Obsidian
    vec3 dAccent = vec3(0.9, 0.6, 0.2);        // Glowing Gold
    vec3 dGold = vec3(0.4, 0.3, 0.1);          // Dim Metallic

    // Mix palettes based on uDarkMode
    vec3 baseColorChoice = mix(lBase, dBase, uDarkMode);
    vec3 accentColorChoice = mix(lAccent, dAccent, uDarkMode);
    vec3 goldColorChoice = mix(lGold, dGold, uDarkMode);

    // --- SHADING LOGIC ---
    float marbleBlend = smoothstep(-0.2, 0.4, vDisplacement);
    vec3 baseColor = mix(baseColorChoice, goldColorChoice, marbleBlend * 0.35);

    // Dynamic Lighting adjustments for dark mode
    // (We boost the rim light in dark mode to make the silhouette pop)
    float lightIntensity = mix(0.7, 0.3, uDarkMode);
    float ambientIntensity = mix(0.35, 0.1, uDarkMode);

    vec3 lightDir1 = normalize(vec3(2.0, 3.0, 2.0));
    float diff1 = max(dot(normal, lightDir1), 0.0);
    vec3 diffuse = baseColor * (diff1 * lightIntensity + ambientIntensity);

    // Specular (Sharper in dark mode)
    float shininess = mix(64.0, 128.0, uDarkMode);
    vec3 halfDir = normalize(lightDir1 + viewDir);
    float spec = pow(max(dot(normal, halfDir), 0.0), shininess);
    vec3 specular = goldColorChoice * spec * mix(0.7, 1.2, uDarkMode);

    // Fresnel (The "Glow" edge)
    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);
    // In dark mode, we make the fresnel stronger and more "emissive"
    vec3 fresnelColor = mix(accentColorChoice, goldColorChoice, fresnel) * fresnel * mix(0.5, 1.5, uDarkMode);

    vec3 color = diffuse + specular + fresnelColor;

    // Tonemapping
    color = color * (2.51 * color + 0.03) / (color * (2.43 * color + 0.59) + 0.14);
    
    // Slight transparency adjustment for dark mode
    float alpha = mix(0.85, 0.95, uDarkMode);
    gl_FragColor = vec4(color, alpha);
  }
`;

// export const sculptureFragmentShader = `
//   precision highp float;
  
//   uniform float uTime;
  
//   varying vec3 vNormal;
//   varying vec3 vPosition;
//   varying vec2 vUv;
//   varying float vDisplacement;
  
//   void main() {
//     vec3 normal = normalize(vNormal);
//     vec3 viewDir = normalize(-vPosition);
    
//     // Marble base colors
//     vec3 warmWhite = vec3(0.95, 0.92, 0.88);
//     vec3 mutedGold = vec3(0.69, 0.553, 0.341);
//     vec3 burntSaffron = vec3(0.773, 0.416, 0.176);
//     vec3 deepAmber = vec3(0.45, 0.28, 0.12);
    
//     // Base marble color with displacement-based variation
//     float marbleBlend = smoothstep(-0.2, 0.4, vDisplacement);
//     vec3 baseColor = mix(warmWhite, mutedGold, marbleBlend * 0.35);
    
//     // Diffuse lighting
//     vec3 lightDir1 = normalize(vec3(2.0, 3.0, 2.0));
//     vec3 lightDir2 = normalize(vec3(-1.5, -0.5, 1.0));
//     float diff1 = max(dot(normal, lightDir1), 0.0);
//     float diff2 = max(dot(normal, lightDir2), 0.0) * 0.3;
    
//     vec3 diffuse = baseColor * (diff1 * 0.7 + diff2 + 0.35);
    
//     // Specular — glossy marble
//     vec3 halfDir = normalize(lightDir1 + viewDir);
//     float spec = pow(max(dot(normal, halfDir), 0.0), 64.0);
//     vec3 specular = mutedGold * spec * 0.7;
    
//     // Gold reflective highlights
//     float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);
//     vec3 fresnelColor = mix(burntSaffron, mutedGold, fresnel) * fresnel * 0.5;
    
//     // Subsurface scattering illusion
//     float sss = pow(max(dot(viewDir, -lightDir1), 0.0), 2.0) * 0.15;
//     vec3 subsurface = burntSaffron * sss;
    
//     vec3 color = diffuse + specular + fresnelColor + subsurface;
    
//     // Warm ambient
//     color += deepAmber * 0.05;
    
//     // ACES-inspired tonemap
//     color = color * (2.51 * color + 0.03) / (color * (2.43 * color + 0.59) + 0.14);
    
//     gl_FragColor = vec4(color, 0.85);
//   }
// `;
