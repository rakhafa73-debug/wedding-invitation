import React from 'react';
import { ArrowDown, MapPin, Coffee, Star } from 'lucide-react';
import { BUSINESS_DATA } from '../data/business';
import { ImageWithFallback } from './common/ImageWithFallback';

interface HeroProps {
  onMenuClick: () => void;
  onLocationClick: () => void;
  onPhotoClick: (photoId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onMenuClick,
  onLocationClick,
  onPhotoClick,
}) => {
  const heroPhoto = BUSINESS_DATA.realPhotos[0];

  return (
    <section
      id="beranda"
      className="relative min-h-[90vh] lg:min-h-screen pt-28 pb-16 lg:pt-36 lg:pb-20 flex items-center justify-center bg-[#151210] text-[#F5EFEB] border-b border-[#2C231D]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Typographic Editorial Layout */}
          <div className="lg:col-span-7 flex flex-col items-start">
            
            {/* Clean Sub-header / Location Stamp */}
            <div className="flex items-center gap-2 text-xs font-medium tracking-wider uppercase text-[#B88246] mb-4">
              <span>Singabangsa, Tenjo — Jawa Barat</span>
              <span aria-hidden="true" className="text-[#6B6158]">/</span>
              <span className="text-[#968A7E]">Coffee & Rooftop</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-[4.2rem] font-medium text-[#FAF7F2] leading-[1.14] tracking-tight mb-6 text-balance">
              Temukan Ruang Nyaman di Atas Secangkir Kopi.
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-[#C8BFB5] font-normal max-w-xl leading-relaxed mb-8">
              {BUSINESS_DATA.shortDescription}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto mb-10">
              <button
                onClick={onMenuClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#B88246] hover:bg-[#C89254] text-[#151210] text-xs uppercase tracking-widest font-semibold rounded transition-colors duration-200"
              >
                <Coffee className="w-4 h-4" />
                <span>Lihat Pilihan Menu</span>
              </button>

              <button
                onClick={onLocationClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#201A16] hover:bg-[#2A221C] text-[#FAF7F2] border border-[#3E3128] text-xs uppercase tracking-widest font-semibold rounded transition-colors duration-200"
              >
                <MapPin className="w-4 h-4 text-[#B88246]" />
                <span>Petunjuk Lokasi</span>
              </button>
            </div>

            {/* Clean Factual Data Strip (No artificial badges or pills) */}
            <div className="pt-6 border-t border-[#2C231D] w-full max-w-xl flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-[#8A7E73]">
              <div className="flex items-center gap-1.5 text-[#FAF7F2]">
                <Star className="w-3.5 h-3.5 text-[#B88246] fill-[#B88246]" />
                <span className="font-semibold text-sm tabular-nums">4.9 / 5.0</span>
                <span className="text-[#8A7E73]">(56 Ulasan Google)</span>
              </div>
              <span aria-hidden="true" className="text-[#3E3128]">·</span>
              <div>
                <span>Buka setiap sore mulai <strong className="text-[#E0D7CC] font-normal">16.00 WIB</strong></span>
              </div>
              <span aria-hidden="true" className="text-[#3E3128]">·</span>
              <div className="text-[#B88246]">
                Rooftop & Meja Kayu
              </div>
            </div>

          </div>

          {/* Right Column: Authentic Photography Display */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Photo Frame Container */}
              <div 
                onClick={() => onPhotoClick(heroPhoto.id)}
                className="group relative cursor-pointer overflow-hidden rounded-lg border border-[#332821] bg-[#1E1814] shadow-xl hover:border-[#B88246]/60 transition-colors duration-300"
              >
                <ImageWithFallback
                  src={heroPhoto.localUrl}
                  fallbackSrc={heroPhoto.directUrl}
                  alt={heroPhoto.alt}
                  containerClassName="w-full aspect-[4/5] sm:aspect-[9/11] lg:aspect-[4/5]"
                  className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500 ease-out"
                />

                {/* Subtle Editorial Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#151210] via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                
                {/* Clean Caption Bar */}
                <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-[#151210] via-[#151210]/80 to-transparent">
                  <p className="text-xs font-semibold text-[#B88246] uppercase tracking-wider">
                    Dokumentasi Kedai
                  </p>
                  <p className="font-display text-lg font-medium text-[#FAF7F2] mt-0.5">
                    {heroPhoto.title}
                  </p>
                  <p className="text-xs text-[#A89E93] mt-1 line-clamp-1">
                    {heroPhoto.description}
                  </p>
                </div>
              </div>

              {/* Minimalist Footnote */}
              <div className="mt-2.5 flex items-center justify-between text-[11px] text-[#786D62] px-1">
                <span>Foto asli di lokasi Singabangsa</span>
                <span className="text-[#B88246] hover:underline cursor-pointer" onClick={() => onPhotoClick(heroPhoto.id)}>
                  Buka foto penuh
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
