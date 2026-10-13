import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { BUSINESS_DATA } from '../data/business';
import { ImageWithFallback } from './common/ImageWithFallback';

interface AboutProps {
  onPhotoClick: (photoId: string) => void;
  onExploreGallery: () => void;
}

export const About: React.FC<AboutProps> = ({ onPhotoClick, onExploreGallery }) => {
  const aboutPhoto = BUSINESS_DATA.realPhotos[1];

  return (
    <section id="tentang" className="py-20 lg:py-28 bg-[#181411] text-[#F5EFEB] border-b border-[#2C231D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Authentic Photo in Clean Architectural Frame */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div 
              onClick={() => onPhotoClick(aboutPhoto.id)}
              className="group cursor-pointer relative overflow-hidden rounded-lg border border-[#332821] bg-[#1E1814] shadow-xl hover:border-[#B88246]/60 transition-colors duration-300"
            >
              <ImageWithFallback
                src={aboutPhoto.localUrl}
                fallbackSrc={aboutPhoto.directUrl}
                alt={aboutPhoto.alt}
                containerClassName="w-full aspect-[4/5]"
                className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500 ease-out"
              />

              <div className="p-4 bg-[#151210] border-t border-[#2C231D]">
                <p className="font-display text-base font-medium text-[#FAF7F2]">
                  {aboutPhoto.title}
                </p>
                <p className="text-xs text-[#968A7E] mt-0.5">
                  {aboutPhoto.description}
                </p>
              </div>
            </div>

            <div className="mt-3 text-right">
              <button
                onClick={onExploreGallery}
                className="text-xs text-[#B88246] hover:underline inline-flex items-center gap-1 font-medium"
              >
                <span>Lihat galeri suasana kedai</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Column: Story & Space Identity */}
          <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col justify-center">
            <p className="text-xs uppercase tracking-widest text-[#B88246] font-semibold mb-3">
              Tentang Ruang Atas
            </p>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium text-[#FAF7F2] leading-tight mb-6">
              Lebih dari Sekadar Tempat Ngopi.
            </h2>

            <p className="text-base sm:text-lg text-[#C8BFB5] leading-relaxed mb-8">
              {BUSINESS_DATA.aboutStory}
            </p>

            {/* Architectural Elements of the Space */}
            <div className="border-t border-[#2C231D] pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h3 className="font-display text-lg font-medium text-[#FAF7F2] mb-1.5">
                  Rooftop & Udara Terbuka
                </h3>
                <p className="text-xs sm:text-sm text-[#968A7E] leading-relaxed">
                  Menikmati sore dengan angin sejuk dan langit senja yang lapang dari lantai atas.
                </p>
              </div>

              <div>
                <h3 className="font-display text-lg font-medium text-[#FAF7F2] mb-1.5">
                  Meja Kayu & Sentuhan Industrial
                </h3>
                <p className="text-xs sm:text-sm text-[#968A7E] leading-relaxed">
                  Tata ruang bersahaja yang memberikan rasa nyaman untuk mengobrol maupun jeda sejenak.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#2C231D] text-xs text-[#8A7E73] flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#B88246]" />
              <span>Lokasi strategis di Kampung Baru, gerbang Perumahan Tenjo City Tahap 3 Singabangsa.</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
