import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Student } from '../types';
import { LazyImage } from './LazyImage';

interface StudentHorizontalScrollProps {
  students: Student[];
  onStudentClick: (student: Student) => void;
}

export const StudentHorizontalScroll: React.FC<StudentHorizontalScrollProps> = ({ 
  students, 
  onStudentClick 
}) => {
  const [scrollPosition, setScrollPosition] = React.useState(0);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    
    const container = scrollRef.current;
    const scrollAmount = container.clientWidth * 0.7;
    
    if (direction === 'right') {
      container.scrollTo({
        left: scrollPosition + scrollAmount,
        behavior: 'smooth'
      });
      setScrollPosition(prev => prev + scrollAmount);
    } else {
      container.scrollTo({
        left: Math.max(0, scrollPosition - scrollAmount),
        behavior: 'smooth'
      });
      setScrollPosition(prev => Math.max(0, prev - scrollAmount));
    }
  };

  return (
    <div className="relative mb-12">
      <div className="flex justify-between items-center mb-4 px-4 sm:px-6 lg:px-8">
        <h3 className="text-xl font-bold text-gray-900">Featured Students</h3>
        <div className="flex space-x-2">
          <button 
            onClick={() => handleScroll('left')}
            className="p-2 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50 transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft size={18} />
          </button>
          <button 
            onClick={() => handleScroll('right')}
            className="p-2 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50 transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        className="overflow-x-auto hide-scrollbar px-4 sm:px-6 lg:px-8 pb-4"
      >
        <div className="flex space-x-4" style={{ minWidth: `${students.length * 180}px` }}>
          {students.map((student, index) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex-shrink-0 w-40 cursor-pointer"
              onClick={() => onStudentClick(student)}
            >
              <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100">
                <div className="aspect-square relative overflow-hidden">
                  <LazyImage
                    src={student.photos[0]}
                    alt={student.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-3">
                  <h4 className="font-medium text-gray-900 text-center truncate">{student.name}</h4>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};