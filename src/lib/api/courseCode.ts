import { teacherApi } from './teacher';
import { Course } from '../types';

/**
 * Genera un código aleatorio para un curso
 * @returns Un código de curso único
 */
export function generateRandomCourseCode(): string {
  // Generar un prefijo de 3 letras mayúsculas
  const prefix = Array(3)
    .fill(0)
    .map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26)))
    .join('');
  
  // Generar un número de 3 dígitos
  const number = Math.floor(Math.random() * 900 + 100);
  
  // Generar un sufijo de 2 letras mayúsculas
  const suffix = Array(2)
    .fill(0)
    .map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26)))
    .join('');
  
  return `${prefix}-${number}-${suffix}`;
}

/**
 * API para la gestión de códigos de curso
 */
export const courseCodeApi = {
  /**
   * Genera un nuevo código para un curso
   * @param courseId ID del curso
   * @returns El nuevo código generado
   */
  generateCode: async (courseId: string): Promise<string> => {
    try {
      // Generar un código aleatorio
      const newCode = generateRandomCourseCode();
      
      // Actualizar el curso con el nuevo código
      await teacherApi.updateCourse(courseId, { code: newCode });
      
      return newCode;
    } catch (error) {
      console.error('Error al generar código de curso:', error);
      throw new Error('No se pudo generar el código del curso');
    }
  },
  
  /**
   * Actualiza el código de un curso
   * @param courseId ID del curso
   * @param code Nuevo código
   * @returns true si se actualizó correctamente
   */
  updateCode: async (courseId: string, code: string): Promise<boolean> => {
    try {
      await teacherApi.updateCourse(courseId, { code });
      return true;
    } catch (error) {
      console.error('Error al actualizar código de curso:', error);
      throw new Error('No se pudo actualizar el código del curso');
    }
  }
};