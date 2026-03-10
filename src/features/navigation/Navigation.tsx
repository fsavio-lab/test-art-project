import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Search, ShoppingBag } from 'lucide-react';
import { useCart } from '@/features/shared/context/CartContext';
import indiaFineArtLogo from '@/assets/logo/android-chrome-192x192.png';
import SearchDialog from '@/features/search/SearchDialog';

const navLinks = [
  { label: 'Marketplace', href: '/marketplace' },
  { label: 'Exhibitions', href: '/exhibitions' },
  { label: 'Editions', href: '/editions' },
  { label: 'Fine Art', href: '/fine_art' },
  { label: 'Artists', href: '/artists' },
  { label: 'About', href: '/about' },
  // { label: 'Contact', href: '/contact' },
];

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const location = useLocation();
  const { itemCount } = useCart();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  // Global keyboard shortcut: Cmd/Ctrl+K opens search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((o) => !o);
        setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleSearchOpen = () => {
    setSearchOpen(true);
    setMenuOpen(false);
  };
  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-700 bg-background/80 backdrop-blur-md shadow-warm`}
      // className={`fixed left-0 right-0 top-0 z-50 transition-all duration-700 ${isScrolled ? 'bg-background/80 backdrop-blur-md shadow-warm' : ''
      //   }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-8 py-3">
          {/* <Link to="/" className="font-display text-lg md:text-xl  font-light tracking-wider text-foreground">
            <div className='flex items-center'><img
              src={indiaFineArtLogo}
              alt="India Fine Art Logo"
              className="h-full w-16 transition-transform duration-700 group-hover:scale-105"

            />
              <h1>
                INDIA FINE ART
              </h1></div>
          </Link> */}
          <Link
            to="/"
            className="relative flex items-center justify-center font-display text-lg md:text-xl font-light tracking-wider text-foreground w-40 pb-2"
          >
            <img
              src={indiaFineArtLogo}
              alt="India Fine Art Logo"
              className="w-15 "
            />

            <h1 className="absolute z-10 underline underline-offset-4 pt-4">
              INDIA FINE ART
            </h1>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-10 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className={`group relative font-body text-xs uppercase tracking-[0.25em] transition-colors duration-300 hover:text-foreground ${location.pathname === link.href ? 'text-foreground' : 'text-muted-foreground'
                  }`}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 h-px bg-primary transition-all duration-300 ${location.pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
              </Link>
            ))}

            {/* Search */}
            <button
              onClick={handleSearchOpen}
              className="text-muted-foreground"
              aria-label="Search"
            >
              <Search size={18} />
            </button>


            {/* Cart */}
            <Link to="/cart" className="relative text-muted-foreground transition-colors hover:text-foreground" aria-label="Shopping cart">
              <ShoppingBag size={18} />
              {itemCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-medium text-primary-foreground">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Theme toggle */}
            {/* {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="rounded-full p-2 text-muted-foreground transition-colors duration-300 hover:text-foreground"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            )} */}
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-4 lg:hidden">
            <button
              onClick={handleSearchOpen}
              className="text-muted-foreground"
              aria-label="Search"
            >
              <Search size={18} />
            </button>
            <Link to="/cart" className="relative text-muted-foreground px-2" aria-label="Shopping cart">
              <ShoppingBag size={18} />
              {itemCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-medium text-primary-foreground mx-2">
                  {itemCount}
                </span>
              )}
            </Link>
            {/* {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 text-muted-foreground"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            )} */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="relative flex h-6 w-6 items-center justify-center"
              aria-label="Toggle menu"
            >
              {/* Top Line */}
              <motion.span
                animate={
                  menuOpen
                    ? { rotate: 45, y: 0 }
                    : { rotate: 0, y: -6 }
                }
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="absolute h-px w-6 bg-foreground"
                style={{ transformOrigin: "center" }}
              />

              {/* Middle Line */}
              <motion.span
                animate={{
                  opacity: menuOpen ? 0 : 1,
                  scaleX: menuOpen ? 0.8 : 1
                }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="absolute h-px w-6 bg-foreground"
                style={{ transformOrigin: "center" }}
              />

              {/* Bottom Line */}
              <motion.span
                animate={
                  menuOpen
                    ? { rotate: -45, y: 0 }
                    : { rotate: 0, y: 6 }
                }
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="absolute h-px w-6 bg-foreground"
                style={{ transformOrigin: "center" }}
              />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-background/95 backdrop-blur-xl"
          >
            <div className="flex flex-col items-center gap-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    to={link.href}
                    className="font-display text-4xl font-light text-foreground"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* ── Search dialog ────────────────────────────────────────────── */}
      <SearchDialog isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default Navigation;
