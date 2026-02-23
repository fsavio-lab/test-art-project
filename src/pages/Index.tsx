import { lazy, Suspense } from 'react';
import Navigation from '@/features/navigation/Navigation';
import HeroOverlay from '@/features/immersive-hero/HeroOverlay';
import ArtCarousel from '@/features/artwork-carousel/ArtCarousel';
import AboutSection from '@/features/about/AboutSection';
import ContactSection from '@/features/contact/ContactSection';
import HeroCanvas from '@/features/immersive-hero/HeroCanvas';

// const HeroCanvas = lazy(() => import('@/features/immersive-hero/HeroCanvas'));

const Index = () => {
  return (
    <div className="relative min-h-screen bg-background">
      {/* WebGL Background */}
      <Suspense
        fallback={
          <div className="fixed inset-0 z-0 bg-background" />
        }
      >
        <HeroCanvas />
      </Suspense>

      {/* Grain overlay */}
      <div className="grain-overlay fixed inset-0 z-1 pointer-events-none" />

      <Navigation />
      <HeroOverlay />

      {/* Content sections */}
      <div className="relative z-10 bg-linear-to-b from-transparent via-background/95 to-background">
        <ArtCarousel />
        <div className="bg-section-alt">
          <AboutSection />
        </div>
        <ContactSection />
      </div>
    </div>
  );
};

export default Index;
