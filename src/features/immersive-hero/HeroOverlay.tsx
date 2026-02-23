import { motion } from 'framer-motion';

const HeroOverlay = () => {
  return (
    <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="text-center"
      >
        <motion.p
          initial={{ opacity: 0, letterSpacing: '0.3em' }}
          animate={{ opacity: 1, letterSpacing: '0.5em' }}
          transition={{ duration: 2, delay: 0.3 }}
          className="mb-6 font-body text-xs uppercase tracking-[0.5em] text-primary/70"
        >
          Premium Art Gallery
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="font-display text-6xl font-light leading-[0.9] tracking-tight text-foreground md:text-8xl lg:text-9xl"
        >
          <span className="block">India</span>
          <span className="block text-gradient-gold italic">Fine Art</span>
        </motion.h1>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 1.2 }}
          className="mx-auto mt-8 h-px w-32 bg-primary/40"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="mt-8 max-w-md font-body text-sm leading-relaxed text-muted-foreground"
        >
          From striking contemporary masterpieces to refined modern expressions, our gallery celebrates art that inspires, elevates, and endures. Discover investment-worthy paintings in an intimate, sophisticated setting designed for those who value rarity, authenticity, and uncompromising quality.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2 }}
          className="mt-12"
        >
          <a
            href="/marketplace"
            className="inline-block border border-primary/30 px-8 py-3 font-body text-xs uppercase tracking-[0.3em] text-primary transition-all duration-500 hover:border-primary/60 hover:bg-primary/5"
          >
            Enter Marketplace
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
        className="absolute bottom-12 flex flex-col items-center gap-3"
      >
        <span className="font-bold text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="h-8 w-px bg-linear-to-brom-primary/50 to-transparent"
        />
      </motion.div>
    </section>
  );
};

export default HeroOverlay;
