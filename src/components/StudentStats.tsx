import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Image as ImageIcon, 
  Heart, 
  Camera, 
  ChevronDown, 
  ChevronUp,
  TrendingUp,
  Award,
  Calendar,
  Target
} from 'lucide-react';
import { Student } from '../types';

interface StudentStatsProps {
  students: Student[];
  favorites: number[];
}

export const StudentStats: React.FC<StudentStatsProps> = ({ students, favorites }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const totalPhotos = students.reduce((total, student) => total + student.photos.length, 0);
  const studentsWithPhotos = students.filter(student => 
    student.photos.length > 0 && !student.photos[0].includes('catbox.moe')
  ).length;
  const completionRate = Math.round((studentsWithPhotos / students.length) * 100);
  const averagePhotosPerStudent = Math.round(totalPhotos / students.length);
  
  // Calculate additional metrics
  const studentsWithMultiplePhotos = students.filter(student => 
    student.photos.length > 1 && !student.photos[0].includes('catbox.moe')
  ).length;
  const multiplePhotosRate = Math.round((studentsWithMultiplePhotos / students.length) * 100);
  const favoriteRate = Math.round((favorites.length / students.length) * 100);

  const primaryStats = [
    {
      icon: <Users size={24} />,
      label: 'Total Siswa',
      value: students.length,
      color: 'bg-blue-500 dark:bg-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-700 dark:text-blue-300',
      description: 'Jumlah total siswa kelas 8E'
    },
    {
      icon: <ImageIcon size={24} />,
      label: 'Total Foto',
      value: totalPhotos,
      color: 'bg-green-500 dark:bg-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-700 dark:text-green-300',
      description: 'Total foto yang tersedia'
    },
    {
      icon: <Heart size={24} />,
      label: 'Favorit',
      value: favorites.length,
      color: 'bg-red-500 dark:bg-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      textColor: 'text-red-700 dark:text-red-300',
      description: 'Siswa yang ditandai favorit'
    },
    {
      icon: <Camera size={24} />,
      label: 'Kelengkapan',
      value: `${completionRate}%`,
      color: 'bg-purple-500 dark:bg-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-700 dark:text-purple-300',
      description: 'Persentase siswa dengan foto'
    },
  ];

  const detailedStats = [
    {
      icon: <TrendingUp size={20} />,
      label: 'Rata-rata Foto',
      value: `${averagePhotosPerStudent} foto`,
      color: 'bg-indigo-500 dark:bg-indigo-600',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
      textColor: 'text-indigo-700 dark:text-indigo-300',
      description: 'Rata-rata foto per siswa'
    },
    {
      icon: <Award size={20} />,
      label: 'Multi Foto',
      value: `${multiplePhotosRate}%`,
      color: 'bg-orange-500 dark:bg-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      textColor: 'text-orange-700 dark:text-orange-300',
      description: 'Siswa dengan lebih dari 1 foto'
    },
    {
      icon: <Target size={20} />,
      label: 'Tingkat Favorit',
      value: `${favoriteRate}%`,
      color: 'bg-pink-500 dark:bg-pink-600',
      bgColor: 'bg-pink-50 dark:bg-pink-900/20',
      textColor: 'text-pink-700 dark:text-pink-300',
      description: 'Persentase siswa favorit'
    },
    {
      icon: <Calendar size={20} />,
      label: 'Status Koleksi',
      value: studentsWithPhotos > 20 ? 'Lengkap' : 'Berkembang',
      color: 'bg-teal-500 dark:bg-teal-600',
      bgColor: 'bg-teal-50 dark:bg-teal-900/20',
      textColor: 'text-teal-700 dark:text-teal-300',
      description: 'Status kelengkapan koleksi'
    },
  ];

  const toggleExpanded = () => {
    setIsExpanded(prev => !prev);
  };

  return (
    <div className="mb-8">
      {/* Toggle Button */}
      <motion.button
        onClick={toggleExpanded}
        className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-700 transition-all duration-200 group"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        aria-expanded={isExpanded}
        aria-controls="student-stats-content"
        aria-label={isExpanded ? "Tutup statistik siswa" : "Buka statistik siswa"}
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg text-white shadow-sm">
            <Users size={20} />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Statistik Siswa
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isExpanded ? 'Klik untuk menyembunyikan detail' : 'Klik untuk melihat detail statistik'}
            </p>
          </div>
        </div>
        
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-colors"
        >
          <ChevronDown size={20} className="text-gray-600 dark:text-gray-300" />
        </motion.div>
      </motion.button>

      {/* Stats Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            id="student-stats-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ 
              duration: 0.4, 
              ease: "easeInOut",
              opacity: { duration: 0.3 }
            }}
            className="overflow-hidden"
          >
            <div className="pt-4 space-y-6">
              {/* Primary Stats */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                {primaryStats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 + (index * 0.05), duration: 0.3 }}
                    className={`${stat.bgColor} rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 transition-all duration-300 hover:shadow-md group cursor-default`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`${stat.color} p-2 rounded-lg text-white shadow-sm group-hover:shadow-md transition-shadow`}>
                        {stat.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white truncate">
                          {stat.value}
                        </p>
                        <p className={`text-sm ${stat.textColor} font-medium truncate`}>
                          {stat.label}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
                      {stat.description}
                    </p>
                  </motion.div>
                ))}
              </motion.div>

              {/* Detailed Stats */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="flex items-center space-x-2 mb-4">
                  <TrendingUp size={20} className="text-gray-600 dark:text-gray-300" />
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Analisis Detail
                  </h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {detailedStats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 + (index * 0.05), duration: 0.3 }}
                      className={`${stat.bgColor} rounded-lg p-4 transition-all duration-200 hover:shadow-sm group cursor-default`}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`${stat.color} p-1.5 rounded text-white`}>
                          {stat.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-lg font-bold text-gray-900 dark:text-white truncate">
                            {stat.value}
                          </p>
                        </div>
                      </div>
                      <p className={`text-sm ${stat.textColor} font-medium mb-1`}>
                        {stat.label}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                        {stat.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Progress Indicators */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
              >
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                  <Target size={20} className="text-blue-600 dark:text-blue-400" />
                  <span>Progress Koleksi</span>
                </h4>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Kelengkapan Foto
                      </span>
                      <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                        {completionRate}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <motion.div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${completionRate}%` }}
                        transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Siswa dengan Multi Foto
                      </span>
                      <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                        {multiplePhotosRate}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <motion.div
                        className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${multiplePhotosRate}%` }}
                        transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};