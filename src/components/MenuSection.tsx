import React, { useState } from 'react';
import { Coffee, MessageCircle, HelpCircle } from 'lucide-react';
import { MENU_CATEGORIES, SAMPLE_MENU_ITEMS } from '../data/menu';
import { MenuItem } from '../types';

interface MenuSectionProps {
  onInquireMenu: (menuName?: string) => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({ onInquireMenu }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredItems = activeCategory === 'all'
    ? SAMPLE_MENU_ITEMS
    : SAMPLE_MENU_ITEMS.filter(item => item.category === activeCategory);

  return (
    <section id="menu" className="py-20 lg:py-28 bg-[#181411] text-[#F5EFEB] border-b border-[#2C231D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-xl">
            <p className="text-xs uppercase tracking-widest text-[#B88246] font-semibold mb-2">
              Sajian & Racikan
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium text-[#FAF7F2] leading-tight">
              Temukan Favoritmu.
            </h2>
            <p className="text-sm text-[#968A7E] mt-3 leading-relaxed">
              Pilihan kopi seduh, racikan signature segar, minuman non-kopi, hingga kudapan pelengkap waktu nongkrong di sore dan malam hari.
            </p>
          </div>

          <div className="text-xs text-[#8A7E73] border-l-2 border-[#B88246] pl-3 py-1 max-w-sm">
            Varian biji kopi berganti secara berkala. Ketersediaan menu harian dapat ditanyakan langsung ke barista di bar kedai.
          </div>
        </div>

        {/* Category Tabs (Minimalist Segmented Filter) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar border-b border-[#2C231D]">
          {MENU_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 text-xs uppercase tracking-wider rounded font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#B88246] text-[#151210]'
                    : 'bg-transparent text-[#968A7E] hover:text-[#FAF7F2] hover:bg-[#251E18]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Menu Catalog Grid — Clean Artisanal Coffee Board Style (NO PRICELIST) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredItems.map((item: MenuItem) => (
            <div
              key={item.id}
              className="p-6 rounded-lg bg-[#1D1713] border border-[#2F251E] hover:border-[#B88246]/50 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-display text-lg font-medium text-[#FAF7F2]">
                    {item.name}
                  </h3>
                  {item.notes && (
                    <span className="text-[11px] text-[#B88246] bg-[#2A2018] px-2 py-0.5 rounded shrink-0">
                      {item.notes}
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-[#968A7E] leading-relaxed mb-4">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#292019] flex items-center justify-between text-xs">
                <span className="text-[#6E645A] flex items-center gap-1.5">
                  <Coffee className="w-3.5 h-3.5 text-[#B88246]" />
                  <span>Sajian Bar Kedai</span>
                </span>

                <button
                  onClick={() => onInquireMenu(item.name)}
                  className="text-[#B88246] hover:text-[#D49E5E] transition-colors inline-flex items-center gap-1 font-medium"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Tanya Barista</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bar Consultation Invitation Banner */}
        <div className="p-7 sm:p-8 rounded-lg bg-[#14110F] border border-[#2F251E] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h4 className="font-display text-xl font-medium text-[#FAF7F2]">
              Ingin Tahu Ketersediaan Menu & Varian Beans Hari Ini?
            </h4>
            <p className="text-xs sm:text-sm text-[#968A7E] mt-1 max-w-xl">
              Silakan langsung mampir ke bar kasir kami saat kedai buka atau hubungi pengelola kedai melalui kontak resmi.
            </p>
          </div>

          <button
            onClick={() => onInquireMenu()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#B88246] hover:bg-[#C89254] text-[#151210] text-xs uppercase tracking-wider font-semibold rounded shrink-0 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Tanya Ketersediaan Menu</span>
          </button>
        </div>

      </div>
    </section>
  );
};
