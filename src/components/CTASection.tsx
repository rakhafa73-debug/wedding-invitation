import React from 'react';
import { MapPin, MessageCircle } from 'lucide-react';

interface CTASectionProps {
  onLocationClick: () => void;
  onContactClick: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({
  onLocationClick,
  onContactClick,
}) => {
  return (
    <section className="py-20 lg:py-24 bg-[#14110F] text-[#F5EFEB] border-b border-[#2C231D]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <p className="text-xs uppercase tracking-widest text-[#B88246] font-semibold mb-3">
          Kedai Kopi Ruang Atas
        </p>

        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-medium text-[#FAF7F2] leading-tight mb-4">
          Secangkir Kopi, Sejuta Cerita.
        </h2>

        <p className="text-base sm:text-lg text-[#A89E93] max-w-lg mx-auto mb-8 leading-relaxed">
          Sudah menemukan tempat untuk bersantai hari ini? Mampir dan nikmati waktumu di Ruang Atas.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onLocationClick}
            className="px-7 py-3.5 bg-[#B88246] hover:bg-[#C89254] text-[#151210] text-xs uppercase tracking-widest font-semibold rounded transition-colors inline-flex items-center gap-2"
          >
            <MapPin className="w-4 h-4" />
            <span>Petunjuk Lokasi</span>
          </button>

          <button
            onClick={onContactClick}
            className="px-7 py-3.5 bg-[#1E1915] hover:bg-[#28211C] text-[#FAF7F2] border border-[#3E3128] text-xs uppercase tracking-widest font-semibold rounded transition-colors inline-flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4 text-[#B88246]" />
            <span>Hubungi Kami</span>
          </button>
        </div>

        <p className="text-xs text-[#6E645A] mt-8">
          Kampung Baru, Singabangsa, Tenjo, Bogor · Buka mulai 16.00 WIB
        </p>

      </div>
    </section>
  );
};
