import { InvitationData, PricingPackage, OrderItem, GuestItem, RSVPResponseItem, UserProfile } from '../types/wedding';

export const INITIAL_PACKAGES: PricingPackage[] = [
  {
    id: 'pkg-silver',
    tier: 'silver',
    name: 'Silver Romance',
    price: 149000,
    discounted_price: 99000,
    description: 'Pilihan hemat untuk pernikahan intim & sederhana dengan esensi lengkap.',
    features: [
      'Desain Responsif (Mobile & Desktop)',
      'Hitung Mundur Waktu Acara',
      'Peta Lokasi Google Maps 1-Klik',
      'Maksimal 150 Nama Tamu',
      'Amplop Digital (1 Rekening)',
      'Masa Aktif 3 Bulan'
    ],
    is_popular: false,
  },
  {
    id: 'pkg-gold',
    tier: 'gold',
    name: 'Gold Emerald',
    price: 249000,
    discounted_price: 179000,
    description: 'Pilihan terfavorit dengan tema eksklusif Emerald & Gold serta fitur RSVP lengkap.',
    features: [
      'Tema Emerald & Gold Arch Eksklusif',
      'Personalisasi Tamu Tanpa Batas (?to=Nama)',
      'Konfirmasi RSVP & Ucapan Real-Time',
      'Amplop Digital & QRIS Dinamis',
      'Galeri Foto Prewedding (Hingga 12 Foto)',
      'Pemutar Musik Latar Romantis Otomatis',
      'Kirim Undangan WhatsApp 1-Klik',
      'Masa Aktif 12 Bulan'
    ],
    is_popular: true,
  },
  {
    id: 'pkg-platinum',
    tier: 'platinum',
    name: 'Platinum Royal',
    price: 399000,
    discounted_price: 299000,
    description: 'Paket paripurna untuk momen agung berkesan seumur hidup tanpa batasan.',
    features: [
      'Semua Fitur Paket Gold',
      'Dukungan Custom Domain (namapasangan.id)',
      'Galeri Foto & Video Sinematik Tanpa Batas',
      'Integrasi Live Streaming YouTube/Zoom',
      'Kisah Perjalanan Cinta (Love Story Timeline)',
      'Sistem QR Code Check-In Tamu Resepsi',
      'Bantuan Desain & Input Data VIP',
      'Masa Aktif Selamanya'
    ],
    is_popular: false,
  }
];

