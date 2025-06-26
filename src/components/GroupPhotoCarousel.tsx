import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { LazyImage } from './LazyImage';

interface GroupPhotoCarouselProps {
  photos: string[];
}

export const GroupPhotoCarousel: React.FC<GroupPhotoCarouselProps> = ({ title, photos }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex(prev => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  const isGroupPhoto = title.toLowerCase().includes("kenangan kelas");

  return (
    <div className={`${isGroupPhoto ? 'mb-16' : 'mb-12'}`}>
      <h2 className={`font-bold text-gray-900 mb-4 ${isGroupPhoto ? 'text-3xl' : 'text-2xl'}`}>
        {title}
      </h2>
      
      <div className="relative rounded-xl overflow-hidden shadow-xl bg-white">
        <div className={`${isGroupPhoto ? 'aspect-[16/9] max-h-[90vh]' : 'aspect-[19.9] max-h-[70vh]'}`}>
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
                src={photos[currentIndex]}
                alt={`${title} - ${currentIndex + 1}`}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {photos.length > 1 && (
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
          {currentIndex + 1} / {photos.length}
        </div>
      </div>
    </div>
  );
};
