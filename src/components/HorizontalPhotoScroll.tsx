// src/components/HorizontalPhotoScroll.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { LazyImage } from './LazyImage';

interface HorizontalPhotoScrollProps {
  title: string;
  photos: string[];
  onPhotoClick: (index: number) => void;
}

export const HorizontalPhotoScroll: React.FC<HorizontalPhotoScrollProps> = ({
  title,
  photos,
  onPhotoClick
}) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-3">{title}</h2>
      <div className="relative">
        <div className="flex overflow-x-auto pb-4 -mx-2 hide-scrollbar">
          {photos.map((photo, index) => (
            <motion.div
              key={index}
              className="flex-shrink-0 px-2"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <div 
                className="rounded-lg overflow-hidden shadow-md cursor-pointer"
                onClick={() => onPhotoClick(index)}
                style={{ width: '200px', height: '300px' }}
              >
                <LazyImage 
                  src={photo}
                  alt={`${title} - ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};