import { motion } from 'framer-motion';
import GalleryCarousel from '@/components/GalleryCarousel';
import { fineArtPaintings, type Painting } from '@/features/shared/data/paintings';
import { Link } from 'react-router-dom';
import { useCardWidth } from '@/hooks/use-card-dimensions';


// ── Availability badge ────────────────────────────────────────────────────────

const availabilityConfig = {
  available: { label: 'Available', classes: 'bg-emerald-900/60 text-emerald-300 border-emerald-700/40' },
  reserved: { label: 'Reserved', classes: 'bg-amber-900/60  text-amber-300  border-amber-700/40' },
  sold: { label: 'Sold', classes: 'bg-rose-900/60   text-rose-300   border-rose-700/40' },
} as const;

// ── Fine Art Card ─────────────────────────────────────────────────────────────

interface PaintingCardProps {
  painting: Painting;
  isActive: boolean;
  absOffset: number;
}

const FineArtCard = ({ painting, isActive, absOffset }: PaintingCardProps) => {
  const badge = availabilityConfig[painting.availability];
  const cardWidth = useCardWidth();

  return (
    <div
      className={`group relative overflow-hidden transition-shadow duration-700 ${isActive ? 'glow-gold' : ''
        }`}
      style={{ width: cardWidth }}
    >
      {/* Artwork image */}
      <div className="relative h-96 w-full overflow-hidden">
        <img
          src={painting.image}
          alt={painting.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          style={{
            filter: isActive
              ? 'none'
              : `blur(${absOffset * 1.5}px) brightness(${1 - absOffset * 0.15})`,
          }}
          draggable={false}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-background/90 via-background/10 to-transparent" />

        {/* Availability badge */}
        {isActive && (
          <motion.span
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25, duration: 0.35 }}
            className={`absolute right-4 top-4 border px-2.5 py-1 font-body text-[9px] font-semibold uppercase tracking-[0.18em] backdrop-blur-sm ${badge.classes}`}
          >
            {badge.label}
          </motion.span>
        )}

        {/* Framed indicator */}
        {painting.art_piece_type === 'framed' && isActive && (
          <motion.span
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35, duration: 0.35 }}
            className="absolute left-4 top-4 border border-primary/30 bg-background/50 px-2.5 py-1 font-body text-[9px] uppercase tracking-[0.18em] text-primary/80 backdrop-blur-sm"
          >
            Framed
          </motion.span>
        )}
      </div>

      {/* Info panel */}
      <motion.div
        animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 12 }}
        transition={{ duration: 0.45 }}
        className="absolute bottom-0 left-0 right-0 p-5"
      >
        <p className="font-body text-[9px] uppercase tracking-[0.2em] text-primary/60">
          {painting.style}
        </p>
        <h3 className="mt-1 font-display text-2xl font-light italic text-foreground">
          {painting.title}
        </h3>
        <p className="mt-1 font-body text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          {painting.artist}
        </p>
        <p className="mt-0.5 font-body text-[9px] text-muted-foreground/60">
          {painting.medium} · {painting.dimensions} · {painting.year}
        </p>

        {/* Price row */}
        <div className="mt-4 flex items-baseline justify-between border-t border-border/20 pt-3">
          <div>
            <span className="font-display text-2xl font-light text-primary">
              ₹{painting.price.toLocaleString('en-IN')}
            </span>
          </div>
          {painting.availability === 'available' && (
            <span className="font-body text-[9px] uppercase tracking-[0.15em] text-muted-foreground/50">
              {painting.size} · {painting.orientation}
            </span>
          )}
        </div>
      </motion.div>
    </div>

  );
};

// ── Section ───────────────────────────────────────────────────────────────────

const FineArtSection = () => {
  const cardWidth = useCardWidth();
  return (
    <GalleryCarousel<Painting>
      items={fineArtPaintings}
      sectionId="fine-art"
      eyebrow="Original Works"
      title={
        <>
          Fine Art
          <span className="block italic text-gradient-gold">Collection</span>
        </>
      }
      // subtitle="Singular originals in India's most revered traditions — each work a unique artefact of culture, technique, and devotion."
      autoplayInterval={5500}
      cardWidth={cardWidth}
      carouselHeight={480}
      renderCard={(painting, isActive, absOffset) => {
        return isActive === true ?
          (<Link key={painting.id} to={`/marketplace/${painting.id}`}>
            <FineArtCard painting={painting} isActive={isActive} absOffset={absOffset} />
          </Link>) :
          (<><FineArtCard painting={painting} isActive={isActive} absOffset={absOffset} /></>)
      }} />
  )
};

export default FineArtSection;
