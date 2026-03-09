import heroImage from '@/assets/hero-image.jpg';

/**
 * StaticHeroCanvas
 *
 * A lightweight replacement for HeroCanvas that renders the hero image as a
 * static background with a layered dark overlay — no WebGL, no shader loop,
 * no mobile-browser glitch from the bottom bar overflowing a fixed full-height
 * canvas.
 *
 * Max-height of 800 px keeps the canvas inside the initial viewport on nearly
 * every device without the bottom chrome causing a jump.
 */
const StaticHeroCanvas = () => (
  <div
    className="fixed inset-x-0 top-0 z-0 w-full overflow-hidden"
    style={{ maxHeight: '800px', height: '100svh' }}
    aria-hidden="true"
  >
    {/* ── Hero photograph ───────────────────────────────────────────────── */}
    <img
      src={heroImage}
      alt=""
      draggable={false}
      className="pt-20 h-full w-full object-cover object-center select-none"
      style={{
        // Slight desaturation so the gold UI text reads cleanly above the
        // vibrant painting without clashing.
        filter: 'saturate(0.72) brightness(0.48)',
      }}
    />

    {/* ── Layered vignette / gradient ───────────────────────────────────── */}
    {/* Bottom-to-top deep fade — merges canvas into the dark bg beneath */}
    <div
      className="absolute inset-0"
      style={{
        background:
          'linear-gradient(to top, hsl(var(--background)) 0%, hsl(var(--background) / 0.82) 18%, hsl(var(--background) / 0.18) 48%, transparent 72%)',
      }}
    />

    {/* Top thin fade — hides the hard clip edge and blends into Navigation */}
    <div
      className="absolute inset-x-0 top-0 h-40"
      style={{
        background:
          'linear-gradient(to bottom, hsl(var(--background) / 0.72) 0%, transparent 100%)',
      }}
    />

    {/* Radial edge-vignette to focus attention to the centre */}
    <div
      className="absolute inset-0"
      style={{
        background:
          'radial-gradient(ellipse 80% 90% at 50% 40%, transparent 40%, hsl(var(--background) / 0.55) 100%)',
      }}
    />
  </div>
);

export default StaticHeroCanvas;