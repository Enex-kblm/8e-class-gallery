import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Users, Image as ImageIcon } from 'lucide-react';
import { Student, GroupPhoto } from '../types';
import { StudentCard } from './StudentCard';
import { PhotoModal } from './PhotoModal';
import { GroupPhotoCarousel } from './GroupPhotoCarousel';
import { StudentHorizontalScroll } from './StudentHorizontalScroll';
import { SearchAndFilter } from './SearchAndFilter';
import { StudentStats } from './StudentStats';
import { DownloadModal } from './DownloadModal';
import { ShareModal } from './ShareModal';
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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  const filteredStudents = useMemo(() => {
    let filtered = students.filter(student =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (showFavoritesOnly) {
      filtered = filtered.filter(student => favorites.includes(student.id));
    }

    // Menampilkan siswa dalam urutan asli dari data (tidak ada sorting A-Z)
    return filtered;
  }, [students, searchQuery, favorites, showFavoritesOnly]);

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

  const handleDownload = (student: Student) => {
    setSelectedStudent(student);
    setDownloadModalOpen(true);
  };

  const handleShare = (student: Student, photoIndex: number = 0) => {
    setSelectedStudent(student);
    setCurrentPhotoIndex(photoIndex);
    setShareModalOpen(true);
  };

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
          </motion.div>
        </div>
      </div>

      {/* Search and Filter */}
      <SearchAndFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortOrder="asc"
        onSortChange={() => {}}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showFavoritesOnly={showFavoritesOnly}
        onToggleFavorites={() => setShowFavoritesOnly(!showFavoritesOnly)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <StudentStats students={students} favorites={favorites} />

        {/* Group Photos and Featured Students - only show when not searching */}
        {!searchQuery && !showFavoritesOnly && (
          <>
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
          </>
        )}

        {/* Students Grid/List */}
        {filteredStudents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-gray-400 mb-4">
              <Users size={48} className="mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              {showFavoritesOnly ? 'Belum ada favorit' : 'Tidak ada siswa yang ditemukan'}
            </h3>
            <p className="text-gray-500">
              {showFavoritesOnly 
                ? 'Tambahkan siswa ke favorit dengan menekan tombol ❤️'
                : 'Coba ubah kata kunci pencarian Anda'
              }
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6'
                : 'space-y-4'
            }
          >
            {filteredStudents.map((student, index) => (
              <StudentCard
                key={student.id}
                student={{ ...student, isFavorite: favorites.includes(student.id) }}
                index={index}
                onClick={() => handleStudentClick(student)}
                onToggleFavorite={() => toggleFavorite(student.id)}
                onDownload={() => handleDownload(student)}
                onShare={(photoIndex) => handleShare(student, photoIndex)}
                viewMode={viewMode}
              />
            ))}
          </motion.div>
        )}

        {(searchQuery || showFavoritesOnly) && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-500 mt-8"
          >
            Menampilkan {filteredStudents.length} dari {students.length} siswa
          </motion.p>
        )}
      </div>

      {/* Modals */}
      <PhotoModal
        isOpen={selectedStudent !== null && !downloadModalOpen && !shareModalOpen}
        onClose={handleCloseModal}
        photos={selectedStudent?.photos || []}
        currentIndex={currentPhotoIndex}
        studentName={selectedStudent?.name || ''}
        onPrevious={handlePreviousPhoto}
        onNext={handleNextPhoto}
        onDownload={() => setDownloadModalOpen(true)}
        onShare={() => setShareModalOpen(true)}
      />

      <DownloadModal
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
        student={selectedStudent}
      />

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        student={selectedStudent}
        photoIndex={currentPhotoIndex}
      />
    </div>
  );
};