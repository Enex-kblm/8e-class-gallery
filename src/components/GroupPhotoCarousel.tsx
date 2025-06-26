import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { LazyImage } from './LazyImage';

interface GroupPhotoCarouselProps {
  photos: string[];
}

export const GroupPhotoCarousel: React.FC<GroupPhotoCarouselProps> = ({ photos }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex(prev => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  const validPhotos = photos.filter((photo) => photo.trim() !== "");

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
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white"
              aria-label="Previous photo"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white"
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
