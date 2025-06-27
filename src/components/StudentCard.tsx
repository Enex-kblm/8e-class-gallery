import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Images, Heart } from 'lucide-react';
import { Student } from '../types';
import { LazyImage } from './LazyImage';

interface StudentCardProps {
  student: Student;
  index: number;
  onClick: () => void;
  onToggleFavorite: (studentId: number) => void;
}

export const StudentCard: React.FC<StudentCardProps> = ({ 
  student, 
  index, 
  onClick,
  onToggleFavorite
}) => {
  const [isFavorite, setIsFavorite] = useState(student.isFavorite || false);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    onToggleFavorite(student.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group cursor-pointer"
      onClick={onClick}
    >
      <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
        <div className="aspect-square relative overflow-hidden">
          <LazyImage
            src={student.photos[0]}
            alt={student.name}
            className="w-full h-full group-hover:scale-105 transition-transform duration-500"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-3 left-3 flex items-center space-x-1 text-white">
              <Images size={16} />
              <span className="text-sm font-medium">{student.photos.length} photos</span>
            </div>
          </div>

          <div className="absolute top-3 right-3 p-2 bg-white/20 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Camera size={16} className="text-white" />
          </div>

          {/* Tombol favorit */}
          <button 
            onClick={handleToggleFavorite}
            className="absolute top-3 left-3 p-2 bg-white/20 backdrop-blur-sm rounded-full"
          >
            <Heart 
              size={16} 
              className={isFavorite ? "text-red-500 fill-red-500" : "text-white"} 
            />
          </button>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-gray-900 text-center group-hover:text-blue-600 transition-colors duration-200">
            {student.name}
          </h3>
          <p className="text-sm text-gray-500 text-center mt-1">
            Class 8E
          </p>
        </div>
      </div>
    </motion.div>
  );
};