import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Download, Loader2 } from 'lucide-react';
import { usePhotoInteractions } from '../hooks/usePhotoInteractions';

interface PhotoInteractionButtonsProps {
  photoUrl: string;
  studentId: number;
  studentName: string;
  className?: string;
  showLabels?: boolean;
}

export const PhotoInteractionButtons: React.FC<PhotoInteractionButtonsProps> = ({
  photoUrl,
  studentId,
  studentName,
  className = '',
  showLabels = false
}) => {
  const photoId = `${studentId}_${photoUrl.split('/').pop()}`;
  const { stats, isLoading, error, toggleLike, downloadPhoto } = usePhotoInteractions(
    photoId,
    studentId,
    photoUrl
  );

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Like Button */}
      <motion.button
        onClick={toggleLike}
        disabled={isLoading}
        className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 ${
          stats.isLiked
            ? 'bg-red-100 text-red-600 hover:bg-red-200'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={`${stats.isLiked ? 'Unlike' : 'Like'} photo of ${studentName}`}
      >
        {isLoading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Heart
            size={16}
            className={stats.isLiked ? 'fill-current' : ''}
          />
        )}
        <span className="text-sm font-medium">{stats.likeCount}</span>
        {showLabels && (
          <span className="text-xs hidden sm:inline">
            {stats.likeCount === 1 ? 'Like' : 'Likes'}
          </span>
        )}
      </motion.button>

      {/* Download Button */}
      <motion.button
        onClick={downloadPhoto}
        disabled={isLoading}
        className="flex items-center space-x-1 px-3 py-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={`Download photo of ${studentName}`}
      >
        {isLoading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Download size={16} />
        )}
        {showLabels && (
          <span className="text-xs hidden sm:inline">Download</span>
        )}
      </motion.button>

      {/* Error Display */}
      {error && (
        <div className="text-xs text-red-500 max-w-32 truncate" title={error}>
          {error}
        </div>
      )}
    </div>
  );
};