export const INITIAL_INVITATIONS: InvitationData[] = [
  {
    id: 'inv-rina-dimas',
    user_id: 'usr-customer-1',
    slug: 'rina-dimas',
    title: 'The Wedding of Rina & Dimas',
    theme_id: 'emerald-arch',
    package_tier: 'gold',
    status: 'published',
    is_paid: true,
    
    // Exact visual reference
    cover_photo: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1000&q=85',
    greeting_quote: 'Assalamu’alaikum Warahmatullahi Wabarakatuh\nDengan memohon rahmat dan ridho Allah Subhanahu Wa Ta’ala, kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri hari bahagia pernikahan kami.',
    verse_text: '“Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.”\n(QS. Ar-Rum: 21)',
    
    couple: {
      groom_name: 'Dimas Aditya Pratama, S.T.',
      groom_nickname: 'Dimas',
      groom_parents: 'Putra kedua dari Bpk. Ir. H. Bambang Suryo & Ibu Dra. Hj. Ratna Dewi',
      groom_photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=85',
      bride_name: 'Rina Anggraini, S.Ked',
      bride_nickname: 'Rina',
      bride_parents: 'Putri pertama dari Bpk. Drs. H. Suryono & Ibu Hj. Siti Aminah',
      bride_photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=85',
    },
    
    event_date: '2026-10-24',
    akad: {
      title: 'Akad Nikah',
      date: 'Sabtu, 24 Oktober 2026',
      time_start: '08:00',
      time_end: '10:00 WIB',
      venue_name: 'Masjid Agung Al-Ikhlas',
      address: 'Jl. Melati Raya No. 12, Kebayoran Baru, Jakarta Selatan',
      maps_url: 'https://maps.google.com/?q=Masjid+Agung+Al-Ikhlas+Jakarta',
    },
    resepsi: {
      title: 'Resepsi Pernikahan',
      date: 'Sabtu, 24 Oktober 2026',
      time_start: '11:00',
      time_end: '14:00 WIB',
      venue_name: 'The Glass House Ballroom - Senayan',
      address: 'Senayan Park Lt. 3, Jl. Gerbang Pemuda No. 3, Gelora, Tanah Abang, Jakarta Pusat',
      maps_url: 'https://maps.google.com/?q=Senayan+Park+Jakarta',
    },
    
    audio_url: 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_db6591201e.mp3?filename=romantic-acoustic-guitar-wedding-111956.mp3',
    audio_title: 'Romantic Acoustic Wedding Melodies',
    
    digital_envelopes: [
      {
        bank_name: 'Bank Central Asia (BCA)',
        account_number: '8830192812',
        account_holder: 'Dimas Aditya Pratama',
      },
      {
        bank_name: 'Bank Mandiri',
        account_number: '1370019283741',
        account_holder: 'Rina Anggraini',
      }
    ],
    
    love_stories: [
      {
        year_or_date: 'Maret 2021',
        title: 'Pertemuan Pertama di Kampus',
        story: 'Kami pertama kali berpapasan di perpustakaan universitas. Dimas memberanikan diri menyapa dan diskusi tugas akhir.',
      },
      {
        year_or_date: 'Agustus 2023',
        title: 'Komitmen & Restu Orang Tua',
        story: 'Setelah dua tahun saling mengenal dan menguatkan mimpi bersama, kami memutuskan untuk melangkah ke jenjang yang lebih serius.',
      },
      {
        year_or_date: 'Januari 2026',
        title: 'Hari Pertunangan yang Hangat',
        story: 'Di hadapan kedua keluarga besar, kami mengikat janji suci dan menetapkan tanggal akad pernikahan kami.',
      }
    ],
    
    gallery_photos: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=900&q=80',
    ],
    
    created_at: '2026-10-01T10:00:00Z',
    updated_at: '2026-10-12T15:30:00Z',
  },
  {
    id: 'inv-aditya-clara',
    user_id: 'usr-customer-2',
    slug: 'aditya-clara',
    title: 'The Wedding of Aditya & Clara',
    theme_id: 'royal-botanical',
    package_tier: 'platinum',
    status: 'draft',
    is_paid: true,
    cover_photo: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=85',
    greeting_quote: 'Dengan penuh sukacita, kami mengundang sanak saudara dan sahabat terkasih untuk menyaksikan penyatuan dua jiwa dalam ikatan suci pernikahan.',
    couple: {
      groom_name: 'Aditya Nugraha, M.B.A.',
      groom_nickname: 'Adit',
      groom_parents: 'Putra Bpk. Hendra Nugraha & Ibu Linda',
      groom_photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=85',
      bride_name: 'Clara Michelle, B.Des',
      bride_nickname: 'Clara',
      bride_parents: 'Putri Bpk. Ferry Santoso & Ibu Maya',
      bride_photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=85',
    },
    event_date: '2026-11-15',
    akad: {
      title: 'Pemberkatan Nikah',
      date: 'Minggu, 15 November 2026',
      time_start: '09:00',
      time_end: '11:00 WIB',
      venue_name: 'Gereja Katedral Jakarta',
      address: 'Jl. Katedral No. 7B, Pasar Baru, Jakarta Pusat',
      maps_url: 'https://maps.google.com/?q=Gereja+Katedral+Jakarta',
    },
    resepsi: {
      title: 'Grand Wedding Reception',
      date: 'Minggu, 15 November 2026',
      time_start: '18:30',
      time_end: '21:30 WIB',
      venue_name: 'Hotel Mulia Senayan - Grand Ballroom',
      address: 'Jl. Asia Afrika, Gelora, Jakarta Pusat',
      maps_url: 'https://maps.google.com/?q=Hotel+Mulia+Senayan',
    },
    digital_envelopes: [
      {
        bank_name: 'Bank Central Asia (BCA)',
        account_number: '5220819231',
        account_holder: 'Aditya Nugraha',
      }
    ],
    love_stories: [],
    gallery_photos: [],
    created_at: '2026-10-05T08:00:00Z',
    updated_at: '2026-10-10T12:00:00Z',
  }
];

