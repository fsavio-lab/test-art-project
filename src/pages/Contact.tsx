import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import Navigation from '@/features/navigation/Navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

// ── Shared easing ─────────────────────────────────────────────────────────────
const EASE = [0.22, 1, 0.36, 1] as const;

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 18 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};

// ── Schema ────────────────────────────────────────────────────────────────────
const contactSchema = z.object({
  name:    z.string().trim().min(1, 'Name is required').max(100),
  email:   z.string().trim().email('Invalid email address').max(255),
  subject: z.string().trim().min(1, 'Subject is required').max(200),
  message: z.string().trim().min(1, 'Message is required').max(2000),
});

type ContactForm = z.infer<typeof contactSchema>;

// ── Contact info items ────────────────────────────────────────────────────────
const contactItems = [
  { icon: MapPin, label: 'Address', value: '42 MG Road, Fort, Mumbai 400001, India' },
  { icon: Phone,  label: 'Phone',   value: '+91 22 2204 7890' },
  { icon: Mail,   label: 'Email',   value: 'info@indiafineart.com' },
  {
    icon: Clock,
    label: 'Hours',
    value: 'Tue – Sat: 10:00 – 19:00\nSun: 12:00 – 17:00\nMon: Closed',
  },
] as const;

// ── Component ─────────────────────────────────────────────────────────────────
const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  const infoRef = useRef<HTMLDivElement>(null);
  const mapRef  = useRef<HTMLDivElement>(null);
  const infoInView = useInView(infoRef, { once: true, margin: '-60px' });
  const mapInView  = useInView(mapRef,  { once: true, margin: '-60px' });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactForm>({ resolver: zodResolver(contactSchema) });

  const onSubmit = (_data: ContactForm) => {
    setSubmitted(true);
    reset();
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="mx-auto max-w-7xl px-6 pb-20 pt-28">

        {/* ── Page header ─────────────────────────────────────────────────── */}
        <motion.div
          className="mb-16"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <motion.p
            variants={staggerItem}
            className="mb-2 font-body text-xs uppercase tracking-[0.4em] text-primary/60"
          >
            Get in Touch
          </motion.p>

          <motion.h1
            variants={staggerItem}
            className="font-display text-5xl font-light text-foreground md:text-6xl"
          >
            Contact
          </motion.h1>

          {/* Animated gold underline */}
          <motion.div
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}
            className="mt-5 h-px w-16 bg-primary"
          />
        </motion.div>

        <div className="grid gap-16 lg:grid-cols-2">

          {/* ── Form column ───────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
          >
            {/* Success banner */}
            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="mb-6 border border-primary/30 bg-primary/5 p-4 font-body text-sm text-primary"
              >
                Thank you for your message. We will be in touch shortly.
              </motion.div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>

              {/* Text / email fields — each stagger-animates */}
              <motion.div
                className="space-y-6"
                variants={staggerContainer}
                initial="hidden"
                animate="show"
              >
                {(['name', 'email', 'subject'] as const).map((field) => (
                  <motion.div key={field} variants={staggerItem}>
                    <label
                      htmlFor={field}
                      className="mb-1.5 block font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground"
                    >
                      {field}
                    </label>
                    <input
                      id={field}
                      type={field === 'email' ? 'email' : 'text'}
                      {...register(field)}
                      className="w-full border border-border bg-card px-4 py-3 font-body text-sm text-foreground outline-none transition-colors focus:border-primary"
                    />
                    {errors[field] && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-1 font-body text-xs text-destructive"
                      >
                        {errors[field]?.message}
                      </motion.p>
                    )}
                  </motion.div>
                ))}

                {/* Textarea */}
                <motion.div variants={staggerItem}>
                  <label
                    htmlFor="message"
                    className="mb-1.5 block font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    {...register('message')}
                    className="w-full resize-none border border-border bg-card px-4 py-3 font-body text-sm text-foreground outline-none transition-colors focus:border-primary"
                  />
                  {errors.message && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1 font-body text-xs text-destructive"
                    >
                      {errors.message.message}
                    </motion.p>
                  )}
                </motion.div>

                {/* Submit button */}
                <motion.div variants={staggerItem}>
                  <button
                    type="submit"
                    className="bg-primary px-10 py-3 font-body text-xs uppercase tracking-[0.2em] text-primary-foreground transition-all hover:bg-primary/90"
                  >
                    Send Message
                  </button>
                </motion.div>
              </motion.div>
            </form>
          </motion.div>

          {/* ── Info + map column ─────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}
            className="space-y-10"
          >
            {/* Contact info items — scroll-triggered stagger */}
            <div ref={infoRef}>
              <motion.div
                className="space-y-6"
                variants={staggerContainer}
                initial="hidden"
                animate={infoInView ? 'show' : 'hidden'}
              >
                {contactItems.map(({ icon: Icon, label, value }) => (
                  <motion.div key={label} variants={staggerItem} className="flex gap-4">
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={infoInView ? { scale: 1, opacity: 1 } : {}}
                      transition={{ duration: 0.5, ease: EASE }}
                    >
                      <Icon size={18} className="mt-0.5 shrink-0 text-primary" />
                    </motion.div>
                    <div>
                      <p className="font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        {label}
                      </p>
                      <p className="mt-1 whitespace-pre-line font-body text-sm text-foreground">
                        {value}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Map — fades in when it enters viewport */}
            <div ref={mapRef}>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={mapInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.9, ease: EASE }}
                className="aspect-video w-full overflow-hidden border border-border shadow-warm"
              >
                <iframe
                  title="Gallery Location"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=72.8300%2C18.9250%2C72.8400%2C18.9350&layer=mapnik&marker=18.9300%2C72.8350"
                  className="h-full w-full border-0"
                  loading="lazy"
                  allowFullScreen
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Contact;
