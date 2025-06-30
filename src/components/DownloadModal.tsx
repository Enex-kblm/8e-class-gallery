import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Check, Image as ImageIcon } from 'lucide-react';
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

  const handleDownload = async () => {
    if (!student || selectedPhotos.length === 0) return;
    
    setIsDownloading(true);
    
    // Simulate download process
    for (const photoIndex of selectedPhotos) {
      const photoUrl = student.photos[photoIndex];
      const link = document.createElement('a');
      link.href = photoUrl;
      link.download = `${student.name}_photo_${photoIndex + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Small delay between downloads
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setIsDownloading(false);
    onClose();
  };

  if (!student) return null;

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
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
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
                    }`}
                    onClick={() => togglePhotoSelection(index)}
                  >
                    <img
                      src={photo}
                      alt={`${student.name} - Photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {selectedPhotos.includes(index) && (
                      <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                        <div className="bg-blue-500 rounded-full p-1">
                          <Check size={16} className="text-white" />
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-1 right-1 bg-black/50 text-white text-xs px-1 rounded">
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t bg-gray-50">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <ImageIcon size={16} />
                <span>{selectedPhotos.length} foto akan didownload</span>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-700 font-medium"
                >
                  Batal
                </button>
                <button
                  onClick={handleDownload}
                  disabled={selectedPhotos.length === 0 || isDownloading}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors"
                >
                  <Download size={16} />
                  <span>{isDownloading ? 'Downloading...' : 'Download'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};