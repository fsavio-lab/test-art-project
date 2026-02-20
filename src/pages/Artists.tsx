import { artists } from '@/features/shared/data/artists';
import Navigation from '@/features/navigation/Navigation';
import { Link } from 'react-router-dom';

const Artists = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="mx-auto max-w-7xl px-6 pb-20 pt-28">
        <div className="mb-16">
          <p className="mb-2 font-body text-xs uppercase tracking-[0.4em] text-primary/60">Our Artists</p>
          <h1 className="font-display text-5xl font-light text-foreground md:text-6xl">Artists</h1>
          <p className="mt-4 max-w-xl font-body text-sm leading-relaxed text-muted-foreground">
            Meet the master artisans and contemporary visionaries whose work defines the India Fine Art experience.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {artists.map((artist) => (
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
                <h3 className="font-display text-xl font-light text-foreground">{artist.name}</h3>
                <p className="mt-1 font-body text-xs uppercase tracking-[0.2em] text-primary/60">{artist.specialization}</p>
                <p className="mt-3 line-clamp-2 font-body text-xs leading-relaxed text-muted-foreground">{artist.bio}</p>
                <span className="mt-4 inline-block font-body text-[10px] uppercase tracking-[0.2em] text-primary transition-colors group-hover:text-primary/80">
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
