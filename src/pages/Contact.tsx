import Navigation from '@/features/navigation/Navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  email: z.string().trim().email('Invalid email address').max(255),
  subject: z.string().trim().min(1, 'Subject is required').max(200),
  message: z.string().trim().min(1, 'Message is required').max(2000),
});

type ContactForm = z.infer<typeof contactSchema>;

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = (data: ContactForm) => {
    setSubmitted(true);
    reset();
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="mx-auto max-w-7xl px-6 pb-20 pt-28">
        <div className="mb-16">
          <p className="mb-2 font-body text-xs uppercase tracking-[0.4em] text-primary/60">Get in Touch</p>
          <h1 className="font-display text-5xl font-light text-foreground md:text-6xl">Contact</h1>
        </div>

        <div className="grid gap-16 lg:grid-cols-2">
          {/* Form */}
          <div>
            {submitted && (
              <div className="mb-6 border border-primary/30 bg-primary/5 p-4 font-body text-sm text-primary">
                Thank you for your message. We will be in touch shortly.
              </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
              {(['name', 'email', 'subject'] as const).map((field) => (
                <div key={field}>
                  <label htmlFor={field} className="mb-1.5 block font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    {field}
                  </label>
                  <input
                    id={field}
                    type={field === 'email' ? 'email' : 'text'}
                    {...register(field)}
                    className="w-full border border-border bg-card px-4 py-3 font-body text-sm text-foreground outline-none transition-colors focus:border-primary"
                  />
                  {errors[field] && <p className="mt-1 font-body text-xs text-destructive">{errors[field]?.message}</p>}
                </div>
              ))}
              <div>
                <label htmlFor="message" className="mb-1.5 block font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={6}
                  {...register('message')}
                  className="w-full resize-none border border-border bg-card px-4 py-3 font-body text-sm text-foreground outline-none transition-colors focus:border-primary"
                />
                {errors.message && <p className="mt-1 font-body text-xs text-destructive">{errors.message.message}</p>}
              </div>
              <button
                type="submit"
                className="bg-primary px-10 py-3 font-body text-xs uppercase tracking-[0.2em] text-primary-foreground transition-all hover:bg-primary/90"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Info + Map */}
          <div className="space-y-10">
            <div className="space-y-6">
              {[
                { icon: MapPin, label: 'Address', value: '42 MG Road, Fort, Mumbai 400001, India' },
                { icon: Phone, label: 'Phone', value: '+91 22 2204 7890' },
                { icon: Mail, label: 'Email', value: 'info@indiafineart.com' },
                { icon: Clock, label: 'Hours', value: 'Tue – Sat: 10:00 – 19:00\nSun: 12:00 – 17:00\nMon: Closed' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex gap-4">
                  <Icon size={18} className="mt-0.5 shrink-0 text-primary" />
                  <div>
                    <p className="font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
                    <p className="mt-1 whitespace-pre-line font-body text-sm text-foreground">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Map — Mumbai Fort area */}
            <div className="aspect-video w-full overflow-hidden border border-border shadow-warm">
              <iframe
                title="Gallery Location"
                src="https://www.openstreetmap.org/export/embed.html?bbox=72.8300%2C18.9250%2C72.8400%2C18.9350&layer=mapnik&marker=18.9300%2C72.8350"
                className="h-full w-full border-0"
                loading="lazy"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;
