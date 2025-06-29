import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Users, Image as ImageIcon } from 'lucide-react';
import { Student, GroupPhoto } from '../types';
import { StudentCard } from './StudentCard';
import { PhotoModal } from './PhotoModal';
import { GroupPhotoCarousel } from './GroupPhotoCarousel';
import { StudentHorizontalScroll } from './StudentHorizontalScroll';
import { PhotoStatsDisplay } from './PhotoStatsDisplay';
import featuredStudentsData from '../data/featuredStudents.json';

interface GalleryProps {
  students: Student[];
  groupPhotos: GroupPhoto[];
}

export const Gallery: React.FC<GalleryProps> = ({ students, groupPhotos }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [favorites, setFavorites] = useState<number[]>(() => {
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  const filteredStudents = useMemo(() => {
    return students.filter(student =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [students, searchQuery]);

  const handleStudentClick = (student: Student) => {
    setSelectedStudent(student);
    setCurrentPhotoIndex(0);
  };

  const handleCloseModal = () => {
    setSelectedStudent(null);
    setCurrentPhotoIndex(0);
  };

  const handlePreviousPhoto = () => {
    if (selectedStudent) {
      setCurrentPhotoIndex(prev =>
        prev === 0 ? selectedStudent.photos.length - 1 : prev - 1
      );
    }
  };

  const handleNextPhoto = () => {
    if (selectedStudent) {
      setCurrentPhotoIndex(prev =>
        prev === selectedStudent.photos.length - 1 ? 0 : prev + 1
      );
    }
  };

  const toggleFavorite = (studentId: number) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId];

      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const totalPhotos = students.reduce((total, student) => total + student.photos.length, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Galeri Kelas 8E</h1>
            <p className="text-lg text-gray-600 mb-6">
              Jelajahi kenangan dari siswa-siswi kami yang luar biasa
            </p>

            <div className="flex justify-center space-x-8 mb-6">
              <div className="flex items-center space-x-2 text-gray-600">
                <Users size={20} />
                <span className="font-medium">{students.length} Siswa</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <ImageIcon size={20} />
                <span className="font-medium">{totalPhotos} Foto</span>
              </div>
            </div>

            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Telusuri siswa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {!searchQuery && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Statistics Display */}
          <div className="mb-8">
            <PhotoStatsDisplay className="max-w-sm mx-auto" />
          </div>

          {groupPhotos.map(group => (
            <GroupPhotoCarousel
              key={group.id}
              photos={group.photos}
            />
          ))}

          <StudentHorizontalScroll
            students={featuredStudentsData.featuredStudents}
            onStudentClick={handleStudentClick}
          />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredStudents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-gray-400 mb-4">
              <Users size={48} className="mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-600 mb-2">Tidak ada siswa yang ditemukan</h3>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6"
          >
            {filteredStudents.map((student, index) => (
              <StudentCard
                key={student.id}
                student={{ ...student, isFavorite: favorites.includes(student.id) }}
                index={index}
                onClick={() => handleStudentClick(student)}
                onToggleFavorite={() => toggleFavorite(student.id)}
              />
            ))}
          </motion.div>
        )}

        {searchQuery && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-500 mt-8"
          >
            Showing {filteredStudents.length} of {students.length} students
          </p>
        )}
      </div>

      <PhotoModal
        isOpen={selectedStudent !== null}
        onClose={handleCloseModal}
        photos={selectedStudent?.photos || []}
        currentIndex={currentPhotoIndex}
        studentName={selectedStudent?.name || ''}
        studentId={selectedStudent?.id || 0}
        onPrevious={handlePreviousPhoto}
        onNext={handleNextPhoto}
      />
    </div>
  );
};