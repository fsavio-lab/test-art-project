import { useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, SlidersHorizontal } from 'lucide-react';
import Navigation from '@/features/navigation/Navigation';
import { useSearch, trendingSearches, type SearchResult, type SearchCategory } from '@/hooks/use-search';
import PaintingCard from '@/features/marketplace/PaintingCard';

// ── Ease ──────────────────────────────────────────────────────────────────────

const EASE = [0.22, 1, 0.36, 1] as const;

// ── Category tab config ───────────────────────────────────────────────────────

const TABS: { id: SearchCategory; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'paintings', label: 'Fine Art' },
    { id: 'prints', label: 'Prints' },
    { id: 'artists', label: 'Artists' },
];

// ── Artist card ───────────────────────────────────────────────────────────────

const ArtistCard = ({ artist }: { artist: any }) => (
    <Link
        to={`/artists/${artist.id}`}
        className="group relative flex flex-col overflow-hidden transition-all duration-700 hover:shadow-[0_0_32px_-4px_hsl(var(--primary)/0.18)]"
    >
        {/* ── Portrait image ─────────────────────────────────────────────── */}
        <div className="relative overflow-hidden" style={{ aspectRatio: '3/4' }}>
            <img
                src={artist.image}
                alt={artist.name}
                className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />

            {/* Multi-layer gradient — deep bottom fade, soft top darkening */}
            <div className="absolute inset-0 bg-linear-to-t from-background via-background/30 to-transparent" style={{ background: 'linear-gradient(to top, hsl(var(--background)) 0%, hsl(var(--background)/0.55) 28%, transparent 58%)' }} />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, hsl(var(--background)/0.35) 0%, transparent 30%)' }} />

            {/* "The Maker" eyebrow — top left */}
            <div className="absolute left-0 top-0 flex items-center gap-2 px-4 pt-4">
                <span className="h-px w-3 bg-primary/50" />
                <p className="font-body text-[8px] uppercase tracking-[0.35em] text-primary/60">
                    The Maker
                </p>
            </div>

            {/* Award badge — top right */}
            {artist.awards?.[0] && (
                <div className="absolute right-0 top-0 max-w-[60%] bg-primary/90 px-3 py-1.5 backdrop-blur-sm">
                    <p className="truncate font-body text-[7px] font-semibold uppercase tracking-[0.2em] text-background">
                        ★ {artist.awards[0]}
                    </p>
                </div>
            )}

            {/* Name + origin — overlaid at the bottom of the image */}
            <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
                <p className="font-body text-[8px] uppercase tracking-[0.28em] text-primary/70">
                    {artist.origin}
                </p>
                <h3 className="mt-1 font-display text-2xl font-light italic leading-tight text-foreground transition-colors duration-300 group-hover:text-primary">
                    {artist.name}
                </h3>
                <p className="mt-0.5 font-body text-[9px] uppercase tracking-[0.2em] text-muted-foreground/70">
                    {artist.speciality}
                </p>
            </div>
        </div>

        {/* ── Info panel ─────────────────────────────────────────────────── */}
        <div
            className="flex flex-col gap-3 border border-t-0 border-border/15 bg-card/60 px-4 pb-4 pt-3 backdrop-blur-sm transition-colors duration-500 group-hover:border-primary/25 group-hover:bg-card/80"
        >
            {/* Style tags */}
            <div className="flex flex-wrap gap-1.5">
                {artist.styles.slice(0, 3).map((s: string) => (
                    <span
                        key={s}
                        className="border border-primary/18 px-2 py-0.5 font-body text-[7px] uppercase tracking-[0.15em] text-primary/50 transition-colors group-hover:border-primary/35 group-hover:text-primary/70"
                    >
                        {s}
                    </span>
                ))}
            </div>

            {/* Stats row */}
            <div className="flex items-center justify-between border-t border-border/12 pt-3">
                {/* Works */}
                <div className="flex items-baseline gap-1.5">
                    <span className="font-display text-xl font-light text-primary">
                        {artist.totalWorks}
                    </span>
                    <p className="font-body text-[8px] uppercase tracking-[0.18em] text-muted-foreground/50">
                        Works
                    </p>
                </div>

                {/* Divider */}
                <div className="h-5 w-px bg-border/20" />

                {/* Years active */}
                <div className="text-right">
                    <p className="font-body text-[8px] uppercase tracking-[0.18em] text-muted-foreground/40">
                        Active
                    </p>
                    <span className="font-body text-[10px] text-foreground/60">
                        {artist.yearsActive}
                    </span>
                </div>

                {/* Arrow */}
                <ArrowRight
                    size={14}
                    className="ml-2 text-primary/25 transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary/70"
                />
            </div>
        </div>
    </Link>
);

