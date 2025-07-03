import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Copy, Check, Facebook, Twitter, MessageCircle, ExternalLink } from 'lucide-react';
import { Student } from '../types';
import { useUrlParams } from '../hooks/useUrlParams';

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
  const [copiedDirect, setCopiedDirect] = useState(false);
  const { generateShareUrl } = useUrlParams();

  if (!student) return null;

  const shareUrl = generateShareUrl(student.id, photoIndex, false);
  const directShareUrl = generateShareUrl(student.id, photoIndex, true);
  const shareText = `Lihat foto ${student.name} di Galeri Kelas 8E`;

  const copyToClipboard = async (url: string, isDirect: boolean = false) => {
    try {
      await navigator.clipboard.writeText(url);
      if (isDirect) {
        setCopiedDirect(true);
        setTimeout(() => setCopiedDirect(false), 2000);
      } else {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const shareOptions = [
    {
      name: 'WhatsApp',
      icon: <MessageCircle size={20} />,
      color: 'bg-green-500 hover:bg-green-600',
      url: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + directShareUrl)}`,
    },
    {
      name: 'Facebook',
      icon: <Facebook size={20} />,
      color: 'bg-blue-600 hover:bg-blue-700',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(directShareUrl)}`,
    },
    {
      name: 'Twitter',
      icon: <Twitter size={20} />,
      color: 'bg-sky-500 hover:bg-sky-600',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(directShareUrl)}`,
    },
  ];

  const handleShare = (url: string) => {
    window.open(url, '_blank', 'width=600,height=400');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Foto ${student.name} - Galeri Kelas 8E`,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.error('Native share failed:', err);
        await copyToClipboard(shareUrl);
      }
    } else {
      await copyToClipboard(shareUrl);
    }
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
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <Share2 size={20} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Bagikan Foto</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{student.name}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500 dark:text-gray-400" />
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
                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                  Foto {photoIndex + 1} dari {student.photos.length}
                </p>
              </div>

              {/* Quick Share */}
              <div className="mb-6">
                <button
                  onClick={handleNativeShare}
                  className="w-full flex items-center justify-center space-x-2 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  <Share2 size={18} />
                  <span>Bagikan Sekarang</span>
                </button>
              </div>

              {/* Share Options */}
              <div className="space-y-3 mb-6">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Bagikan ke platform:</p>
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

              {/* Direct Link */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Direct link:</p>
                  <div className="flex items-center space-x-1 text-xs text-blue-600 dark:text-blue-400">
                    <ExternalLink size={12} />
                    <span>Direct</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={directShareUrl}
                    readOnly
                    className="flex-1 p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-white"
                  />
                  <button
                    onClick={() => copyToClipboard(directShareUrl, true)}
                    className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                      copiedDirect
                        ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300'
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {copiedDirect ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
                {copiedDirect && (
                  <p className="text-sm text-green-600 dark:text-green-400">✓ Link langsung disalin!</p>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};