import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Coffee } from 'lucide-react';
import { BUSINESS_DATA } from '../data/business';

interface NavbarProps {
  onExploreClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onExploreClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Beranda', href: '#beranda' },
    { name: 'Tentang', href: '#tentang' },
    { name: 'Menu', href: '#menu' },
    { name: 'Suasana', href: '#suasana' },
    { name: 'Ulasan', href: '#ulasan' },
    { name: 'Lokasi', href: '#lokasi' },
  ];

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#151210]/95 backdrop-blur-md border-b border-[#2C231D] py-3.5 shadow-md shadow-black/30'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8">
          
          {/* Brand Wordmark */}
          <a
            href="#beranda"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#beranda');
            }}
            className="flex items-center gap-3 whitespace-nowrap shrink-0 text-left focus:outline-none"
          >
            <div className="w-8 h-8 rounded bg-[#251E18] border border-[#3E3128] flex items-center justify-center text-[#B88246]">
              <Coffee className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-lg font-bold tracking-wider text-[#FAF7F2]">
                {BUSINESS_DATA.brandTitle}
              </span>
              <span className="text-[10px] tracking-widest uppercase text-[#8A7E73] -mt-0.5">
                {BUSINESS_DATA.brandSubtitle}
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs uppercase tracking-wider font-medium">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="text-[#C8BFB5] hover:text-[#B88246] transition-colors py-1 whitespace-nowrap"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Action Button */}
          <div className="hidden md:flex items-center gap-4 shrink-0">
            <button
              onClick={onExploreClick}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-widest font-semibold text-[#151210] bg-[#B88246] hover:bg-[#C89254] rounded transition-colors whitespace-nowrap"
            >
              <span>Jelajahi Kedai</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-[#FAF7F2] hover:text-[#B88246] transition-colors focus:outline-none"
              aria-label={isMobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#151210] border-b border-[#2C231D] px-6 py-5 space-y-3">
          <div className="flex flex-col space-y-1 pb-3 border-b border-[#2C231D]">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="px-2 py-2 text-sm text-[#C8BFB5] hover:text-[#B88246] transition-colors font-medium"
              >
                {link.name}
              </a>
            ))}
          </div>

          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              onExploreClick();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold uppercase tracking-wider text-[#151210] bg-[#B88246] hover:bg-[#C89254] rounded transition-colors"
          >
            <span>Jelajahi Kedai</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </header>
  );
};
