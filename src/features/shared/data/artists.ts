import artwork1 from '@/assets/artwork-1.jpg';
import artwork2 from '@/assets/artwork-2.jpg';
import artwork3 from '@/assets/artwork-3.jpg';
import artwork4 from '@/assets/artwork-4.jpg';
import artwork5 from '@/assets/artwork-5.jpg';

export interface Artist {
  id: string;
  name: string;
  portrait: string;
  specialization: string;
  bio: string;
  fullBio: string;
  style: string;
  awards: string[];
  socialLinks: { platform: string; url: string }[];
  featuredWorks: string[];
  isFeatured: boolean
}

export const artists: Artist[] = [
  {
    id: '1',
    name: 'Lakshmi Venkataraman',
    portrait: artwork1,
    specialization: 'Tanjore & Kalamkari',
    bio: 'Chennai-based artist preserving the luminous tradition of Tanjore painting with 22-karat gold leaf and Kalamkari textile art from Andhra Pradesh.',
    fullBio: 'Lakshmi Venkataraman is a Chennai-based master artist who has dedicated over two decades to the preservation and evolution of South Indian traditional art forms. Trained under the legendary Tanjore painter Sri Ramaswamy at the Government College of Fine Arts, she brings an extraordinary reverence for the gold-leaf technique that defines Thanjavur art. Her Kalamkari works draw from the ancient Srikalahasti tradition, using natural vegetable dyes applied with a bamboo pen (kalam). Her works are held in the National Gallery of Modern Art, New Delhi, and private collections across Asia and Europe.',
    style: 'Traditional Tanjore & Kalamkari with contemporary sensibility',
    awards: ['National Award for Traditional Art, Lalit Kala Akademi 2022', 'Gold Medal, Chennai Art Festival 2021'],
    socialLinks: [
      { platform: 'Instagram', url: '#' },
      { platform: 'Website', url: '#' },
    ],
    featuredWorks: ['1', '6'],
    isFeatured: true
  },
  {
    id: '2',
    name: 'Jivya Soma Mashe',
    portrait: artwork2,
    specialization: 'Warli Tribal Art',
    bio: 'Pioneering Warli artist from Maharashtra who elevated tribal art to international gallery recognition while preserving its sacred geometric vocabulary.',
    fullBio: 'Jivya Soma Mashe is one of the most celebrated Warli artists of the modern era, hailing from the Thane district of Maharashtra. His work bridges the ancient ritual art of the Warli community — traditionally painted on mud walls during weddings and harvests — with contemporary fine art. Using only rice paste and natural earth pigments, his compositions depict the cyclical rhythms of tribal life, harvest celebrations, and the deep symbiosis between humanity and nature. His works have been exhibited at the Musée du quai Branly in Paris and the Museum of Sacred Art in Belgium.',
    style: 'Warli Tribal Art',
    awards: ['Padma Shri Award, Government of India', 'National Tribal Art Award 2020'],
    socialLinks: [
      { platform: 'Instagram', url: '#' },
      { platform: 'Website', url: '#' },
    ],
    featuredWorks: ['2'],
    isFeatured: false
  },
  {
    id: '3',
    name: 'Ananta Maharana',
    portrait: artwork3,
    specialization: 'Pattachitra & Gond Art',
    bio: 'Odisha-based Pattachitra master blending centuries-old scroll painting traditions with Gond tribal narratives from Central India.',
    fullBio: 'Ananta Maharana belongs to a lineage of chitrakars (traditional painters) from the temple town of Puri, Odisha. His Pattachitra paintings follow the strict iconographic traditions codified over a thousand years, using natural dyes extracted from stones, flowers, and conch shells. Each work narrates episodes from the Jagannath cult, the Dashavatara, or scenes from the Gita Govinda. In recent years, he has also embraced Gond art from Madhya Pradesh, creating a unique fusion that honors both traditions. His works are part of the permanent collection at the Odisha State Museum and the Victoria & Albert Museum, London.',
    style: 'Pattachitra Scroll Painting & Gond Tribal Art',
    awards: ['State Master Craftsman Award, Odisha 2023', 'UNESCO Seal of Excellence 2022'],
    socialLinks: [
      { platform: 'Instagram', url: '#' },
      { platform: 'Website', url: '#' },
    ],
    featuredWorks: ['3', '8'],
    isFeatured: false
  },
  {
    id: '4',
    name: 'Razia Sultana',
    portrait: artwork4,
    specialization: 'Mughal & Rajasthani Miniatures',
    bio: 'Jaipur-based miniature painter trained in the Mughal and Rajput schools, creating courtly narratives with mineral pigments and gold wash.',
    fullBio: 'Razia Sultana is a Jaipur-based miniature painter whose mastery of the Mughal and Rajasthani schools has earned her international acclaim. Trained at the prestigious Jaipur School of Art under master ustad Haji Mohammed Sharif, she works with hand-ground mineral pigments, squirrel-hair brushes containing just a few strands, and 24-karat gold wash on handmade wasli paper. Her paintings require months of painstaking detail, with some works featuring brushstrokes invisible to the naked eye. Her work has been exhibited at the Metropolitan Museum of Art, New York, and the Aga Khan Museum, Toronto.',
    style: 'Mughal & Rajasthani Miniature Painting',
    awards: ['President\'s Award for Master Craftsperson 2024', 'Shilp Guru Award 2023'],
    socialLinks: [
      { platform: 'Instagram', url: '#' },
      { platform: 'Website', url: '#' },
    ],
    featuredWorks: ['4', '7'],
    isFeatured: false
  },
  {
    id: '5',
    name: 'Bharti Dayal',
    portrait: artwork5,
    specialization: 'Madhubani (Mithila) Art',
    bio: 'Bihar-born Madhubani artist reinventing the vibrant Mithila tradition with contemporary themes while honoring its sacred symbolism.',
    fullBio: 'Bharti Dayal is one of the foremost contemporary practitioners of Madhubani painting, a tradition rooted in the Mithila region of Bihar. Her work reimagines the traditional motifs — the tree of life, lotus, fish, peacocks, and the sun and moon — through a modern lens while maintaining the intricate line work and vivid natural dyes that define the art form. Working in the Bharni (filled) and Kachni (line) styles, she creates compositions that pulse with energy and spiritual symbolism. Her work is collected by the Mithila Museum in Japan and the Smithsonian Institution.',
    style: 'Contemporary Madhubani',
    awards: ['Bihar Ratna Award 2023', 'India Art Fair Emerging Master 2022'],
    socialLinks: [
      { platform: 'Instagram', url: '#' },
      { platform: 'Website', url: '#' },
    ],
    featuredWorks: ['5'],
    isFeatured: false
  },
];
