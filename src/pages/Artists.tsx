import { useMemo, useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { artists } from '@/features/shared/data/artists';
import Navigation from '@/features/navigation/Navigation';
import PageHeader from '@/components/PageHeader';
import { Link } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';

// ── Shared easing ─────────────────────────────────────────────────────────────
const EASE = [0.22, 1, 0.36, 1] as const;

type SortOption = 'name-asc' | 'name-desc';

// ── Artist card — individual scroll-triggered reveal ─────────────────────────
const ArtistCard = ({
  artist,
  index,
}: {
  artist: (typeof artists)[number];
  index: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: EASE, delay: (index % 3) * 0.1 }}
    >
      <Link
        to={`/artists/${artist.id}`}
        className="group block border border-border bg-card shadow-warm transition-all duration-500 hover:border-primary/30 hover:shadow-warm-lg"
      >
        <div className="aspect-square overflow-hidden">
          <motion.img
            src={artist.image}
            alt={artist.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            initial={{ scale: 1.06 }}
            animate={inView ? { scale: 1 } : {}}
            transition={{ duration: 1.1, ease: EASE, delay: (index % 3) * 0.1 }}
          />
        </div>

        <div className="p-6">
          <h3 className="font-display text-xl font-light text-foreground">
            {artist.name}
          </h3>
          <p className="mt-1 font-body text-xs uppercase tracking-[0.2em] text-primary/60">
            {artist.speciality}
          </p>
          <p className="mt-3 line-clamp-2 font-body text-xs leading-relaxed text-muted-foreground">
            {artist.bio}
          </p>

          {artist.isFeatured && (
            <span className="mt-3 inline-block font-body text-[9px] uppercase tracking-[0.3em] text-gold">
              Featured
            </span>
          )}

          <span className="mt-4 block font-body text-[10px] uppercase tracking-[0.2em] text-primary transition-colors group-hover:text-primary/80">
            View Profile →
          </span>
        </div>
      </Link>
    </motion.div>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────
const Artists = () => {
  const [sort,        setSort]        = useState<SortOption>('name-asc');
  const [search,      setSearch]      = useState('');
  const [featured,    setFeatured]    = useState<'all' | 'featured'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const toolbarRef = useRef<HTMLDivElement>(null);
  const toolbarInView = useInView(toolbarRef, { once: true, margin: '-40px' });

  const filteredArtists = useMemo(() => {
    const result = artists.filter((artist) => {
      if (search && !artist.name.toLowerCase().includes(search.toLowerCase()))
        return false;
      if (featured === 'featured' && !artist.isFeatured) return false;
      return true;
    });

    result.sort((a, b) => {
      const cmp = a.name.localeCompare(b.name);
      return sort === 'name-asc' ? cmp : -cmp;
    });

    return result;
  }, [search, featured, sort]);

  const activeFilterCount =
    (search ? 1 : 0) + (featured === 'featured' ? 1 : 0);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="mx-auto max-w-7xl px-6 pb-20 pt-28">

        {/* ── Page header ─────────────────────────────────────────────── */}
        <PageHeader
          eyebrow="Our Artists"
          title="Artists"
          subtitle="Meet the master artisans and contemporary visionaries whose work defines the India Fine Art experience."
        />

        {/* ── Toolbar — slides up after header ────────────────────────── */}
        <div ref={toolbarRef}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={toolbarInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE }}
            className="mb-8 flex flex-wrap items-center justify-between gap-4"
          >
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 border border-border px-4 py-2 font-body text-xs uppercase tracking-[0.2em] text-foreground transition-colors hover:border-primary"
            >
              <SlidersHorizontal size={14} />
              Filters
              {activeFilterCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <div className="flex items-center gap-2">
              <label className="font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Sort by
              </label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="border border-border bg-card px-3 py-2 font-body text-xs text-foreground outline-none transition-colors focus:border-primary"
              >
                <option value="name-asc">Name: A → Z</option>
                <option value="name-desc">Name: Z → A</option>
              </select>
            </div>
          </motion.div>

          {/* ── Filter panel — AnimatePresence for enter/exit ──────────── */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                key="filter-panel"
                initial={{ opacity: 0, height: 0, y: -8 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -8 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="mb-8 overflow-hidden border border-border bg-card"
              >
                <div className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="font-body text-xs uppercase tracking-[0.2em] text-foreground">
                      Refine
                    </span>
                    <button
                      onClick={() => { setSearch(''); setFeatured('all'); }}
                      className="font-body text-[10px] uppercase tracking-[0.2em] text-primary hover:underline"
                    >
                      Clear All
                    </button>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        Artist Name
                      </label>
                      <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name"
                        className="w-full border border-border bg-card px-3 py-2 font-body text-xs text-foreground outline-none transition-colors focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        Featured
                      </label>
                      <select
                        value={featured}
                        onChange={(e) => setFeatured(e.target.value as 'all' | 'featured')}
                        className="w-full border border-border bg-card px-3 py-2 font-body text-xs text-foreground outline-none transition-colors focus:border-primary"
                      >
                        <option value="all">All Artists</option>
                        <option value="featured">Featured Only</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Grid ───────────────────────────────────────────────────── */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredArtists.length > 0 ? (
              filteredArtists.map((artist, i) => (
                <ArtistCard key={artist.id} artist={artist} index={i} />
              ))
            ) : (
              <motion.p
                key="empty"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="col-span-full py-20 text-center font-body text-sm text-muted-foreground"
              >
                No artists match your filters.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Artists;
