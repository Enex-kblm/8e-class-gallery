import React from 'react';
import { motion } from 'framer-motion';
import { Camera, User, Home } from 'lucide-react';
import { DarkModeToggle } from './DarkModeToggle';

interface NavigationProps {
  currentPage: 'gallery' | 'developer';
  onPageChange: (page: 'gallery' | 'developer') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentPage, onPageChange }) => {
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 transition-colors duration-300">
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
            <span className="text-xl font-bold text-gray-900 dark:text-white">8E Gallery</span>
          </motion.div>

          {/* Navigation Links & Controls */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            {/* Navigation Buttons */}
            <div className="flex space-x-1">
              <button
                onClick={() => onPageChange('gallery')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  currentPage === 'gallery'
                    ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-medium'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Home size={18} />
                <span>Gallery</span>
              </button>
              
              <button
                onClick={() => onPageChange('developer')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  currentPage === 'developer'
                    ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 font-medium'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <User size={18} />
                <span>Developer</span>
              </button>
            </div>

            {/* Dark Mode Toggle */}
            <DarkModeToggle />
          </motion.div>
        </div>
      </div>
    </nav>
  );
};