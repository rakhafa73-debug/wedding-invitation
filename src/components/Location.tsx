import React, { useState } from 'react';
import { MapPin, Clock, Navigation, ExternalLink, Copy, Check } from 'lucide-react';
import { BUSINESS_DATA } from '../data/business';

export const Location: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(BUSINESS_DATA.address.full);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="lokasi" className="py-20 lg:py-28 bg-[#151210] text-[#F5EFEB] border-b border-[#2C231D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-xl mb-14">
          <p className="text-xs uppercase tracking-widest text-[#B88246] font-semibold mb-2">
            Lokasi & Jam Buka
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium text-[#FAF7F2]">
            Sedikit Tersembunyi, Layak Disinggahi.
          </h2>
          <p className="text-sm text-[#968A7E] mt-3 leading-relaxed">
            Berada di perbatasan tenang Tenjo, Bogor. Suasana rooftop terbuka yang cocok dinikmati saat sore berganti malam.
          </p>
        </div>

        {/* 2-Column Physical Place Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Details & Guide */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Address */}
            <div className="p-6 rounded-lg bg-[#1B1612] border border-[#2F251E]">
              <div className="flex items-start gap-3.5">
                <MapPin className="w-5 h-5 text-[#B88246] shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-display text-lg font-medium text-[#FAF7F2] mb-1">
                    Alamat Kedai
                  </h3>
                  <p className="text-sm text-[#C8BFB5] leading-relaxed mb-4">
                    {BUSINESS_DATA.address.full}
                  </p>

                  <div className="p-3 rounded bg-[#151210] border border-[#261E18] text-xs text-[#8A7E73] mb-4 leading-relaxed">
                    <strong className="text-[#B88246] font-medium block mb-0.5">Petunjuk Arah:</strong>
                    {BUSINESS_DATA.address.directionsTip}
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href={BUSINESS_DATA.address.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#B88246] hover:bg-[#C89254] text-[#151210] text-xs uppercase tracking-wider font-semibold rounded transition-colors"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Buka Google Maps</span>
                    </a>

                    <button
                      onClick={handleCopyAddress}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#251E18] hover:bg-[#2F2620] text-xs text-[#C8BFB5] rounded border border-[#3E3128] transition-colors"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Tersalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-[#8A7E73]" />
                          <span>Salin Alamat</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="p-6 rounded-lg bg-[#1B1612] border border-[#2F251E]">
              <div className="flex items-start gap-3.5">
                <Clock className="w-5 h-5 text-[#B88246] shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-display text-lg font-medium text-[#FAF7F2] mb-1">
                    Jam Operasional
                  </h3>
                  
                  <div className="my-2">
                    <p className="text-xs uppercase tracking-wider text-[#B88246] font-medium">
                      {BUSINESS_DATA.openingHours.days}
                    </p>
                    <p className="text-2xl font-bold font-mono text-[#FAF7F2] mt-0.5">
                      {BUSINESS_DATA.openingHours.time}
                    </p>
                  </div>

                  <p className="text-xs text-[#8A7E73] mt-2 leading-relaxed">
                    {BUSINESS_DATA.openingHours.disclaimer}
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Interactive Map Embed */}
          <div className="lg:col-span-7">
            <div className="rounded-lg overflow-hidden border border-[#2F251E] bg-[#1B1612]">
              <div className="p-3.5 bg-[#14110F] border-b border-[#261E18] flex items-center justify-between text-xs text-[#8A7E73]">
                <span className="text-[#FAF7F2] font-medium">Peta Wilayah Singabangsa & Tenjo City</span>
                <a
                  href={BUSINESS_DATA.address.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#B88246] hover:underline inline-flex items-center gap-1"
                >
                  <span>Buka di Aplikasi Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="w-full h-[380px] sm:h-[420px] bg-[#151210]">
                <iframe
                  title="Peta Kedai Kopi Ruang Atas"
                  src="https://maps.google.com/maps?q=Tenjo+City+Singabangsa+Bogor&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0 filter grayscale-[15%] contrast-[105%]"
                  loading="lazy"
                  allowFullScreen
                />
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
