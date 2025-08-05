// Tipos para la base de datos
export interface User {
    uid: string;
    email: string;
    name: string;
    role: 'student' | 'teacher' | 'tutor';
    createdAt: Date;
    updatedAt: Date;
}

export interface Student extends User {
    role: 'student';
    school: string;
    grade: string;
    tutorId?: string;
    teacherId?: string;
    courseId?: string;
}

export interface Teacher extends User {
    role: 'teacher';
    school: string;
    subjects: string[];
    courses: string[];
}

export interface Tutor extends User {
    role: 'tutor';
    students: string[]; // Array de UIDs de estudiantes
    relationship: string; // e.g., "padre", "madre", "apoderado"
}

export interface Course {
    id: string;
    name: string;
    grade: string;
    school: string;
    teacherId: string;
    students: string[]; // Array de UIDs de estudiantes
    createdAt: Date;
    updatedAt: Date;
}

// Colecciones en Firestore
export const COLLECTIONS = {
    USERS: 'users',
    STUDENTS: 'students',
    TEACHERS: 'teachers',
    TUTORS: 'tutors',
    COURSES: 'courses',
    REPORTS: 'reports'
} as const;
