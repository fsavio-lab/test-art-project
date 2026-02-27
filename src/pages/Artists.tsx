import { useMemo, useState } from "react";
import { artists } from "@/features/shared/data/artists";
import Navigation from "@/features/navigation/Navigation";
import { Link } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";

type SortOption = "name-asc" | "name-desc";

const Artists = () => {
  const [sort, setSort] = useState<SortOption>("name-asc");
  const [search, setSearch] = useState("");
  const [featured, setFeatured] = useState<"all" | "featured">("all");
  const [showFilters, setShowFilters] = useState(false);

  const filteredArtists = useMemo(() => {
    let result = artists.filter((artist) => {
      if (
        search &&
        !artist.name.toLowerCase().includes(search.toLowerCase())
      )
        return false;

      if (featured === "featured" && !artist.isFeatured) return false;

      return true;
    });

    result.sort((a, b) => {
      const comparison = a.name.localeCompare(b.name);
      return sort === "name-asc" ? comparison : -comparison;
    });

    return result;
  }, [search, featured, sort]);

  const activeFilterCount =
    (search ? 1 : 0) + (featured === "featured" ? 1 : 0);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="mx-auto max-w-7xl px-6 pb-20 pt-28">
        {/* Header */}
        <div className="mb-12">
          <p className="mb-2 font-body text-xs uppercase tracking-[0.4em] text-primary/60">
            Our Artists
          </p>
          <h1 className="font-display text-5xl font-light text-foreground md:text-6xl">
            Artists
          </h1>
          <p className="mt-4 max-w-xl font-body text-sm leading-relaxed text-muted-foreground">
            Meet the master artisans and contemporary visionaries whose work defines the India Fine Art experience.
          </p>
        </div>

        {/* Toolbar */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
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
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mb-8 border border-border bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-body text-xs uppercase tracking-[0.2em] text-foreground">
                Refine
              </span>
              <button
                onClick={() => {
                  setSearch("");
                  setFeatured("all");
                }}
                className="font-body text-[10px] uppercase tracking-[0.2em] text-primary hover:underline"
              >
                Clear All
              </button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {/* Name Search */}
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

              {/* Featured Filter */}
              <div>
                <label className="mb-1.5 block font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Featured
                </label>
                <select
                  value={featured}
                  onChange={(e) =>
                    setFeatured(e.target.value as "all" | "featured")
                  }
                  className="w-full border border-border bg-card px-3 py-2 font-body text-xs text-foreground outline-none transition-colors focus:border-primary"
                >
                  <option value="all">All Artists</option>
                  <option value="featured">Featured Only</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredArtists.map((artist) => (
            <Link
              key={artist.id}
              to={`/artists/${artist.id}`}
              className="group border border-border bg-card shadow-warm transition-all duration-500 hover:border-primary/30 hover:shadow-warm-lg"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={artist.portrait}
                  alt={artist.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <div className="p-6">
                <h3 className="font-display text-xl font-light text-foreground">
                  {artist.name}
                </h3>
                <p className="mt-1 font-body text-xs uppercase tracking-[0.2em] text-primary/60">
                  {artist.specialization}
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
          ))}
        </div>
      </main>
    </div>
  );
};

export default Artists;