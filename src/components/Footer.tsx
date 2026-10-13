import React from 'react';
import { Coffee, ArrowUp, MapPin, Clock, ExternalLink, Settings, MessageCircle, Instagram } from 'lucide-react';
import { BUSINESS_DATA } from '../data/business';

interface FooterProps {
  onOpenContact: () => void;
  onOpenConfigGuide: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenContact,
  onOpenConfigGuide,
}) => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const navLinks = [
    { name: 'Beranda', href: '#beranda' },
    { name: 'Tentang', href: '#tentang' },
    { name: 'Menu', href: '#menu' },
    { name: 'Suasana', href: '#suasana' },
    { name: 'Ulasan', href: '#ulasan' },
    { name: 'Lokasi', href: '#lokasi' },
  ];

  const handleNavClick = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#110E0C] text-[#8A7E73] border-t border-[#251E18]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-[#221A15]">
          
          {/* Brand & Identity */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-[#1E1915] border border-[#3A2E25] flex items-center justify-center text-[#B88246]">
                <Coffee className="w-4 h-4" />
              </div>
              <div>
                <span className="font-display text-lg font-bold tracking-wider text-[#FAF7F2] block">
                  {BUSINESS_DATA.brandTitle}
                </span>
                <span className="text-[10px] tracking-widest uppercase text-[#B88246] block -mt-0.5">
                  {BUSINESS_DATA.brandSubtitle}
                </span>
              </div>
            </div>

            <p className="text-sm text-[#968A7E] leading-relaxed max-w-sm">
              Kedai kopi dengan suasana santai, rooftop terbuka, dan sentuhan industrial di Singabangsa, Tenjo, Kabupaten Bogor.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={onOpenContact}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#1B1612] hover:bg-[#251E18] border border-[#30261E] text-xs text-[#FAF7F2] transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp</span>
              </button>

              <button
                onClick={onOpenContact}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#1B1612] hover:bg-[#251E18] border border-[#30261E] text-xs text-[#FAF7F2] transition-colors"
              >
                <Instagram className="w-3.5 h-3.5 text-[#B88246]" />
                <span>Instagram</span>
              </button>
            </div>
          </div>

          {/* Navigation */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold text-[#FAF7F2] tracking-wider uppercase">
              Navigasi
            </h4>
            <ul className="space-y-2 text-xs">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link.href);
                    }}
                    className="hover:text-[#B88246] transition-colors inline-block"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Location & Schedule */}
          <div className="lg:col-span-5 space-y-4">
            <h4 className="text-xs font-semibold text-[#FAF7F2] tracking-wider uppercase">
              Alamat & Jadwal
            </h4>

            <div className="flex items-start gap-3 text-xs">
              <MapPin className="w-4 h-4 text-[#B88246] shrink-0 mt-0.5" />
              <div>
                <p className="text-[#C8BFB5]">{BUSINESS_DATA.address.full}</p>
                <a
                  href={BUSINESS_DATA.address.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#B88246] hover:underline inline-flex items-center gap-1 mt-1 font-medium"
                >
                  <span>Buka Petunjuk Arah di Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs pt-1">
              <Clock className="w-4 h-4 text-[#B88246] shrink-0 mt-0.5" />
              <div>
                <p className="text-[#C8BFB5]">
                  {BUSINESS_DATA.openingHours.days} ({BUSINESS_DATA.openingHours.time})
                </p>
                <p className="text-[11px] text-[#7A7065] mt-0.5">
                  Informasi jam buka referensi, periksa kembali sebelum berkunjung.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-4 flex-wrap">
            <p>
              &copy; {currentYear} {BUSINESS_DATA.name}.
            </p>
            <span className="hidden sm:inline text-[#3A2E25]">·</span>
            <button
              onClick={onOpenConfigGuide}
              className="text-[#B88246] hover:underline inline-flex items-center gap-1 transition-colors"
            >
              <Settings className="w-3 h-3" />
              <span>Panduan Konfigurasi & Vercel</span>
            </button>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#1B1612] hover:bg-[#251E18] border border-[#2E241D] text-xs text-[#FAF7F2] hover:text-[#B88246] transition-colors"
            aria-label="Kembali ke atas"
          >
            <span>Kembali ke atas</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
