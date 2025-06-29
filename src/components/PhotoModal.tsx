import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { LazyImage } from './LazyImage';
import { PhotoInteractionButtons } from './PhotoInteractionButtons';

interface PhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  photos: string[];
  currentIndex: number;
  studentName: string;
  studentId: number;
  onPrevious: () => void;
  onNext: () => void;
}

export const PhotoModal: React.FC<PhotoModalProps> = ({
  isOpen,
  onClose,
  photos,
  currentIndex,
  studentName,
  studentId,
  onPrevious,
  onNext,
}) => {
  const [showInfo, setShowInfo] = useState(false);

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
        case 'i':
        case 'I':
          setShowInfo(!showInfo);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onPrevious, onNext, showInfo]);

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
            {/* Top Controls */}
            <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center">
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                aria-label="Toggle photo information"
              >
                <Info size={24} />
              </button>
              
              <button
                onClick={onClose}
                className="p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>

            {/* Navigation buttons */}
            {photos.length > 1 && (
              <>
                <button
                  onClick={onPrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                  aria-label="Previous photo"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={onNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                  aria-label="Next photo"
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
              
              {/* Photo info overlay */}
              <AnimatePresence>
                {showInfo && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white"
                  >
                    <h3 className="text-xl font-semibold mb-2">{studentName}</h3>
                    <p className="text-sm opacity-90 mb-4">
                      Photo {currentIndex + 1} of {photos.length} • Class 8E
                    </p>
                    
                    <PhotoInteractionButtons
                      photoUrl={photos[currentIndex]}
                      studentId={studentId}
                      studentName={studentName}
                      showLabels={true}
                      className="justify-start"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bottom controls when info is hidden */}
              {!showInfo && (
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                  <div className="text-white bg-black/50 px-3 py-1 rounded-full text-sm">
                    {currentIndex + 1} / {photos.length}
                  </div>
                  
                  <PhotoInteractionButtons
                    photoUrl={photos[currentIndex]}
                    studentId={studentId}
                    studentName={studentName}
                    className="bg-black/50 rounded-lg p-2"
                  />
                </div>
              )}

              {/* Thumbnail navigation */}
              {photos.length > 1 && (
                <div className="p-4 bg-gray-50 border-t max-h-32 overflow-y-auto">
                  <div className="flex space-x-2 overflow-x-auto pb-2">
                    {photos.map((photo, index) => (
                      <button
                        key={index}
                        onClick={() => {/* This would be handled by parent component */}}
                        className={`flex-shrink-0 w-16 h-20 rounded overflow-hidden border-2 transition-colors ${
                          index === currentIndex ? 'border-blue-500' : 'border-gray-200'
                        }`}
                        aria-label={`View photo ${index + 1}`}
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