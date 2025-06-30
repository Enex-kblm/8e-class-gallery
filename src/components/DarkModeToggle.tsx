import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export const DarkModeToggle: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <motion.button
      onClick={toggleDarkMode}
      className={`relative p-2 rounded-lg transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' 
          : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      <motion.div
        initial={false}
        animate={{ 
          rotate: isDarkMode ? 180 : 0,
          scale: isDarkMode ? 0.8 : 1
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {isDarkMode ? (
          <Moon size={20} className="text-blue-400" />
        ) : (
          <Sun size={20} className="text-yellow-500" />
        )}
      </motion.div>
      
      {/* Subtle glow effect */}
      <motion.div
        className={`absolute inset-0 rounded-lg ${
          isDarkMode ? 'bg-blue-400/20' : 'bg-yellow-400/20'
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: isDarkMode ? 0.3 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
};