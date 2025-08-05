export interface User {
  id: number | string;
  name: string;
  email: string;
  role: string;
  school?: string;
  subjects?: string;
  relationship?: string;
  createdAt?: string;
  points?: number;
  
  // Propiedades adicionales para los perfiles
  lastName?: string;
  phone?: string;
  bio?: string;
  specialty?: string;
  profilePicture?: string;
}

export interface UserProfileUpdate {
  name?: string;
  lastName?: string;
  phone?: string;
  bio?: string;
  specialty?: string;
  profilePicture?: string;
}

export interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  error: string | null;
  clearError: () => void;
  updateUserProfile?: (updates: UserProfileUpdate) => Promise<void>;
  register: (userData: {
    email: string;
    password: string;
    name: string;
    role: 'teacher' | 'tutor' | 'student';
    [key: string]: any;
  }) => Promise<boolean>;
}
