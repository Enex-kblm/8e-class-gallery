// src/App.tsx
import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Gallery } from './components/Gallery';
import { DeveloperInfo } from './components/DeveloperInfo';
import { DirectPhotoView } from './components/DirectPhotoView';
import { ThemeProvider } from './contexts/ThemeContext';
import { useUrlParams } from './hooks/useUrlParams';
import studentsData from './data/students.json';
import groupPhotosData from './data/groupPhotos.json';

function App() {
  const [currentPage, setCurrentPage] = useState<'gallery' | 'developer'>('gallery');
  const [students, setStudents] = useState<Student[]>([]);
  const [groupPhotos, setGroupPhotos] = useState<GroupPhoto[]>([]);
  const [showDirectView, setShowDirectView] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  
  const { params, clearParams, updateUrl } = useUrlParams();

  useEffect(() => {
    setStudents(studentsData.students);
    setGroupPhotos(groupPhotosData);
  }, []);

  useEffect(() => {
    // Handle URL parameters for direct photo viewing
    if (params.studentId && params.photoIndex !== undefined) {
      const student = students.find(s => s.id === params.studentId);
      if (student && student.photos[params.photoIndex]) {
        setSelectedStudent(student);
        setCurrentPhotoIndex(params.photoIndex);
        
        if (params.isDirectView) {
          setShowDirectView(true);
          setCurrentPage('gallery'); // Ensure we're on gallery page
        }
      }
    }
  }, [params, students]);

  useEffect(() => {
    // Listen for photo change events from DirectPhotoView
    const handlePhotoChange = (event: CustomEvent) => {
      const newIndex = event.detail;
      if (selectedStudent && selectedStudent.photos[newIndex]) {
        setCurrentPhotoIndex(newIndex);
        updateUrl(selectedStudent.id, newIndex, showDirectView);
      }
    };

    window.addEventListener('photoChange', handlePhotoChange as EventListener);
    return () => window.removeEventListener('photoChange', handlePhotoChange as EventListener);
  }, [selectedStudent, showDirectView, updateUrl]);

  const handleCloseDirectView = () => {
    setShowDirectView(false);
    setSelectedStudent(null);
    setCurrentPhotoIndex(0);
    clearParams();
  };

  const handleNavigateToGallery = () => {
    setShowDirectView(false);
    setCurrentPage('gallery');
    clearParams();
  };

  const handlePreviousPhoto = () => {
    if (selectedStudent && selectedStudent.photos.length > 1) {
      const newIndex = currentPhotoIndex === 0 
        ? selectedStudent.photos.length - 1 
        : currentPhotoIndex - 1;
      setCurrentPhotoIndex(newIndex);
      updateUrl(selectedStudent.id, newIndex, showDirectView);
    }
  };

  const handleNextPhoto = () => {
    if (selectedStudent && selectedStudent.photos.length > 1) {
      const newIndex = currentPhotoIndex === selectedStudent.photos.length - 1 
        ? 0 
        : currentPhotoIndex + 1;
      setCurrentPhotoIndex(newIndex);
      updateUrl(selectedStudent.id, newIndex, showDirectView);
    }
  };

  // Show direct view if enabled
  if (showDirectView) {
    return (
      <ThemeProvider>
        <DirectPhotoView
          student={selectedStudent}
          photoIndex={currentPhotoIndex}
          onClose={handleCloseDirectView}
          onNavigateToGallery={handleNavigateToGallery}
          onPrevious={handlePreviousPhoto}
          onNext={handleNextPhoto}
        />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
        
        <main>
          {currentPage === 'gallery' ? (
            <Gallery students={students} groupPhotos={groupPhotos} />
          ) : (
            <DeveloperInfo />
          )}
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;