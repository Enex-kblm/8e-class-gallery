import { useState, useEffect } from 'react';

export interface PhotoStats {
  id: string;
  likeCount: number;
  downloadCount: number;
  isLiked: boolean;
}

// Generate a unique session ID for the user
const getSessionId = (): string => {
  let sessionId = localStorage.getItem('gallery_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('gallery_session_id', sessionId);
  }
  return sessionId;
};

// Get photo data from localStorage
const getPhotoData = (photoId: string) => {
  const data = localStorage.getItem('photo_interactions');
  const allData = data ? JSON.parse(data) : {};
  return allData[photoId] || { likes: 0, downloads: 0, likedBy: [] };
};

// Save photo data to localStorage
const savePhotoData = (photoId: string, photoData: any) => {
  const data = localStorage.getItem('photo_interactions');
  const allData = data ? JSON.parse(data) : {};
  allData[photoId] = photoData;
  localStorage.setItem('photo_interactions', JSON.stringify(allData));
};

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

  const loadPhotoStats = () => {
    try {
      const photoData = getPhotoData(photoId);
      setStats({
        id: photoId,
        likeCount: photoData.likes,
        downloadCount: photoData.downloads,
        isLiked: photoData.likedBy.includes(sessionId)
      });
    } catch (err) {
      console.error('Error loading photo stats:', err);
      setError('Failed to load photo statistics');
    }
  };

  const toggleLike = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const photoData = getPhotoData(photoId);
      const isCurrentlyLiked = photoData.likedBy.includes(sessionId);

      if (isCurrentlyLiked) {
        // Unlike
        photoData.likes = Math.max(0, photoData.likes - 1);
        photoData.likedBy = photoData.likedBy.filter((id: string) => id !== sessionId);
      } else {
        // Like
        photoData.likes += 1;
        photoData.likedBy.push(sessionId);
      }

      savePhotoData(photoId, photoData);

      setStats(prev => ({
        ...prev,
        likeCount: photoData.likes,
        isLiked: !isCurrentlyLiked
      }));

      // Simulate network delay for better UX
      await new Promise(resolve => setTimeout(resolve, 200));
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

      // Track the download
      const photoData = getPhotoData(photoId);
      photoData.downloads += 1;
      savePhotoData(photoId, photoData);

      // Download the image
      const response = await fetch(photoUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const filename = photoUrl.split('/').pop() || `student_${studentId}_photo.jpg`;
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Update download count
      setStats(prev => ({
        ...prev,
        downloadCount: photoData.downloads
      }));

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
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