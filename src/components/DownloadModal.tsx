import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Check, Image as ImageIcon, AlertCircle, ExternalLink } from 'lucide-react';
import { Student } from '../types';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({
  isOpen,
  onClose,
  student,
}) => {
  const [selectedPhotos, setSelectedPhotos] = useState<number[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<{[key: number]: 'pending' | 'downloading' | 'success' | 'error'}>({});

  const togglePhotoSelection = (index: number) => {
    setSelectedPhotos(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const selectAllPhotos = () => {
    if (!student) return;
    setSelectedPhotos(
      selectedPhotos.length === student.photos.length
        ? []
        : student.photos.map((_, index) => index)
    );
  };

  const downloadImage = async (url: string, filename: string): Promise<boolean> => {
    try {
      // Method 1: Try direct download with proper CORS handling
      try {
        const response = await fetch(url, {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Accept': 'image/*',
          },
        });

        if (response.ok) {
          const blob = await response.blob();
          const downloadLink = document.createElement('a');
          const objectUrl = URL.createObjectURL(blob);
          
          downloadLink.href = objectUrl;
          downloadLink.download = filename;
          downloadLink.style.display = 'none';
          
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
          
          setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
          return true;
        }
      } catch (corsError) {
        console.log('CORS method failed, trying alternative...');
      }

      // Method 2: Fallback - Open in new tab with download attribute
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      // Add download attribute and trigger click
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return true;
    } catch (error) {
      console.error('Download failed:', error);
      return false;
    }
  };

  const getFileExtension = (url: string): string => {
    const match = url.match(/\.(jpg|jpeg|png|gif|webp)(\?|$)/i);
    return match ? match[1].toLowerCase() : 'jpg';
  };

  const sanitizeFilename = (name: string): string => {
    return name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  };

  const handleDownload = async () => {
    if (!student || selectedPhotos.length === 0) return;
    
    setIsDownloading(true);
    const newProgress: {[key: number]: 'pending' | 'downloading' | 'success' | 'error'} = {};
    
    // Initialize progress for selected photos
    selectedPhotos.forEach(index => {
      newProgress[index] = 'pending';
    });
    setDownloadProgress(newProgress);
    
    let successCount = 0;
    
    // Download each selected photo
    for (const photoIndex of selectedPhotos) {
      const photoUrl = student.photos[photoIndex];
      const fileExtension = getFileExtension(photoUrl);
      const sanitizedName = sanitizeFilename(student.name);
      const filename = `${sanitizedName}_photo_${photoIndex + 1}.${fileExtension}`;
      
      // Update progress to downloading
      setDownloadProgress(prev => ({
        ...prev,
        [photoIndex]: 'downloading'
      }));
      
      const success = await downloadImage(photoUrl, filename);
      
      if (success) {
        successCount++;
      }
      
      // Update progress based on result
      setDownloadProgress(prev => ({
        ...prev,
        [photoIndex]: success ? 'success' : 'error'
      }));
      
      // Small delay between downloads
      if (photoIndex !== selectedPhotos[selectedPhotos.length - 1]) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    setIsDownloading(false);
    
    // Show completion message
    if (successCount === selectedPhotos.length) {
      // All successful
      setTimeout(() => {
        onClose();
        setDownloadProgress({});
      }, 1500);
    } else if (successCount > 0) {
      // Partial success
      setTimeout(() => {
        setDownloadProgress({});
      }, 3000);
    }
  };

  const handleDirectDownload = () => {
    if (!student || selectedPhotos.length === 0) return;
    
    // Open each selected photo in new tab for manual download
    selectedPhotos.forEach((photoIndex) => {
      const photoUrl = student.photos[photoIndex];
      window.open(photoUrl, '_blank');
    });
    
    onClose();
  };

  const getProgressIcon = (status: 'pending' | 'downloading' | 'success' | 'error') => {
    switch (status) {
      case 'downloading':
        return <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full" />;
      case 'success':
        return <Check size={16} className="text-green-500" />;
      case 'error':
        return <AlertCircle size={16} className="text-red-500" />;
      default:
        return null;
    }
  };

  if (!student) return null;

  const hasErrors = Object.values(downloadProgress).some(status => status === 'error');
  const successCount = Object.values(downloadProgress).filter(status => status === 'success').length;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Download Foto - {student.name}
                </h3>
                <p className="text-sm text-gray-600">
                  Pilih foto yang ingin didownload
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={isDownloading}
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Controls */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={selectAllPhotos}
                  disabled={isDownloading}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium disabled:text-gray-400"
                >
                  {selectedPhotos.length === student.photos.length ? 'Deselect All' : 'Select All'}
                </button>
                <span className="text-sm text-gray-600">
                  {selectedPhotos.length} dari {student.photos.length} foto dipilih
                </span>
              </div>

              {/* Photo Grid */}
              <div className="grid grid-cols-3 gap-3 max-h-60 overflow-y-auto">
                {student.photos.map((photo, index) => (
                  <div
                    key={index}
                    className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                      selectedPhotos.includes(index)
                        ? 'border-blue-500 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${isDownloading ? 'pointer-events-none' : ''}`}
                    onClick={() => !isDownloading && togglePhotoSelection(index)}
                  >
                    <img
                      src={photo}
                      alt={`${student.name} - Photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Selection indicator */}
                    {selectedPhotos.includes(index) && (
                      <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                        <div className="bg-blue-500 rounded-full p-1">
                          <Check size={16} className="text-white" />
                        </div>
                      </div>
                    )}
                    
                    {/* Download progress indicator */}
                    {downloadProgress[index] && (
                      <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md">
                        {getProgressIcon(downloadProgress[index])}
                      </div>
                    )}
                    
                    <div className="absolute bottom-1 right-1 bg-black/50 text-white text-xs px-1 rounded">
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>

              {/* Download Progress */}
              {isDownloading && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2 text-sm text-blue-700">
                    <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full" />
                    <span>Mengunduh foto... Mohon tunggu</span>
                  </div>
                  <div className="mt-2 text-xs text-blue-600">
                    {successCount} dari {selectedPhotos.length} foto berhasil diunduh
                  </div>
                </div>
              )}

              {/* Error Message */}
              {hasErrors && !isDownloading && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertCircle size={16} className="text-yellow-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="text-yellow-800 font-medium">Beberapa foto gagal diunduh</p>
                      <p className="text-yellow-700 mt-1">
                        Coba gunakan tombol "Buka di Tab Baru" untuk download manual
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t bg-gray-50">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <ImageIcon size={16} />
                <span>{selectedPhotos.length} foto dipilih</span>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleDirectDownload}
                  disabled={selectedPhotos.length === 0 || isDownloading}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors"
                >
                  <ExternalLink size={16} />
                  <span>Buka di Tab Baru</span>
                </button>
                
                <button
                  onClick={onClose}
                  disabled={isDownloading}
                  className="px-4 py-2 text-gray-600 hover:text-gray-700 font-medium disabled:text-gray-400"
                >
                  {isDownloading ? 'Mengunduh...' : 'Batal'}
                </button>
                
                <button
                  onClick={handleDownload}
                  disabled={selectedPhotos.length === 0 || isDownloading}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors"
                >
                  <Download size={16} />
                  <span>
                    {isDownloading 
                      ? `Downloading... (${successCount}/${selectedPhotos.length})`
                      : 'Download'
                    }
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};