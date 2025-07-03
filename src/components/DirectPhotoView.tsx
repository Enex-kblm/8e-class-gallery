import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Share2, 
  Home,
  User,
  Calendar,
  Image as ImageIcon,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { Student } from '../types';
import { LazyImage } from './LazyImage';

interface DirectPhotoViewProps {
  student: Student | null;
  photoIndex: number;
  onClose: () => void;
  onNavigateToGallery: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

export const DirectPhotoView: React.FC<DirectPhotoViewProps> = ({
  student,
  photoIndex,
  onClose,
  onNavigateToGallery,
  onPrevious,
  onNext,
}) => {
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          if (isFullscreen) {
            setIsFullscreen(false);
          } else {
            onClose();
          }
          break;
        case 'ArrowLeft':
          if (student && student.photos.length > 1) {
            onPrevious();
          }
          break;
        case 'ArrowRight':
          if (student && student.photos.length > 1) {
            onNext();
          }
          break;
        case 'f':
        case 'F':
          setIsFullscreen(!isFullscreen);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [student, onClose, onPrevious, onNext, isFullscreen]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  const downloadImage = async () => {
    if (!student || !student.photos[photoIndex]) return;

    try {
      const response = await fetch(student.photos[photoIndex]);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${student.name.replace(/\s+/g, '_')}_photo_${photoIndex + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback: open in new tab
      window.open(student.photos[photoIndex], '_blank');
    }
  };

  const sharePhoto = async () => {
    if (!student) return;

    const shareData = {
      title: `Foto ${student.name} - Galeri Kelas 8E`,
      text: `Lihat foto ${student.name} di Galeri Kelas 8E`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await copyToClipboard();
      }
    } catch (error) {
      console.error('Share failed:', error);
      await copyToClipboard();
    }
  };

  if (!student) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-500 rounded-full flex items-center justify-center">
            <User size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-2">Foto Tidak Ditemukan</h2>
          <p className="text-gray-300 mb-6">Siswa atau foto yang Anda cari tidak tersedia.</p>
          <button
            onClick={onNavigateToGallery}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            <Home size={20} />
            <span>Kembali ke Galeri</span>
          </button>
        </div>
      </div>
    );
  }

  const currentPhoto = student.photos[photoIndex];
  if (!currentPhoto) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 mx-auto mb-4 bg-yellow-500 rounded-full flex items-center justify-center">
            <ImageIcon size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-2">Foto Tidak Tersedia</h2>
          <p className="text-gray-300 mb-6">Foto yang Anda cari tidak ditemukan untuk siswa ini.</p>
          <button
            onClick={onNavigateToGallery}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            <Home size={20} />
            <span>Kembali ke Galeri</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-900 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/70 to-transparent">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={onNavigateToGallery}
              className="p-2 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-lg text-white transition-colors"
              title="Kembali ke Galeri"
            >
              <Home size={20} />
            </button>
            
            <div className="text-white">
              <h1 className="text-lg font-semibold">{student.name}</h1>
              <p className="text-sm text-gray-300">
                Foto {photoIndex + 1} dari {student.photos.length} • Absen #{student.id}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={copyToClipboard}
              className="p-2 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-lg text-white transition-colors"
              title="Salin Link"
            >
              {copied ? <Check size={20} /> : <Copy size={20} />}
            </button>
            
            <button
              onClick={sharePhoto}
              className="p-2 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-lg text-white transition-colors"
              title="Bagikan"
            >
              <Share2 size={20} />
            </button>
            
            <button
              onClick={downloadImage}
              className="p-2 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-lg text-white transition-colors"
              title="Download"
            >
              <Download size={20} />
            </button>
            
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-lg text-white transition-colors"
              title={isFullscreen ? "Keluar Fullscreen" : "Fullscreen"}
            >
              <ExternalLink size={20} />
            </button>
            
            <button
              onClick={onClose}
              className="p-2 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-lg text-white transition-colors"
              title="Tutup"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Photo */}
      <div className="relative h-screen flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={photoIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="relative max-w-full max-h-full"
          >
            <img
              src={currentPhoto}
              alt={`${student.name} - Photo ${photoIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              onClick={() => setIsFullscreen(!isFullscreen)}
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {student.photos.length > 1 && (
          <>
            <button
              onClick={onPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full text-white transition-colors"
              title="Foto Sebelumnya"
            >
              <ChevronLeft size={24} />
            </button>
            
            <button
              onClick={onNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full text-white transition-colors"
              title="Foto Selanjutnya"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </div>

      {/* Bottom Info */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent">
        <div className="p-4">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <Calendar size={16} />
                <span>Galeri Kelas 8E</span>
              </div>
              
              {copied && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="text-sm text-green-400"
                >
                  ✓ Link disalin!
                </motion.div>
              )}
            </div>

            <div className="text-sm text-gray-300">
              Tekan F untuk fullscreen • ESC untuk keluar
            </div>
          </div>

          {/* Thumbnail Navigation */}
          {student.photos.length > 1 && (
            <div className="mt-4 flex justify-center">
              <div className="flex space-x-2 overflow-x-auto max-w-full">
                {student.photos.map((photo, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      // This would be handled by parent component
                      const event = new CustomEvent('photoChange', { detail: index });
                      window.dispatchEvent(event);
                    }}
                    className={`flex-shrink-0 w-12 h-12 rounded overflow-hidden border-2 transition-colors ${
                      index === photoIndex 
                        ? 'border-white' 
                        : 'border-gray-500 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={photo}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};