import React, { useState } from 'react';
import { X, MessageCircle, MapPin, Navigation, CheckCircle2, Copy, Check } from 'lucide-react';
import { BUSINESS_DATA } from '../data/business';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopic?: string;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  initialTopic = '',
}) => {
  const [visitorName, setVisitorName] = useState('');
  const [message, setMessage] = useState(initialTopic ? `Halo Kedai Kopi Ruang Atas, saya ingin menanyakan ketersediaan ${initialTopic}.` : '');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(BUSINESS_DATA.address.full);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const waNumber = BUSINESS_DATA.contact.whatsappNumber.trim();
    const encodedText = encodeURIComponent(
      `Halo Kedai Kopi Ruang Atas! Saya ${visitorName || 'Pengunjung'}.\n\nPesan: ${message || 'Saya ingin bertanya seputar kedai dan menu.'}`
    );

    if (waNumber) {
      window.open(`https://wa.me/${waNumber}?text=${encodedText}`, '_blank');
      setIsSubmitted(true);
    } else {
      setIsSubmitted(true);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-lg rounded-lg bg-[#181411] border border-[#332821] shadow-2xl p-6 sm:p-8 text-[#F5EFEB] max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded text-[#8A7E73] hover:text-[#FAF7F2] hover:bg-[#251E18] transition-colors"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-left mb-6">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#B88246] block mb-1">
            Kontak & Singgah
          </span>
          <h3 className="font-display text-2xl font-medium text-[#FAF7F2]">
            Hubungi Kedai Kopi Ruang Atas
          </h3>
          <p className="text-xs sm:text-sm text-[#8A7E73] mt-1">
            Tanyakan ketersediaan beans hari ini, rute jalan, atau rencana berkunjung.
          </p>
        </div>

        {isSubmitted ? (
          <div className="p-6 rounded bg-[#14110F] border border-emerald-500/30 text-center space-y-4">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h4 className="font-display text-lg font-medium text-[#FAF7F2]">
              Pesan Disiapkan
            </h4>
            <p className="text-xs text-[#8A7E73] leading-relaxed">
              {BUSINESS_DATA.contact.whatsappNumber
                ? 'Tautan WhatsApp telah dibuka. Terima kasih telah menghubungi kami!'
                : 'Pesan Anda tersimpan di form pratinjau. Nomor WhatsApp resmi dapat diisi pada file src/data/business.ts.'}
            </p>
            <button
              onClick={() => {
                setIsSubmitted(false);
                onClose();
              }}
              className="px-6 py-2 bg-[#B88246] text-[#151210] text-xs font-semibold uppercase tracking-wider rounded hover:bg-[#C89254] transition-colors"
            >
              Tutup
            </button>
          </div>
        ) : (
          <form onSubmit={handleSendWhatsApp} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#C8BFB5] mb-1.5">
                Nama Pengunjung
              </label>
              <input
                type="text"
                value={visitorName}
                onChange={(e) => setVisitorName(e.target.value)}
                placeholder="Contoh: Rian / Pelanggan"
                className="w-full px-3.5 py-2.5 rounded bg-[#14110F] border border-[#2F251E] text-sm text-[#FAF7F2] focus:outline-none focus:border-[#B88246] transition-colors placeholder:text-[#6E645A]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#C8BFB5] mb-1.5">
                Pertanyaan Seputar Kedai / Menu
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tuliskan pertanyaan Anda..."
                className="w-full px-3.5 py-2.5 rounded bg-[#14110F] border border-[#2F251E] text-sm text-[#FAF7F2] focus:outline-none focus:border-[#B88246] transition-colors placeholder:text-[#6E645A] resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#B88246] hover:bg-[#C89254] text-[#151210] text-xs uppercase tracking-wider font-semibold rounded transition-colors shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Kirim via WhatsApp</span>
            </button>
          </form>
        )}

        {/* Location shortcuts */}
        <div className="mt-6 pt-5 border-t border-[#2A221C] space-y-3">
          <div className="flex items-start justify-between gap-3 text-xs">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#B88246] shrink-0 mt-0.5" />
              <span className="text-[#8A7E73] line-clamp-2">{BUSINESS_DATA.address.full}</span>
            </div>
            <button
              type="button"
              onClick={handleCopyAddress}
              className="p-1.5 rounded bg-[#14110F] hover:bg-[#251E18] text-[#C8BFB5] shrink-0 border border-[#2E241D]"
              title="Salin Alamat"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <a
            href={BUSINESS_DATA.address.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-[#14110F] hover:bg-[#201A16] border border-[#2E241D] text-xs font-medium text-[#FAF7F2] rounded transition-colors"
          >
            <Navigation className="w-3.5 h-3.5 text-[#B88246]" />
            <span>Petunjuk Arah di Google Maps</span>
          </a>
        </div>

      </div>
    </div>
  );
};
