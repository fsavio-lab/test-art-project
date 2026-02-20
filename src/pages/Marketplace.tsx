import MarketplaceGrid from '@/features/marketplace/MarketplaceGrid';
import Navigation from '@/features/navigation/Navigation';

const Marketplace = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="mx-auto max-w-7xl px-6 pb-20 pt-28">
        <div className="mb-12">
          <p className="mb-2 font-body text-xs uppercase tracking-[0.4em] text-primary/60">Collection</p>
          <h1 className="font-display text-5xl font-light text-foreground md:text-6xl">
            Marketplace
          </h1>
          <p className="mt-4 max-w-xl font-body text-sm leading-relaxed text-muted-foreground">
            Discover and acquire exceptional works from India's finest traditional and contemporary artists.
          </p>
        </div>
        <MarketplaceGrid />
      </main>
    </div>
  );
};

export default Marketplace;
