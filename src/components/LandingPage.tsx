import React, { useState } from 'react';
import { 
  Sparkles, 
  Check, 
  ArrowRight, 
  Heart, 
  MapPin, 
  Users, 
  Gift, 
  Music, 
  ShieldCheck, 
  Smartphone, 
  MessageCircle, 
  HelpCircle,
  Database,
  Eye,
  ExternalLink
} from 'lucide-react';
import { PricingPackage, InvitationData } from '../types/wedding';
import { isSupabaseConfigured } from '../services/supabase';

interface LandingPageProps {
  packages: PricingPackage[];
  featuredInvitation: InvitationData;
  onOpenPublicInvitation: (slug: string) => void;
  onSelectPackage: (pkg: PricingPackage) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onOpenSupabaseModal: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  packages,
  featuredInvitation,
  onOpenPublicInvitation,
  onSelectPackage,
  onOpenAuth,
  onOpenSupabaseModal,
}) => {
  const [selectedTemplateTab, setSelectedTemplateTab] = useState('emerald-arch');
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(null);

  const templates = [
    {
      id: 'emerald-arch',
      name: 'Emerald Arch Luxury (Signature)',
      category: 'Deep Emerald & Soft Gold',
      image: featuredInvitation.cover_photo,
      description: 'Tema utama sesuai referensi dengan nuansa hijau botol mewah (#2D4038), bingkai foto arch emas, dan tipografi serif klasik.',
      badge: 'Paling Diminati',
    },
    {
      id: 'royal-botanical',
      name: 'Royal Botanical Cream',
      category: 'Botanical Pearl',
      image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
      description: 'Sentuhan dedaunan botanical emas berpadu dengan latar krem lembut yang menenangkan.',
      badge: 'Elegan',
    },
    {
      id: 'minimalist-gold',
      name: 'Minimalist Pearl Gold',
      category: 'Modern Aesthetic',
      image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
      description: 'Konsep minimalis kontemporer dengan garis emas bersih dan fokus tipografi estetis.',
      badge: 'Modern',
    }
  ];

  const features = [
    {
      icon: <Users className="w-5 h-5 text-[#B6A078]" />,
      title: 'Personalisasi Tamu Tanpa Batas',
      desc: 'Sapa setiap tamu dengan namanya sendiri melalui format link otomatis (/i/slug?to=Nama+Tamu) langsung terintegrasi WhatsApp.'
    },
    {
      icon: <Check className="w-5 h-5 text-[#B6A078]" />,
      title: 'RSVP Real-Time & Buku Tamu',
      desc: 'Tamu dapat mengonfirmasi kehadiran serta menuliskan doa restu yang langsung tercatat rapi di dashboard Anda.'
    },
    {
      icon: <Gift className="w-5 h-5 text-[#B6A078]" />,
      title: 'Amplop Digital & QRIS Dinamis',
      desc: 'Kemudahan bagi tamu yang ingin mengirimkan kado pernikahan melalui transfer bank (1-klik salin rekening) atau scan QRIS.'
    },
    {
      icon: <MapPin className="w-5 h-5 text-[#B6A078]" />,
      title: 'Peta Lokasi Google Maps',
      desc: 'Pandu tamu undangan Anda ke lokasi akad maupun resepsi dengan navigasi peta digital yang akurat.'
    },
    {
      icon: <Music className="w-5 h-5 text-[#B6A078]" />,
      title: 'Musik Latar Romantis Eksklusif',
      desc: 'Instrumen akustik romantis yang otomatis berputar saat undangan dibuka, dilengkapi tombol kontrol mute/unmute.'
    },
    {
      icon: <Smartphone className="w-5 h-5 text-[#B6A078]" />,
      title: 'Responsif di Semua Perangkat',
      desc: 'Tampilan undangan dirancang dengan rasio visual sempurna di ponsel Android, iPhone, tablet, hingga desktop.'
    }
  ];

  const faqs = [
    {
      q: 'Berapa lama proses pembuatan undangan online di Nuptia?',
      a: 'Sangat cepat! Anda bisa langsung mengisi formulir pernikahan (nama mempelai, tanggal, lokasi, dan foto) dan undangan Anda siap dipublikasikan dalam waktu kurang dari 10 menit.'
    },
    {
      q: 'Apakah bisa mengubah data setelah undangan dipublikasikan?',
      a: 'Ya, Anda dapat mengedit informasi acara, foto, atau rekening amplop digital kapan saja melalui Dashboard Pelanggan tanpa mengubah tautan undangan yang sudah dibagikan.'
    },
    {
      q: 'Bagaimana cara membagikan undangan dengan nama tamu yang berbeda-beda?',
      a: 'Di dashboard Nuptia, terdapat menu Manajemen Tamu. Anda cukup memasukkan nama tamu atau daftar kontak, dan sistem akan membuat tautan khusus personal seperti /i/rina-dimas?to=Rizky+Ramadhan serta tombol kirim ke WhatsApp secara otomatis.'
    },
    {
      q: 'Metode pembayaran apa saja yang didukung?',
      a: 'Kami menerima transfer bank BCA, Mandiri, BNI, BRI, serta QRIS (Gopay, OVO, Dana, ShopeePay) dengan verifikasi langsung.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F9F6EE] text-[#2D4038] font-sans">
      
      {/* ------------------------------------------------------------- */}
      {/* STATUS BANNER (SUPABASE CONFIGURATION DISCLOSURE) */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-[#202F29] text-[#F9F6EE] px-4 py-2 text-xs border-b border-[#B6A078]/30">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-[#B6A078]" />
            <span>
              Status Database: {isSupabaseConfigured ? (
                <strong className="text-emerald-400">Terhubung ke Supabase PostgreSQL</strong>
              ) : (
                <span className="text-[#B6A078]">Mode Lokal & Demo (Data tersimpan di penyimpanan browser aman)</span>
              )}
            </span>
          </div>
          <button
            onClick={onOpenSupabaseModal}
            className="underline hover:text-[#B6A078] text-[11px] font-medium transition cursor-pointer"
          >
            {isSupabaseConfigured ? 'Cek Konfigurasi Supabase' : 'Koneksikan Supabase Anda'}
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* NAVIGATION HEADER */}
      {/* ------------------------------------------------------------- */}
      <header className="sticky top-0 z-40 bg-[#F9F6EE]/90 backdrop-blur-md border-b border-[#B6A078]/20 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#2D4038] flex items-center justify-center text-[#B6A078]">
              <Heart className="w-4 h-4 fill-[#B6A078]" />
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-[#2D4038]">Nuptia</span>
              <span className="hidden sm:inline-block text-[9px] uppercase tracking-widest text-[#B6A078] ml-2">Wedding Invitation</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-wider font-medium text-[#77756E]">
            <a href="#katalog" className="hover:text-[#2D4038] transition">Katalog Desain</a>
            <a href="#fitur" className="hover:text-[#2D4038] transition">Fitur</a>
            <a href="#harga" className="hover:text-[#2D4038] transition">Paket Harga</a>
            <a href="#faq" className="hover:text-[#2D4038] transition">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenAuth('login')}
              className="text-xs font-medium px-4 py-2 rounded-full border border-[#B6A078] text-[#2D4038] hover:bg-[#B6A078]/10 transition"
            >
              Masuk
            </button>
            <button
              onClick={() => onOpenAuth('register')}
              className="text-xs font-medium px-5 py-2 rounded-full bg-[#2D4038] text-[#F9F6EE] hover:bg-[#202F29] transition shadow-sm"
            >
              Buat Undangan
            </button>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* HERO SECTION */}
      {/* ------------------------------------------------------------- */}
      <section className="relative px-6 pt-16 pb-24 overflow-hidden border-b border-[#B6A078]/20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2D4038]/10 border border-[#B6A078]/30 text-[11px] font-medium tracking-wider uppercase text-[#2D4038]">
              <Sparkles className="w-3.5 h-3.5 text-[#B6A078]" />
              Jasa Undangan Pernikahan Online Eksklusif
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#2D4038] font-normal leading-tight">
              Kemewahan Abadi dalam <span className="italic text-[#2D4038] underline decoration-[#B6A078]">Sentuhan Digital</span>
            </h1>

            <p className="text-sm sm:text-base text-[#77756E] leading-relaxed max-w-xl font-light">
              Bagikan kabar bahagia pernikahan Anda dengan desain berkelas tema <strong className="text-[#2D4038]">Deep Emerald & Soft Gold</strong>. Lengkap dengan personalisasi nama tamu tanpa batas, konfirmasi RSVP real-time, amplop digital, dan integrasi WhatsApp.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onOpenPublicInvitation('rina-dimas')}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#2D4038] text-[#F9F6EE] text-xs font-semibold tracking-wider uppercase transition hover:bg-[#202F29] shadow-lg shadow-[#2D4038]/20 cursor-pointer"
              >
                <Eye className="w-4 h-4 text-[#B6A078]" />
                Lihat Demo Undangan (Rina & Dimas)
              </button>

              <button
                onClick={() => onOpenAuth('register')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-[#B6A078] text-[#2D4038] text-xs font-semibold tracking-wider uppercase hover:bg-[#B6A078]/10 transition cursor-pointer"
              >
                Mulai Buat Undangan
                <ArrowRight className="w-4 h-4 text-[#B6A078]" />
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-[#B6A078]/25 max-w-lg">
              <div>
                <strong className="block font-serif text-2xl text-[#2D4038]">1,500+</strong>
                <span className="text-[11px] text-[#77756E]">Pasangan Berbahagia</span>
              </div>
              <div>
                <strong className="block font-serif text-2xl text-[#2D4038]">99.8%</strong>
                <span className="text-[11px] text-[#77756E]">Uptime Server Cepat</span>
              </div>
              <div>
                <strong className="block font-serif text-2xl text-[#2D4038]">5 Menit</strong>
                <span className="text-[11px] text-[#77756E]">Siap Dibagikan</span>
              </div>
            </div>
          </div>

          {/* Right Preview Card (Mobile Frame Mockup of Emerald Arch) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-72 sm:w-80 rounded-[40px] p-3 bg-[#202F29] border-4 border-[#B6A078]/70 shadow-2xl">
              {/* Speaker Notch */}
              <div className="w-20 h-4 bg-[#2D4038] rounded-b-xl mx-auto mb-2"></div>
              
              {/* Screen Content simulating Emerald Arch */}
              <div className="rounded-[28px] overflow-hidden bg-[#2D4038] text-center text-[#F9F6EE] p-5 border border-[#B6A078]/40">
                <span className="text-[9px] uppercase tracking-[0.25em] text-[#B6A078] block mb-2">
                  THE WEDDING OF
                </span>
                
                {/* Arch photo */}
                <div className="w-40 h-52 mx-auto rounded-t-[90px] rounded-b-xl border border-[#B6A078] overflow-hidden shadow-md my-2">
                  <img
                    src={featuredInvitation.cover_photo}
                    alt="Rina & Dimas"
                    className="w-full h-full object-cover"
                  />
                </div>

                <h3 className="font-serif text-xl font-light text-[#F9F6EE] mt-2">
                  Rina <span className="text-[#B6A078]">&</span> Dimas
                </h3>
                <p className="text-[10px] text-[#B6A078] uppercase tracking-widest mt-1">
                  Sabtu, 24 Oktober 2026
                </p>

                <div className="mt-4 p-2.5 rounded-xl bg-[#202F29]/80 border border-[#B6A078]/30 text-left">
                  <span className="text-[9px] uppercase tracking-wider text-[#F9F6EE]/60 block">Kepada Yth.</span>
                  <p className="text-xs font-medium text-[#F9F6EE]">Bapak/Ibu/Saudara/i</p>
                </div>

                <button
                  onClick={() => onOpenPublicInvitation('rina-dimas')}
                  className="mt-4 w-full py-2.5 rounded-full bg-[#B6A078] text-[#2D4038] text-[10px] uppercase font-bold tracking-widest hover:bg-[#A38C62] transition"
                >
                  Buka Undangan Demo
                </button>
              </div>

              {/* Bottom Home Indicator */}
              <div className="w-24 h-1 bg-[#F9F6EE]/40 rounded-full mx-auto mt-2"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* KATALOG TEMPLATE DESAIN */}
      {/* ------------------------------------------------------------- */}
      <section id="katalog" className="px-6 py-20 bg-white border-b border-[#B6A078]/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[11px] font-medium tracking-[0.3em] uppercase text-[#B6A078]">
              KATALOG EKSKLUSIF
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#2D4038] mt-2 mb-4">
              Pilihan Tema yang Menawan
            </h2>
            <p className="text-xs sm:text-sm text-[#77756E] font-light">
              Setiap template dirancang khusus dengan filosofi keanggunan, proporsi tipografi yang matang, dan kenyamanan visual bagi tamu Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {templates.map((tpl) => (
              <div
                key={tpl.id}
                className="rounded-2xl border border-[#B6A078]/30 overflow-hidden bg-[#F9F6EE] transition-all duration-300 hover:shadow-xl hover:border-[#B6A078]"
              >
                <div className="relative aspect-3/4 overflow-hidden bg-[#2D4038]">
                  <img
                    src={tpl.image}
                    alt={tpl.name}
                    className="w-full h-full object-cover transition duration-500 hover:scale-105"
                  />
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[#2D4038]/90 text-[#B6A078] border border-[#B6A078]/50 text-[10px] font-semibold tracking-wider uppercase">
                    {tpl.badge}
                  </div>
                </div>

                <div className="p-6">
                  <span className="text-[10px] uppercase tracking-widest text-[#B6A078] font-semibold">
                    {tpl.category}
                  </span>
                  <h3 className="font-serif text-xl text-[#2D4038] font-semibold mt-1 mb-2">
                    {tpl.name}
                  </h3>
                  <p className="text-xs text-[#77756E] leading-relaxed mb-5 font-light">
                    {tpl.description}
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenPublicInvitation('rina-dimas')}
                      className="flex-1 py-2.5 px-4 rounded-full bg-[#2D4038] text-[#F9F6EE] text-xs font-medium tracking-wider uppercase text-center hover:bg-[#202F29] transition"
                    >
                      Lihat Demo
                    </button>
                    <button
                      onClick={() => onOpenAuth('register')}
                      className="py-2.5 px-4 rounded-full border border-[#B6A078] text-[#2D4038] text-xs font-medium tracking-wider uppercase hover:bg-[#B6A078]/10 transition"
                    >
                      Pilih
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* FITUR & KEUNGGULAN */}
      {/* ------------------------------------------------------------- */}
      <section id="fitur" className="px-6 py-20 bg-[#F9F6EE] border-b border-[#B6A078]/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[11px] font-medium tracking-[0.3em] uppercase text-[#B6A078]">
              FITUR LENGKAP
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#2D4038] mt-2 mb-4">
              Dirancang untuk Kenyamanan Anda & Tamu
            </h2>
            <p className="text-xs sm:text-sm text-[#77756E] font-light">
              Solusi digital modern yang membuat momen pernikahan Anda berjalan praktis tanpa mengurangi kesakralan acara.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-[#B6A078]/25 shadow-xs transition hover:border-[#B6A078] hover:shadow-md"
              >
                <div className="w-10 h-10 rounded-xl bg-[#2D4038] flex items-center justify-center mb-4">
                  {feat.icon}
                </div>
                <h3 className="font-serif text-lg font-semibold text-[#2D4038] mb-2">
                  {feat.title}
                </h3>
                <p className="text-xs text-[#77756E] leading-relaxed font-light">
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* PAKET HARGA BISNIS */}
      {/* ------------------------------------------------------------- */}
      <section id="harga" className="px-6 py-20 bg-white border-b border-[#B6A078]/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[11px] font-medium tracking-[0.3em] uppercase text-[#B6A078]">
              INVESTASI TRANSPARAN
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#2D4038] mt-2 mb-4">
              Pilihan Paket Harga
            </h2>
            <p className="text-xs sm:text-sm text-[#77756E] font-light">
              Pilih paket yang paling sesuai dengan kebutuhan perayaan pernikahan Anda. Tanpa biaya tersembunyi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative flex flex-col justify-between p-8 rounded-3xl border transition-all duration-300 ${
                  pkg.is_popular
                    ? 'bg-[#2D4038] text-[#F9F6EE] border-[#B6A078] shadow-2xl scale-105 z-10'
                    : 'bg-[#F9F6EE] text-[#2D4038] border-[#B6A078]/30 shadow-sm'
                }`}
              >
                {pkg.is_popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#B6A078] text-[#2D4038] text-[10px] font-bold tracking-widest uppercase">
                    Paling Populer & Rekomendasi
                  </div>
                )}

                <div>
                  <span className={`text-[11px] uppercase tracking-widest font-semibold ${pkg.is_popular ? 'text-[#B6A078]' : 'text-[#77756E]'}`}>
                    Paket {pkg.tier}
                  </span>
                  <h3 className="font-serif text-2xl font-bold mt-1 mb-2">
                    {pkg.name}
                  </h3>
                  <p className={`text-xs mb-6 font-light ${pkg.is_popular ? 'text-[#F9F6EE]/70' : 'text-[#77756E]'}`}>
                    {pkg.description}
                  </p>

                  <div className="mb-6 pb-6 border-b border-[#B6A078]/30">
                    <span className="text-xs line-through text-gray-400 mr-2">
                      Rp {pkg.price.toLocaleString('id-ID')}
                    </span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="font-serif text-3xl font-bold">
                        Rp {pkg.discounted_price.toLocaleString('id-ID')}
                      </span>
                      <span className="text-[11px] opacity-70">/ undangan</span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8 text-xs font-light">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-[#B6A078] shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => onSelectPackage(pkg)}
                  className={`w-full py-3 px-6 rounded-full text-xs font-semibold tracking-wider uppercase transition shadow-sm ${
                    pkg.is_popular
                      ? 'bg-[#B6A078] text-[#2D4038] hover:bg-[#A38C62]'
                      : 'bg-[#2D4038] text-[#F9F6EE] hover:bg-[#202F29]'
                  }`}
                >
                  Pilih Paket {pkg.tier}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* FAQ SECTION */}
      {/* ------------------------------------------------------------- */}
      <section id="faq" className="px-6 py-20 bg-[#F9F6EE] border-b border-[#B6A078]/20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[11px] font-medium tracking-[0.3em] uppercase text-[#B6A078]">
              PERTANYAAN UMUM
            </span>
            <h2 className="font-serif text-3xl text-[#2D4038] mt-2 mb-2">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-[#B6A078]/30 bg-white overflow-hidden shadow-xs"
              >
                <button
                  onClick={() => setFaqOpenIndex(faqOpenIndex === idx ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between text-sm font-medium text-[#2D4038] hover:text-[#B6A078] transition"
                >
                  <span>{faq.q}</span>
                  <span className="text-lg text-[#B6A078]">{faqOpenIndex === idx ? '−' : '+'}</span>
                </button>
                {faqOpenIndex === idx && (
                  <div className="px-5 pb-5 pt-1 text-xs text-[#77756E] leading-relaxed border-t border-[#F4EFE6] font-light">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* FOOTER */}
      {/* ------------------------------------------------------------- */}
      <footer className="bg-[#2D4038] text-[#F9F6EE] px-6 py-14">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#B6A078] flex items-center justify-center text-[#2D4038]">
                <Heart className="w-3.5 h-3.5 fill-[#2D4038]" />
              </div>
              <span className="font-serif text-xl font-bold tracking-wide">Nuptia</span>
            </div>
            <p className="text-xs text-[#F9F6EE]/70 max-w-sm font-light leading-relaxed">
              Jasa pembuatan website undangan pernikahan online profesional. Mengabadikan cinta dalam desain yang elegan, terpercaya, dan berkesan.
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#B6A078] font-semibold mb-3">Tautan Cepat</h4>
            <ul className="space-y-2 text-xs text-[#F9F6EE]/70 font-light">
              <li><a href="#katalog" className="hover:text-[#F9F6EE]">Katalog Desain</a></li>
              <li><a href="#fitur" className="hover:text-[#F9F6EE]">Fitur Undangan</a></li>
              <li><a href="#harga" className="hover:text-[#F9F6EE]">Paket Harga</a></li>
              <li><button onClick={() => onOpenPublicInvitation('rina-dimas')} className="hover:text-[#F9F6EE]">Demo Rina & Dimas</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#B6A078] font-semibold mb-3">Bantuan & Kontak</h4>
            <ul className="space-y-2 text-xs text-[#F9F6EE]/70 font-light">
              <li>WhatsApp: +62 812-8899-0011</li>
              <li>Email: halo@nuptiawedding.id</li>
              <li>Jakarta & Seluruh Indonesia</li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-[#B6A078]/20 flex flex-wrap items-center justify-between gap-4 text-[11px] text-[#F9F6EE]/50">
          <p>© 2026 Nuptia Wedding Invitation. All rights reserved.</p>
          <div className="flex gap-4">
            <button onClick={onOpenSupabaseModal} className="hover:underline text-[#B6A078]">
              Supabase Status
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
