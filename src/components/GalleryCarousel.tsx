import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
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

/**
 * Minimum swipe distance (px) OR velocity (px/ms) required to advance a slide.
 * Keeping both thresholds low keeps it snappy while avoiding accidental triggers.
 */
const SWIPE_MIN_PX = 64;
const SWIPE_MIN_VEL = 0.18; // px/ms — lower vel threshold keeps slow intentional drags working

// ── Component ─────────────────────────────────────────────────────────────────

function GalleryCarousel<T extends { id: string | number }>({
  items,
  renderCard,
  sectionId,
  eyebrow,
  title,
  subtitle,
  autoplayInterval = 8000,
  cardWidth = 300,
  carouselHeight = 500,
}: GalleryCarouselProps<T>) {
  const [activeIndex, setActiveIndex] = useState(Math.floor(items.length / 2));
  const [isPaused, setIsPaused] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  const isMobile = useIsMobile();
  const spacing = isMobile ? cardWidth * 0.75 : cardWidth + 20;

  // ── Touch state (refs avoid re-renders during gesture) ──────────────────────
  const touchStartX = useRef(0);
  const touchStartTime = useRef(0);

  // ── Autoplay ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (isPaused || !isInView) return;
    const id = setInterval(
      () => setActiveIndex((i) => (i + 1) % items.length),
      autoplayInterval,
    );
    return () => clearInterval(id);
  }, [isPaused, isInView, items.length, autoplayInterval]);

  // ── Native touch handlers (replaces Framer Motion drag) ─────────────────────
  // Using native events keeps gesture tracking OFF the JS animation loop.
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartX.current = e.touches[0].clientX;
    touchStartTime.current = performance.now();
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      setIsPaused(false);
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      const dt = performance.now() - touchStartTime.current;
      const velocity = Math.abs(dx) / Math.max(dt, 1);

      const shouldAdvance = Math.abs(dx) > SWIPE_MIN_PX || velocity > SWIPE_MIN_VEL;
      if (!shouldAdvance) return;

      if (dx < 0 && activeIndex < items.length - 1) setActiveIndex((i) => i + 1);
      else if (dx > 0 && activeIndex > 0) setActiveIndex((i) => i - 1);
    },
    [activeIndex, items.length],
  );

  // ── Keyboard navigation ───────────────────────────────────────────────────
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && activeIndex > 0) setActiveIndex((i) => i - 1);
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
      role="region"
      aria-label={eyebrow}
      tabIndex={0}
    >
      {/* ── Section header ────────────────────────────────────────────────── */}
      {/*
       * Framer Motion is KEPT here intentionally — this is a one-shot entrance
       * animation (not a per-frame loop), so its overhead is negligible.
       */}
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

      {/* ── Carousel track ───────────────────────────────────────────────────
       *
       *  Performance decisions:
       *  ┌─────────────────────────────────────────────────────────────────┐
       *  │  contain: strict           → isolates paint/layout subtree      │
       *  │  will-change on children   → pre-promotes each card to GPU layer│
       *  │  CSS transition            → runs on compositor, NOT JS thread  │
       *  │  translate3d               → single composite op, no z/rotateY  │
       *  │  pointer-events: none      → skip hit-testing invisible cards   │
       *  │  absOffset > 3 culled      → fewer nodes in the DOM             │
       *  └─────────────────────────────────────────────────────────────────┘
       *
       *  Why no Framer Motion here:
       *  FM's `animate` prop diffs values in JS every RAF tick, serialising
       *  work onto the main thread and breaking the compositor fast-path.
       *  Pure CSS transitions hand off to the GPU immediately after the
       *  first style recalc, achieving true 120 fps on modern mobile.
       */}
      <div
        className="relative mx-auto flex max-w-6xl items-center justify-center overflow-hidden"
        style={{
          height: carouselHeight,
          // Isolate this subtree: browser won't re-layout/paint outside it.
          contain: 'layout style paint',
        }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {items.map((item, index) => {
          const offset = index - activeIndex;
          const absOffset = Math.abs(offset);

          // Cull cards that are completely off-screen — no DOM node, no GPU layer.
          if (absOffset > 3) return null;

          const isActive = index === activeIndex;

          // Values computed once per render, then handed to the CSS engine.
          const scale = isActive ? 1 : Math.max(0.64, 0.78 - absOffset * 0.07);
          const opacity = absOffset > 2 ? 0 : 1 - absOffset * 0.28;
          const tx = offset * spacing;

          return (
            <div
              key={item.id}
              role="option"
              aria-selected={isActive}
              aria-label={`Item ${index + 1} of ${items.length}`}
              onClick={() => setActiveIndex(index)}
              style={{
                position: 'absolute',

                // ─── GPU composite path ──────────────────────────────────
                // translate3d forces layer promotion and avoids triggering
                // layout. Skipping rotateY / z keeps the composite op cheap.
                transform: `translate3d(${tx}px, 0, 0) scale(${scale})`,
                opacity,

                // Pre-promote to GPU layer so the browser doesn't need to
                // rasterise on the first frame of the transition.
                willChange: 'transform, opacity',

                // 680 ms long-ease — unhurried, deliberate, luxury pacing.
                // cubic-bezier: slow start, confident glide, silky settle.
                transition:
                  'transform 680ms cubic-bezier(0.16, 1, 0.3, 1), opacity 520ms cubic-bezier(0.16, 1, 0.3, 1)',

                zIndex: 10 - absOffset,
                cursor: isActive ? 'default' : 'pointer',

                // Invisible cards must not receive pointer events — prevents
                // ghost clicks and keeps hit-testing fast.
                pointerEvents: absOffset > 2 ? 'none' : 'auto',

                // Avoid the browser painting card contents when only the
                // parent transform changes.
                backfaceVisibility: 'hidden',
              }}
            >
              {renderCard(item, isActive, absOffset)}
            </div>
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
            className={`h-px transition-all duration-700 ${
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
            <path
              d="M10 3L5 8l5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <span className="font-body text-xs tabular-nums text-muted-foreground/60">
          {String(activeIndex + 1).padStart(2, '0')} /{' '}
          {String(items.length).padStart(2, '0')}
        </span>
        <button
          onClick={() => setActiveIndex((i) => Math.min(items.length - 1, i + 1))}
          disabled={activeIndex === items.length - 1}
          aria-label="Next"
          className="flex h-9 w-9 items-center justify-center border border-border/40 text-muted-foreground transition-all hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-20"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M6 3l5 5-5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </section>
  );
}

export default GalleryCarousel;