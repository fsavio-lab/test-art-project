export const particleVertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uScroll;
  
  attribute float aRandom;
  
  varying float vAlpha;
  varying float vRandom;
  
  void main() {
    vec3 pos = position;
    
    // Breathing animation
    float breathe = sin(uTime * 0.5 + aRandom * 6.28) * 0.03;
    pos.x += breathe;
    pos.y += sin(uTime * 0.3 + aRandom * 3.14) * 0.02;
    pos.z += sin(uTime * 0.4 + aRandom * 4.0) * 0.05;
    
    // Mouse influence
    vec2 mouseOffset = uMouse * 0.15;
    float dist = length(pos.xy - mouseOffset * 2.0);
    float mouseEffect = smoothstep(1.5, 0.0, dist) * 0.2;
    pos.x += mouseOffset.x * mouseEffect;
    pos.y += mouseOffset.y * mouseEffect;
    
    // Scroll dispersion
    pos.z += uScroll * aRandom * 2.0;
    pos.x += sin(aRandom * 10.0) * uScroll * 0.5;
    pos.y += cos(aRandom * 8.0) * uScroll * 0.3;
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    
    // Size attenuation
    float size = 3.0 + aRandom * 2.0;
    size *= (1.0 - uScroll * 0.5);
    gl_PointSize = size * (300.0 / -mvPosition.z);
    
    gl_Position = projectionMatrix * mvPosition;
    
    vAlpha = 0.6 + aRandom * 0.4;
    vAlpha *= (1.0 - uScroll * 0.8);
    vRandom = aRandom;
  }
`;

export const particleFragmentShader = `
  precision highp float;
  
  uniform float uTime;
  
  varying float vAlpha;
  varying float vRandom;
  
  void main() {
    // Soft circular particle
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    
    float alpha = smoothstep(0.5, 0.1, d) * vAlpha;
    
    // Saffron-gold palette
    vec3 burntSaffron = vec3(0.773, 0.416, 0.176);
    vec3 mutedGold = vec3(0.69, 0.553, 0.341);
    vec3 lightGold = vec3(0.88, 0.78, 0.52);
    vec3 deepAmber = vec3(0.55, 0.30, 0.10);
    
    float t = sin(uTime * 0.5 + vRandom * 6.28) * 0.5 + 0.5;
    vec3 color = mix(deepAmber, burntSaffron, t);
    color = mix(color, mutedGold, vRandom * 0.5);
    color = mix(color, lightGold, pow(1.0 - d * 2.0, 3.0) * 0.5);
    
    gl_FragColor = vec4(color, alpha);
  }
`;
