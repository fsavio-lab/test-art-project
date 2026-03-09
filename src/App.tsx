import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { CartProvider } from "@/features/shared/context/CartContext";
import { lazy, Suspense } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";

const Marketplace = lazy(() => import("./pages/Marketplace"));
const ArtDetail = lazy(() => import("./pages/ArtDetail"));
const Cart = lazy(() => import("./pages/Cart"));
const Exhibitions = lazy(() => import("./pages/Exhibitions"));
const Contact = lazy(() => import("./pages/Contact"));
const About = lazy(() => import("./pages/About"));
const Artists = lazy(() => import("./pages/Artists"));
const ArtistProfile = lazy(() => import("./pages/ArtistProfile"));
const FineArt = lazy(() => import("./pages/FineArt"));
const Prints = lazy(() => import("./pages/Prints"));
const SearchResults = lazy(() => import("./pages/SearchResults"));

const queryClient = new QueryClient();

const PageFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-background">
    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
  </div>
);

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Suspense fallback={<PageFallback />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/marketplace/:id" element={<ArtDetail />} />
                <Route path="/prints" element={<Prints />} />
                <Route path="/fine_art" element={<FineArt />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/exhibitions" element={<Exhibitions />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/about" element={<About />} />
                <Route path="/artists" element={<Artists />} />
                <Route path="/artists/:id" element={<ArtistProfile />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
