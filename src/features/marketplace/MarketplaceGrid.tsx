import { useMemo, useState, useCallback } from 'react';
import PaintingCard from './PaintingCard';
import { paintings, type Painting } from '@/features/shared/data/paintings';
import { SlidersHorizontal, X } from 'lucide-react';

type SortOption = 'price-asc' | 'price-desc' | 'newest' | 'popular';

const categories = ['all', 'painting', 'sculpture', 'photography'];
const sizes = ['all', 'small', 'medium', 'large'];
const orientations = ['all', 'landscape', 'portrait', 'square'];
const availabilities = ['all', 'available', 'sold', 'reserved'];

const MarketplaceGrid = () => {
  const [sort, setSort] = useState<SortOption>('popular');
  const [category, setCategory] = useState('all');
  const [size, setSize] = useState('all');
  const [orientation, setOrientation] = useState('all');
  const [availability, setAvailability] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [showFilters, setShowFilters] = useState(false);

  const handlePriceMin = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPriceRange((prev) => [Number(e.target.value), prev[1]]);
  }, []);

  const handlePriceMax = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPriceRange((prev) => [prev[0], Number(e.target.value)]);
  }, []);

  const filtered = useMemo(() => {
    let result = paintings.filter((p) => {
      if (category !== 'all' && p.category !== category) return false;
      if (size !== 'all' && p.size !== size) return false;
      if (orientation !== 'all' && p.orientation !== orientation) return false;
      if (availability !== 'all' && p.availability !== availability) return false;
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
      return true;
    });

    result.sort((a, b) => {
      switch (sort) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'newest': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'popular': return b.popularity - a.popularity;
        default: return 0;
      }
    });

    return result;
  }, [sort, category, size, orientation, availability, priceRange]);

  const activeFilterCount = [category, size, orientation, availability].filter((f) => f !== 'all').length +
    (priceRange[0] > 0 || priceRange[1] < 50000 ? 1 : 0);

  const SelectFilter = ({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) => (
    <div>
      <label className="mb-1.5 block font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-border bg-card px-3 py-2 font-body text-xs text-foreground outline-none transition-colors focus:border-primary"
        aria-label={label}
      >
        {options.map((o) => (
          <option key={o} value={o}>{o === 'all' ? `All ${label}s` : o.charAt(0).toUpperCase() + o.slice(1)}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 border border-border px-4 py-2 font-body text-xs uppercase tracking-[0.2em] text-foreground transition-colors hover:border-primary"
          aria-expanded={showFilters}
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
          <label className="font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Sort by</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="border border-border bg-card px-3 py-2 font-body text-xs text-foreground outline-none transition-colors focus:border-primary"
            aria-label="Sort artworks"
          >
            <option value="popular">Most Popular</option>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
          </select>
        </div>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="mb-8 border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="font-body text-xs uppercase tracking-[0.2em] text-foreground">Refine</span>
            <button onClick={() => { setCategory('all'); setSize('all'); setOrientation('all'); setAvailability('all'); setPriceRange([0, 50000]); }}
              className="font-body text-[10px] uppercase tracking-[0.2em] text-primary hover:underline"
            >
              Clear All
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            <SelectFilter label="Category" value={category} onChange={setCategory} options={categories} />
            <SelectFilter label="Size" value={size} onChange={setSize} options={sizes} />
            <SelectFilter label="Orientation" value={orientation} onChange={setOrientation} options={orientations} />
            <SelectFilter label="Availability" value={availability} onChange={setAvailability} options={availabilities} />
            <div>
              <label className="mb-1.5 block font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Price Range</label>
              <div className="flex items-center gap-2">
                <input type="number" value={priceRange[0]} onChange={handlePriceMin} min={0} max={priceRange[1]}
                  className="w-full border border-border bg-card px-2 py-2 font-body text-xs text-foreground outline-none focus:border-primary" aria-label="Minimum price" />
                <span className="text-muted-foreground">–</span>
                <input type="number" value={priceRange[1]} onChange={handlePriceMax} min={priceRange[0]} max={50000}
                  className="w-full border border-border bg-card px-2 py-2 font-body text-xs text-foreground outline-none focus:border-primary" aria-label="Maximum price" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <p className="mb-6 font-body text-xs text-muted-foreground">{filtered.length} artwork{filtered.length !== 1 ? 's' : ''}</p>

      {filtered.length === 0 ? (
        <div className="py-20 text-center">
          <p className="font-display text-2xl font-light text-foreground">No artworks found</p>
          <p className="mt-2 font-body text-sm text-muted-foreground">Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((painting) => (
            <PaintingCard key={painting.id} painting={painting} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MarketplaceGrid;
