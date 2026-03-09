import { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, ArrowRight, TrendingUp } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSearch, trendingSearches, type SearchResultPainting, type SearchResultArtist } from '@/hooks/use-search';

// ── Ease ──────────────────────────────────────────────────────────────────────

const EASE = [0.22, 1, 0.36, 1] as const;

// ── Sub-components ────────────────────────────────────────────────────────────

const AvailabilityDot = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    available: 'bg-emerald-400',
    reserved: 'bg-amber-400',
    sold: 'bg-rose-400',
  };
  return (
    <span className={`inline-block h-1.5 w-1.5 rounded-full ${colors[status] ?? 'bg-border'}`} />
  );
};

// ── Painting result row ───────────────────────────────────────────────────────

const PaintingRow = ({
  result,
  onClose,
  index,
}: {
  result: SearchResultPainting;
  onClose: () => void;
  index: number;
}) => {
  const { item } = result;
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.38, delay: index * 0.055, ease: EASE }}
    >
      <Link
        to={`/marketplace/${item.id}`}
        onClick={onClose}
        className="group flex items-center gap-4 py-3 transition-colors hover:bg-primary/5"
      >
        {/* Thumbnail */}
        <div className="relative h-14 w-14 shrink-0 overflow-hidden">
          <img
            src={item.image}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            style={{ filter: item.availability === 'sold' ? 'grayscale(0.6)' : 'none' }}
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <AvailabilityDot status={item.availability} />
            <p className="font-body text-[8px] uppercase tracking-[0.2em] text-primary/50">
              {item.style}
            </p>
          </div>
          <h4 className="mt-0.5 truncate font-display text-base font-light italic text-foreground group-hover:text-primary transition-colors">
            {item.title}
          </h4>
          <p className="font-body text-[10px] text-muted-foreground/60">{item.artist}</p>
        </div>

        {/* Price */}
        <div className="text-right shrink-0">
          <p className="font-display text-sm font-light text-primary">
            ₹{item.price.toLocaleString('en-IN')}
          </p>
          <p className="font-body text-[9px] uppercase tracking-[0.15em] text-muted-foreground/40">
            {item.category === 'prints' ? item.edition ?? 'Print' : item.size}
          </p>
        </div>

        {/* Arrow */}
        <ArrowRight
          size={14}
          className="shrink-0 text-primary/0 transition-all group-hover:text-primary/60 group-hover:translate-x-0.5"
        />
      </Link>
    </motion.div>
  );
};

// ── Artist result row ─────────────────────────────────────────────────────────

const ArtistRow = ({
  result,
  onClose,
  index,
}: {
  result: SearchResultArtist;
  onClose: () => void;
  index: number;
}) => {
  const { item } = result;
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.38, delay: index * 0.055, ease: EASE }}
    >
      <Link
        to={`/artists/${item.id}`}
        onClick={onClose}
        className="group flex items-center gap-4 py-3 transition-colors hover:bg-primary/5"
      >
        {/* Portrait */}
        <div className="relative h-14 w-14 shrink-0flow-hidden rounded-full">
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-primary/20" />
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <p className="font-body text-[8px] uppercase tracking-[0.2em] text-primary/50">
            {item.origin}
          </p>
          <h4 className="mt-0.5 truncate font-display text-base font-light italic text-foreground group-hover:text-primary transition-colors">
            {item.name}
          </h4>
          <p className="font-body text-[10px] text-muted-foreground/60">{item.speciality}</p>
        </div>

        {/* Works count */}
        <div className="text-right shrink-0">
          <p className="font-display text-sm font-light text-primary">{item.totalWorks}</p>
          <p className="font-body text-[9px] uppercase tracking-[0.15em] text-muted-foreground/40">
            Works
          </p>
        </div>

        <ArrowRight
          size={14}
          className="shrink-0 text-primary/0 transition-all group-hover:text-primary/60 group-hover:translate-x-0.5"
        />
      </Link>
    </motion.div>
  );
};

// ── Category label ────────────────────────────────────────────────────────────

const CategoryLabel = ({
  label,
  count,
  to,
  onClose,
}: {
  label: string;
  count: number;
  to: string;
  onClose: () => void;
}) => (
  <div className="mb-2 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <span className="h-px w-4 bg-primary/40" />
      <p className="font-body text-[9px] uppercase tracking-[0.35em] text-primary/60">{label}</p>
      <span className="font-body text-[9px] text-muted-foreground/30">{count}</span>
    </div>
    {count > 3 && (
      <Link
        to={to}
        onClick={onClose}
        className="group flex items-center gap-1 font-body text-[9px] uppercase tracking-[0.2em] text-muted-foreground/40 transition-colors hover:text-primary/70"
      >
        See all
        <ArrowRight size={10} className="transition-transform group-hover:translate-x-0.5" />
      </Link>
    )}
  </div>
);

