import React from 'react';
import { Maximize2 } from 'lucide-react';
import { BUSINESS_DATA } from '../data/business';
import { ImageWithFallback } from './common/ImageWithFallback';

interface GalleryProps {
  onPhotoClick: (photoId: string) => void;
}

export const Gallery: React.FC<GalleryProps> = ({ onPhotoClick }) => {
  const photos = BUSINESS_DATA.realPhotos;

  return (
    <section id="suasana" className="py-20 lg:py-28 bg-[#151210] text-[#F5EFEB] border-b border-[#2C231D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-xl mb-14">
          <p className="text-xs uppercase tracking-widest text-[#B88246] font-semibold mb-2">
            Dokumentasi Ruang
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium text-[#FAF7F2]">
            Suasana yang Bikin Betah.
          </h2>
          <p className="text-sm text-[#968A7E] mt-3 leading-relaxed">
            Foto-foto asli sudut kedai: suasana sore di area bar, meja kayu panjang untuk berkumpul, hingga lantai atas dengan sirkulasi udara terbuka.
          </p>
        </div>

        {/* Photography Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          
          {/* Main Photo 1: Bar Area */}
          <div className="md:col-span-7">
            <div
              onClick={() => onPhotoClick(photos[0].id)}
              className="group relative cursor-pointer h-full min-h-[380px] sm:min-h-[460px] rounded-lg overflow-hidden border border-[#2F251E] bg-[#1A1512] hover:border-[#B88246]/60 transition-colors"
            >
              <ImageWithFallback
                src={photos[0].localUrl}
                fallbackSrc={photos[0].directUrl}
                alt={photos[0].alt}
                containerClassName="w-full h-full min-h-[380px] sm:min-h-[460px]"
                className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500 ease-out"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#151210] via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

              <div className="absolute top-4 right-4 p-2 rounded bg-[#151210]/80 text-[#FAF7F2] opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-4 h-4 text-[#B88246]" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 bg-gradient-to-t from-[#151210] via-[#151210]/90 to-transparent">
                <h3 className="font-display text-xl sm:text-2xl font-medium text-[#FAF7F2]">
                  {photos[0].title}
                </h3>
                <p className="text-xs sm:text-sm text-[#A89E93] mt-1 max-w-md">
                  {photos[0].description}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Photos 2 & 3 */}
          <div className="md:col-span-5 flex flex-col gap-6">
            
            {/* Photo 2: Wooden Seating */}
            <div
              onClick={() => onPhotoClick(photos[1].id)}
              className="group relative cursor-pointer flex-1 min-h-[220px] rounded-lg overflow-hidden border border-[#2F251E] bg-[#1A1512] hover:border-[#B88246]/60 transition-colors"
            >
              <ImageWithFallback
                src={photos[1].localUrl}
                fallbackSrc={photos[1].directUrl}
                alt={photos[1].alt}
                containerClassName="w-full h-full min-h-[220px]"
                className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500 ease-out"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#151210] via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

              <div className="absolute top-4 right-4 p-2 rounded bg-[#151210]/80 text-[#FAF7F2] opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-3.5 h-3.5 text-[#B88246]" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-[#151210] via-[#151210]/90 to-transparent">
                <h3 className="font-display text-lg font-medium text-[#FAF7F2]">
                  {photos[1].title}
                </h3>
                <p className="text-xs text-[#A89E93] mt-0.5">
                  {photos[1].description}
                </p>
              </div>
            </div>

            {/* Photo 3: Rooftop View */}
            <div
              onClick={() => onPhotoClick(photos[2].id)}
              className="group relative cursor-pointer flex-1 min-h-[220px] rounded-lg overflow-hidden border border-[#2F251E] bg-[#1A1512] hover:border-[#B88246]/60 transition-colors"
            >
              <ImageWithFallback
                src={photos[2].localUrl}
                fallbackSrc={photos[2].directUrl}
                alt={photos[2].alt}
                containerClassName="w-full h-full min-h-[220px]"
                className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500 ease-out"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#151210] via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

              <div className="absolute top-4 right-4 p-2 rounded bg-[#151210]/80 text-[#FAF7F2] opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-3.5 h-3.5 text-[#B88246]" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-[#151210] via-[#151210]/90 to-transparent">
                <h3 className="font-display text-lg font-medium text-[#FAF7F2]">
                  {photos[2].title}
                </h3>
                <p className="text-xs text-[#A89E93] mt-0.5">
                  {photos[2].description}
                </p>
              </div>
            </div>

          </div>

        </div>

        <div className="mt-6 text-xs text-[#6E645A] text-center">
          Klik foto untuk memperbesar tampilan dalam mode layar penuh.
        </div>

      </div>
    </section>
  );
};
