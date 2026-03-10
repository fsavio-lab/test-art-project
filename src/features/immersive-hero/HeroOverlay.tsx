import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fineArtPaintings, type Painting } from '@/features/shared/data/paintings';

// ── Constants ─────────────────────────────────────────────────────────────────

const ACTIVE_W    = 220;
const INACTIVE_W  = 140;
const GAP         = 8;
const AUTOPLAY_MS = 4200;

const availabilityDot: Record<Painting['availability'], string> = {
  available: 'bg-emerald-400',
  reserved:  'bg-amber-400',
  sold:      'bg-rose-400',
};

// ── Mini Card ─────────────────────────────────────────────────────────────────

interface MiniCardProps {
  painting: Painting;
  isActive: boolean;
  onClick: () => void;
}

const MiniCard = ({ painting, isActive, onClick }: MiniCardProps) => (
  <div
    className="group relative shrink-0 overflow-hidden cursor-pointer"
    style={{
      width: isActive ? ACTIVE_W : INACTIVE_W,
      transition: 'width 560ms cubic-bezier(0.16, 1, 0.3, 1)',
    }}
    onClick={onClick}
  >
    <div className="relative h-42 overflow-hidden">
      <img
        src={painting.image}
        alt={painting.title}
        draggable={false}
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        style={{
          filter: isActive ? 'none' : 'brightness(0.38) saturate(0.5)',
          transition: 'filter 560ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent" />

      {/* Active glow border */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          opacity: isActive ? 1 : 0,
          boxShadow: 'inset 0 0 0 1px hsl(var(--primary) / 0.5)',
        }}
      />

      {isActive && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.18, type: 'spring', stiffness: 260 }}
          className={`absolute right-3 top-3 h-1.5 w-1.5 rounded-full ${availabilityDot[painting.availability]}`}
        />
      )}
    </div>

    {/* Info overlay */}
    <motion.div
      animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 6 }}
      transition={{ duration: 0.4 }}
      className="absolute bottom-0 left-0 right-0 px-3 pb-3"
    >
      <p className="font-body text-[8px] uppercase tracking-[0.22em] text-primary/60">
        {painting.style}
      </p>
      <h4 className="mt-0.5 truncate font-display text-sm font-light italic text-white">
        {painting.title}
      </h4>
      <p className="mt-1 font-display text-sm font-light text-primary">
        ₹{painting.price.toLocaleString('en-IN')}
      </p>

      {/* Navigate link — only visible/reachable when active */}
      {isActive && (
        <Link
          to={`/marketplace/${painting.id}`}
          className="mt-2 inline-block font-body text-[8px] uppercase tracking-[0.2em] text-primary/70 hover:text-primary"
          onClick={(e) => e.stopPropagation()}
        >
          View →
        </Link>
      )}
    </motion.div>
  </div>
);

// ── Carousel ──────────────────────────────────────────────────────────────────

