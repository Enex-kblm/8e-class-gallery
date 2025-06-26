import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { LazyImage } from './LazyImage';

interface PhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  photos: string[];
  currentIndex: number;
  studentName: string;
  onPrevious: () => void;
  onNext: () => void;
}

export const PhotoModal: React.FC<PhotoModalProps> = ({
  isOpen,
  onClose,
  photos,
  currentIndex,
  studentName,
  onPrevious,
  onNext,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          onPrevious();
          break;
        case 'ArrowRight':
          onNext();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onPrevious, onNext]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative max-w-4xl max-h-[90vh] w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
            >
              <X size={24} />
            </button>

            {/* Navigation buttons */}
            {photos.length > 1 && (
              <>
                <button
                  onClick={onPrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={onNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            {/* Image container */}
            <div className="relative bg-white rounded-lg overflow-hidden shadow-2xl">
              <div className="aspect-[3/4] max-h-[80vh]">
                <LazyImage
                  src={photos[currentIndex]}
                  alt={`${studentName} - Photo ${currentIndex + 1}`}
                  className="w-full h-full"
                />
              </div>
              
              {/* Photo info */}
              <div className="p-4 bg-white">
                <h3 className="text-lg font-semibold text-gray-900">{studentName}</h3>
                <p className="text-sm text-gray-500">
                  Photo {currentIndex + 1} of {photos.length}
                </p>
              </div>

              {/* Thumbnail navigation */}
              {photos.length > 1 && (
                <div className="p-4 bg-gray-50 border-t">
                  <div className="flex space-x-2 overflow-x-auto">
                    {photos.map((photo, index) => (
                      <button
                        key={index}
                        onClick={() => {/* This would be handled by parent component */}}
                        className={`flex-shrink-0 w-16 h-20 rounded overflow-hidden border-2 transition-colors ${
                          index === currentIndex ? 'border-blue-500' : 'border-gray-200'
                        }`}
                      >
                        <LazyImage
                          src={photo}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};