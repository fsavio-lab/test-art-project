import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const ContactSection = () => {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} id="contact" className="relative z-10 px-6 py-32">
      <div className="mx-auto max-w-2xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
        >
          <p className="mb-4 font-body text-xs uppercase tracking-[0.4em] text-primary/60">
            Get in Touch
          </p>
          <h2 className="font-display text-5xl font-light text-foreground md:text-6xl">
            Visit the <span className="italic text-gradient-gold">Gallery</span>
          </h2>
          <div className="mx-auto mt-8 h-px w-16 bg-primary/30" />
          <p className="mt-8 font-body text-sm leading-relaxed text-muted-foreground">
            Experience our exhibitions in person or schedule a private viewing.
            Our curators are available to guide you through the collection.
          </p>

          <div className="mt-12 space-y-4">
            <p className="font-body text-xs uppercase tracking-[0.3em] text-foreground/70">
              info@indiafineart.com
            </p>
            <p className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground">
              42 MG Road, Fort, Mumbai 400001, India
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5, duration: 1 }}
            className="mt-12"
          >
            <a
              href="mailto:info@indiafineart.com"
              className="inline-block border border-primary/30 px-10 py-4 font-body text-xs uppercase tracking-[0.3em] text-primary transition-all duration-500 hover:border-primary/60 hover:bg-primary/5"
            >
              Schedule a Visit
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="mx-auto mt-32 max-w-6xl border-t border-border/30 pt-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <span className="font-display text-sm font-light tracking-wider text-muted-foreground">
            INDIA FINE ART © 2024
          </span>
          <div className="flex gap-8">
            {['Instagram', 'Twitter', 'Newsletter'].map((link) => (
              <a
                key={link}
                href="#"
                className="font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
