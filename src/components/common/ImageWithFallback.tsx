import React, { useState } from 'react';
import { Coffee, ImageOff } from 'lucide-react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  fallbackSrc?: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  captionTitle?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  fallbackSrc,
  alt,
  className = '',
  containerClassName = '',
  captionTitle,
  ...props
}) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    } else {
      setHasError(true);
      setIsLoading(false);
    }
  };

  return (
    <div className={`relative overflow-hidden bg-[#181411] ${containerClassName}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-[#181411] flex items-center justify-center z-0">
          <Coffee className="w-5 h-5 text-[#B88246]/40 animate-pulse" />
        </div>
      )}

      {hasError ? (
        <div className="absolute inset-0 bg-[#181411] flex flex-col items-center justify-center p-6 text-center text-[#8A7E73]">
          <ImageOff className="w-6 h-6 mb-2 text-[#B88246]" />
          <p className="text-xs font-medium text-[#FAF7F2]">{captionTitle || alt}</p>
          <p className="text-[11px] mt-0.5 text-[#7A7065]">Foto Dokumentasi Kedai</p>
        </div>
      ) : (
        <img
          src={currentSrc}
          alt={alt}
          referrerPolicy="no-referrer"
          loading="lazy"
          onLoad={() => setIsLoading(false)}
          onError={handleError}
          className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          {...props}
        />
      )}
    </div>
  );
};
