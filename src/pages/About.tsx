import Navigation from '@/features/navigation/Navigation';
import artwork1 from '@/assets/artwork-1.jpg';

const milestones = [
  { year: '2018', title: 'Founded in Mumbai', desc: 'India Fine Art opens its first exhibition space in the historic Fort district of Mumbai.' },
  { year: '2020', title: 'Digital Platform Launch', desc: 'Launch of the immersive online gallery, connecting Indian art with collectors worldwide.' },
  { year: '2022', title: 'International Recognition', desc: 'Featured at India Art Fair and the Venice Biennale with curated Indian art pavilions.' },
  { year: '2024', title: 'National Presence', desc: 'Expanded to Mumbai, Jaipur, and Delhi with over 52 represented artists across traditional forms.' },
];

const artForms = [
  { name: 'Madhubani', origin: 'Bihar', period: 'Ancient (2,500+ years)', materials: 'Natural dyes, twigs, fingers on handmade paper', symbolism: 'Fertility, devotion, cosmic harmony', philosophy: 'Every surface is a canvas for the divine — art as daily spiritual practice.' },
  { name: 'Pattachitra', origin: 'Odisha & Bengal', period: 'Classical (8th century onwards)', materials: 'Natural stone & vegetable dyes on cloth (patta)', symbolism: 'Jagannath cult, Dashavatara, Gita Govinda narratives', philosophy: 'Visual scripture — painting as devotional storytelling.' },
  { name: 'Tanjore Painting', origin: 'Tamil Nadu', period: 'Maratha period (16th century)', materials: '22-karat gold leaf, semi-precious stones, natural pigments', symbolism: 'Divine abundance, royal devotion', philosophy: 'Opulence as offering — the more precious the material, the deeper the devotion.' },
  { name: 'Warli', origin: 'Maharashtra', period: 'Neolithic origins (2,500+ years)', materials: 'Rice paste on mud walls, bamboo sticks', symbolism: 'Harvest cycles, community, nature worship', philosophy: 'Geometric simplicity encodes the rhythms of tribal life and ecological wisdom.' },
  { name: 'Kalamkari', origin: 'Andhra Pradesh', period: 'Ancient (3,000+ years)', materials: 'Vegetable dyes applied with pen (kalam) on cotton', symbolism: 'Epic narratives — Ramayana, Mahabharata', philosophy: 'Art as textile — wearable mythology that clothes the body in sacred stories.' },
  { name: 'Mughal & Rajasthani Miniatures', origin: 'North India', period: 'Medieval (16th–19th century)', materials: 'Mineral pigments, gold wash, squirrel-hair brushes on wasli', symbolism: 'Courtly life, romance, nature, spiritual devotion', philosophy: 'Infinite patience in finite space — entire worlds within a palm-sized painting.' },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="mx-auto max-w-7xl px-6 pb-20 pt-28">
        {/* Header */}
        <div className="mb-20">
          <p className="mb-2 font-body text-xs uppercase tracking-[0.4em] text-primary/60">Our Story</p>
          <h1 className="font-display text-5xl font-light text-foreground md:text-6xl">About India Fine Art</h1>
        </div>

        {/* History */}
        <section className="grid gap-16 md:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-light text-foreground">Gallery History</h2>
            <p className="mt-6 font-body text-sm leading-relaxed text-muted-foreground">
              Founded in 2018 in Mumbai's historic Fort district, India Fine Art was born from a singular vision: to celebrate
              and preserve India's extraordinary artistic heritage through immersive technology. What began as a modest gallery
              dedicated to traditional Indian art forms has evolved into a nationally recognized institution representing master
              artisans and contemporary innovators across the subcontinent.
            </p>
            <p className="mt-4 font-body text-sm leading-relaxed text-muted-foreground">
              Our mission is to bridge millennia of Indian artistic tradition with cutting-edge digital presentation, making
              the sublime craftsmanship of Madhubani, Tanjore, Pattachitra, Warli, and miniature painting accessible to a
              global audience of collectors and connoisseurs.
            </p>
          </div>
          <div className="overflow-hidden border border-border shadow-warm">
            <img src={artwork1} alt="India Fine Art Gallery interior" className="aspect-[4/3] w-full object-cover" />
          </div>
        </section>

        {/* Milestones */}
        <section className="mt-24">
          <h2 className="mb-12 font-display text-3xl font-light text-foreground">Key Milestones</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {milestones.map((m) => (
              <div key={m.year} className="border-t border-primary/20 pt-6">
                <span className="font-display text-2xl text-gradient-gold">{m.year}</span>
                <h3 className="mt-2 font-display text-lg text-foreground">{m.title}</h3>
                <p className="mt-2 font-body text-xs leading-relaxed text-muted-foreground">{m.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Art Forms */}
        <section className="mt-24 border-t border-border pt-16">
          <h2 className="mb-4 font-display text-3xl font-light text-foreground">Indian Art Forms We Celebrate</h2>
          <p className="mb-12 max-w-2xl font-body text-sm text-muted-foreground">A curated overview of the traditional art forms represented in our collection, each carrying centuries of cultural heritage.</p>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {artForms.map((form) => (
              <div key={form.name} className="border border-border bg-card p-6 shadow-warm transition-shadow duration-500 hover:shadow-warm-lg">
                <h3 className="font-display text-xl font-light text-foreground">{form.name}</h3>
                <p className="mt-1 font-body text-[10px] uppercase tracking-[0.2em] text-primary/70">{form.origin} · {form.period}</p>
                <div className="mt-4 space-y-2">
                  <p className="font-body text-xs text-muted-foreground"><span className="text-foreground/70">Materials:</span> {form.materials}</p>
                  <p className="font-body text-xs text-muted-foreground"><span className="text-foreground/70">Symbolism:</span> {form.symbolism}</p>
                  <p className="mt-3 font-body text-xs italic leading-relaxed text-muted-foreground">&ldquo;{form.philosophy}&rdquo;</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* What sets us apart */}
        <section className="mt-24 border-t border-border pt-16">
          <h2 className="mb-8 font-display text-3xl font-light text-foreground">What Sets Us Apart</h2>
          <div className="grid gap-10 md:grid-cols-3">
            {[
              { title: 'Heritage Preservation', desc: 'We partner directly with master artisans and their families, ensuring traditional techniques survive for future generations.' },
              { title: 'Scholarly Curation', desc: 'Every exhibition is curated by art historians specializing in Indian art, ensuring cultural authenticity and scholarly depth.' },
              { title: 'Global Reach', desc: 'With collectors in over 35 countries, we connect India\'s artistic legacy with discerning patrons worldwide.' },
            ].map((p) => (
              <div key={p.title}>
                <h3 className="font-display text-xl font-light text-foreground">{p.title}</h3>
                <p className="mt-3 font-body text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Founder */}
        <section className="mt-24 border-t border-border pt-16">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="overflow-hidden border border-border shadow-warm">
              <img src={artwork1} alt="Gallery Founder" className="aspect-square w-full object-cover" />
            </div>
            <div>
              <p className="font-body text-xs uppercase tracking-[0.3em] text-primary/60">Founder & Director</p>
              <h2 className="mt-2 font-display text-4xl font-light text-foreground">Arjun Mehta</h2>
              <p className="mt-6 font-body text-sm leading-relaxed text-muted-foreground">
                Arjun Mehta is a visionary gallerist and art historian whose passion for Indian heritage has shaped India Fine Art
                into one of the country's most respected galleries for traditional and contemporary Indian art. With a background
                in art history from JNU and curatorial experience at the National Gallery of Modern Art, he brings an unparalleled
                understanding of India's artistic traditions and a deep commitment to supporting the artisan communities who
                keep these art forms alive.
              </p>
              <blockquote className="mt-8 border-l-2 border-primary/30 pl-6 font-display text-lg italic text-foreground/80">
                &ldquo;Every brushstroke carries a thousand years of heritage — our mission is to ensure those stories continue to be told.&rdquo;
              </blockquote>
              <p className="mt-2 font-body text-xs text-muted-foreground">— Arjun Mehta</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;
