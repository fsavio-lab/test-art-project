import { useMemo, useState, useCallback } from 'react';
import { paintings, type Painting } from '@/features/shared/data/paintings';
import { artists, type Artist } from '@/features/shared/data/artists';

// ── Types ─────────────────────────────────────────────────────────────────────

export type SearchCategory = 'all' | 'paintings' | 'prints' | 'artists';

export interface SearchResultPainting {
  type: 'painting';
  item: Painting;
  score: number;
  matchedFields: string[];
}

export interface SearchResultArtist {
  type: 'artist';
  item: Artist;
  score: number;
  matchedFields: string[];
}

export type SearchResult = SearchResultPainting | SearchResultArtist;

export interface SearchResults {
  paintings: SearchResultPainting[];
  prints: SearchResultPainting[];
  artists: SearchResultArtist[];
  total: number;
}

// ── Scoring ───────────────────────────────────────────────────────────────────

/** Returns a relevance score ≥ 0. Higher = more relevant. */
function scorePainting(painting: Painting, query: string): { score: number; matchedFields: string[] } {
  const q = query.toLowerCase().trim();
  if (!q) return { score: 0, matchedFields: [] };

  let score = 0;
  const matchedFields: string[] = [];

  const checks: Array<[string, number, string]> = [
    [painting.title.toLowerCase(), 10, 'Title'],
    [painting.artist.toLowerCase(), 8, 'Artist'],
    [painting.style.toLowerCase(), 7, 'Style'],
    [painting.medium.toLowerCase(), 5, 'Medium'],
    [painting.description.toLowerCase(), 3, 'Description'],
    [painting.category.toLowerCase(), 4, 'Category'],
    [painting.availability.toLowerCase(), 3, 'Availability'],
  ];

  for (const [field, weight, label] of checks) {
    if (field.includes(q)) {
      score += weight;
      matchedFields.push(label);
    } else {
      // Partial word matching — each matching word adds half weight
      const words = q.split(/\s+/);
      const matchedWords = words.filter((w) => w.length > 2 && field.includes(w));
      if (matchedWords.length > 0) {
        score += (matchedWords.length / words.length) * weight * 0.6;
        if (!matchedFields.includes(label)) matchedFields.push(label);
      }
    }
  }

  // Boost popular / available items slightly
  if (painting.availability === 'available') score += 0.5;
  score += painting.popularity * 0.02;

  return { score, matchedFields };
}

function scoreArtist(artist: Artist, query: string): { score: number; matchedFields: string[] } {
  const q = query.toLowerCase().trim();
  if (!q) return { score: 0, matchedFields: [] };

  let score = 0;
  const matchedFields: string[] = [];

  const checks: Array<[string, number, string]> = [
    [artist.name.toLowerCase(), 10, 'Name'],
    [artist.origin.toLowerCase(), 6, 'Origin'],
    [artist.speciality.toLowerCase(), 7, 'Speciality'],
    [artist.bio?.toLowerCase() ?? '', 3, 'Bio'],
    [artist.styles.join(' ').toLowerCase(), 5, 'Style'],
  ];

  for (const [field, weight, label] of checks) {
    if (field.includes(q)) {
      score += weight;
      matchedFields.push(label);
    } else {
      const words = q.split(/\s+/);
      const matchedWords = words.filter((w) => w.length > 2 && field.includes(w));
      if (matchedWords.length > 0) {
        score += (matchedWords.length / words.length) * weight * 0.6;
        if (!matchedFields.includes(label)) matchedFields.push(label);
      }
    }
  }

  return { score, matchedFields };
}

// ── Hook ──────────────────────────────────────────────────────────────────────

const QUICK_LIMIT = 3; // Items per category shown in dialog preview
const PAGE_SIZE = 12;

export function useSearch() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<SearchCategory>('all');
  const [page, setPage] = useState(1);

  const results: SearchResults = useMemo(() => {
    if (!query.trim() || query.trim().length < 2) {
      return { paintings: [], prints: [], artists: [], total: 0 };
    }

    const paintingResults: SearchResultPainting[] = paintings
      .filter((p) => p.category === 'fine-art')
      .map((p) => {
        const { score, matchedFields } = scorePainting(p, query);
        return { type: 'painting' as const, item: p, score, matchedFields };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score);

    const printResults: SearchResultPainting[] = paintings
      .filter((p) => p.category === 'prints')
      .map((p) => {
        const { score, matchedFields } = scorePainting(p, query);
        return { type: 'painting' as const, item: p, score, matchedFields };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score);

    const artistResults: SearchResultArtist[] = artists
      .map((a) => {
        const { score, matchedFields } = scoreArtist(a, query);
        return { type: 'artist' as const, item: a, score, matchedFields };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score);

    return {
      paintings: paintingResults,
      prints: printResults,
      artists: artistResults,
      total: paintingResults.length + printResults.length + artistResults.length,
    };
  }, [query]);

  // Paginated flat list for the results page
  const pagedResults = useMemo(() => {
    let flat: SearchResult[] = [];

    if (activeCategory === 'all' || activeCategory === 'paintings') {
      flat = [...flat, ...results.paintings];
    }
    if (activeCategory === 'all' || activeCategory === 'prints') {
      flat = [...flat, ...results.prints];
    }
    if (activeCategory === 'all' || activeCategory === 'artists') {
      flat = [...flat, ...results.artists];
    }

    // Re-sort combined list by score
    flat.sort((a, b) => b.score - a.score);

    return {
      items: flat.slice(0, page * PAGE_SIZE),
      hasMore: flat.length > page * PAGE_SIZE,
      total: flat.length,
    };
  }, [results, activeCategory, page]);

  // Preview — top N per category for the dialog
  const preview = useMemo(() => ({
    paintings: results.paintings.slice(0, QUICK_LIMIT),
    prints: results.prints.slice(0, QUICK_LIMIT),
    artists: results.artists.slice(0, QUICK_LIMIT),
  }), [results]);

  const loadMore = useCallback(() => setPage((p) => p + 1), []);

  const reset = useCallback(() => {
    setQuery('');
    setPage(1);
    setActiveCategory('all');
  }, []);

  return {
    query,
    setQuery,
    results,
    preview,
    pagedResults,
    activeCategory,
    setActiveCategory,
    page,
    loadMore,
    reset,
    isEmpty: query.trim().length < 2,
  };
}

// ── Suggested / trending queries ──────────────────────────────────────────────

export const trendingSearches = [
  'Tanjore',
  'Warli',
  'Pattachitra',
  'Mughal miniature',
  'Madhubani',
  'Gold leaf',
  'Limited edition',
];