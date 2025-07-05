import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Images, Heart, Download, Share2, User } from 'lucide-react';
import { Student } from '../types';
import { LazyImage } from './LazyImage';

interface StudentCardProps {
  student: Student;
  index: number;
  onClick: () => void;
  onToggleFavorite: (studentId: number) => void;
  onDownload?: () => void;
  onShare?: (photoIndex: number) => void;
  viewMode?: 'grid' | 'list';
}

export const StudentCard: React.FC<StudentCardProps> = ({ 
  student, 
  index, 
  onClick,
  onToggleFavorite,
  onDownload,
  onShare,
  viewMode = 'grid'
}) => {
  const [isFavorite, setIsFavorite] = useState(student.isFavorite || false);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    onToggleFavorite(student.id);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDownload?.();
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShare?.(0);
  };

  // Special logic: Elmira (ID 12) is considered to have valid photos even from catbox.moe
  // All other students: catbox.moe photos are considered invalid
  const hasRealPhotos = student.photos.length > 0 && 
    student.photos[0] && 
    student.photos[0].trim() !== '' &&
    !student.photos[0].includes('dhy9t7.png') && // Exclude placeholder
    (student.id === 12 || !student.photos[0].includes('catbox.moe')); // Special case for Elmira (ID 12)

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700"
      >
        <div className="flex items-center p-4 space-x-4">
          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
            {hasRealPhotos ? (
              <LazyImage
                src={student.photos[0]}
                alt={student.name}
                className="w-full h-full"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <User size={24} className="text-gray-400 dark:text-gray-500" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">{student.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Absen #{student.id}</p>
            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400 dark:text-gray-500">
              <span className="flex items-center space-x-1">
                <Images size={12} />
                <span>{student.photos.length} foto</span>
              </span>
              {hasRealPhotos && (
                <span className="text-green-600 dark:text-green-400 font-medium">✓ Lengkap</span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleToggleFavorite}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Heart 
                size={16} 
                className={isFavorite ? "text-red-500 fill-red-500" : "text-gray-400 dark:text-gray-500"} 
              />
            </button>
            
            {hasRealPhotos && (
              <>
                <button
                  onClick={handleDownload}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="Download"
                >
                  <Download size={16} className="text-gray-600 dark:text-gray-300" />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="Share"
                >
                  <Share2 size={16} className="text-gray-600 dark:text-gray-300" />
                </button>
              </>
            )}
            
            <button
              onClick={onClick}
              className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 hover:bg-blue-200 dark:hover:bg-blue-800/50 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium transition-colors"
            >
              Lihat
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group cursor-pointer"
      onClick={onClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="aspect-square relative overflow-hidden">
          {hasRealPhotos ? (
            <LazyImage
              src={student.photos[0]}
              alt={student.name}
              className="w-full h-full group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
              <User size={48} className="text-gray-400 dark:text-gray-500" />
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-3 left-3 flex items-center space-x-1 text-white">
              <Images size={16} />
              <span className="text-sm font-medium">{student.photos.length} photos</span>
            </div>
            
            {hasRealPhotos && (
              <div className="absolute bottom-3 right-3 flex space-x-2">
                <button
                  onClick={handleDownload}
                  className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                  title="Download"
                >
                  <Download size={14} className="text-white" />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                  title="Share"
                >
                  <Share2 size={14} className="text-white" />
                </button>
              </div>
            )}
          </div>

          <div className="absolute top-3 right-3 p-2 bg-white/20 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Camera size={16} className="text-white" />
          </div>

          <button 
            onClick={handleToggleFavorite}
            className="absolute top-3 left-3 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
          >
            <Heart 
              size={16} 
              className={isFavorite ? "text-red-500 fill-red-500" : "text-white"} 
            />
          </button>

          {!hasRealPhotos && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <span className="text-white text-sm font-medium bg-black/50 px-2 py-1 rounded">
                Coming Soon
              </span>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white text-center group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
            {student.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-1">
            Absen #{student.id}
          </p>
          {hasRealPhotos && (
            <div className="flex justify-center mt-2">
              <span className="text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full font-medium">
                ✓ Foto Tersedia
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};