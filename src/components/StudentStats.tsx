import React from 'react';
import { motion } from 'framer-motion';
import { Users, Image as ImageIcon, Heart, Camera } from 'lucide-react';
import { Student } from '../types';

interface StudentStatsProps {
  students: Student[];
  favorites: number[];
}

export const StudentStats: React.FC<StudentStatsProps> = ({ students, favorites }) => {
  const totalPhotos = students.reduce((total, student) => total + student.photos.length, 0);
  const studentsWithPhotos = students.filter(student => 
    student.photos.length > 0 && !student.photos[0].includes('catbox.moe')
  ).length;
  const completionRate = Math.round((studentsWithPhotos / students.length) * 100);

  const stats = [
    {
      icon: <Users size={24} />,
      label: 'Total Siswa',
      value: students.length,
      color: 'bg-blue-500',
    },
    {
      icon: <ImageIcon size={24} />,
      label: 'Total Foto',
      value: totalPhotos,
      color: 'bg-green-500',
    },
    {
      icon: <Heart size={24} />,
      label: 'Favorit',
      value: favorites.length,
      color: 'bg-red-500',
    },
    {
      icon: <Camera size={24} />,
      label: 'Kelengkapan',
      value: `${completionRate}%`,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
        >
          <div className="flex items-center space-x-3">
            <div className={`${stat.color} p-2 rounded-lg text-white`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};