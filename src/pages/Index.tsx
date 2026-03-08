import { Suspense } from 'react';
import Navigation from '@/features/navigation/Navigation';
import HeroOverlay from '@/features/immersive-hero/HeroOverlay';
import HeroCanvas from '@/features/immersive-hero/HeroCanvas';
import ArtCarousel from '@/features/artwork-carousel/ArtCarousel';
import ArtistsSection from '@/features/artists-showcase/ArtistsSection';
import FineArtSection from '@/features/fine-art/FineArtSection';
import PrintsSection from '@/features/prints/PrintsSection';
import AboutSection from '@/features/about/AboutSection';
import ContactSection from '@/features/contact/ContactSection';

const Index = () => {
  return (
    <div className="relative min-h-screen bg-background">
      {/* WebGL Background */}
      <Suspense fallback={<div className="fixed inset-0 z-0 bg-background" />}>
        <HeroCanvas />
      </Suspense>

      {/* Grain overlay */}
      <div className="grain-overlay fixed inset-0 z-1 pointer-events-none" />

      <Navigation />
      <HeroOverlay />

      {/* ── Scrollable content ─────────────────────────────────────────────── */}
      <div className="relative z-10 bg-linear-to-b from-transparent via-background/95 to-background">

        {/* Featured picks — original ArtCarousel (hero carousel) */}
        {/* <ArtCarousel /> */}

        {/* Artists — meet the makers */}
        <div className="bg-section-alt">
          <ArtistsSection />
        </div>

        {/* Fine Art originals */}
        <FineArtSection />

        {/* Limited edition prints */}
        <div className="bg-section-alt">
          <PrintsSection />
        </div>

        {/* About the gallery */}
        <AboutSection />

        <ContactSection />
      </div>
    </div>
  );
};

export default Index;
