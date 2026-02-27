import MarketplaceGrid from '@/features/marketplace/MarketplaceGrid';
import Navigation from '@/features/navigation/Navigation';

const Prints = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="mx-auto max-w-7xl px-6 pb-20 pt-32">
        <div className="mb-16">
          <p className="mb-3 font-body text-xs uppercase tracking-[0.4em] text-primary/60">Reproductions</p>
          <h1 className="font-display text-6xl font-light text-foreground md:text-7xl">
            Fine Art Prints
          </h1>
          <p className="mt-5 max-w-xl font-body text-base leading-relaxed text-muted-foreground">
            Museum-quality reproductions for modern spaces
          </p>
          <div className="mt-8 h-px w-24 bg-primary/30" />
        </div>
        <MarketplaceGrid categoryFilter="prints" />
      </main>
    </div>
  );
};

export default Prints;
