import { useState, useEffect } from 'react';
import { supabase, getSessionId } from '../lib/supabase';

export interface PhotoStats {
  id: string;
  likeCount: number;
  downloadCount: number;
  isLiked: boolean;
}

export const usePhotoInteractions = (photoId: string, studentId: number, photoUrl: string) => {
  const [stats, setStats] = useState<PhotoStats>({
    id: photoId,
    likeCount: 0,
    downloadCount: 0,
    isLiked: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sessionId = getSessionId();

  // Load initial stats
  useEffect(() => {
    loadPhotoStats();
  }, [photoId]);

  const loadPhotoStats = async () => {
    try {
      setIsLoading(true);
      
      // First, ensure the photo exists in the database
      await ensurePhotoExists();
      
      // Get photo stats
      const { data: photoData, error: photoError } = await supabase
        .from('photo_stats')
        .select('*')
        .eq('student_id', studentId)
        .eq('url', photoUrl)
        .single();

      if (photoError && photoError.code !== 'PGRST116') {
        throw photoError;
      }

      // Check if user has liked this photo
      const { data: likeData, error: likeError } = await supabase
        .from('photo_likes')
        .select('id')
        .eq('photo_id', photoData?.id || photoId)
        .eq('session_id', sessionId)
        .single();

      if (likeError && likeError.code !== 'PGRST116') {
        console.warn('Error checking like status:', likeError);
      }

      setStats({
        id: photoData?.id || photoId,
        likeCount: photoData?.like_count || 0,
        downloadCount: photoData?.download_count || 0,
        isLiked: !!likeData
      });
    } catch (err) {
      console.error('Error loading photo stats:', err);
      setError('Failed to load photo statistics');
    } finally {
      setIsLoading(false);
    }
  };

  const ensurePhotoExists = async () => {
    const { data: existingPhoto } = await supabase
      .from('photos')
      .select('id')
      .eq('student_id', studentId)
      .eq('url', photoUrl)
      .single();

    if (!existingPhoto) {
      const filename = photoUrl.split('/').pop() || `student_${studentId}_photo.jpg`;
      await supabase
        .from('photos')
        .insert({
          student_id: studentId,
          student_name: `Student ${studentId}`,
          url: photoUrl,
          filename,
          alt_text: `Photo of Student ${studentId}`
        });
    }
  };

  const toggleLike = async () => {
    try {
      setIsLoading(true);
      setError(null);

      await ensurePhotoExists();

      // Get the photo ID
      const { data: photoData } = await supabase
        .from('photos')
        .select('id')
        .eq('student_id', studentId)
        .eq('url', photoUrl)
        .single();

      if (!photoData) {
        throw new Error('Photo not found');
      }

      if (stats.isLiked) {
        // Unlike
        const { error } = await supabase
          .from('photo_likes')
          .delete()
          .eq('photo_id', photoData.id)
          .eq('session_id', sessionId);

        if (error) throw error;

        setStats(prev => ({
          ...prev,
          likeCount: Math.max(0, prev.likeCount - 1),
          isLiked: false
        }));
      } else {
        // Like
        const { error } = await supabase
          .from('photo_likes')
          .insert({
            photo_id: photoData.id,
            session_id: sessionId
          });

        if (error) throw error;

        setStats(prev => ({
          ...prev,
          likeCount: prev.likeCount + 1,
          isLiked: true
        }));
      }
    } catch (err) {
      console.error('Error toggling like:', err);
      setError('Failed to update like status');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadPhoto = async () => {
    try {
      setIsLoading(true);
      setError(null);

      await ensurePhotoExists();

      // Get the photo ID
      const { data: photoData } = await supabase
        .from('photos')
        .select('id, filename')
        .eq('student_id', studentId)
        .eq('url', photoUrl)
        .single();

      if (!photoData) {
        throw new Error('Photo not found');
      }

      // Track the download
      await supabase
        .from('photo_downloads')
        .insert({
          photo_id: photoData.id,
          session_id: sessionId
        });

      // Download the image
      const response = await fetch(photoUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = photoData.filename || `student_${studentId}_photo.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Update download count
      setStats(prev => ({
        ...prev,
        downloadCount: prev.downloadCount + 1
      }));
    } catch (err) {
      console.error('Error downloading photo:', err);
      setError('Failed to download photo');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    stats,
    isLoading,
    error,
    toggleLike,
    downloadPhoto,
    refreshStats: loadPhotoStats
  };
};