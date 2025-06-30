// src/App.tsx
import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Gallery } from './components/Gallery';
import { DeveloperInfo } from './components/DeveloperInfo';
import { ThemeProvider } from './contexts/ThemeContext';
import studentsData from './data/students.json';
import groupPhotosData from './data/groupPhotos.json';

function App() {
  const [currentPage, setCurrentPage] = useState<'gallery' | 'developer'>('gallery');
  const [students, setStudents] = useState<Student[]>([]);
  const [groupPhotos, setGroupPhotos] = useState<GroupPhoto[]>([]);

  useEffect(() => {
    setStudents(studentsData.students);
    setGroupPhotos(groupPhotosData);
  }, []);

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