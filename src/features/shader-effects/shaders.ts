export const heroVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  uniform float uTime;
  uniform vec2 uMouse;
  
  void main() {
    vUv = uv;
    vPosition = position;
    
    vec3 pos = position;
    float dist = distance(uv, uMouse);
    pos.z += sin(pos.x * 3.0 + uTime * 0.5) * 0.05;
    pos.z += cos(pos.y * 2.0 + uTime * 0.3) * 0.05;
    pos.z += smoothstep(0.5, 0.0, dist) * 0.15;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

// export const heroFragmentShader = 

// `
//   precision highp float;

//   varying vec2 vUv;

//   uniform sampler2D uTexture;
//   uniform float uTime;
//   uniform vec2 uMouse;
//   uniform vec2 uResolution;

//   // If you're using snoise, make sure the function exists above this.
//   // (Keep your snoise implementation here)

// void main() {
//   vec2 uv = vUv;

//   // Mouse distortion
//   float mouseDist = distance(uv, uMouse);
//   float mouseInfluence = smoothstep(0.45, 0.0, mouseDist) * 0.18;
//   uv += mouseInfluence * (uv - uMouse);

//   // Ripple
//   float ripple = sin(mouseDist * 25.0 - uTime * 2.0) 
//                  * smoothstep(0.4, 0.0, mouseDist) * 0.008;
//   uv += ripple;

//   // Organic flow distortion
//   float t = uTime * 0.1;
//   float distortion = snoise(vec3(uv * 3.0, t)) * 0.03;
//   uv += distortion;

//   // --- Aspect correction ---
//   float imageAspect = 16.0 / 9.0; 
//   float screenAspect = uResolution.x / uResolution.y;

//   vec2 uvCorrected = uv;

//   if (screenAspect > imageAspect) {
//       uvCorrected.x = (uv.x - 0.5) * (screenAspect / imageAspect) + 0.5;
//   } else {
//       uvCorrected.y = (uv.y - 0.5) * (imageAspect / screenAspect) + 0.5;
//   }

//   vec3 imageColor = texture2D(uTexture, uvCorrected).rgb;

//   // gl_FragColor = vec4(imageColor, 1.0);
// }
// `;


// `
// uniform sampler2D uTexture;

// void main() {
//   vec2 uv = vUv;

//   // Mouse distortion
//   float mouseDist = distance(uv, uMouse);
//   float mouseInfluence = smoothstep(0.45, 0.0, mouseDist) * 0.18;
//   uv += mouseInfluence * (uv - uMouse);

//   // Ripple
//   float ripple = sin(mouseDist * 25.0 - uTime * 2.0) 
//                  * smoothstep(0.4, 0.0, mouseDist) * 0.008;
//   uv += ripple;

//   // Organic flow distortion
//   float t = uTime * 0.1;
//   float distortion = snoise(vec3(uv * 3.0, t)) * 0.03;
//   uv += distortion;

//   vec2 uvCorrected = uv;
//   float imageAspect = 16.0 / 9.0; // match your image
//   float screenAspect = uResolution.x / uResolution.y;

//   if (screenAspect > imageAspect) {
//       uvCorrected.x *= screenAspect / imageAspect;
//   } else {
//       uvCorrected.y *= imageAspect / screenAspect;
//   }
    
//   // vec3 darkOverlay = vec3(0.08, 0.08, 0.1);
//   // imageColor = mix(imageColor, imageColor * darkOverlay, uTheme * 0.6);

//   // 🔥 Sample the image
//   vec3 imageColor = texture2D(uTexture, uvCorrected).rgb;

//   // Optional cinematic contrast boost
//   // imageColor = imageColor * (2.51 * imageColor + 0.03) 
//   //             / (imageColor * (2.43 * imageColor + 0.59) + 0.14);

//   gl_FragColor = vec4(imageColor, 1.0);
// }

// `

// export const heroFragmentShader = `
// precision highp float;

// varying vec2 vUv;
// uniform sampler2D uTexture;

// void main() {
//   gl_FragColor = texture2D(uTexture, vUv);
// }
// `;

export const heroFragmentShader = `
precision highp float;

varying vec2 vUv;

uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform vec2 uImageResolution;
uniform float uTheme; // 0 = light, 1 = dark

void main() {

  vec2 uv = vUv;

  // -------------------------------------------------
  // TILE IN X AXIS
  // -------------------------------------------------
  uv.x = fract(uv.x * 1.0); // change 1.0 to control tiling amount

  // -------------------------------------------------
  // COVER BEHAVIOR (vertical crop only)
  // -------------------------------------------------
  float screenRatio = uResolution.x / uResolution.y;
  float imageRatio  = uImageResolution.x / uImageResolution.y;

  vec2 newUV = uv;

  if (screenRatio < imageRatio) {
      float scale = imageRatio / screenRatio;
      newUV.y = (uv.y - 0.5) * scale + 0.5;
  }

  vec3 color = texture2D(uTexture, newUV).rgb;

  // -------------------------------------------------
  // STRONG LIGHT / DARK COMPENSATION
  // -------------------------------------------------

  // Dark mode → cinematic darkening
  vec3 darkened = color * 0.55;

  // Light mode → strong soft white overlay
  vec3 lightened = mix(color, vec3(1.0), 0.25);

  color = mix(lightened, darkened, uTheme);

  // -------------------------------------------------
  // Center readability boost (radial light focus)
  // -------------------------------------------------
  float center = 1.0 - smoothstep(0.0, 0.6, distance(vUv, vec2(0.5)));
  color += center * (1.0 - uTheme) * 0.15;

  gl_FragColor = vec4(color, 1.0);
}`

// export const heroFragmentShader = `
// precision highp float;

// varying vec2 vUv;

// uniform sampler2D uTexture;
// uniform vec2 uResolution;
// uniform vec2 uImageResolution;
// uniform float uTheme; // 0 = light, 1 = dark

// void main() {

//   vec2 uv = vUv;

//   // --- COVER behavior (like CSS background-size: cover) ---
//   float screenRatio = uResolution.x / uResolution.y;
//   float imageRatio  = uImageResolution.x / uImageResolution.y;

//   vec2 newUV = uv;


//   vec3 color = texture2D(uTexture, newUV).rgb;

//   // --- Dark / Light Mode Compensation ---
//   vec3 darkened = color * 0.6;

//   // Lighten by lifting midtones instead of clipping highlights
//   vec3 lightened = mix(color, vec3(1.0), 0.08);

//   // uTheme = 0 → lightened
//   // uTheme = 1 → darkened
//   color = mix(lightened, darkened, uTheme);

//   gl_FragColor = vec4(color, 1.0);
// }
// `;



// export const heroFragmentShader = `
//   precision highp float;
  
//   varying vec2 vUv;
//   varying vec3 vPosition;
//   uniform float uTime;
//   uniform vec2 uMouse;
//   uniform float uScroll;
//   uniform vec2 uResolution;
//   uniform float uTheme;
  
//   vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
//   vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
//   vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
//   vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  
//   float snoise(vec3 v) {
//     const vec2 C = vec2(1.0/6.0, 1.0/3.0);
//     const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    
//     vec3 i = floor(v + dot(v, C.yyy));
//     vec3 x0 = v - i + dot(i, C.xxx);
    
//     vec3 g = step(x0.yzx, x0.xyz);
//     vec3 l = 1.0 - g;
//     vec3 i1 = min(g.xyz, l.zxy);
//     vec3 i2 = max(g.xyz, l.zxy);
    
//     vec3 x1 = x0 - i1 + C.xxx;
//     vec3 x2 = x0 - i2 + C.yyy;
//     vec3 x3 = x0 - D.yyy;
    
//     i = mod289(i);
//     vec4 p = permute(permute(permute(
//       i.z + vec4(0.0, i1.z, i2.z, 1.0))
//       + i.y + vec4(0.0, i1.y, i2.y, 1.0))
//       + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    
//     float n_ = 0.142857142857;
//     vec3 ns = n_ * D.wyz - D.xzx;
    
//     vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    
//     vec4 x_ = floor(j * ns.z);
//     vec4 y_ = floor(j - 7.0 * x_);
    
//     vec4 x = x_ * ns.x + ns.yyyy;
//     vec4 y = y_ * ns.x + ns.yyyy;
//     vec4 h = 1.0 - abs(x) - abs(y);
    
//     vec4 b0 = vec4(x.xy, y.xy);
//     vec4 b1 = vec4(x.zw, y.zw);
    
//     vec4 s0 = floor(b0)*2.0 + 1.0;
//     vec4 s1 = floor(b1)*2.0 + 1.0;
//     vec4 sh = -step(h, vec4(0.0));
    
//     vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
//     vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    
//     vec3 p0 = vec3(a0.xy, h.x);
//     vec3 p1 = vec3(a0.zw, h.y);
//     vec3 p2 = vec3(a1.xy, h.z);
//     vec3 p3 = vec3(a1.zw, h.w);
    
//     vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
//     p0 *= norm.x;
//     p1 *= norm.y;
//     p2 *= norm.z;
//     p3 *= norm.w;
    
//     vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
//     m = m * m;
//     return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
//   }
  
//   void main() {
//     vec2 uv = vUv;
    
//     // Mouse distortion — incense smoke feel
//     float mouseDist = distance(uv, uMouse);
//     float mouseInfluence = smoothstep(0.45, 0.0, mouseDist) * 0.18;
//     uv += mouseInfluence * (uv - uMouse);
    
//     // Cursor ripple
//     float ripple = sin(mouseDist * 25.0 - uTime * 2.0) * smoothstep(0.4, 0.0, mouseDist) * 0.008;
//     uv += ripple;
    
//     // Layered noise — organic flowing smoke
//     float t = uTime * 0.12;
//     float noise1 = snoise(vec3(uv * 2.0, t)) * 0.5 + 0.5;
//     float noise2 = snoise(vec3(uv * 4.0 + 100.0, t * 1.3)) * 0.5 + 0.5;
//     float noise3 = snoise(vec3(uv * 8.0 + 200.0, t * 0.7)) * 0.5 + 0.5;
    
//     float combinedNoise = noise1 * 0.5 + noise2 * 0.3 + noise3 * 0.2;
    
//     // Scroll intensity modulation
//     combinedNoise += uScroll * 0.3;
    
//     // Warm Ivory / Saffron / Gold palette
//     vec3 warmIvory = vec3(0.992, 0.984, 0.969);
//     vec3 softBeige = vec3(0.953, 0.929, 0.894);
//     vec3 mutedGold = vec3(0.69, 0.553, 0.341);
//     vec3 burntSaffron = vec3(0.773, 0.416, 0.176);

//     // DARK PALETTE (Museum Night)
//     vec3 darkCharcoal = vec3(0.07, 0.07, 0.09);
//     vec3 deepCharcoal = vec3(0.1, 0.1, 0.12);
//     vec3 darkGold = vec3(0.55, 0.45, 0.28);
//     vec3 warmAmber = vec3(0.8, 0.5, 0.2);

//     // Blend palettes
//     vec3 baseLight = mix(warmIvory, softBeige, smoothstep(0.2, 0.5, combinedNoise));
//     vec3 baseDark = mix(darkCharcoal, deepCharcoal, smoothstep(0.2, 0.6, combinedNoise));

//     vec3 color = mix(baseLight, baseDark, uTheme);
//     // color = mix(color, softBeige, smoothstep(0.2, 0.5, combinedNoise));
//     // color = mix(color, mutedGold, smoothstep(0.55, 0.8, combinedNoise) * 0.2);
    
//     // Saffron-tinted warm light
//     float highlight = pow(combinedNoise, 4.0) * 0.4;
//     highlight += mouseInfluence * 1.2;
//     vec3 highlightLight = burntSaffron * 0.2 + mutedGold * 0.15;
//     vec3 highlightDark = warmAmber * 0.25 + darkGold * 0.2;

//     color += mix(highlightLight, highlightDark, uTheme) * highlight;
    
//     // Warm volumetric light ray
//     float lightRay = smoothstep(0.0, 1.0, 1.0 - abs(uv.x - 0.55 + sin(uTime * 0.08) * 0.12));
//     lightRay *= smoothstep(1.0, 0.0, uv.y);
//     color += mutedGold * lightRay * 0.035;
    
//     // Atmospheric fog depth
//     float fogDepth = smoothstep(0.0, 0.6, uv.y) * 0.04;
//     color = mix(color, warmIvory, fogDepth);
    
//     // Film grain — paper texture
//     float grain = fract(sin(dot(uv * uTime * 0.01, vec2(12.9898, 78.233))) * 43758.5453);
//     color += (grain - 0.5) * 0.018;
    
//     // Radial warmth vignette
//     float vignette = 1.0 - smoothstep(0.35, 1.1, length(uv - 0.5));
//     float vignetteStrength = mix(0.12, 0.25, uTheme);
//     color *= vignette * vignetteStrength + (1.0 - vignetteStrength);
    
//     // Cinematic tone mapping (ACES-inspired)
//     color = color * (2.51 * color + 0.03) / (color * (2.43 * color + 0.59) + 0.14);
    
//     gl_FragColor = vec4(color, 1.0);
//   }
// `;