const HeroPaintingCarousel = () => {
  const paintings    = fineArtPaintings.slice(0, 6);
  const [activeIdx, setActiveIdx]   = useState(0);
  const [isPaused,  setIsPaused]    = useState(false);
  const [containerW, setContainerW] = useState(0);
  const containerRef  = useRef<HTMLDivElement>(null);
  const dragStartX    = useRef<number | null>(null);
  const isDragging    = useRef(false);

  // Measure container width
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setContainerW(el.clientWidth);
    const ro = new ResizeObserver(() => setContainerW(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Autoplay — resumes from current activeIdx whenever unpaused
  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(
      () => setActiveIdx((i) => (i + 1) % paintings.length),
      AUTOPLAY_MS,
    );
    return () => clearInterval(id);
  }, [isPaused, paintings.length]);

  // Swipe handlers — NOT using setPointerCapture so child clicks still fire
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
    isDragging.current = false;
    setIsPaused(true);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (dragStartX.current === null) return;
    if (Math.abs(e.clientX - dragStartX.current) > 8) {
      isDragging.current = true;
    }
  }, []);

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      setIsPaused(false);
      if (dragStartX.current === null) return;
      const dx = e.clientX - dragStartX.current;
      dragStartX.current = null;

      // Only treat as swipe if there was real movement
      if (!isDragging.current || Math.abs(dx) < 30) return;
      if (dx < 0) setActiveIdx((i) => Math.min(i + 1, paintings.length - 1));
      else        setActiveIdx((i) => Math.max(i - 1, 0));
    },
    [paintings.length],
  );

  // Card click — only fires when NOT dragging
  const handleCardClick = useCallback((i: number) => {
    if (isDragging.current) return;
    setActiveIdx(i);
  }, []);

  /**
   * Leading spacer = containerW/2 - ACTIVE_W/2
   * → card[0]'s centre sits at container centre when track is at x=0.
   * Shift track left by n × (INACTIVE_W + GAP) to centre card[n].
   */
  const spacer     = containerW > 0 ? containerW / 2 - ACTIVE_W / 2 : 0;
  const translateX = -(activeIdx * (INACTIVE_W + GAP));

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Label row */}
      <div className="mb-4 flex items-center justify-between px-6 md:px-10">
        <div className="flex items-center gap-3">
          <span className="h-px w-6 bg-primary/50" />
          <p className="font-body text-[9px] uppercase tracking-[0.35em] text-primary/60">
            Featured Works
          </p>
        </div>
        <Link
          to="/marketplace"
          className="group flex items-center gap-2 font-body text-[9px] uppercase tracking-[0.25em] text-muted-foreground/50 transition-colors hover:text-primary/70"
        >
          View all
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
            className="transition-transform group-hover:translate-x-0.5">
            <path d="M2.5 6h7M6.5 3l3 3-3 3"
              stroke="currentColor" strokeWidth="1.2"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>

      {/* Clipping viewport */}
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden select-none"
        style={{ cursor: isDragging.current ? 'grabbing' : 'grab' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {/* Edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20
                        bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20
                        bg-gradient-to-l from-background to-transparent" />

        {/* Sliding track */}
        <motion.div
          className="flex"
          style={{ gap: GAP }}
          animate={{ x: translateX }}
          transition={{ type: 'spring', stiffness: 300, damping: 38, mass: 0.85 }}
        >
          <div className="shrink-0" style={{ width: spacer }} />

          {paintings.map((p, i) => (
            <MiniCard
              key={p.id}
              painting={p}
              isActive={i === activeIdx}
              onClick={() => handleCardClick(i)}
            />
          ))}

          <div className="shrink-0" style={{ width: spacer }} />
        </motion.div>
      </div>

      {/* Dot indicators */}
      <div className="mt-4 flex justify-center gap-1.5">
        {paintings.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIdx(i)}
            aria-label={`Go to painting ${i + 1}`}
            className="h-px transition-all duration-700"
            style={{
              width: i === activeIdx ? 28 : 10,
              backgroundColor: i === activeIdx
                ? 'hsl(var(--primary))'
                : 'hsl(var(--muted-foreground) / 0.25)',
            }}
          />
        ))}
      </div>
    </div>
  );
};

// ── Hero Overlay ──────────────────────────────────────────────────────────────

const HeroOverlay = () => {
  const { scrollY }     = useScroll();
  const heroY           = useTransform(scrollY, [0, 500], [0, -80]);
  const heroOpacity     = useTransform(scrollY, [0, 320], [1, 0]);
  const carouselY       = useTransform(scrollY, [0, 260], [0, 30]);
  const carouselOpacity = useTransform(scrollY, [0, 260], [1, 0]);

  return (
    <div className="relative z-10 flex flex-col" style={{ height: '800px' }}>
      <motion.div
        style={{ y: heroY, opacity: heroOpacity }}
        className="flex flex-1 flex-col items-center justify-center px-6 pt-24 text-center"
      >
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 font-body text-[9px] uppercase tracking-[0.45em] text-primary/70"
        >
          India's Premier Art Gallery
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
          className="font-display pb-8 text-5xl font-light leading-[1.08] text-white sm:text-6xl md:text-7xl lg:text-8xl"
        >
          India Fine
          <span className="block italic text-gradient-gold"> Art</span>
        </motion.h1>

        <motion.div
          style={{ y: carouselY, opacity: carouselOpacity }}
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-7xl pb-8"
        >
          <HeroPaintingCarousel />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.3 }}
          className="mt-10 flex flex-col items-center gap-2"
        >
          <div className="h-8 w-px bg-gradient-to-b from-primary/40 to-transparent" />
          <p className="font-body text-[8px] uppercase tracking-[0.4em] text-muted-foreground/30">
            Scroll
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HeroOverlay;