import { useCart } from '@/features/shared/context/CartContext';
import Navigation from '@/features/navigation/Navigation';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

const TAX_RATE = 0.18; // GST
const SHIPPING_FLAT = 2500;

const Cart = () => {
  const { items, removeItem, updateQuantity, subtotal, clearCart } = useCart();
  const tax = subtotal * TAX_RATE;
  const shipping = items.length > 0 ? SHIPPING_FLAT : 0;
  const total = subtotal + tax + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="flex flex-col items-center justify-center px-6 pb-20 pt-40 text-center">
          <ShoppingBag size={48} className="text-muted-foreground/30" />
          <h1 className="mt-6 font-display text-4xl font-light text-foreground">Your Cart is Empty</h1>
          <p className="mt-3 font-body text-sm text-muted-foreground">Discover exceptional artworks from India's finest artists.</p>
          <Link to="/marketplace" className="mt-8 bg-primary px-10 py-3 font-body text-xs uppercase tracking-[0.2em] text-primary-foreground transition-all hover:bg-primary/90">
            Browse Collection
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="mx-auto max-w-7xl px-6 pb-20 pt-28">
        <h1 className="mb-12 font-display text-5xl font-light text-foreground">Shopping Cart</h1>
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Items */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-6 border border-border bg-card p-4 shadow-warm">
                  <Link to={`/marketplace/${item.id}`} className="h-28 w-28 shrink-0 overflow-hidden">
                    <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                  </Link>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <Link to={`/marketplace/${item.id}`} className="font-display text-lg text-foreground hover:text-primary">
                        {item.title}
                      </Link>
                      <p className="font-body text-xs text-muted-foreground">{item.artist}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}
                          className="border border-border p-1.5 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30" aria-label="Decrease quantity">
                          <Minus size={12} />
                        </button>
                        <span className="w-6 text-center font-body text-sm text-foreground">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="border border-border p-1.5 text-muted-foreground transition-colors hover:text-foreground" aria-label="Increase quantity">
                          <Plus size={12} />
                        </button>
                        <button onClick={() => removeItem(item.id)}
                          className="ml-4 text-muted-foreground transition-colors hover:text-destructive" aria-label="Remove item">
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <p className="font-display text-lg text-foreground">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="h-fit border border-border bg-card p-8 shadow-warm">
            <h2 className="mb-6 font-display text-2xl font-light text-foreground">Order Summary</h2>
            <div className="space-y-3 border-b border-border pb-4">
              <div className="flex justify-between font-body text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between font-body text-sm">
                <span className="text-muted-foreground">GST (18%)</span>
                <span className="text-foreground">₹{tax.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between font-body text-sm">
                <span className="text-muted-foreground">Insured Shipping</span>
                <span className="text-foreground">₹{shipping.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <div className="mt-4 flex justify-between">
              <span className="font-display text-xl text-foreground">Total</span>
              <span className="font-display text-xl text-foreground">₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <button className="mt-6 w-full bg-primary py-4 font-body text-xs uppercase tracking-[0.2em] text-primary-foreground transition-all hover:bg-primary/90">
              Proceed to Checkout
            </button>
            <button onClick={clearCart} className="mt-3 w-full py-2 font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground">
              Clear Cart
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cart;
