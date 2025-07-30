import axios from 'axios';
import { SERVER_CONFIG } from '../../config';
import { Student, StudentWithStats } from '../types/student';

// Create a client instance for student-related API operations
const apiClient = axios.create({
  baseURL: SERVER_CONFIG.BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Error handling utility
const handleError = (error: any) => {
  console.error('API Error:', error);
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    return {
      error: error.response.data.message || 'Error en la operación',
      status: error.response.status
    };
  } else if (error.request) {
    // The request was made but no response was received
    return {
      error: 'No se recibió respuesta del servidor',
      status: 0
    };
  } else {
    // Something happened in setting up the request that triggered an Error
    return {
      error: error.message || 'Error al procesar la solicitud',
      status: 0
    };
  }
};

// Student API service
export const studentApi = {
  /**
   * Get all students for a teacher or tutor
   * @param token Authentication token
   * @param teacherId Optional teacher ID
   * @param tutorId Optional tutor ID
   * @returns List of students with their stats
   */
  getStudents: async (token: string, teacherId?: string, tutorId?: string): Promise<StudentWithStats[]> => {
    try {
      let endpoint = '/students';
      
      if (teacherId) {
        endpoint = `/teachers/${teacherId}/students`;
      } else if (tutorId) {
        endpoint = `/tutors/${tutorId}/students`;
      }
      
      const response = await apiClient.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching students:', error);
      return [];
    }
  },
  
  /**
   * Get a specific student by ID
   * @param token Authentication token
   * @param studentId Student ID
   * @returns Student data with stats
   */
  getStudentById: async (token: string, studentId: string | number): Promise<StudentWithStats | null> => {
    try {
      const response = await apiClient.get(`/students/${studentId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching student ${studentId}:`, error);
      return null;
    }
  },
  
  /**
   * Create a new student
   * @param token Authentication token
   * @param studentData Student data
   * @returns Created student data
   */
  createStudent: async (token: string, studentData: Partial<Student>) => {
    try {
      const response = await apiClient.post('/students', studentData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },
  
  /**
   * Update an existing student
   * @param token Authentication token
   * @param studentId Student ID
   * @param studentData Updated student data
   * @returns Updated student data
   */
  updateStudent: async (token: string, studentId: string | number, studentData: Partial<Student>) => {
    try {
      const response = await apiClient.put(`/students/${studentId}`, studentData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },
  
  /**
   * Updates the points for a specific student
   * @param token The authentication token
   * @param studentId The ID of the student to update
   * @param points The number of points to add (positive) or subtract (negative)
   * @returns Result of the operation
   */
  updateStudentPoints: async (token: string, studentId: number, points: number) => {
    try {
      const endpoint = `/students/${studentId}/points`;
      const response = await apiClient.post(
        endpoint,
        { points },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }
};

// For backward compatibility
export const updateStudentPoints = studentApi.updateStudentPoints;
