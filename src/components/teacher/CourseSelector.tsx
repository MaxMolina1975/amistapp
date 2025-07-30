import React from 'react';
import { Course } from '../../lib/types';
import { School, ChevronDown } from 'lucide-react';

interface CourseSelectorProps {
  courses: Course[];
  currentCourse: Course | null;
  onCourseSelect: (course: Course) => void;
}

export function CourseSelector({ courses, currentCourse, onCourseSelect }: CourseSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between"
      >
        <div className="flex items-center">
          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
            <School className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="text-left">
            <p className="font-medium text-gray-800">
              {currentCourse ? currentCourse.name : 'Seleccionar Curso'}
            </p>
            {currentCourse && (
              <p className="text-sm text-gray-500">Código: {currentCourse.code}</p>
            )}
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-100">
          {courses.map((course) => (
            <button
              key={course.id}
              onClick={() => {
                onCourseSelect(course);
                setIsOpen(false);
              }}
              className="w-full p-4 text-left hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl flex items-center"
            >
              <School className="w-5 h-5 text-indigo-600 mr-3" />
              <div>
                <p className="font-medium text-gray-800">{course.name}</p>
                <p className="text-sm text-gray-500">Código: {course.code}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}