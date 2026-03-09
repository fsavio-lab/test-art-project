import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fineArtPaintings, type Painting } from '@/features/shared/data/paintings';

// ── Mini Painting Card ────────────────────────────────────────────────────────

const availabilityDot: Record<Painting['availability'], string> = {
  available: 'bg-emerald-400',
  reserved: 'bg-amber-400',
  sold: 'bg-rose-400',
};

interface MiniCardProps {
  painting: Painting;
  isActive: boolean;
  onClick: () => void;
}

const MiniCard = ({ painting, isActive, onClick }: MiniCardProps) => (
  <Link
    to={`/marketplace/${painting.id}`}
    onClick={(e) => {
      // Allow navigating only when already active; first tap just activates
      if (!isActive) {
        e.preventDefault();
        onClick();
      }
    }}
    className="group relative shrink-0 overflow-hidden"
    style={{
      width: isActive ? 220 : 140,
      transition: 'width 560ms cubic-bezier(0.16, 1, 0.3, 1)',
    }}
  >
    {/* Image */}
    <div className="relative h-42ll overflow-hidden">
      <img
        src={painting.image}
        alt={painting.title}
        draggable={false}
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        style={{
          filter: isActive ? 'none' : 'brightness(0.42) saturate(0.6)',
          transition: 'filter 560ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      />

      {/* Bottom gradient */}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent" />

      {/* Active glow border */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          opacity: isActive ? 1 : 0,
          boxShadow: 'inset 0 0 0 1px hsl(var(--primary) / 0.5)',
        }}
      />

      {/* Availability dot */}
      {isActive && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.18, type: 'spring', stiffness: 260 }}
          className={`absolute right-3 top-3 h-1.5 w-1.5 rounded-full ${availabilityDot[painting.availability]}`}
        />
      )}
    </div>

    {/* Info — slides up when active */}
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
    </motion.div>
  </Link>
);

// ── Hero Painting Carousel ────────────────────────────────────────────────────

const AUTOPLAY_MS = 4200;

const HeroPaintingCarousel = () => {
  const paintings = fineArtPaintings.slice(0, 6);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  // Touch swipe
  const touchStartX = useRef(0);
  const touchStartTime = useRef(0);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartX.current = e.touches[0].clientX;
    touchStartTime.current = performance.now();
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      setIsPaused(false);
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      const dt = Math.max(performance.now() - touchStartTime.current, 1);
      if (Math.abs(dx) < 48 && Math.abs(dx) / dt < 0.18) return;
      if (dx < 0) setActiveIdx((i) => Math.min(i + 1, paintings.length - 1));
      else setActiveIdx((i) => Math.max(i - 1, 0));
    },
    [paintings.length],
  );

  // Autoplay
  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(
      () => setActiveIdx((i) => (i + 1) % paintings.length),
      AUTOPLAY_MS,
    );
    return () => clearInterval(id);
  }, [isPaused, paintings.length]);

  // Scroll active card into view within the track
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const cards = track.querySelectorAll<HTMLElement>(':scope > a');
    const card = cards[activeIdx];
    if (!card) return;
    const trackRect = track.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const scrollLeft =
      track.scrollLeft +
      (cardRect.left - trackRect.left) -
      (trackRect.width - cardRect.width) / 2;
    track.scrollTo({ left: scrollLeft, behavior: 'smooth' });
  }, [activeIdx]);

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
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
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            className="transition-transform group-hover:translate-x-0.5"
          >
            <path
              d="M2.5 6h7M6.5 3l3 3-3 3"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>

      {/* Scrollable track */}
      <div
        ref={trackRef}
        className="flex gap-2 overflow-x-auto px-6 md:px-10 scrollbar-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {paintings.map((p, i) => (
          <MiniCard
            key={p.id}
            painting={p}
            isActive={i === activeIdx}
            onClick={() => setActiveIdx(i)}
          />
        ))}
      </div>

      {/* Dot row */}
      <div className="mt-4 flex justify-center gap-1.5 px-6">
        {paintings.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIdx(i)}
            aria-label={`Go to painting ${i + 1}`}
            className="h-px transition-all duration-700"
            style={{
              width: i === activeIdx ? 28 : 10,
              backgroundColor:
                i === activeIdx
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
  const { scrollY } = useScroll();

  // Parallax: text rises as user scrolls down
  const heroY = useTransform(scrollY, [0, 500], [0, -80]);
  const heroOpacity = useTransform(scrollY, [0, 320], [1, 0]);

  // Carousel fades in slightly after hero text
  const carouselOpacity = useTransform(scrollY, [0, 260], [1, 0]);
  const carouselY = useTransform(scrollY, [0, 260], [0, 30]);

  return (
    <div
      className="relative z-10 flex flex-col"
      style={{ height: '100svh', maxHeight: '768px' }}
    >
      {/* ── Main hero copy ─────────────────────────────────────────────── */}
      <motion.div
        style={{ y: heroY, opacity: heroOpacity }}
        className="flex flex-1 flex-col items-center justify-center px-6 pt-24 text-center"
      >
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 font-body text-[9px] uppercase tracking-[0.45em] text-primary/70"
        >
          India's Premier Art Gallery
        </motion.p>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
          className="font-display pb-8 text-5xl font-light leading-[1.08] text-foreground sm:text-6xl md:text-7xl lg:text-8xl"
        >
          India Fine
          <span className="block italic text-gradient-gold"> Art</span>
        </motion.h1>

        {/* Sub-line */}
        {/* <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-6 max-w-sm font-body text-sm leading-relaxed text-muted-foreground/70 md:max-w-md"
        >
          Curated originals and limited editions from India's most celebrated
          traditional and contemporary masters.
        </motion.p> */}

        {/* CTA buttons */}
        {/* <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
        >
          <Link
            to="/marketplace"
            className="border border-primary bg-primary/10 px-8 py-3 font-body text-[10px] uppercase tracking-[0.3em] text-primary backdrop-blur-sm transition-all hover:bg-primary hover:text-background"
          >
            Explore Gallery
          </Link>
          <Link
            to="/artists"
            className="border border-border/30 px-8 py-3 font-body text-[10px] uppercase tracking-[0.3em] text-muted-foreground backdrop-blur-sm transition-all hover:border-primary/40 hover:text-primary/80"
          >
            Meet the Artists
          </Link>
        </motion.div> */}
        <motion.div
          style={{ y: carouselY, opacity: carouselOpacity }}
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-7xl pb-8"
        >
          <HeroPaintingCarousel />
          {/* Top separator */}
          {/* <div className="mx-6 mb-6 h-px bg-gradient-to-r from-transparent via-border/20 to-transparent md:mx-10" /> */}


        </motion.div>
        {/* Scroll hint */}
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

      {/* ── Featured Works carousel ────────────────────────────────────── */}

    </div>
  );
};

export default HeroOverlay;