// ── Main Dialog ───────────────────────────────────────────────────────────────

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchDialog = ({ isOpen, onClose }: SearchDialogProps) => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const { query, setQuery, preview, results, reset, isEmpty } = useSearch();

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 120);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    if (isOpen) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleClose = useCallback(() => {
    onClose();
    reset();
  }, [onClose, reset]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!query.trim()) return;
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      handleClose();
    },
    [query, navigate, handleClose],
  );

  const handleTrending = useCallback(
    (term: string) => {
      setQuery(term);
      setTimeout(() => inputRef.current?.focus(), 50);
    },
    [setQuery],
  );

  const hasResults = !isEmpty && results.total > 0;
  const noResults = !isEmpty && results.total === 0;
  const showAllHref = `/search?q=${encodeURIComponent(query.trim())}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="search-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-60 bg-background/92 backdrop-blur-xl"
            onClick={handleClose}
          />

          {/* Panel */}
          <motion.div
            key="search-panel"
            initial={{ opacity: 0, y: -32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.48, ease: EASE }}
            className="fixed inset-x-0 top-0 z-61 mx-auto max-w-2xl px-4 pt-6 pb-8 sm:px-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ── Input row ─────────────────────────────────────────────── */}
            <form onSubmit={handleSubmit} className="relative">
              <div className="flex items-center gap-4 border-b border-border/30 pb-4 transition-colors focus-within:border-primary/60">
                <Search size={18} className="shrink-0 text-primary/50" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search paintings, artists, styles…"
                  className="flex-1 bg-transparent font-display text-xl font-light text-foreground placeholder:text-muted-foreground/30 outline-none"
                  autoComplete="off"
                  spellCheck={false}
                />
                {query && (
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    type="button"
                    onClick={() => setQuery('')}
                    className="shrink-0 text-muted-foreground/40 transition-colors hover:text-foreground"
                  >
                    <X size={16} />
                  </motion.button>
                )}
                <button
                  type="button"
                  onClick={handleClose}
                  className="shrink-0er border-border/30 px-2.5 py-1 font-body text-[9px] uppercase tracking-[0.25em] text-muted-foreground/50 transition-colors hover:border-primary/40 hover:text-primary/70"
                >
                  Esc
                </button>
              </div>

              {/* Submit hint */}
              {query.trim().length >= 2 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2 font-body text-[9px] uppercase tracking-[0.25em] text-muted-foreground/30"
                >
                  Press ↵ to see all results
                </motion.p>
              )}
            </form>

            {/* ── Body ──────────────────────────────────────────────────── */}
            <div className="mt-6 max-h-[68vh] overflow-y-auto overscroll-contain pr-1"
              style={{ scrollbarWidth: 'thin', scrollbarColor: 'hsl(var(--border)) transparent' }}
            >

              {/* Empty state — trending */}
              {isEmpty && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp size={12} className="text-primary/40" />
                    <p className="font-body text-[9px] uppercase tracking-[0.35em] text-primary/50">
                      Trending searches
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {trendingSearches.map((term, i) => (
                      <motion.button
                        key={term}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.04 }}
                        onClick={() => handleTrending(term)}
                        className="border border-border/30 px-3 py-1.5 font-body text-[10px] uppercase tracking-[0.18em] text-muted-foreground/60 transition-all hover:border-primary/50 hover:text-primary/80 hover:bg-primary/5"
                      >
                        {term}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* No results */}
              {noResults && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-10 text-center"
                >
                  <p className="font-display text-2xl font-light italic text-foreground/40">
                    Nothing found
                  </p>
                  <p className="mt-2 font-body text-xs text-muted-foreground/40">
                    Try a different term — style, artist, or medium
                  </p>
                </motion.div>
              )}

              {/* Results */}
              {hasResults && (
                <div className="space-y-6">
                  {/* Fine Art */}
                  {preview.paintings.length > 0 && (
                    <div>
                      <CategoryLabel
                        label="Fine Art"
                        count={results.paintings.length}
                        to={`${showAllHref}&cat=paintings`}
                        onClose={handleClose}
                      />
                      <div className="divide-y divide-border/10">
                        {preview.paintings.map((r, i) => (
                          <PaintingRow key={r.item.id} result={r} onClose={handleClose} index={i} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Prints */}
                  {preview.prints.length > 0 && (
                    <div>
                      <CategoryLabel
                        label="Editions & Prints"
                        count={results.prints.length}
                        to={`${showAllHref}&cat=prints`}
                        onClose={handleClose}
                      />
                      <div className="divide-y divide-border/10">
                        {preview.prints.map((r, i) => (
                          <PaintingRow key={r.item.id} result={r} onClose={handleClose} index={i} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Artists */}
                  {preview.artists.length > 0 && (
                    <div>
                      <CategoryLabel
                        label="Artists"
                        count={results.artists.length}
                        to={`${showAllHref}&cat=artists`}
                        onClose={handleClose}
                      />
                      <div className="divide-y divide-border/10">
                        {preview.artists.map((r, i) => (
                          <ArtistRow key={r.item.id} result={r} onClose={handleClose} index={i} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* View all CTA */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="border-t border-border/15 pt-5"
                  >
                    <Link
                      to={showAllHref}
                      onClick={handleClose}
                      className="group flex w-full items-center justify-between border border-border/20 px-5 py-3.5 transition-all hover:border-primary/50 hover:bg-primary/5"
                    >
                      <div>
                        <p className="font-body text-[9px] uppercase tracking-[0.3em] text-muted-foreground/50">
                          Full results
                        </p>
                        <p className="mt-0.5 font-display text-base font-light italic text-foreground group-hover:text-primary transition-colors">
                          View all {results.total} results for "{query}"
                        </p>
                      </div>
                      <ArrowRight
                        size={16}
                        className="text-primary/40 transition-transform group-hover:translate-x-1 group-hover:text-primary"
                      />
                    </Link>
                  </motion.div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchDialog;