import React from 'react';
import { useLazyImage } from '../hooks/useLazyImage';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  onClick?: () => void;
}

// Fungsi untuk validasi URL
const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const LazyImage: React.FC<LazyImageProps> = ({ src, alt, className = '', onClick }) => {
  const { imageSrc, isLoaded, isError, imgRef } = useLazyImage(src);

  // Optimisasi jika URL valid
  const optimizedSrc = isValidUrl(imageSrc) ? `${imageSrc}?w=400&q=80` : imageSrc;

  return (
    <div 
      ref={imgRef} 
      className={`relative overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 ${className}`}
      onClick={onClick}
    >
      {!isLoaded && !isError && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-200 to-gray-300">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </div>
      )}
      
      {isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-gray-400 text-center">
            <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-xs">Failed to load</p>
          </div>
        </div>
      )}
      
      {isLoaded && (
        <img
          src={optimizedSrc}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      )}
    </div>
  );
};
