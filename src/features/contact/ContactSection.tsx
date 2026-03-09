import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

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

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5, duration: 1 }}
            className="mt-12"
          >
            <a
              href="mailto:tanveerbhomer@gmail.com"
              className="inline-block border border-primary/30 px-10 py-4 font-body text-xs uppercase tracking-[0.3em] text-primary transition-all duration-500 hover:border-primary/60 hover:bg-primary/5"
            >
              Schedule a Visit
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="mx-auto mt-32 max-w-6xl border-t border-border/30 pt-10">
        <div className="grid gap-10 md:grid-cols-2">
          {/* Left — Brand + Links */}
          <div>
            <Link to="/" className="font-display text-lg font-light tracking-wider text-foreground">
              INDIA FINE ART
            </Link>
            <p className="mt-3 max-w-xs font-body text-sm leading-relaxed text-muted-foreground">
              Celebrating Indian artistic heritage through immersive technology and curated exhibitions.
            </p>
            <div className="mt-6 flex gap-8">
              {['Instagram', 'Twitter'].map((link) => (
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

          {/* Right — Contact Details */}
          <address className="not-italic">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 flex-shrink-0 text-primary" aria-hidden="true" />
                <p className="font-body text-sm text-foreground">India Fine Art, 3rd Floor, Film Center Bldg, 68 Tardeo Road, Mumbai - 400034</p>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={16} className="mt-0.5 flex-shrink-0 text-primary" aria-hidden="true" />
                <a href="tel:+919699251555" className="font-body text-sm text-foreground transition-colors hover:text-primary">
                  +91 9699851555
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={16} className="mt-0.5 flex-shrink-0 text-primary" aria-hidden="true" />
                <a href="mailto:tanveerbhomer@gmail.com" className="font-body text-sm text-foreground transition-colors hover:text-primary">
                  tanveerbhomer@gmail.com
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={16} className="mt-0.5 flex-shrink-0 text-primary" aria-hidden="true" />
                <p className="font-body text-sm text-foreground">
                  Tue – Sat: 10:00 – 19:00 · Sun: 12:00 – 17:00
                </p>
              </div>
            </div>
          </address>
        </div>

        <div className="mt-10 border-t border-border/20 pt-6 text-center">
          <span className="font-body text-xs text-muted-foreground">
            © {new Date().getFullYear()} India Fine Art. All rights reserved.
          </span>
        </div>
      </footer>
    </section>
  );
};

export default ContactSection;
