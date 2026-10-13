import { ReviewItem } from '../types';

export const REVIEWS_OVERVIEW = {
  score: 4.9,
  maxScore: 5.0,
  totalReviews: 56,
  sourceName: 'Google Maps',
  googleMapsReviewUrl: 'https://www.google.com/maps/search/?api=1&query=Kedai+Kopi+Ruang+Atas+Tenjo+City+Bogor'
};

export const REVIEWS_DATA: ReviewItem[] = [
  {
    id: 'rev-1',
    author: 'Pengunjung Google Maps',
    rating: 5,
    highlight: 'Suasana Rooftop Sore Hari',
    content: 'Tempat ngopi asyik di Tenjo, suasananya enak buat nongkrong sore ke malam hari. Angin sepoi-sepoi di rooftop bikin betah.'
  },
  {
    id: 'rev-2',
    author: 'Pengunjung Google Maps',
    rating: 5,
    highlight: 'Hidden Gem di Tenjo',
    content: 'Hidden gem di daerah Singabangsa dekat gerbang Tenjo City. Meja kayu dan suasananya santai, cocok buat ngobrol santai bareng teman.'
  },
  {
    id: 'rev-3',
    author: 'Pengunjung Google Maps',
    rating: 5,
    highlight: 'Tempat Bersih & Nyaman',
    content: 'Tempatnya bersih dengan konsep industrial terbuka yang nyaman. Paling pas datang pas senja ketika kedai buka jam 16.00.'
  }
];
