import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, useInView, PanInfo } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface GalleryCarouselProps<T> {
  items: T[];
  renderCard: (item: T, isActive: boolean, absOffset: number) => React.ReactNode;
  sectionId: string;
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
  autoplayInterval?: number;
  /** Width of each card in px (desktop). Default 300. */
  cardWidth?: number;
  /** Height of the carousel viewport in px. Default 500. */
  carouselHeight?: number;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const SWIPE_THRESHOLD = 8000;

const swipePower = (offset: number, velocity: number) =>
  Math.abs(offset) * velocity;

// ── Component ─────────────────────────────────────────────────────────────────

function GalleryCarousel<T extends { id: string | number }>({
  items,
  renderCard,
  sectionId,
  eyebrow,
  title,
  subtitle,
  autoplayInterval = 5500,
  cardWidth = 300,
  carouselHeight = 500,
}: GalleryCarouselProps<T>) {
  const [activeIndex, setActiveIndex] = useState(
    // start at the middle item for the 3D effect to be immediately visible
    Math.floor(items.length / 2),
  );
  const [isPaused, setIsPaused] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  const isMobile = useIsMobile();
  const spacing = isMobile ? cardWidth * 0.75 : cardWidth + 20;

  // ── Autoplay ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (isPaused || !isInView) return;
    const id = setInterval(
      () => setActiveIndex((i) => (i + 1) % items.length),
      autoplayInterval,
    );
    return () => clearInterval(id);
  }, [isPaused, isInView, items.length, autoplayInterval]);

  // ── Drag handler ─────────────────────────────────────────────────────────────
  const handleDragEnd = useCallback(
    (_: unknown, { offset, velocity }: PanInfo) => {
      setIsPaused(false);
      const power = swipePower(offset.x, velocity.x);
      if (power < -SWIPE_THRESHOLD && activeIndex < items.length - 1) {
        setActiveIndex((i) => i + 1);
      } else if (power > SWIPE_THRESHOLD && activeIndex > 0) {
        setActiveIndex((i) => i - 1);
      }
    },
    [activeIndex, items.length],
  );

  // ── Keyboard navigation ───────────────────────────────────────────────────
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && activeIndex > 0)
        setActiveIndex((i) => i - 1);
      if (e.key === 'ArrowRight' && activeIndex < items.length - 1)
        setActiveIndex((i) => i + 1);
    },
    [activeIndex, items.length],
  );

  return (
    <section
      ref={sectionRef}
      id={sectionId}
      className="relative z-10 py-28"
      onKeyDown={handleKeyDown}
      // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
      role="region"
      aria-label={eyebrow}
      tabIndex={0}
    >
      {/* ── Section header ────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="mb-16 px-6 text-center"
      >
        <p className="mb-4 font-body text-xs uppercase tracking-[0.4em] text-primary/60">
          {eyebrow}
        </p>
        <h2 className="font-display text-5xl font-light leading-tight text-foreground md:text-6xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mx-auto mt-5 max-w-xl font-body text-sm leading-relaxed text-muted-foreground">
            {subtitle}
          </p>
        )}
      </motion.div>

      {/* ── 3D Carousel track ────────────────────────────────────────────────── */}
      <div
        className="relative mx-auto flex max-w-6xl items-center justify-center overflow-hidden"
        style={{ height: carouselHeight }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {items.map((item, index) => {
          const offset = index - activeIndex;
          const absOffset = Math.abs(offset);
          const isActive = index === activeIndex;

          return (
            <motion.div
              key={item.id}
              className="absolute cursor-pointer touch-pan-y select-none"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragStart={() => setIsPaused(true)}
              onDragEnd={handleDragEnd}
              animate={{
                x: offset * spacing,
                z: -absOffset * 120,
                scale: isActive ? 1 : 0.78 - absOffset * 0.07,
                opacity: absOffset > 2 ? 0 : 1 - absOffset * 0.28,
                rotateY: offset * -6,
              }}
              transition={{ type: 'spring', stiffness: 220, damping: 32 }}
              onClick={() => setActiveIndex(index)}
              style={{ zIndex: 10 - absOffset, perspective: 1200 }}
              aria-label={`Item ${index + 1} of ${items.length}`}
              aria-selected={isActive}
              role="option"
            >
              {renderCard(item, isActive, absOffset)}
            </motion.div>
          );
        })}
      </div>

      {/* ── Dot navigation ──────────────────────────────────────────────────── */}
      <div
        className="mt-10 flex items-center justify-center gap-2"
        role="tablist"
        aria-label="Carousel navigation"
      >
        {items.map((_, index) => (
          <button
            key={index}
            role="tab"
            aria-selected={index === activeIndex}
            aria-label={`Go to item ${index + 1}`}
            onClick={() => setActiveIndex(index)}
            className={`h-px transition-all duration-500 ${
              index === activeIndex
                ? 'w-10 bg-primary'
                : 'w-3 bg-muted-foreground/25 hover:bg-muted-foreground/50'
            }`}
          />
        ))}
      </div>

      {/* ── Arrow navigation (desktop) ───────────────────────────────────────── */}
      <div className="mt-6 hidden items-center justify-center gap-4 md:flex">
        <button
          onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
          disabled={activeIndex === 0}
          aria-label="Previous"
          className="flex h-9 w-9 items-center justify-center border border-border/40 text-muted-foreground transition-all hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-20"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className="font-body text-xs tabular-nums text-muted-foreground/60">
          {String(activeIndex + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
        </span>
        <button
          onClick={() => setActiveIndex((i) => Math.min(items.length - 1, i + 1))}
          disabled={activeIndex === items.length - 1}
          aria-label="Next"
          className="flex h-9 w-9 items-center justify-center border border-border/40 text-muted-foreground transition-all hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-20"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </section>
  );
}

export default GalleryCarousel;
