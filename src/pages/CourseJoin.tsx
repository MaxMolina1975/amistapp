import React, { useState } from 'react';
import { UserPlus, ArrowRight } from 'lucide-react';

export function CourseJoin() {
  const [courseCode, setCourseCode] = useState('');

  const handleJoinCourse = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement course joining logic
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 py-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Unirse al Curso</h1>
        <p className="text-gray-600">Ingresa el código de tu profesor</p>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <UserPlus className="w-8 h-8 text-blue-600" />
        </div>

        <form onSubmit={handleJoinCourse}>
          <div className="mb-6">
            <label htmlFor="courseCode" className="block text-sm font-medium text-gray-700 mb-2">
              Código del Curso
            </label>
            <input
              type="text"
              id="courseCode"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej: CURSO-2024-A1"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center"
          >
            <span>Unirse al Curso</span>
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </form>
      </div>

      <div className="bg-blue-50 rounded-xl p-4">
        <h2 className="font-semibold text-gray-800 mb-2">¿Qué obtienes al unirte?</h2>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• 50 puntos de bienvenida</li>
          <li>• Acceso al catálogo de premios</li>
          <li>• Sistema de reportes anónimos</li>
          <li>• Interacción con compañeros</li>
        </ul>
      </div>
    </div>
  );
}