import { useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { artists } from '@/features/shared/data/artists';
import { paintings } from '@/features/shared/data/paintings';
import Navigation from '@/features/navigation/Navigation';
import PaintingCard from '@/features/marketplace/PaintingCard';
import { ArrowLeft } from 'lucide-react';

// ── Shared easing ─────────────────────────────────────────────────────────────
const EASE = [0.22, 1, 0.36, 1] as const;

// ── Reusable variants ────────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.85, ease: EASE, delay },
});

const fadeLeft = (delay = 0) => ({
  initial: { opacity: 0, x: -28 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.85, ease: EASE, delay },
});

const fadeRight = (delay = 0) => ({
  initial: { opacity: 0, x: 28 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.85, ease: EASE, delay },
});

// Stagger children wrapper
const staggerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 18 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

// ── Component ─────────────────────────────────────────────────────────────────
const ArtistProfile = () => {
  const { id } = useParams<{ id: string }>();
  const artist = artists.find((a) => a.id === id);

  const awardsRef  = useRef<HTMLDivElement>(null);
  const worksRef   = useRef<HTMLElement>(null);
  const awardsInView = useInView(awardsRef,  { once: true, margin: '-60px' });
  const worksInView  = useInView(worksRef,   { once: true, margin: '-60px' });

  if (!artist) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <Navigation />
        <motion.p {...fadeUp(0.1)} className="font-display text-2xl text-foreground">
          Artist not found
        </motion.p>
        <motion.div {...fadeUp(0.25)}>
          <Link to="/artists" className="mt-4 font-body text-sm text-primary hover:underline">
            Back to Artists
          </Link>
        </motion.div>
      </div>
    );
  }

  const artistWorks = paintings.filter((p) => p.artistId === artist.id);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="mx-auto max-w-7xl px-6 pb-20 pt-28">

        {/* ── Back link ───────────────────────────────────────────────────── */}
        <motion.div {...fadeLeft(0)}>
          <Link
            to="/artists"
            className="mb-8 inline-flex items-center gap-2 font-body text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft size={14} /> Back to Artists
          </Link>
        </motion.div>

        {/* ── Hero grid ───────────────────────────────────────────────────── */}
        <div className="grid items-start gap-12 md:grid-cols-3">

          {/* Portrait — slides in from left */}
          <motion.div
            {...fadeLeft(0.1)}
            className="overflow-hidden border border-border shadow-warm"
          >
            <motion.img
              src={artist.image}
              alt={artist.name}
              className="aspect-square w-full object-cover"
              initial={{ scale: 1.08 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.2, ease: EASE, delay: 0.1 }}
            />
          </motion.div>

          {/* Info — slides in from right, children staggered */}
          <motion.div
            className="md:col-span-2"
            variants={staggerContainer}
            initial="hidden"
            animate="show"
          >
            <motion.p
              variants={staggerItem}
              className="font-body text-xs uppercase tracking-[0.3em] text-primary/60"
            >
              {artist.speciality}
            </motion.p>

            <motion.h1
              variants={staggerItem}
              className="mt-2 font-display text-4xl font-light text-foreground md:text-5xl"
            >
              {artist.name}
            </motion.h1>

            {/* Animated gold rule */}
            <motion.div
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.4 }}
              className="mt-5 h-px w-16 bg-primary"
            />

            <motion.p
              variants={staggerItem}
              className="mt-6 font-body text-sm leading-relaxed text-muted-foreground"
            >
              {artist.bio}
            </motion.p>

            <motion.p variants={staggerItem} className="mt-4 font-body text-xs text-muted-foreground">
              <strong className="text-foreground">Style:</strong> {artist.styles.join(" | ")}
            </motion.p>

            {/* Social links */}
            {/* {artist.socialLinks.length > 0 && (
              <motion.div variants={staggerItem} className="mt-8 flex gap-4">
                {artist.socialLinks.map((link) => (
                  <a
                    key={link.platform}
                    href={link.url}
                    className="border border-border px-4 py-2 font-body text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    {link.platform}
                  </a>
                ))}
              </motion.div>
            )} */}
          </motion.div>
        </div>

        {/* ── Awards — scroll-triggered ──────────────────────────────────── */}
        {artist.awards && artist.awards.length > 0 && (
          <div ref={awardsRef}>
            <motion.section
              initial={{ opacity: 0, y: 32 }}
              animate={awardsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, ease: EASE }}
              className="mt-16 border-t border-border pt-10"
            >
              <h3 className="font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Awards &amp; Recognition
              </h3>

              <motion.ul
                variants={staggerContainer}
                initial="hidden"
                animate={awardsInView ? 'show' : 'hidden'}
                className="mt-4 space-y-1"
              >
                {artist.awards.map((award) => (
                  <motion.li
                    key={award}
                    variants={staggerItem}
                    className="font-body text-sm text-foreground"
                  >
                    • {award}
                  </motion.li>
                ))}
              </motion.ul>
            </motion.section>
          </div>
        )}

        {/* ── Works grid — scroll-triggered ─────────────────────────────── */}
        {artistWorks.length > 0 && (
          <section ref={worksRef} className="mt-20 border-t border-border pt-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={worksInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.75, ease: EASE }}
              className="mb-8 font-display text-3xl font-light text-foreground"
            >
              Available Works
            </motion.h2>

            <motion.div
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
              variants={staggerContainer}
              initial="hidden"
              animate={worksInView ? 'show' : 'hidden'}
            >
              {artistWorks.map((p) => (
                <motion.div key={p.id} variants={staggerItem}>
                  <PaintingCard painting={p} />
                </motion.div>
              ))}
            </motion.div>
          </section>
        )}
      </main>
    </div>
  );
};

export default ArtistProfile;