export const INITIAL_GUESTS: GuestItem[] = [
  {
    id: 'gst-1',
    invitation_id: 'inv-rina-dimas',
    name: 'Rizky Ramadhan',
    phone: '081234567890',
    category: 'Teman',
    pax_allowed: 2,
    slug_code: 'Rizky',
    is_opened: true,
    status: 'hadir',
    created_at: '2026-10-02T10:00:00Z',
  },
  {
    id: 'gst-2',
    invitation_id: 'inv-rina-dimas',
    name: 'Bapak Ir. Hendra Gunawan & Keluarga',
    phone: '081298765432',
    category: 'VIP',
    pax_allowed: 4,
    slug_code: 'Hendra-Gunawan',
    is_opened: true,
    status: 'hadir',
    created_at: '2026-10-02T10:15:00Z',
  },
  {
    id: 'gst-3',
    invitation_id: 'inv-rina-dimas',
    name: 'Siti Fauziah & Suami',
    phone: '085711223344',
    category: 'Keluarga',
    pax_allowed: 2,
    slug_code: 'Siti-Fauziah',
    is_opened: false,
    status: 'belum_konfirmasi',
    created_at: '2026-10-02T10:30:00Z',
  },
  {
    id: 'gst-4',
    invitation_id: 'inv-rina-dimas',
    name: 'Budi Santoso',
    phone: '081399887766',
    category: 'Rekan Kerja',
    pax_allowed: 1,
    slug_code: 'Budi',
    is_opened: true,
    status: 'ragu',
    created_at: '2026-10-03T09:00:00Z',
  }
];

export const INITIAL_RSVPS: RSVPResponseItem[] = [
  {
    id: 'rsvp-1',
    invitation_id: 'inv-rina-dimas',
    guest_name: 'Rizky Ramadhan',
    attendance: 'hadir',
    pax: 2,
    message: 'Barakallahu lakum wa baraka alaikum wa jama\'a bainakuma fii khoir. Selamat menempuh hidup baru sahabatku Dimas & Rina! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah.',
    created_at: '2026-10-08T14:20:00Z',
  },
  {
    id: 'rsvp-2',
    invitation_id: 'inv-rina-dimas',
    guest_name: 'Bapak Ir. Hendra Gunawan',
    attendance: 'hadir',
    pax: 3,
    message: 'Selamat untuk ananda berdua dan keluarga besar Bpk Bambang Suryo. InsyaAllah kami sekeluarga hadir mendoakan langsung di resepsi.',
    created_at: '2026-10-09T09:12:00Z',
  },
  {
    id: 'rsvp-3',
    invitation_id: 'inv-rina-dimas',
    guest_name: 'Nadira Putri',
    attendance: 'hadir',
    pax: 1,
    message: 'Cantik banget undangannya! Selamat ya Rina sayang, terharu banget liat perjalanan cinta kalian. See you on your big day!',
    created_at: '2026-10-10T11:45:00Z',
  },
  {
    id: 'rsvp-4',
    invitation_id: 'inv-rina-dimas',
    guest_name: 'Farhan & Maya',
    attendance: 'ragu',
    pax: 2,
    message: 'Selamat Dimas dan Rina! Kami sedang mengusahakan jadwal cuti dari luar kota, mohon doanya agar bisa hadir langsung.',
    created_at: '2026-10-11T16:05:00Z',
  }
];

export const INITIAL_ORDERS: OrderItem[] = [
  {
    id: 'ord-101',
    order_number: 'NPT-202610-001',
    user_id: 'usr-customer-1',
    user_email: 'rina@wedding.id',
    invitation_id: 'inv-rina-dimas',
    invitation_title: 'The Wedding of Rina & Dimas',
    package_name: 'Gold Emerald',
    amount: 179000,
    status: 'paid',
    payment_method: 'Transfer Bank BCA',
    payment_proof_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80',
    created_at: '2026-10-01T10:30:00Z',
  },
  {
    id: 'ord-102',
    order_number: 'NPT-202610-002',
    user_id: 'usr-customer-2',
    user_email: 'clara@wedding.id',
    invitation_id: 'inv-aditya-clara',
    invitation_title: 'The Wedding of Aditya & Clara',
    package_name: 'Platinum Royal',
    amount: 299000,
    status: 'paid',
    payment_method: 'QRIS Gopay',
    payment_proof_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80',
    created_at: '2026-10-05T09:00:00Z',
  }
];

export const DEMO_USERS: UserProfile[] = [
  {
    id: 'usr-customer-1',
    email: 'rina@wedding.id',
    full_name: 'Rina Anggraini',
    phone: '081288990011',
    role: 'customer',
    created_at: '2026-10-01T09:00:00Z',
  },
  {
    id: 'usr-admin-1',
    email: 'admin@nuptia.id',
    full_name: 'Administrator Nuptia',
    phone: '081100223344',
    role: 'admin',
    created_at: '2026-09-01T00:00:00Z',
  }
];
