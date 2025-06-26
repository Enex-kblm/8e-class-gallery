import React from 'react';
import { motion } from 'framer-motion';
import { Camera, User, Home } from 'lucide-react';

interface NavigationProps {
  currentPage: 'gallery' | 'developer';
  onPageChange: (page: 'gallery' | 'developer') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentPage, onPageChange }) => {
  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Camera size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">8E Gallery</span>
          </motion.div>

          {/* Navigation Links */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex space-x-1"
          >
            <button
              onClick={() => onPageChange('gallery')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                currentPage === 'gallery'
                  ? 'bg-blue-100 text-blue-700 font-medium'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Home size={18} />
              <span>Gallery</span>
            </button>
            
            <button
              onClick={() => onPageChange('developer')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                currentPage === 'developer'
                  ? 'bg-purple-100 text-purple-700 font-medium'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <User size={18} />
              <span>Developer</span>
            </button>
          </motion.div>
        </div>
      </div>
    </nav>
  );
};