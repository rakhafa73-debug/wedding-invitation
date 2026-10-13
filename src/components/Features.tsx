import React from 'react';
import { Coffee, Wind, Compass, Users } from 'lucide-react';
import { FEATURES_DATA } from '../data/features';

export const Features: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Coffee':
        return Coffee;
      case 'Sparkles':
        return Compass;
      case 'Sunset':
        return Wind;
      case 'Users':
        return Users;
      default:
        return Coffee;
    }
  };

  return (
    <section className="py-20 lg:py-24 bg-[#151210] text-[#F5EFEB] border-b border-[#2C231D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Header */}
        <div className="max-w-xl mb-14">
          <p className="text-xs uppercase tracking-widest text-[#B88246] font-semibold mb-2">
            Pengalaman Kedai
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-medium text-[#FAF7F2]">
            Suasana yang Kami Hadirkan
          </h2>
          <p className="text-sm text-[#968A7E] mt-3 leading-relaxed">
            Kedai kopi sederhana dengan karakter yang jujur — tempat bersinggah untuk menikmati secangkir kopi dan bercerita tanpa tergesa-gesa.
          </p>
        </div>

        {/* 4 Feature Columns with Editorial Balance */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES_DATA.map((feat) => {
            const IconComponent = getIcon(feat.iconName);
            return (
              <div
                key={feat.id}
                className="p-6 rounded-lg bg-[#1B1612] border border-[#2F251E] flex flex-col justify-between hover:border-[#B88246]/50 transition-colors duration-200"
              >
                <div>
                  <div className="w-10 h-10 rounded bg-[#251E18] border border-[#3E3128] flex items-center justify-center text-[#B88246] mb-5">
                    <IconComponent className="w-5 h-5" />
                  </div>

                  <h3 className="font-display text-xl font-medium text-[#FAF7F2] mb-1">
                    {feat.title}
                  </h3>

                  <p className="text-xs text-[#B88246] font-medium uppercase tracking-wider mb-3">
                    {feat.subtitle}
                  </p>

                  <p className="text-xs sm:text-sm text-[#A89E93] leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#2C231D] text-[11px] text-[#6E645A]">
                  Ruang Atas · Singabangsa
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
