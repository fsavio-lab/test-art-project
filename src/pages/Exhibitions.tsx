import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { exhibitions } from '@/features/shared/data/exhibitions';
import Navigation from '@/features/navigation/Navigation';
import { Link } from 'react-router-dom';

const EASE = [0.22, 1, 0.36, 1] as const;

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

// ── Individual exhibition article with its own scroll trigger ─────────────────
const ExhibitionArticle = ({
  ex,
  index,
}: {
  ex: (typeof exhibitions)[number];
  index: number;
}) => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const isOdd = index % 2 !== 0;

  return (
    <motion.article
      ref={ref}
      key={ex.id}
      className="grid items-center gap-10 md:grid-cols-2"
      variants={staggerContainer}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
    >
      {/* Image */}
      <motion.div
        variants={{
          hidden: { opacity: 0, x: isOdd ? 32 : -32 },
          show:   { opacity: 1, x: 0, transition: { duration: 0.9, ease: EASE } },
        }}
        className={`overflow-hidden border border-border shadow-warm ${isOdd ? 'md:order-2' : ''}`}
      >
        <img
          src={ex.image}
          alt={ex.name}
          loading="lazy"
          className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-105"
        />
      </motion.div>

      {/* Text */}
      <motion.div
        className={isOdd ? 'md:order-1' : ''}
        variants={staggerContainer}
        initial="hidden"
        animate={inView ? 'show' : 'hidden'}
      >
        <motion.p variants={staggerItem} className="font-body text-xs uppercase tracking-[0.3em] text-primary/60">
          {ex.year}
        </motion.p>
        <motion.h3 variants={staggerItem} className="mt-2 font-display text-3xl font-light text-foreground">
          {ex.name}
        </motion.h3>
        {/* Gold rule */}
        <motion.div
          initial={{ scaleX: 0, originX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
          className="mt-4 h-px w-10 bg-primary"
        />
        <motion.p variants={staggerItem} className="mt-4 font-body text-sm leading-relaxed text-muted-foreground">
          {ex.longDescription}
        </motion.p>
        <motion.p variants={staggerItem} className="mt-3 font-body text-xs text-muted-foreground">
          Curated by {ex.curator}
        </motion.p>
        <motion.div variants={staggerItem}>
          <Link
            to="/marketplace"
            className="mt-6 inline-block border border-primary/30 px-8 py-3 font-body text-xs uppercase tracking-[0.2em] text-primary transition-all duration-300 hover:border-primary hover:bg-primary/5"
          >
            View Collection
          </Link>
        </motion.div>
      </motion.div>
    </motion.article>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────
const Exhibitions = () => {
  const featured = exhibitions[0];

  const listRef   = useRef<HTMLElement>(null);
  const listInView = useInView(listRef, { once: true, margin: '-60px' });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative h-[70vh] overflow-hidden">
        {/* Background image — subtle scale-in */}
        <motion.img
          src={featured.image}
          alt={featured.name}
          className="absolute inset-0 h-full w-full object-cover"
          initial={{ scale: 1.06 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.6, ease: EASE }}
        />

        {/* Gradient */}
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-transparent" />

        {/* Hero text — staggered from bottom */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 px-6 pb-16 pt-20"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <div className="mx-auto max-w-7xl">
            <motion.p
              variants={staggerItem}
              className="font-body text-xs uppercase tracking-[0.4em] text-primary"
            >
              Current Exhibition
            </motion.p>

            <motion.h1
              variants={staggerItem}
              className="mt-3 font-display text-5xl font-light text-foreground md:text-7xl"
            >
              {featured.name}
            </motion.h1>

            <motion.p
              variants={staggerItem}
              className="mt-4 max-w-xl font-body text-sm leading-relaxed text-muted-foreground"
            >
              {featured.description}
            </motion.p>

            <motion.p
              variants={staggerItem}
              className="mt-3 font-body text-xs text-muted-foreground"
            >
              Curated by {featured.curator} · {featured.year}
            </motion.p>
          </div>
        </motion.div>
      </section>

      {/* ── Exhibitions list ──────────────────────────────────────────────── */}
      <main ref={listRef} className="mx-auto max-w-7xl px-6 pb-20 pt-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={listInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
          className="mb-12 font-display text-4xl font-light text-foreground"
        >
          All Exhibitions
        </motion.h2>

        <div className="space-y-24">
          {exhibitions.map((ex, i) => (
            <ExhibitionArticle key={ex.id} ex={ex} index={i} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Exhibitions;
