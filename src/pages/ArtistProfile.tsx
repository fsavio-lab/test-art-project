import { useParams, Link } from 'react-router-dom';
import { artists } from '@/features/shared/data/artists';
import { paintings } from '@/features/shared/data/paintings';
import Navigation from '@/features/navigation/Navigation';
import PaintingCard from '@/features/marketplace/PaintingCard';
import { ArrowLeft } from 'lucide-react';

const ArtistProfile = () => {
  const { id } = useParams<{ id: string }>();
  const artist = artists.find((a) => a.id === id);

  if (!artist) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <Navigation />
        <p className="font-display text-2xl text-foreground">Artist not found</p>
        <Link to="/artists" className="mt-4 font-body text-sm text-primary hover:underline">Back to Artists</Link>
      </div>
    );
  }

  const artistWorks = paintings.filter((p) => p.artistId === artist.id);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="mx-auto max-w-7xl px-6 pb-20 pt-28">
        <Link to="/artists" className="mb-8 inline-flex items-center gap-2 font-body text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft size={14} /> Back to Artists
        </Link>

        <div className="grid items-start gap-12 md:grid-cols-3">
          <div className="overflow-hidden border border-border shadow-warm">
            <img src={artist.portrait} alt={artist.name} className="aspect-square w-full object-cover" />
          </div>
          <div className="md:col-span-2">
            <p className="font-body text-xs uppercase tracking-[0.3em] text-primary/60">{artist.specialization}</p>
            <h1 className="mt-2 font-display text-4xl font-light text-foreground md:text-5xl">{artist.name}</h1>
            <p className="mt-6 font-body text-sm leading-relaxed text-muted-foreground">{artist.fullBio}</p>
            <p className="mt-4 font-body text-xs text-muted-foreground"><strong className="text-foreground">Style:</strong> {artist.style}</p>

            {artist.awards.length > 0 && (
              <div className="mt-8">
                <h3 className="font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Awards & Recognition</h3>
                <ul className="mt-3 space-y-1">
                  {artist.awards.map((a) => (
                    <li key={a} className="font-body text-sm text-foreground">• {a}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-8 flex gap-4">
              {artist.socialLinks.map((link) => (
                <a
                  key={link.platform}
                  href={link.url}
                  className="border border-border px-4 py-2 font-body text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  {link.platform}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Available works */}
        {artistWorks.length > 0 && (
          <section className="mt-20 border-t border-border pt-12">
            <h2 className="mb-8 font-display text-3xl font-light text-foreground">Available Works</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {artistWorks.map((p) => (
                <PaintingCard key={p.id} painting={p} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default ArtistProfile;
