import React, { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { BusinessPhoto } from '../types';
import { ImageWithFallback } from './common/ImageWithFallback';

interface LightboxProps {
  photos: BusinessPhoto[];
  currentPhotoId: string | null;
  onClose: () => void;
  onSelectPhoto: (id: string) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  photos,
  currentPhotoId,
  onClose,
  onSelectPhoto,
}) => {
  if (!currentPhotoId) return null;

  const currentIndex = photos.findIndex(p => p.id === currentPhotoId);
  const currentPhoto = photos[currentIndex] || photos[0];

  const handlePrev = useCallback(() => {
    const prevIndex = (currentIndex - 1 + photos.length) % photos.length;
    onSelectPhoto(photos[prevIndex].id);
  }, [currentIndex, photos, onSelectPhoto]);

  const handleNext = useCallback(() => {
    const nextIndex = (currentIndex + 1) % photos.length;
    onSelectPhoto(photos[nextIndex].id);
  }, [currentIndex, photos, onSelectPhoto]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose, handlePrev, handleNext]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Dokumentasi Kedai Kopi Ruang Atas"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 sm:p-6"
    >
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex items-center justify-between text-white z-20">
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-widest font-medium text-[#B88246]">
            Dokumentasi Kedai
          </span>
          <span className="text-xs text-[#8A7E73]">
            {currentIndex + 1} / {photos.length}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={currentPhoto.previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[#8A7E73] hover:text-[#B88246] transition-colors p-2"
          >
            <span>Tautan Sumber</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={onClose}
            className="p-2 rounded bg-white/10 hover:bg-[#B88246] hover:text-[#151210] text-white transition-colors"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Prev Button */}
      <button
        onClick={handlePrev}
        className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/60 hover:bg-[#B88246] text-white hover:text-[#151210] transition-colors border border-white/10"
        aria-label="Foto sebelumnya"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Next Button */}
      <button
        onClick={handleNext}
        className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/60 hover:bg-[#B88246] text-white hover:text-[#151210] transition-colors border border-white/10"
        aria-label="Foto berikutnya"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Center Image Container */}
      <div className="relative max-w-4xl w-full max-h-[85vh] flex flex-col items-center justify-center p-2">
        <div className="relative overflow-hidden rounded border border-white/10 shadow-2xl bg-[#151210] max-h-[70vh] flex items-center justify-center">
          <ImageWithFallback
            src={currentPhoto.localUrl}
            fallbackSrc={currentPhoto.directUrl}
            alt={currentPhoto.alt}
            className="max-h-[68vh] w-auto object-contain rounded"
          />
        </div>

        {/* Caption */}
        <div className="mt-4 text-center max-w-xl">
          <h4 className="font-display text-lg font-medium text-[#FAF7F2]">
            {currentPhoto.title}
          </h4>
          <p className="text-xs text-[#A89E93] mt-0.5">
            {currentPhoto.description}
          </p>
        </div>

        {/* Thumbnails */}
        <div className="flex items-center gap-2.5 mt-4">
          {photos.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => onSelectPhoto(p.id)}
              className={`w-11 h-11 rounded overflow-hidden border transition-all ${
                p.id === currentPhoto.id
                  ? 'border-[#B88246] scale-105'
                  : 'border-white/20 opacity-50 hover:opacity-100'
              }`}
            >
              <img
                src={p.localUrl}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
