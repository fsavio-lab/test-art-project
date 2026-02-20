import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const AboutSection = () => {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} id="about" className="relative z-10 px-6 py-32">
      <div className="mx-auto grid max-w-6xl gap-16 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1 }}
        >
          <p className="mb-4 font-body text-xs uppercase tracking-[0.4em] text-primary/60">
            About the Gallery
          </p>
          <h2 className="font-display text-5xl font-light leading-tight text-foreground">
            Where Heritage Meets
            <span className="block italic text-gradient-gold">Digital Space</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
          className="flex flex-col justify-center"
        >
          <p className="font-body text-sm leading-relaxed text-muted-foreground">
            India Fine Art is a premium digital exhibition space celebrating the
            rich tapestry of Indian artistic heritage. We curate immersive experiences
            spanning millennia — from ancient temple murals and Mughal miniatures
            to contemporary Indian masters redefining the global art landscape.
          </p>
          <p className="mt-6 font-body text-sm leading-relaxed text-muted-foreground">
            Founded with a passion for preserving and presenting India's artistic
            legacy, our gallery bridges traditional craftsmanship with cutting-edge
            digital technology, making art accessible to collectors worldwide.
          </p>
          <div className="mt-10 flex gap-12">
            {[
              { num: '52', label: 'Artists' },
              { num: '18', label: 'Exhibitions' },
              { num: '5K+', label: 'Collectors' },
            ].map((stat) => (
              <div key={stat.label}>
                <span className="font-display text-3xl font-light text-gradient-gold">
                  {stat.num}
                </span>
                <p className="mt-1 font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
