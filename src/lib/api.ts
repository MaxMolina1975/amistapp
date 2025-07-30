import { SERVER_CONFIG } from '../config';

// Para cuando necesitemos API_ENDPOINTS, creamos una constante local
// Reemplazar esto en la versión de producción con la importación correcta
const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout'
  },
  HEALTH: '/health',
  REWARDS: '/rewards',
  TEACHER: {
    STUDENTS: '/teacher/students',
    STUDENT_POINTS: (studentId: string | number) => `/teacher/students/${studentId}/points`
  }
};

// For preview/demo purposes, we've commented out the health check URL
// and related functionality to avoid unnecessary console errors
// Uncomment for production use:
// const HEALTH_CHECK_URL = `${SERVER_CONFIG.BASE_URL}${API_ENDPOINTS.HEALTH}`;

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  details?: string;
  token?: string;
  user?: any; 
}

// Función para manejar errores de API de forma consistente
function handleApiError(error: any): ApiResponse {
  // For preview/demo purposes, suppress error logging to console
  // Uncomment for production use:
  // console.error('API Error:', error);
  
  if (error.response) {
    // Error de respuesta del servidor
    return {
      error: error.response.data.error || 'Error del servidor',
      details: error.response.data.details || error.response.statusText
    };
  } else if (error.request) {
    // Error de red (no se pudo conectar al servidor)
    return {
      error: 'Error de conexión',
      details: 'No se pudo conectar con el servidor. Por favor, verifica tu conexión a internet.'
    };
  } else {
    // Error inesperado
    return {
      error: 'Error inesperado',
      details: error.message || 'Ocurrió un error al procesar la solicitud.'
    };
  }
}

// Función para establecer un timeout en las peticiones fetch
export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout = 5000
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  const response = await fetch(url, {
    ...options,
    signal: controller.signal
  });
  
  clearTimeout(id);
  
  return response;
}

// Verificar si el servidor está en línea
export async function checkServerHealth(): Promise<boolean> {
  // For preview/demo purposes, always return true
  // This allows the app to function without a backend server
  // Remove this section and uncomment the code below for production use
  return true;
  
  // try {
  //   const response = await fetchWithTimeout(HEALTH_CHECK_URL, {}, 3000);
  //   
  //   if (response.ok) {
  //     const data = await response.json();
  //     return data.status === 'ok';
  //   }
  //   
  //   return false;
  // } catch (error) {
  //   console.error('Error al verificar la salud del servidor:', error);
  //   return false;
  // }
}

// Procesar la respuesta de la API
async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  if (!response.ok) {
    if (response.status === 401) {
      // Token inválido o expirado
      return { error: 'Sesión expirada', details: 'Por favor, vuelve a iniciar sesión.' };
    }
    
    const errorData = await response.json().catch(() => ({}));
    return { 
      error: errorData.error || 'Error del servidor', 
      details: errorData.details || response.statusText 
    };
  }
  
  try {
    const data = await response.json();
    return data;
  } catch (error) {
    return { error: 'Error al procesar la respuesta' };
  }
}

// Función general de login que funciona para cualquier rol
export async function login(data: {
  email: string;
  password: string;
}): Promise<ApiResponse> {
  try {
    const loginUrl = `${SERVER_CONFIG.BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`;
    
    const response = await fetchWithTimeout(
      loginUrl,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }
    );
    
    return handleResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
}

// Función general de registro que funciona para cualquier rol
export async function register(data: {
  email: string;
  password: string;
  name: string;
  role: 'teacher' | 'tutor' | 'student';
  [key: string]: any; 
}): Promise<ApiResponse> {
  try {
    const registerUrl = `${SERVER_CONFIG.BASE_URL}${API_ENDPOINTS.AUTH.REGISTER}`;
    
    const response = await fetchWithTimeout(
      registerUrl,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }
    );
    
    return handleResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
}

// Función para obtener el perfil de cualquier usuario
export async function getUserProfile(token: string): Promise<ApiResponse> {
  try {
    const profileUrl = `${SERVER_CONFIG.BASE_URL}${API_ENDPOINTS.AUTH.PROFILE}`;
    
    const response = await fetchWithTimeout(
      profileUrl,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return handleResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
}

// Mantener las funciones anteriores para compatibilidad, pero redirigirlas a las nuevas
export function loginTeacher(data: {
  email: string;
  password: string;
}): Promise<ApiResponse> {
  return login({ ...data });
}

export function registerTeacher(data: {
  email: string;
  password: string;
  fullName: string;
  school?: string;
  subject?: string;
}): Promise<ApiResponse> {
  return register({
    email: data.email,
    password: data.password,
    name: data.fullName,
    role: 'teacher',
    school: data.school,
    subject: data.subject
  });
}

export function getTeacherProfile(token: string): Promise<ApiResponse> {
  return getUserProfile(token);
}

export function loginTutor(data: {
  email: string;
  password: string;
}): Promise<ApiResponse> {
  return login({ ...data });
}

export function registerTutor(data: {
  email: string;
  password: string;
  fullName: string;
  relation: 'parent' | 'guardian' | 'other';
}): Promise<ApiResponse> {
  return register({
    email: data.email,
    password: data.password,
    name: data.fullName,
    role: 'tutor',
    relationship: data.relation
  });
}

export function getTutorProfile(token: string): Promise<ApiResponse> {
  return getUserProfile(token);
}

// Funciones para operaciones específicas de docentes
export async function getStudents(token: string): Promise<ApiResponse> {
  try {
    const studentsUrl = `${SERVER_CONFIG.BASE_URL}${API_ENDPOINTS.TEACHER.STUDENTS}`;
    
    const response = await fetchWithTimeout(
      studentsUrl,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return handleResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function getRewards(token: string): Promise<ApiResponse> {
  try {
    const rewardsUrl = `${SERVER_CONFIG.BASE_URL}${API_ENDPOINTS.REWARDS}`;
    
    const response = await fetchWithTimeout(
      rewardsUrl,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return handleResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function createReward(token: string, data: {
  title: string;
  description?: string;
  pointsCost: number;
}): Promise<ApiResponse> {
  try {
    const rewardsUrl = `${SERVER_CONFIG.BASE_URL}${API_ENDPOINTS.REWARDS}`;
    
    const response = await fetchWithTimeout(
      rewardsUrl,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }
    );
    
    return handleResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function updateStudentPoints(
  token: string,
  studentId: number,
  points: number
): Promise<ApiResponse> {
  try {
    const studentPointsUrl = `${SERVER_CONFIG.BASE_URL}${API_ENDPOINTS.TEACHER.STUDENT_POINTS(studentId)}`;
    
    const response = await fetchWithTimeout(
      studentPointsUrl,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ points })
      }
    );
    
    return handleResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
}
