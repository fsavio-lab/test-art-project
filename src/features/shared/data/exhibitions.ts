import artwork1 from '@/assets/artwork-1.jpg';
import artwork2 from '@/assets/artwork-2.jpg';
import artwork3 from '@/assets/artwork-3.jpg';
import artwork4 from '@/assets/artwork-4.jpg';
import artwork5 from '@/assets/artwork-5.jpg';

export interface Exhibition {
  id: string;
  name: string;
  year: string;
  description: string;
  longDescription: string;
  image: string;
  featuredArtworks: string[];
  startDate: string;
  endDate: string;
  curator: string;
}

export const exhibitions: Exhibition[] = [
  {
    id: '1',
    name: 'Temple Narratives',
    year: '2024',
    description: 'Sacred stories from India\'s temple walls — Tanjore, Pattachitra, and mural traditions spanning a millennium of devotion.',
    longDescription: 'Temple Narratives brings together the luminous gold-leaf Tanjore paintings of Tamil Nadu, the intricate scroll paintings of Odisha\'s Pattachitra tradition, and rare reproductions of Kerala mural art. Each work tells a sacred story — from the Dashavatara to the Gita Govinda — revealing how Indian temple art served as both worship and visual scripture for centuries. This exhibition celebrates the divine craftsmanship that transformed places of worship into galleries of transcendent beauty.',
    image: artwork1,
    featuredArtworks: ['1', '3', '6'],
    startDate: '2024-06-01',
    endDate: '2024-12-31',
    curator: 'Dr. Meera Krishnamurthy',
  },
  {
    id: '2',
    name: 'Royal Courts',
    year: '2024',
    description: 'Mughal and Rajasthani miniatures — the jewel-like precision of India\'s courtly painting traditions.',
    longDescription: 'Royal Courts presents an extraordinary collection of Mughal and Rajasthani miniature paintings that epitomize the refined artistic culture of India\'s royal courts. From the naturalistic precision of Akbar\'s atelier to the romantic intensity of Mewar\'s Rajput paintings, this exhibition traces the evolution of miniature art across dynasties and regions. Each painting, painstakingly created with hand-ground mineral pigments and gold wash on handmade wasli paper, is a masterclass in patience, devotion, and artistic virtuosity.',
    image: artwork4,
    featuredArtworks: ['4', '7'],
    startDate: '2024-03-15',
    endDate: '2024-09-30',
    curator: 'Prof. Ebba Koch',
  },
  {
    id: '3',
    name: 'Folk Traditions',
    year: '2023',
    description: 'Warli, Madhubani, and Gond — the living folk art traditions that embody India\'s tribal wisdom.',
    longDescription: 'Folk Traditions celebrates India\'s vibrant tribal and folk art heritage through the geometric rhythms of Warli from Maharashtra, the sacred symbolism of Madhubani from Bihar, and the enchanting dot-and-dash patterns of Gond art from Madhya Pradesh. These art forms, passed down through generations within indigenous communities, encode profound ecological knowledge, creation myths, and social rituals. This exhibition honors the master artists who preserve these endangered traditions while making them accessible to a global audience.',
    image: artwork2,
    featuredArtworks: ['2', '5', '8'],
    startDate: '2023-09-01',
    endDate: '2024-02-28',
    curator: 'Dr. Jyotindra Jain',
  },
  {
    id: '4',
    name: 'Contemporary Indian Masters',
    year: '2023',
    description: 'Where tradition meets innovation — contemporary Indian artists redefining heritage through modern expression.',
    longDescription: 'Contemporary Indian Masters showcases artists who straddle the boundary between traditional Indian art forms and contemporary expression. These creators draw deeply from India\'s artistic heritage — the techniques, materials, and philosophies — while addressing modern themes of identity, ecology, and globalization. The result is a dynamic dialogue between past and present that positions Indian art at the forefront of the global contemporary scene.',
    image: artwork5,
    featuredArtworks: ['5', '6'],
    startDate: '2023-05-01',
    endDate: '2023-08-31',
    curator: 'Ranjit Hoskote',
  },
];
