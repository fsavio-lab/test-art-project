

# Transform Logo into 3D Hero Object + Light Theme Color Scheme

## Overview
Replace the current floating icosahedron with a 3D representation of the uploaded logo, and update the entire color scheme to the luxury white/gold/black light theme.

---

## Part 1: 3D Logo in Hero Background

### Approach
Since the uploaded image is a 2D silhouette logo, we will create a compelling 3D effect using a **particle-based approach**: sample the logo image pixels, then render thousands of particles positioned to form the logo shape in 3D space. This creates a stunning volumetric, floating logo effect.

### How it works
1. Copy the logo image to `src/assets/logo_1200_dpi.jpg`
2. Replace `FloatingSculpture.tsx` with a new `LogoParticles.tsx` component that:
   - Loads the logo image as a texture
   - Samples pixel positions from the silhouette (non-white pixels)
   - Creates a `THREE.Points` geometry with those positions spread in 3D space (slight Z variation for depth)
   - Uses a custom shader material with:
     - Soft gold-tinted particles
     - Slow floating/breathing animation
     - Mouse reactivity (subtle displacement)
     - Scroll-based transformation
   - Particles gently drift and reform the logo shape
3. A static fallback (the flat logo image with CSS opacity) for low-end devices

### New/Modified files
- **Copy**: `user-uploads://logo_1200_dpi.jpg` to `src/assets/logo_1200_dpi.jpg`
- **Create**: `src/features/immersive-hero/LogoParticles.tsx` -- particle system component
- **Create**: `src/features/shader-effects/particleShaders.ts` -- vertex + fragment shaders for particles
- **Modify**: `src/features/immersive-hero/HeroCanvas.tsx` -- swap `FloatingSculpture` for `LogoParticles`

### Particle shader details
- **Vertex shader**: Applies time-based displacement (sine waves), mouse influence, and size attenuation
- **Fragment shader**: Renders soft circular particles with gold color tint and alpha falloff
- Particle count: ~5,000-8,000 (sampled from logo silhouette for performance)

---

## Part 2: Light Theme Color Scheme

### Changes to `src/index.css`
- Current `:root` becomes `.dark` (preserving dark mode)
- New `:root` gets light theme values:

| Token | Light Value |
|-------|------------|
| --background | 0 0% 100% (white) |
| --foreground | 0 0% 0% (black) |
| --primary | 43 76% 52% (elegant gold #D4AF37) |
| --card | 0 0% 100% (white) |
| --muted | 40 20% 96% |
| --muted-foreground | 0 0% 35% |
| --border | 40 30% 88% |

### Changes to `src/features/shader-effects/shaders.ts`
- Update the `heroFragmentShader` color palette: shift from charcoal base to soft white/cream base with gold highlights
- Background becomes light with subtle gold noise patterns instead of dark charcoal
- Maintain the same noise algorithms and mouse interaction

### Changes to `src/features/immersive-hero/HeroCanvas.tsx`
- Update fog color from `#0f0d0a` to `#ffffff` (or soft ivory)
- Update light colors to work on light background

### Changes to Navigation, HeroOverlay, and other components
- These already use theme tokens (`text-foreground`, `bg-background`, etc.) so they will automatically adapt
- The shader background needs manual color updates since GLSL doesn't use CSS variables

---

## Part 3: Dark Mode Preservation

- Move current `:root` values into `.dark` selector
- Install/configure `next-themes` ThemeProvider in `App.tsx` (already in dependencies)
- Add a theme toggle button (sun/moon icon) to `Navigation.tsx`

---

## Files Summary

| File | Action |
|------|--------|
| `src/assets/logo_1200_dpi.jpg` | Copy from upload |
| `src/features/immersive-hero/LogoParticles.tsx` | Create |
| `src/features/shader-effects/particleShaders.ts` | Create |
| `src/features/immersive-hero/HeroCanvas.tsx` | Modify (swap sculpture for particles, update fog/lights) |
| `src/features/shader-effects/shaders.ts` | Modify (light-theme hero shader colors) |
| `src/index.css` | Modify (light root + dark class) |
| `src/App.tsx` | Modify (add ThemeProvider) |
| `src/features/navigation/Navigation.tsx` | Modify (add theme toggle) |

---

## Performance Considerations
- Particle count capped at ~6,000 for smooth 60fps
- Logo image sampled at reduced resolution (canvas downscaled) to extract positions
- `AdaptiveDpr` already in place
- Static image fallback if WebGL unavailable

