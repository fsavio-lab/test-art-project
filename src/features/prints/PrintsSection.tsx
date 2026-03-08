import { motion } from 'framer-motion';
import GalleryCarousel from '@/components/GalleryCarousel';
import { printPaintings, type Painting } from '@/features/shared/data/paintings';
import { Link } from 'react-router-dom';

// ── Edition pill ──────────────────────────────────────────────────────────────

const editionColor = {
  'Limited Edition': 'border-amber-700/40 bg-amber-900/40 text-amber-300',
  'Rare Edition': 'border-rose-700/40   bg-rose-900/40   text-rose-300',
  'Open Edition': 'border-sky-700/40    bg-sky-900/40    text-sky-300',
} as const;

const availabilityConfig = {
  available: { label: 'Available', classes: 'bg-emerald-900/60 text-emerald-300 border-emerald-700/40' },
  reserved: { label: 'Reserved', classes: 'bg-amber-900/60  text-amber-300  border-amber-700/40' },
  sold: { label: 'Sold', classes: 'bg-rose-900/60   text-rose-300   border-rose-700/40' },
} as const;

// ── Print Card ────────────────────────────────────────────────────────────────

interface PrintCardProps {
  painting: Painting;
  isActive: boolean;
  absOffset: number;
}

const PrintCard = ({ painting, isActive, absOffset }: PrintCardProps) => {
  const pillClass =
    painting.edition && editionColor[painting.edition as keyof typeof editionColor]
      ? editionColor[painting.edition as keyof typeof editionColor]
      : 'border-border/40 bg-background/60 text-muted-foreground';

  const soldOut = painting.availability === 'sold';
  const reserved = painting.availability === 'reserved';

  return (
    <div
      className={`group relative overflow-hidden transition-shadow duration-700 ${isActive ? 'glow-gold' : ''
        }`}
      style={{ width: 290 }}
    >
      {/* Print image */}
      <div className="relative h-96 w-full overflow-hidden">
        <img
          src={painting.image}
          alt={painting.title}
          className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 ${soldOut ? 'grayscale' : ''
            }`}
          style={{
            filter: isActive
              ? soldOut
                ? 'grayscale(1)'
                : 'none'
              : `blur(${absOffset * 1.5}px) brightness(${1 - absOffset * 0.15})`,
          }}
          draggable={false}
        />

        {/* Gradient */}
        <div className="absolute inset-0 bg-linear-to-t from-background/90 via-background/10 to-transparent" />

        {/* Edition pill (top-left) */}
        {isActive && (
          <motion.span
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25, duration: 0.35 }}
            className={`absolute right-4 top-4 border px-2.5 py-1 font-body text-[9px] font-semibold uppercase tracking-[0.18em] backdrop-blur-sm ${availabilityConfig[painting.availability].classes}`}
          >
            {painting.availability}
          </motion.span>
        )}

        {/* Sold / Reserved overlay */}
        {/* {isActive && (soldOut || reserved) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="absolute inset-0 flex items-center justify-center bg-background/60">
            <span className="font-body text-xs uppercase tracking-[0.3em] text-foreground">
              {painting.availability === 'sold' ? 'Sold' : 'Reserved'}
            </span>
          </div>
          </motion.div>
        )} */}
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
          {painting.medium} · {painting.dimensions}
        </p>

        {/* Edition counter bar */}
        {isActive && painting.totalEditions && painting.editionNumber && (
          <div className="mt-3">
            <div className="mb-1 flex justify-between font-body text-[9px] text-muted-foreground/50">
              <span>Edition {painting.editionNumber} of {painting.totalEditions}</span>
              <span>
                {Math.round((painting.editionNumber / painting.totalEditions) * 100)}% claimed
              </span>
            </div>
            <div className="h-px w-full bg-border/20">
              <div
                className="h-full bg-primary/60 transition-all duration-700"
                style={{
                  width: `${(painting.editionNumber / painting.totalEditions) * 100}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Price row */}
        <div className="mt-4 flex items-baseline justify-between border-t border-border/20 pt-3">
          <span className="font-display text-2xl font-light text-primary">
            ₹{painting.price.toLocaleString('en-IN')}
          </span>
          {!soldOut && !reserved && (
            <span className="font-body text-[9px] uppercase tracking-[0.12em] text-muted-foreground/50">
              Incl. certificate
            </span>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// ── Section ───────────────────────────────────────────────────────────────────

const PrintsSection = () => (
  <GalleryCarousel<Painting>
    items={printPaintings}
    sectionId="prints"
    eyebrow="Editions & Prints"
    title={
      <>
        Limited
        <span className="block italic text-gradient-gold">Editions</span>
      </>
    }
    subtitle="Museum-quality reproductions with the soul of the original — archival inks, handmade papers, and gold-ink detailing. Each edition is individually signed and certified."
    autoplayInterval={6500}
    cardWidth={290}
    carouselHeight={480}
    renderCard={(painting, isActive, absOffset) => {
      return isActive === true ?
        (<Link key={painting.id
        } to={`/marketplace/${painting.id}`}>
          <PrintCard painting={painting} isActive={isActive} absOffset={absOffset} />
        </Link>) :
        (<><PrintCard painting={painting} isActive={isActive} absOffset={absOffset} /></>)
    }}
  />
);

export default PrintsSection;
