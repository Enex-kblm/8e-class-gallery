import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Download, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface PhotoStatsDisplayProps {
  className?: string;
}

interface GlobalStats {
  totalLikes: number;
  totalDownloads: number;
  totalPhotos: number;
  mostLikedPhoto: {
    student_name: string;
    like_count: number;
  } | null;
}

export const PhotoStatsDisplay: React.FC<PhotoStatsDisplayProps> = ({ className = '' }) => {
  const [stats, setStats] = useState<GlobalStats>({
    totalLikes: 0,
    totalDownloads: 0,
    totalPhotos: 0,
    mostLikedPhoto: null
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadGlobalStats();
  }, []);

  const loadGlobalStats = async () => {
    try {
      setIsLoading(true);

      // Get total stats
      const { data: statsData, error: statsError } = await supabase
        .from('photo_stats')
        .select('like_count, download_count, student_name')
        .order('like_count', { ascending: false });

      if (statsError) throw statsError;

      const totalLikes = statsData?.reduce((sum, photo) => sum + photo.like_count, 0) || 0;
      const totalDownloads = statsData?.reduce((sum, photo) => sum + photo.download_count, 0) || 0;
      const totalPhotos = statsData?.length || 0;
      const mostLikedPhoto = statsData?.[0]?.like_count > 0 ? {
        student_name: statsData[0].student_name,
        like_count: statsData[0].like_count
      } : null;

      setStats({
        totalLikes,
        totalDownloads,
        totalPhotos,
        mostLikedPhoto
      });
    } catch (error) {
      console.error('Error loading global stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg p-4 shadow-sm ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-lg p-4 shadow-sm border border-gray-100 ${className}`}
    >
      <div className="flex items-center space-x-2 mb-4">
        <TrendingUp size={20} className="text-blue-600" />
        <h3 className="font-semibold text-gray-900">Gallery Statistics</h3>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 text-red-600 mb-1">
            <Heart size={16} />
            <span className="text-2xl font-bold">{stats.totalLikes}</span>
          </div>
          <p className="text-xs text-gray-500">Total Likes</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 text-blue-600 mb-1">
            <Download size={16} />
            <span className="text-2xl font-bold">{stats.totalDownloads}</span>
          </div>
          <p className="text-xs text-gray-500">Downloads</p>
        </div>
      </div>

      {stats.mostLikedPhoto && (
        <div className="pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Most Popular</p>
          <p className="text-sm font-medium text-gray-900 truncate">
            {stats.mostLikedPhoto.student_name}
          </p>
          <p className="text-xs text-gray-500">
            {stats.mostLikedPhoto.like_count} likes
          </p>
        </div>
      )}
    </motion.div>
  );
};