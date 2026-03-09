import { useRef, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { paintings } from '@/features/shared/data/paintings';
import { artists } from '@/features/shared/data/artists';
import { useCart } from '@/features/shared/context/CartContext';
import Navigation from '@/features/navigation/Navigation';
import PaintingCard from '@/features/marketplace/PaintingCard';
import InquiryDialog from '@/features/shared/components/InquiryDialog';
import {
  ArrowLeft, Heart, Share2, ShoppingCart, Check, Star, MessageSquare,
} from 'lucide-react';

// ── Shared easing ─────────────────────────────────────────────────────────────
const EASE = [0.22, 1, 0.36, 1] as const;

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};

// ── Static data ───────────────────────────────────────────────────────────────
const reviews = [
  { id: 1, author: 'Collector R.S.',       rating: 5, text: 'Absolutely stunning piece. The craftsmanship and cultural authenticity are extraordinary.' },
  { id: 2, author: 'Art Enthusiast P.K.',  rating: 5, text: "Beautiful work. India Fine Art's curation of traditional forms is unmatched." },
  { id: 3, author: 'Gallery Director M.N.', rating: 4, text: 'Exceptional artistry that commands attention in any space. Museum-quality presentation.' },
];

// ── Component ─────────────────────────────────────────────────────────────────
const ArtDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();

  const [zoomed,      setZoomed]      = useState(false);
  const [wishlisted,  setWishlisted]  = useState(false);
  const [inquiryOpen, setInquiryOpen] = useState(false);

  // Scroll-trigger refs
  const artistRef  = useRef<HTMLElement>(null);
  const reviewsRef = useRef<HTMLElement>(null);
  const relatedRef = useRef<HTMLElement>(null);

  const artistInView  = useInView(artistRef,  { once: true, margin: '-60px' });
  const reviewsInView = useInView(reviewsRef, { once: true, margin: '-60px' });
  const relatedInView = useInView(relatedRef, { once: true, margin: '-60px' });

  const painting = paintings.find((p) => p.id === id);
  const artist   = painting ? artists.find((a) => a.id === painting.artistId) : undefined;
  const related  = painting
    ? paintings
        .filter((p) => p.id !== painting.id && (p.artistId === painting.artistId || p.category === painting.category))
        .slice(0, 4)
    : [];

  const handleAddToCart = useCallback(() => {
    if (!painting) return;
    addItem({ id: painting.id, title: painting.title, artist: painting.artist, price: painting.price, image: painting.image });
  }, [addItem, painting]);

  if (!painting) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <Navigation />
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="font-display text-2xl text-foreground"
        >
          Artwork not found
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <Link to="/marketplace" className="mt-4 font-body text-sm text-primary hover:underline">
            Back to Marketplace
          </Link>
        </motion.div>
      </div>
    );
  }

  const metaRows: [string, string][] = [
    ['Title',         painting.title],
    ['Medium',        painting.medium],
    ['Dimensions',    painting.dimensions],
    ['Year',          painting.year],
    ['Style',         painting.style],
    ['Art Piece Type', painting.art_piece_type.charAt(0).toUpperCase() + painting.art_piece_type.slice(1)],
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="mx-auto max-w-7xl px-6 pb-20 pt-28">

        {/* ── Back link ───────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <Link
            to="/marketplace"
            className="mb-8 inline-flex items-center gap-2 font-body text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft size={14} /> Back to Marketplace
          </Link>
        </motion.div>

        {/* ── Main grid ───────────────────────────────────────────────────── */}
        <div className="grid gap-12 lg:grid-cols-2">

          {/* Image — fade + subtle scale */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.0, ease: EASE, delay: 0.05 }}
            className={`relative cursor-zoom-in overflow-hidden border border-border bg-card shadow-warm ${zoomed ? 'cursor-zoom-out' : ''}`}
            onClick={() => setZoomed(!zoomed)}
            role="button"
            aria-label={zoomed ? 'Zoom out' : 'Zoom in on artwork'}
          >
            <motion.img
              src={painting.image}
              alt={painting.title}
              className="w-full transition-transform duration-700"
              animate={{ scale: zoomed ? 1.5 : 1 }}
              transition={{ duration: 0.7, ease: EASE }}
            />
          </motion.div>

          {/* Info — staggered children */}
          <motion.div
            className="flex flex-col"
            variants={staggerContainer}
            initial="hidden"
            animate="show"
          >
            <motion.p variants={staggerItem} className="font-body text-xs uppercase tracking-[0.3em] text-primary/60">
              {painting.style}
            </motion.p>

            <motion.h1
              variants={staggerItem}
              className="mt-2 font-display text-4xl font-light text-foreground md:text-5xl"
            >
              {painting.title}
            </motion.h1>

            <motion.div variants={staggerItem}>
              <Link
                to={`/artists/${painting.artistId}`}
                className="mt-2 font-body text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                {painting.artist}
              </Link>
            </motion.div>

            {/* Animated gold rule */}
            <motion.div
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}
              className="mt-5 h-px w-16 bg-primary"
            />

            <motion.p
              variants={staggerItem}
              className="mt-6 font-display text-3xl font-light text-foreground"
            >
              ₹{painting.price.toLocaleString('en-IN')}
            </motion.p>

            <motion.p
              variants={staggerItem}
              className={`mt-2 font-body text-xs uppercase tracking-[0.2em] ${
                painting.availability === 'available'
                  ? 'text-green-700 dark:text-green-500'
                  : 'text-muted-foreground'
              }`}
            >
              <Check size={12} className="mr-1 inline" />
              {painting.availability === 'available'
                ? 'Available'
                : painting.availability === 'sold'
                ? 'Sold'
                : 'Reserved'}
            </motion.p>

            <motion.p
              variants={staggerItem}
              className="mt-6 font-body text-sm leading-relaxed text-muted-foreground"
            >
              {painting.description}
            </motion.p>

            {/* CTA buttons */}
            <motion.div variants={staggerItem} className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={handleAddToCart}
                disabled={painting.availability !== 'available'}
                className="flex items-center gap-2 bg-primary px-8 py-3 font-body text-xs uppercase tracking-[0.2em] text-primary-foreground transition-all duration-300 hover:bg-primary/90 disabled:opacity-40"
              >
                <ShoppingCart size={14} /> Add to Cart
              </button>
              <Link
                to="/cart"
                onClick={handleAddToCart}
                className="border border-primary px-8 py-3 font-body text-xs uppercase tracking-[0.2em] text-primary transition-all duration-300 hover:bg-primary/5"
              >
                Buy Now
              </Link>
              <button
                onClick={() => setInquiryOpen(true)}
                className="flex items-center gap-2 border border-primary/30 px-6 py-3 font-body text-xs uppercase tracking-[0.2em] text-primary transition-all duration-300 hover:border-primary hover:bg-primary/5"
              >
                <MessageSquare size={14} /> Inquire
              </button>
              <button
                onClick={() => setWishlisted(!wishlisted)}
                className={`border p-3 transition-all duration-300 ${
                  wishlisted
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border text-muted-foreground hover:border-primary hover:text-primary'
                }`}
                aria-label="Add to wishlist"
              >
                <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
              </button>
              <button
                className="border border-border p-3 text-muted-foreground transition-all duration-300 hover:border-primary hover:text-primary"
                aria-label="Share artwork"
              >
                <Share2 size={16} />
              </button>
            </motion.div>

            {/* Metadata rows — each row staggers in */}
            <motion.div
              className="mt-10 space-y-3 border-t border-border pt-6"
              variants={staggerContainer}
              initial="hidden"
              animate="show"
            >
              {metaRows.map(([label, value]) => (
                <motion.div key={label} variants={staggerItem} className="flex justify-between">
                  <span className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground">
                    {label}
                  </span>
                  <span className="font-body text-xs text-foreground">{value}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* ── About the Artist — scroll-triggered ───────────────────────── */}
        {artist && (
          <section ref={artistRef} className="mt-20 border-t border-border pt-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={artistInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.75, ease: EASE }}
              className="mb-6 font-display text-3xl font-light text-foreground"
            >
              About the Artist
            </motion.h2>

            <motion.div
              className="flex flex-col gap-6 md:flex-row md:items-start"
              variants={staggerContainer}
              initial="hidden"
              animate={artistInView ? 'show' : 'hidden'}
            >
              <motion.img
                variants={staggerItem}
                src={artist.image}
                alt={artist.name}
                className="h-24 w-24 rounded-full object-cover"
              />
              <motion.div variants={staggerItem}>
                <Link
                  to={`/artists/${artist.id}`}
                  className="font-display text-xl text-foreground hover:text-primary"
                >
                  {artist.name}
                </Link>
                <p className="mt-1 font-body text-xs uppercase tracking-[0.2em] text-primary/60">
                  {artist.speciality}
                </p>
                <p className="mt-3 max-w-2xl font-body text-sm leading-relaxed text-muted-foreground">
                  {artist.bio}
                </p>
              </motion.div>
            </motion.div>
          </section>
        )}

        {/* ── Reviews — scroll-triggered ────────────────────────────────── */}
        {/* <section ref={reviewsRef} className="mt-20 border-t border-border pt-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={reviewsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.75, ease: EASE }}
            className="mb-8 font-display text-3xl font-light text-foreground"
          >
            Reviews
          </motion.h2>

          <motion.div
            className="space-y-6"
            variants={staggerContainer}
            initial="hidden"
            animate={reviewsInView ? 'show' : 'hidden'}
          >
            {reviews.map((r) => (
              <motion.div
                key={r.id}
                variants={staggerItem}
                className="border-b border-border/50 pb-6"
              >
                <div className="flex items-center gap-2">
                  <div className="flex text-primary">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} size={12} fill="currentColor" />
                    ))}
                  </div>
                  <span className="font-body text-xs text-muted-foreground">{r.author}</span>
                </div>
                <p className="mt-2 font-body text-sm text-foreground">{r.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </section> */}

        {/* ── Related works — scroll-triggered ──────────────────────────── */}
        {related.length > 0 && (
          <section ref={relatedRef} className="mt-20 border-t border-border pt-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={relatedInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.75, ease: EASE }}
              className="mb-8 font-display text-3xl font-light text-foreground"
            >
              Related Artworks
            </motion.h2>

            <motion.div
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
              variants={staggerContainer}
              initial="hidden"
              animate={relatedInView ? 'show' : 'hidden'}
            >
              {related.map((p) => (
                <motion.div key={p.id} variants={staggerItem}>
                  <PaintingCard painting={p} />
                </motion.div>
              ))}
            </motion.div>
          </section>
        )}
      </main>

      <InquiryDialog
        open={inquiryOpen}
        onOpenChange={setInquiryOpen}
        artworkTitle={painting.title}
        artworkId={painting.id}
      />
    </div>
  );
};

export default ArtDetail;
