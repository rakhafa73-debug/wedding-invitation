import React from 'react';
import { Star, ExternalLink, Quote } from 'lucide-react';
import { REVIEWS_OVERVIEW, REVIEWS_DATA } from '../data/reviews';

export const Reviews: React.FC = () => {
  return (
    <section id="ulasan" className="py-20 lg:py-28 bg-[#181411] text-[#F5EFEB] border-b border-[#2C231D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="max-w-xl">
            <p className="text-xs uppercase tracking-widest text-[#B88246] font-semibold mb-2">
              Ulasan Publik
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium text-[#FAF7F2]">
              Cerita dari Mereka yang Pernah Singgah.
            </h2>
            <p className="text-sm text-[#968A7E] mt-3 leading-relaxed">
              Kesan para pengunjung yang telah menikmati waktu di Kedai Kopi Ruang Atas.
            </p>
          </div>

          {/* Social Proof Metric Block */}
          <div className="p-5 rounded-lg bg-[#14110F] border border-[#2F251E] flex items-center gap-4 shrink-0">
            <div>
              <div className="flex items-center gap-1 text-[#B88246] mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-2xl font-bold text-[#FAF7F2]">
                  {REVIEWS_OVERVIEW.score.toFixed(1)}
                </span>
                <span className="text-xs text-[#8A7E73]">
                  dari {REVIEWS_OVERVIEW.totalReviews} ulasan di Google Maps
                </span>
              </div>
            </div>

            <a
              href={REVIEWS_OVERVIEW.googleMapsReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded bg-[#201A15] hover:bg-[#2A221C] text-[#B88246] hover:text-[#C89254] transition-colors"
              title="Buka Ulasan di Google Maps"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* 3 Authentic Editorial Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {REVIEWS_DATA.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-lg bg-[#1D1713] border border-[#2F251E] flex flex-col justify-between"
            >
              <div>
                <Quote className="w-5 h-5 text-[#B88246]/50 mb-3" />
                <p className="text-sm text-[#E0D7CC] italic leading-relaxed mb-4">
                  "{rev.content}"
                </p>
              </div>

              <div className="pt-4 border-t border-[#292019] flex items-center justify-between text-xs text-[#7A7065]">
                <span className="font-medium text-[#B88246]">{rev.highlight}</span>
                <span>Ulasan Google Maps</span>
              </div>
            </div>
          ))}
        </div>

        {/* Transparent Disclaimer & Direct Maps Link */}
        <div className="text-center text-xs text-[#7A7065]">
          <span>Data ulasan dihimpun dari penilaian publik Google Maps. </span>
          <a
            href={REVIEWS_OVERVIEW.googleMapsReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#B88246] hover:underline ml-1 inline-flex items-center gap-1 font-medium"
          >
            Lihat semua ulasan langsung di Google Maps &rarr;
          </a>
        </div>

      </div>
    </section>
  );
};
