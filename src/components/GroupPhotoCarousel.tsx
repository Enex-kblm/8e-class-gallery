import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { LazyImage } from './LazyImage';

interface GroupPhotoCarouselProps {
  photos: string[];
}

export const GroupPhotoCarousel: React.FC<GroupPhotoCarouselProps> = ({ photos }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [validPhotos, setValidPhotos] = useState<string[]>([]);

  useEffect(() => {
    setValidPhotos(photos.filter(photo => 
      photo && typeof photo === 'string' && photo.trim() !== ""
    ));
  }, [photos]);

  const handlePrevious = () => {
    setCurrentIndex(prev => (prev === 0 ? validPhotos.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev === validPhotos.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (validPhotos.length <= 1) return;

      switch (e.key) {
        case 'ArrowLeft':
          handlePrevious();
          break;
        case 'ArrowRight':
          handleNext();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [validPhotos, currentIndex]);

  if (validPhotos.length === 0) {
    return (
      <div className="mb-12 p-8 bg-gray-100 rounded-xl text-center">
        <p className="text-gray-500">No photos available</p>
      </div>
    );
  }

  return (
    <div className="mb-12">
      <div className="relative rounded-xl overflow-hidden shadow-xl bg-white">
        <div className="aspect-[16/9] max-h-[90vh]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full"
            >
              <LazyImage
                src={validPhotos[currentIndex]}
                alt={`Photo ${currentIndex + 1}`}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {validPhotos.length > 1 && (
          <>
            <button 
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-all"
              aria-label="Previous photo"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-all"
              aria-label="Next photo"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} / {validPhotos.length}
        </div>
      </div>
    </div>
  );
};
