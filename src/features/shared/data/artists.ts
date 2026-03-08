import artwork1 from '@/assets/artwork-1.jpg';
import artwork2 from '@/assets/artwork-2.jpg';
import artwork3 from '@/assets/artwork-3.jpg';
import artwork4 from '@/assets/artwork-4.jpg';
import artwork5 from '@/assets/artwork-5.jpg';

export interface Artist {
  id: string;
  name: string;
  origin: string;
  speciality: string;
  bio: string;
  image: string;
  styles: string[];
  totalWorks: number;
  yearsActive: string;
  awards?: Array<string>;
  isFeatured?: boolean;
}

export const artists: Artist[] = [
  {
    id: '1',
    name: 'Lakshmi Venkataraman',
    origin: 'Thanjavur, Tamil Nadu',
    speciality: 'Tanjore & Kalamkari',
    bio: 'A third-generation master of the Tanjore tradition, Lakshmi fuses the luminous gold-leaf technique of her ancestors with contemporary devotional themes. Her Kalamkari works extend this sacred visual language into textile.',
    image: artwork1,
    styles: ['Tanjore Painting', 'Kalamkari'],
    totalWorks: 2,
    yearsActive: '2008 – Present',
    awards: ['National Crafts Award 2019'],
    isFeatured: true
  },
  {
    id: '2',
    name: 'Jivya Soma Mashe',
    origin: 'Thane, Maharashtra',
    speciality: 'Warli Folk Art',
    bio: 'Credited with bringing the ancient Warli tradition to international prominence, Jivya\'s geometric white figures on terracotta grounds capture the spiritual ecology of tribal Maharashtra with breathtaking economy of means.',
    image: artwork2,
    styles: ['Warli Folk Art'],
    totalWorks: 1,
    yearsActive: '1975 – Present',
    awards: ['Padma Shri 2011'],
    isFeatured: true
  },
  {
    id: '3',
    name: 'Ananta Maharana',
    origin: 'Raghurajpur, Odisha',
    speciality: 'Pattachitra & Gond',
    bio: 'Born in India\'s only heritage crafts village, Ananta is a virtuoso of two traditions — the intricate narrative scrolls of Odisha\'s Pattachitra and the lyrical dot-language of Gond tribal art from central India.',
    image: artwork3,
    styles: ['Pattachitra', 'Gond Art'],
    totalWorks: 2,
    yearsActive: '1995 – Present',
    isFeatured: false
  },
  {
    id: '4',
    name: 'Razia Sultana',
    origin: 'Jaipur, Rajasthan',
    speciality: 'Mughal & Rajasthani Miniature',
    bio: 'Trained at the Rajasthan School of Arts, Razia is one of the few women masters of the miniature tradition. Her paintings recover lost techniques — hand-ground lapis lazuli, gold wash, squirrel-hair brushes — to produce work of breathtaking precision.',
    image: artwork4,
    styles: ['Mughal Miniature', 'Rajasthani Miniature'],
    totalWorks: 2,
    yearsActive: '2001 – Present',
    awards: ['Rajasthan Lalit Kala Akademi Award 2017'],
    isFeatured: true
  },
  {
    id: '5',
    name: 'Bharti Dayal',
    origin: 'Madhubani, Bihar',
    speciality: 'Madhubani (Mithila)',
    bio: 'A leading voice in contemporary Madhubani art, Bharti extends the ancient Mithila tradition beyond ritual contexts into meditations on feminism, ecology, and identity. Her work has been exhibited from New Delhi to New York.',
    image: artwork5,
    styles: ['Madhubani (Mithila)'],
    totalWorks: 1,
    yearsActive: '1998 – Present',
    awards: ['Bihar Ratna Award 2020'],
    isFeatured: true
  },
];
