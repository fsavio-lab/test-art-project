import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import artwork1 from '@/assets/artwork-1.jpg';
import artwork2 from '@/assets/artwork-2.jpg';
import artwork3 from '@/assets/artwork-3.jpg';
import artwork4 from '@/assets/artwork-4.jpg';
import artwork5 from '@/assets/artwork-5.jpg';
import { useIsMobile } from '@/hooks/use-mobile';

const artworks = [
  { id: 1, src: artwork1, title: 'Radha Krishna — Tanjore', artist: 'Lakshmi Venkataraman', year: '2024', medium: 'Gold leaf on wood panel' },
  { id: 2, src: artwork2, title: 'Village Life — Warli', artist: 'Jivya Soma Mashe', year: '2024', medium: 'Rice paste on mud wall' },
  { id: 3, src: artwork3, title: 'Cosmic Dance — Pattachitra', artist: 'Ananta Maharana', year: '2023', medium: 'Natural dyes on silk' },
  { id: 4, src: artwork4, title: 'Mughal Garden', artist: 'Razia Sultana', year: '2024', medium: 'Mineral pigments on wasli' },
  { id: 5, src: artwork5, title: 'Tree of Life — Madhubani', artist: 'Bharti Dayal', year: '2023', medium: 'Acrylic ink on handmade paper' },
];

const swipeConfidenceThreshold = 10000;

const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

const ArtCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(2);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const isMobile = useIsMobile();
  const spacing = isMobile ? 220 : 280;

  return (
    <section ref={sectionRef} id="collection" className="relative z-10 py-32">
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 1 }}
        className="mb-20 text-center"
      >
        <p className="mb-4 font-body text-xs uppercase tracking-[0.4em] text-primary/60">
          Current Exhibition
        </p>
        <h2 className="font-display text-5xl font-light text-foreground md:text-7xl">
          Selected Works
        </h2>
      </motion.div>

      {/* 3D Carousel */}
      <div className="relative mx-auto flex h-125 max-w-6xl items-center justify-center overflow-hidden">
        {artworks.map((artwork, index) => {
          const offset = index - activeIndex;
          const absOffset = Math.abs(offset);
          const isActive = index === activeIndex;

          return (
            <motion.div
              key={artwork.id}
              className="absolute cursor-pointer touch-pan-y"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);

                if (
                  swipe < -swipeConfidenceThreshold &&
                  activeIndex < artworks.length - 1
                ) {
                  setActiveIndex((prev) => prev + 1);
                } else if (
                  swipe > swipeConfidenceThreshold &&
                  activeIndex > 0
                ) {
                  setActiveIndex((prev) => prev - 1);
                }
              }}
              animate={{
                x: offset * spacing,
                z: -absOffset * 100,
                scale: isActive ? 1 : 0.75 - absOffset * 0.08,
                opacity: absOffset > 2 ? 0 : 1 - absOffset * 0.25,
                rotateY: offset * -5,
              }}
              transition={{ type: 'spring', stiffness: 200, damping: 30 }}
              onClick={() => setActiveIndex(index)}
              style={{ zIndex: 10 - absOffset, perspective: 1000 }}
            >
              <div
                className={`group relative overflow-hidden transition-shadow duration-700 ${
                  isActive ? 'glow-gold' : ''
                }`}
              >
                <div className="relative h-100 w-75 overflow-hidden">
                  <img
                    src={artwork.src}
                    alt={artwork.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{
                      filter: isActive
                        ? 'none'
                        : `blur(${absOffset * 1.5}px) brightness(${1 - absOffset * 0.15})`,
                    }}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-background/80 via-transparent to-transparent" />
                </div>

                <motion.div
                  animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 10 }}
                  transition={{ duration: 0.5 }}
                  className="absolute bottom-0 left-0 right-0 p-6"
                >
                  <h3 className="font-display text-2xl font-light italic text-foreground">
                    {artwork.title}
                  </h3>
                  <p className="mt-1 font-body text-xs tracking-wider text-primary/70">
                    {artwork.artist}
                  </p>
                  <p className="mt-0.5 font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    {artwork.medium} · {artwork.year}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Navigation dots */}
      <div className="mt-12 flex items-center justify-center gap-3">
        {artworks.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`h-1 transition-all duration-500 ${
              index === activeIndex
                ? 'w-8 bg-primary'
                : 'w-3 bg-muted-foreground/30 hover:bg-muted-foreground/50'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default ArtCarousel;
