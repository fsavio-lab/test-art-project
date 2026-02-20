import { memo } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '@/features/shared/context/CartContext';
import type { Painting } from '@/features/shared/data/paintings';
import { ShoppingCart } from 'lucide-react';

interface PaintingCardProps {
  painting: Painting;
}

const PaintingCard = memo(({ painting }: PaintingCardProps) => {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (painting.availability !== 'available') return;
    addItem({
      id: painting.id,
      title: painting.title,
      artist: painting.artist,
      price: painting.price,
      image: painting.image,
    });
  };

  return (
    <div className="group flex flex-col overflow-hidden border border-border bg-card shadow-warm transition-all duration-500 hover:border-primary/30 hover:shadow-warm-lg">
      <Link to={`/marketplace/${painting.id}`} className="relative aspect-[3/4] overflow-hidden">
        <img
          src={painting.image}
          alt={painting.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {painting.availability !== 'available' && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60">
            <span className="font-body text-xs uppercase tracking-[0.3em] text-foreground">
              {painting.availability === 'sold' ? 'Sold' : 'Reserved'}
            </span>
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <Link to={`/marketplace/${painting.id}`}>
          <h3 className="font-display text-lg font-light text-foreground transition-colors hover:text-primary">
            {painting.title}
          </h3>
        </Link>
        <p className="mt-1 font-body text-xs tracking-wider text-muted-foreground">{painting.artist}</p>
        <p className="mt-2 line-clamp-2 font-body text-xs leading-relaxed text-muted-foreground/70">
          {painting.description}
        </p>
        <div className="mt-auto pt-4">
          <p className="font-display text-xl font-light text-foreground">
            ₹{painting.price.toLocaleString('en-IN')}
          </p>
          <div className="mt-3 flex gap-2">
            <Link
              to={`/marketplace/${painting.id}`}
              className="flex-1 border border-primary/30 py-2 text-center font-body text-[10px] uppercase tracking-[0.2em] text-primary transition-all duration-300 hover:border-primary hover:bg-primary/5"
            >
              View Details
            </Link>
            <button
              onClick={handleAddToCart}
              disabled={painting.availability !== 'available'}
              className="flex items-center justify-center gap-1.5 bg-primary px-4 py-2 font-body text-[10px] uppercase tracking-[0.2em] text-primary-foreground transition-all duration-300 hover:bg-primary/90 disabled:opacity-40"
              aria-label={`Add ${painting.title} to cart`}
            >
              <ShoppingCart size={12} />
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

PaintingCard.displayName = 'PaintingCard';
export default PaintingCard;