// ── Empty state ───────────────────────────────────────────────────────────────

const EmptyState = ({
    query,
    onTrending,
}: {
    query: string;
    onTrending: (t: string) => void;
}) => (
    <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="py-24 text-center"
    >
        <div className="mx-auto mb-6 h-px w-16 bg-linear-to-r from-transparent via-primary/30 to-transparent" />
        <p className="font-display text-4xl font-light italic text-foreground/30">
            No results for "{query}"
        </p>
        <p className="mx-auto mt-4 max-w-sm font-body text-sm text-muted-foreground/50">
            Try exploring by style, medium, or artist name.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-2">
            {trendingSearches.map((term) => (
                <button
                    key={term}
                    onClick={() => onTrending(term)}
                    className="border border-border/25 px-4 py-2 font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50 transition-all hover:border-primary/40 hover:text-primary/70 hover:bg-primary/5"
                >
                    {term}
                </button>
            ))}
        </div>
    </motion.div>
);

// ── Search Results Page ───────────────────────────────────────────────────────

const SearchResultsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const inputRef = useRef<HTMLInputElement>(null);

    const {
        query,
        setQuery,
        results,
        pagedResults,
        activeCategory,
        setActiveCategory,
        loadMore,
        isEmpty,
    } = useSearch();

    // Sync URL → query on mount / param change
    useEffect(() => {
        const q = searchParams.get('q') ?? '';
        const cat = (searchParams.get('cat') as SearchCategory) ?? 'all';
        setQuery(q);
        setActiveCategory(cat);
    }, []);

    // Sync query → URL
    const handleQueryChange = (val: string) => {
        setQuery(val);
        const params = new URLSearchParams(searchParams);
        if (val.trim()) params.set('q', val.trim());
        else params.delete('q');
        setSearchParams(params, { replace: true });
    };

    const handleCategoryChange = (cat: SearchCategory) => {
        setActiveCategory(cat);
        const params = new URLSearchParams(searchParams);
        if (cat !== 'all') params.set('cat', cat);
        else params.delete('cat');
        setSearchParams(params, { replace: true });
    };

    // Count per tab
    const tabCounts: Record<SearchCategory, number> = {
        all: results.total,
        paintings: results.paintings.length,
        prints: results.prints.length,
        artists: results.artists.length,
    };

    const noResults = !isEmpty && results.total === 0;

    return (
        <div className="min-h-screen bg-background">
            <Navigation />

            <main className="mx-auto max-w-7xl px-6 pb-24 pt-32">

                {/* ── Page header ─────────────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.85, ease: EASE }}
                    className="mb-12"
                >
                    {/* Eyebrow */}
                    <p className="mb-4 font-body text-[9px] uppercase tracking-[0.4em] text-primary/60">
                        Search the Collection
                    </p>

                    {/* Search input */}
                    <div className="flex items-end gap-4 border-b border-border/25 pb-5 transition-colors focus-within:border-primary/50">
                        <Search size={22} className="mb-0.5 shrink-0 text-primary/40" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => handleQueryChange(e.target.value)}
                            placeholder="Paintings, artists, styles, medium…"
                            className="flex-1 bg-transparent font-display text-3xl font-light text-foreground placeholder:text-muted-foreground/25 outline-none md:text-4xl"
                            autoFocus
                            autoComplete="off"
                            spellCheck={false}
                        />
                        {query && (
                            <button
                                onClick={() => handleQueryChange('')}
                                className="mb-1 shrink-0 text-muted-foreground/40 transition-colors hover:text-foreground"
                            >
                                <X size={18} />
                            </button>
                        )}
                    </div>

                    {/* Results summary */}
                    <AnimatePresence mode="wait">
                        {!isEmpty && (
                            <motion.p
                                key={query}
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="mt-3 font-body text-xs text-muted-foreground/50"
                            >
                                {results.total > 0
                                    ? `${results.total} result${results.total !== 1 ? 's' : ''} for "${query}"`
                                    : `No results for "${query}"`}
                            </motion.p>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* ── Category tabs ──────────────────────────────────────────── */}
                {!isEmpty && results.total > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
                        className="mb-10 flex items-center gap-8 overflow-x-auto pb-1"
                        style={{ scrollbarWidth: 'none' }}
                    >
                        {TABS.map((tab) => {
                            const count = tabCounts[tab.id];
                            const isActive = activeCategory === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => handleCategoryChange(tab.id)}
                                    disabled={count === 0 && tab.id !== 'all'}
                                    className={`relative shrink-0 py-2 font-body text-[10px] uppercase tracking-[0.22em] transition-all duration-300 disabled:opacity-30 ${isActive
                                            ? 'text-foreground'
                                            : 'text-muted-foreground/50 hover:text-muted-foreground'
                                        }`}
                                >
                                    {tab.label}
                                    {count > 0 && (
                                        <span className="ml-1.5 font-body text-[8px] text-primary/50">
                                            {count}
                                        </span>
                                    )}
                                    {/* Active underline */}
                                    {isActive && (
                                        <motion.span
                                            layoutId="tab-underline"
                                            className="absolute bottom-0 left-0 right-0 h-px bg-primary"
                                        />
                                    )}
                                </button>
                            );
                        })}

                        {/* Divider */}
                        <div className="mx-3 h-4 w-px shrink-0 bg-border/20" />

                        {/* Result count label */}
                        <p className="shrink-0 font-body text-[9px] uppercase tracking-[0.25em] text-muted-foreground/30">
                            {pagedResults.total} shown
                        </p>
                    </motion.div>
                )}

                {/* ── Results grid ───────────────────────────────────────────── */}
                <AnimatePresence mode="wait">
                    {isEmpty && (
                        <motion.div
                            key="idle"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="py-20 text-center"
                        >
                            <p className="font-display text-3xl font-light italic text-foreground/20">
                                Begin your search above
                            </p>
                            <div className="mt-8 flex flex-wrap justify-center gap-2">
                                {trendingSearches.map((term) => (
                                    <button
                                        key={term}
                                        onClick={() => handleQueryChange(term)}
                                        className="border border-border/20 px-4 py-2 font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40 transition-all hover:border-primary/35 hover:text-primary/60 hover:bg-primary/5"
                                    >
                                        {term}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {noResults && (
                        <motion.div key="no-results">
                            <EmptyState
                                query={query}
                                onTrending={handleQueryChange}
                            />
                        </motion.div>
                    )}

                    {!isEmpty && results.total > 0 && (
                        <motion.div
                            key={`${query}-${activeCategory}`}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.55, ease: EASE }}
                        >
                            {/* Mixed grid */}
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {pagedResults.items.map((result, i) => (
                                    <motion.div
                                        key={`${result.type}-${result.item.id}`}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.45, delay: Math.min(i * 0.04, 0.32), ease: EASE }}
                                    >
                                        {result.type === 'painting' ? (
                                            <PaintingCard painting={(result as any).item} />
                                        ) : (
                                            <ArtistCard artist={(result as any).item} />
                                        )}
                                    </motion.div>
                                ))}
                            </div>

                            {/* Load more */}
                            {pagedResults.hasMore && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="mt-16 flex flex-col items-center gap-3"
                                >
                                    <div className="h-px w-24 bg-linear-to-r from-transparent via-border/30 to-transparent" />
                                    <button
                                        onClick={loadMore}
                                        className="group flex items-center gap-3 border border-border/25 px-8 py-3.5 font-body text-[10px] uppercase tracking-[0.28em] text-muted-foreground/60 transition-all hover:border-primary/45 hover:bg-primary/5 hover:text-primary/80"
                                    >
                                        <SlidersHorizontal size={13} className="transition-transform group-hover:rotate-90" />
                                        Load more results
                                    </button>
                                    <p className="font-body text-[9px] text-muted-foreground/30">
                                        Showing {pagedResults.items.length} of {pagedResults.total}
                                    </p>
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default SearchResultsPage;