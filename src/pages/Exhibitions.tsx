import { exhibitions } from '@/features/shared/data/exhibitions';
import Navigation from '@/features/navigation/Navigation';
import { Link } from 'react-router-dom';

const Exhibitions = () => {
  const featured = exhibitions[0];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero */}
      <section className="relative h-[70vh] overflow-hidden">
        <img src={featured.image} alt={featured.name} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-16 pt-20">
          <div className="mx-auto max-w-7xl">
            <p className="font-body text-xs uppercase tracking-[0.4em] text-primary">Current Exhibition</p>
            <h1 className="mt-3 font-display text-5xl font-light text-foreground md:text-7xl">{featured.name}</h1>
            <p className="mt-4 max-w-xl font-body text-sm leading-relaxed text-muted-foreground">{featured.description}</p>
            <p className="mt-3 font-body text-xs text-muted-foreground">Curated by {featured.curator} · {featured.year}</p>
          </div>
        </div>
      </section>

      {/* Exhibitions list */}
      <main className="mx-auto max-w-7xl px-6 pb-20 pt-20">
        <h2 className="mb-12 font-display text-4xl font-light text-foreground">All Exhibitions</h2>
        <div className="space-y-16">
          {exhibitions.map((ex, i) => (
            <article key={ex.id} className={`grid items-center gap-10 ${i % 2 === 0 ? 'md:grid-cols-2' : 'md:grid-cols-2'}`}>
              <div className={`overflow-hidden border border-border shadow-warm ${i % 2 !== 0 ? 'md:order-2' : ''}`}>
                <img src={ex.image} alt={ex.name} loading="lazy" className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-105" />
              </div>
              <div className={i % 2 !== 0 ? 'md:order-1' : ''}>
                <p className="font-body text-xs uppercase tracking-[0.3em] text-primary/60">{ex.year}</p>
                <h3 className="mt-2 font-display text-3xl font-light text-foreground">{ex.name}</h3>
                <p className="mt-4 font-body text-sm leading-relaxed text-muted-foreground">{ex.longDescription}</p>
                <p className="mt-3 font-body text-xs text-muted-foreground">Curated by {ex.curator}</p>
                <Link
                  to="/marketplace"
                  className="mt-6 inline-block border border-primary/30 px-8 py-3 font-body text-xs uppercase tracking-[0.2em] text-primary transition-all duration-300 hover:border-primary hover:bg-primary/5"
                >
                  View Collection
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Exhibitions;
