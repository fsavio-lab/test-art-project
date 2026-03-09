import { motion } from 'framer-motion';
import GalleryCarousel from '@/components/GalleryCarousel';
import { artists, type Artist } from '@/features/shared/data/artists';
import { Link } from 'react-router-dom';
import { useCardWidth } from "@/hooks/use-card-dimensions"

// ── Artist Card ───────────────────────────────────────────────────────────────

interface ArtistCardProps {
  artist: Artist;
  isActive: boolean;
  absOffset: number;
}

const ArtistCard = ({ artist, isActive, absOffset }: ArtistCardProps) => {
  const cardWidth = useCardWidth();

  return (
    <div
      className={`group relative overflow-hidden transition-shadow duration-700 ${isActive ? 'glow-gold' : ''
        }`}
      style={{ width: cardWidth }}
    >
      {/* Portrait */}
      <div className="relative h-96 w-full overflow-hidden">
        <img
          src={artist.image}
          alt={artist.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          style={{
            filter: isActive
              ? 'none'
              : `blur(${absOffset * 1.5}px) brightness(${1 - absOffset * 0.15})`,
          }}
          draggable={false}
        />

        {/* Vignette */}
        <div className="absolute inset-0 bg-linear-to-t from-background/90 via-background/20 to-transparent" />

        {/* Award badge */}
        {isActive && artist.awards && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="absolute left-4 top-4 bg-primary/90 px-2.5 py-1 backdrop-blur-sm truncate max-w-52"
          >
            {artist.awards && <span className="font-body text-[9px] font-semibold uppercase tracking-[0.18em] text-background ">
              ★ {artist.awards[0]}</span>}

          </motion.div>
        )}
      </div>

      {/* Info panel */}
      <motion.div
        animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 12 }}
        transition={{ duration: 0.45 }}
        className="absolute bottom-0 left-0 right-0 p-5"
      >
        <p className="font-body text-[9px] uppercase tracking-[0.25em] text-primary/70">
          {artist.origin}
        </p>
        <h3 className="mt-1 font-display text-2xl font-light italic text-foreground">
          {artist.name}
        </h3>
        <p className="mt-1 font-body text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          {artist.speciality}
        </p>

        {/* Style tags */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {artist.styles.map((s) => (
            <span
              key={s}
              className="border border-primary/20 px-2 py-0.5 font-body text-[9px] uppercase tracking-[0.15em] text-primary/60"
            >
              {s}
            </span>
          ))}
        </div>

        {/* Stats row */}
        <div className="mt-4 flex items-center gap-5 border-t border-border/20 pt-3">
          <div>
            <span className="font-display text-lg font-light text-primary">
              {artist.totalWorks}
            </span>
            <p className="font-body text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
              Works
            </p>
          </div>
          <div className="h-6 w-px bg-border/20" />
          <div>
            <p className="font-body text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
              Active
            </p>
            <span className="font-body text-[10px] text-foreground/70">
              {artist.yearsActive}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  )
};

// ── Section ───────────────────────────────────────────────────────────────────

const ArtistsSection = () => (
  <GalleryCarousel<Artist>
    items={artists}
    sectionId="artists"
    eyebrow="The Makers"
    title={
      <>
        Contemporary  <span className='italic text-gradient-gold ps-4'>Art</span>
      </>
    }
    autoplayInterval={6000}
    cardWidth={360}
    carouselHeight={480}
    renderCard={(artist, isActive, absOffset) => {
      return isActive === true ?
        (<Link key={artist.id} to={`/artists/${artist.id}`}>
          <ArtistCard artist={artist} isActive={isActive} absOffset={absOffset} />
        </Link>) :
        (<><ArtistCard artist={artist} isActive={isActive} absOffset={absOffset} /></>)
    }
    }
  />
);

export default ArtistsSection;
