import { BusinessConfig } from '../types';

export const BUSINESS_DATA: BusinessConfig = {
  name: "Kedai Kopi Ruang Atas",
  brandTitle: "RUANG ATAS",
  brandSubtitle: "Coffee & Rooftop",
  tagline: "Temukan Ruang Nyaman di Atas Secangkir Kopi.",
  shortDescription: "Tempat singgah untuk menikmati kopi, berbagi cerita, dan menemukan suasana tenang di tengah kesibukan.",
  aboutStory: "Kedai Kopi Ruang Atas hadir untuk kamu yang mencari tempat nyaman menikmati kopi, mengobrol santai, dan melepas penat. Nikmati suasana kedai yang hangat dengan sentuhan industrial dan area terbuka yang membuat setiap kunjungan terasa berbeda.",
  address: {
    full: "Kampung Baru, pertigaan Gerobog (pintu masuk Perumahan Tenjo City Tahap 3), Singabangsa, Kecamatan Tenjo, Kabupaten Bogor, Jawa Barat 16370",
    short: "Singabangsa, Tenjo, Kab. Bogor",
    landmark: "Pertigaan Gerobog / Pintu Masuk Perumahan Tenjo City Tahap 3",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Kedai+Kopi+Ruang+Atas+Tenjo+City+Bogor",
    directionsTip: "Akses mudah dari arah Stasiun Tenjo menuju pertigaan Gerobog, tepat di gerbang pintu masuk Perumahan Tenjo City Tahap 3."
  },
  rating: {
    score: 4.9,
    reviewCount: 56,
    platform: "Google Maps",
    note: "Data ulasan publik Google Maps (4,9/5 dari 56 ulasan). Diperiksa dan diperbarui secara berkala."
  },
  openingHours: {
    time: "Mulai 16.00 WIB",
    days: "Buka Setiap Hari (Sore hingga Malam)",
    disclaimer: "Informasi jam buka pada referensi: buka pukul 16.00 WIB. Disarankan memeriksa jam operasional terbaru kepada pengelola sebelum berkunjung."
  },
  contact: {
    whatsappNumber: "", // Format nomor WhatsApp: 628xxxxxxxxxx
    whatsappDisplay: "Hubungi Pengelola Kedai",
    instagramHandle: "", // Akun resmi Instagram
    instagramDisplay: "Instagram Resmi"
  },
  realPhotos: [
    {
      id: "foto-1",
      title: "Suasana Senja di Kedai",
      localUrl: "/images/foto_asli_1.jpg",
      directUrl: "https://i.ibb.co/kgWcvHfj/Screenshot-20261013-011352.jpg",
      previewUrl: "https://ibb.co.com/tMWCFmtg",
      description: "Pencahayaan hangat di sore hari yang menyatu dengan suasana santai bar kopi.",
      alt: "Foto asli suasana sore Kedai Kopi Ruang Atas Tenjo",
      isHeroCandidate: true
    },
    {
      id: "foto-2",
      title: "Sudut Meja Kayu & Tempat Berbincang",
      localUrl: "/images/foto_asli_2.jpg",
      directUrl: "https://i.ibb.co/6JwVYgNS/Screenshot-20261013-011302.jpg",
      previewUrl: "https://ibb.co.com/qFjXBkx8",
      description: "Meja kayu solid dan kursi santai untuk menikmati secangkir kopi bersama teman.",
      alt: "Foto asli area meja kayu Kedai Kopi Ruang Atas",
      isHeroCandidate: false
    },
    {
      id: "foto-3",
      title: "Nuansa Rooftop Area Terbuka",
      localUrl: "/images/foto_asli_3.jpg",
      directUrl: "https://i.ibb.co/Q3Q7yR6s/Screenshot-20261013-011329.jpg",
      previewUrl: "https://ibb.co.com/hJ9x3jKp",
      description: "Area ruang atas dengan hembusan angin segar dan pemandangan terbuka di waktu senja.",
      alt: "Foto asli rooftop terbuka Kedai Kopi Ruang Atas Tenjo",
      isHeroCandidate: false
    }
  ]
};
