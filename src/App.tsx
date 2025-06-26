// src/App.tsx
import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Gallery } from './components/Gallery';
import { DeveloperInfo } from './components/DeveloperInfo';
import studentsData from './data/students.json';
import groupPhotosData from './data/groupPhotos.json'; // Import data terpisah

function App() {
  const [currentPage, setCurrentPage] = useState<'gallery' | 'developer'>('gallery');
  const [students, setStudents] = useState<Student[]>([]);
  const [groupPhotos, setGroupPhotos] = useState<GroupPhoto[]>([]);

  useEffect(() => {
    setStudents(studentsData.students);
    setGroupPhotos(groupPhotosData); // Gunakan data dari file terpisah
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
      
      <main>
        {currentPage === 'gallery' ? (
          <Gallery students={students} groupPhotos={groupPhotos} />
        ) : (
          <DeveloperInfo />
        )}
      </main>
    </div>
  );
}

export default App;