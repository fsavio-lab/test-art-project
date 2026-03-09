import { motion } from 'framer-motion';
import MarketplaceGrid from '@/features/marketplace/MarketplaceGrid';
import Navigation from '@/features/navigation/Navigation';
import PageHeader from '@/components/PageHeader';

const EASE = [0.22, 1, 0.36, 1] as const;

const Marketplace = () => (
  <div className="min-h-screen bg-background">
    <Navigation />

    <main className="mx-auto max-w-7xl px-6 pb-20 pt-28">
      <PageHeader
        eyebrow="Collection"
        title="Marketplace"
        subtitle="Discover and acquire exceptional works from India's finest traditional and contemporary artists."
      />

      {/* Grid fades up after the header settles */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, ease: EASE, delay: 0.55 }}
      >
        <MarketplaceGrid />
      </motion.div>
    </main>
  </div>
);

export default Marketplace;
