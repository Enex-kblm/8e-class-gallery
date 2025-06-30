import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Copy, Check, Facebook, Twitter, Instagram, MessageCircle } from 'lucide-react';
import { Student } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  photoIndex?: number;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  student,
  photoIndex = 0,
}) => {
  const [copied, setCopied] = useState(false);

  if (!student) return null;

  const shareUrl = `${window.location.origin}?student=${student.id}&photo=${photoIndex}`;
  const shareText = `Lihat foto ${student.name} di Galeri Kelas 8E`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const shareOptions = [
    {
      name: 'WhatsApp',
      icon: <MessageCircle size={20} />,
      color: 'bg-green-500 hover:bg-green-600',
      url: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
    },
    {
      name: 'Facebook',
      icon: <Facebook size={20} />,
      color: 'bg-blue-600 hover:bg-blue-700',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: 'Twitter',
      icon: <Twitter size={20} />,
      color: 'bg-sky-500 hover:bg-sky-600',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    },
  ];

  const handleShare = (url: string) => {
    window.open(url, '_blank', 'width=600,height=400');
  };

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
            className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Share2 size={20} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Bagikan Foto</h3>
                  <p className="text-sm text-gray-600">{student.name}</p>
                </div>
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
              {/* Preview */}
              <div className="mb-6">
                <div className="aspect-square w-24 h-24 mx-auto rounded-lg overflow-hidden mb-3">
                  <img
                    src={student.photos[photoIndex]}
                    alt={student.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-center text-sm text-gray-600">
                  Foto {photoIndex + 1} dari {student.photos.length}
                </p>
              </div>

              {/* Share Options */}
              <div className="space-y-3 mb-6">
                <p className="text-sm font-medium text-gray-700">Bagikan ke:</p>
                <div className="grid grid-cols-3 gap-3">
                  {shareOptions.map((option) => (
                    <button
                      key={option.name}
                      onClick={() => handleShare(option.url)}
                      className={`flex flex-col items-center space-y-2 p-4 rounded-lg text-white transition-colors ${option.color}`}
                    >
                      {option.icon}
                      <span className="text-xs font-medium">{option.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Copy Link */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700">Atau salin link:</p>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 p-3 border border-gray-200 rounded-lg bg-gray-50 text-sm"
                  />
                  <button
                    onClick={copyToClipboard}
                    className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                      copied
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
                {copied && (
                  <p className="text-sm text-green-600">Link berhasil disalin!</p>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};