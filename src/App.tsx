import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Gallery } from './components/Gallery';
import { DeveloperInfo } from './components/DeveloperInfo';
import { StudentsData } from './types';
import studentsData from './data/students.json';

function App() {
  const [currentPage, setCurrentPage] = useState<'gallery' | 'developer'>('gallery');
  const [students, setStudents] = useState<StudentsData['students']>([]);

  useEffect(() => {
    // Load student data
    setStudents(studentsData.students);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
      
      <main>
        {currentPage === 'gallery' ? (
          <Gallery students={students} />
        ) : (
          <DeveloperInfo />
        )}
      </main>
    </div>
  );
}

export default App;