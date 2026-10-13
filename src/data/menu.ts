import { MenuItem } from '../types';

export const MENU_CATEGORIES = [
  { id: 'all', label: 'Semua Sajian' },
  { id: 'coffee', label: 'Seduhan Kopi' },
  { id: 'signature', label: 'Signature Ruang Atas' },
  { id: 'non-coffee', label: 'Non-Coffee' },
  { id: 'food', label: 'Camilan & Kudapan' }
] as const;

export const SAMPLE_MENU_ITEMS: MenuItem[] = [
  {
    id: 'm-1',
    name: 'Kopi Susu Ruang Atas',
    category: 'signature',
    description: 'Espresso blend pilihan dengan susu segar lembut dan sentuhan gula aren yang legit seimbang.',
    notes: 'Favorit Pengunjung'
  },
  {
    id: 'm-2',
    name: 'Americano / Long Black',
    category: 'coffee',
    description: 'Double shot espresso berpadu air mineral, menghadirkan aroma biji kopi yang bersih dan berkarakter.',
    notes: 'Tersedia Panas & Dingin'
  },
  {
    id: 'm-3',
    name: 'Manual Brew Pour Over',
    category: 'coffee',
    description: 'Seduhan manual V60 menggunakan beans pilihan dengan notes floral dan fruity yang lembut.',
    notes: 'Tanyakan Beans Hari Ini'
  },
  {
    id: 'm-4',
    name: 'Caramel Macchiato',
    category: 'coffee',
    description: 'Layer espresso pekat, steamed milk gurih, dan drizzle karamel manis keemasan.',
    notes: 'Krem & Lembut'
  },
  {
    id: 'm-5',
    name: 'Mocktail Senja Tenjo',
    category: 'signature',
    description: 'Cold brew ringan berpadu sari buah tropis dan kesegaran soda dingin untuk sore di rooftop.',
    notes: 'Segar & Unik'
  },
  {
    id: 'm-6',
    name: 'Artisan Matcha Latte',
    category: 'non-coffee',
    description: 'Bubuk matcha murni yang dikocok halus bersama susu murni segar, aroma harum dan menenangkan.',
    notes: 'Racikan Khusus'
  },
  {
    id: 'm-7',
    name: 'Cokelat Hangat / Es Cokelat',
    category: 'non-coffee',
    description: 'Kakao kental dengan rasa manis cokelat yang dalam, teman pas obrolan malam santai.',
    notes: 'Nyaman & Manis'
  },
  {
    id: 'm-8',
    name: 'Kentang Goreng Bumbu Gurih',
    category: 'food',
    description: 'Potongan kentang goreng renyah dengan taburan rempah gurih dan saus cocolan.',
    notes: 'Camilan Teman Ngobrol'
  },
  {
    id: 'm-9',
    name: 'Roti Panggang Cokelat Keju',
    category: 'food',
    description: 'Roti bakar garing keemasan dengan isian cokelat leleh melimpah dan taburan keju gurih klasik.',
    notes: 'Sajian Hangat'
  }
];
