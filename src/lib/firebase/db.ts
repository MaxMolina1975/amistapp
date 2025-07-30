import { db } from '../firebase.js';
import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    where,
    updateDoc,
    deleteDoc,
    serverTimestamp,
    setDoc
} from 'firebase/firestore';
import { COLLECTIONS } from './schema.js';
import type { Student, Teacher, Tutor, Course } from './schema.js';

// Función helper para verificar que db esté disponible
function ensureDbAvailable() {
    if (!db) {
        throw new Error('Firebase Firestore no está disponible. Verifica la configuración de Firebase.');
    }
    return db;
}

// Funciones para estudiantes
export const studentAPI = {
    // Obtener estudiante por ID
    async getById(id: string): Promise<Student | null> {
        try {
            const database = ensureDbAvailable();
            const docRef = doc(database, COLLECTIONS.STUDENTS, id);
            const docSnap = await getDoc(docRef);
            return docSnap.exists() ? docSnap.data() as Student : null;
        } catch (error) {
            console.error('Error al obtener estudiante:', error);
            throw error;
        }
    },

    // Obtener estudiantes por curso
    async getByCourse(courseId: string): Promise<Student[]> {
        try {
            const database = ensureDbAvailable();
            const q = query(
                collection(database, COLLECTIONS.STUDENTS),
                where('courseId', '==', courseId)
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => doc.data() as Student);
        } catch (error) {
            console.error('Error al obtener estudiantes del curso:', error);
            throw error;
        }
    },

    // Actualizar datos del estudiante
    async update(id: string, data: Partial<Student>): Promise<void> {
        try {
            const database = ensureDbAvailable();
            const docRef = doc(database, COLLECTIONS.STUDENTS, id);
            await updateDoc(docRef, {
                ...data,
                updatedAt: serverTimestamp()
            });
        } catch (error) {
            console.error('Error al actualizar estudiante:', error);
            throw error;
        }
    }
};

// Funciones para docentes
export const teacherAPI = {
    // Obtener docente por ID
    async getById(id: string): Promise<Teacher | null> {
        try {
            const database = ensureDbAvailable();
            const docRef = doc(database, COLLECTIONS.TEACHERS, id);
            const docSnap = await getDoc(docRef);
            return docSnap.exists() ? docSnap.data() as Teacher : null;
        } catch (error) {
            console.error('Error al obtener docente:', error);
            throw error;
        }
    },

    // Obtener docentes por escuela
    async getBySchool(school: string): Promise<Teacher[]> {
        try {
            const database = ensureDbAvailable();
            const q = query(
                collection(database, COLLECTIONS.TEACHERS),
                where('school', '==', school)
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => doc.data() as Teacher);
        } catch (error) {
            console.error('Error al obtener docentes de la escuela:', error);
            throw error;
        }
    },

    // Actualizar datos del docente
    async update(id: string, data: Partial<Teacher>): Promise<void> {
        try {
            const database = ensureDbAvailable();
            const docRef = doc(database, COLLECTIONS.TEACHERS, id);
            await updateDoc(docRef, {
                ...data,
                updatedAt: serverTimestamp()
            });
        } catch (error) {
            console.error('Error al actualizar docente:', error);
            throw error;
        }
    }
};

// Funciones para tutores
export const tutorAPI = {
    // Obtener tutor por ID
    async getById(id: string): Promise<Tutor | null> {
        try {
            const database = ensureDbAvailable();
            const docRef = doc(database, COLLECTIONS.TUTORS, id);
            const docSnap = await getDoc(docRef);
            return docSnap.exists() ? docSnap.data() as Tutor : null;
        } catch (error) {
            console.error('Error al obtener tutor:', error);
            throw error;
        }
    },

    // Obtener estudiantes asociados a un tutor
    async getStudents(tutorId: string): Promise<Student[]> {
        try {
            const database = ensureDbAvailable();
            const tutorDoc = await getDoc(doc(database, COLLECTIONS.TUTORS, tutorId));
            const tutorData = tutorDoc.data() as Tutor;
            
            const students: Student[] = [];
            for (const studentId of tutorData.students) {
                const studentDoc = await getDoc(doc(database, COLLECTIONS.STUDENTS, studentId));
                if (studentDoc.exists()) {
                    students.push(studentDoc.data() as Student);
                }
            }
            return students;
        } catch (error) {
            console.error('Error al obtener estudiantes del tutor:', error);
            throw error;
        }
    },

    // Actualizar datos del tutor
    async update(id: string, data: Partial<Tutor>): Promise<void> {
        try {
            const database = ensureDbAvailable();
            const docRef = doc(database, COLLECTIONS.TUTORS, id);
            await updateDoc(docRef, {
                ...data,
                updatedAt: serverTimestamp()
            });
        } catch (error) {
            console.error('Error al actualizar tutor:', error);
            throw error;
        }
    },

    // Asociar estudiante a tutor
    async addStudent(tutorId: string, studentId: string): Promise<void> {
        try {
            const database = ensureDbAvailable();
            const tutorRef = doc(database, COLLECTIONS.TUTORS, tutorId);
            const tutorDoc = await getDoc(tutorRef);
            const tutorData = tutorDoc.data() as Tutor;

            if (!tutorData.students.includes(studentId)) {
                await updateDoc(tutorRef, {
                    students: [...tutorData.students, studentId],
                    updatedAt: serverTimestamp()
                });
            }
        } catch (error) {
            console.error('Error al asociar estudiante al tutor:', error);
            throw error;
        }
    }
};

// Funciones para cursos
export const courseAPI = {
    // Crear nuevo curso
    async create(data: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
        try {
            const database = ensureDbAvailable();
            const courseRef = doc(collection(database, COLLECTIONS.COURSES));
            await setDoc(courseRef, {
                ...data,
                id: courseRef.id,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
            return courseRef.id;
        } catch (error) {
            console.error('Error al crear curso:', error);
            throw error;
        }
    },

    // Obtener curso por ID
    async getById(id: string): Promise<Course | null> {
        try {
            const database = ensureDbAvailable();
            const docRef = doc(database, COLLECTIONS.COURSES, id);
            const docSnap = await getDoc(docRef);
            return docSnap.exists() ? docSnap.data() as Course : null;
        } catch (error) {
            console.error('Error al obtener curso:', error);
            throw error;
        }
    },

    // Obtener cursos por docente
    async getByTeacher(teacherId: string): Promise<Course[]> {
        try {
            const database = ensureDbAvailable();
            const q = query(
                collection(database, COLLECTIONS.COURSES),
                where('teacherId', '==', teacherId)
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => doc.data() as Course);
        } catch (error) {
            console.error('Error al obtener cursos del docente:', error);
            throw error;
        }
    },

    // Agregar estudiante al curso
    async addStudent(courseId: string, studentId: string): Promise<void> {
        try {
            const database = ensureDbAvailable();
            const courseRef = doc(database, COLLECTIONS.COURSES, courseId);
            const courseDoc = await getDoc(courseRef);
            const courseData = courseDoc.data() as Course;

            if (!courseData.students.includes(studentId)) {
                await updateDoc(courseRef, {
                    students: [...courseData.students, studentId],
                    updatedAt: serverTimestamp()
                });

                // Actualizar el courseId del estudiante
                await updateDoc(doc(database, COLLECTIONS.STUDENTS, studentId), {
                    courseId,
                    updatedAt: serverTimestamp()
                });
            }
        } catch (error) {
            console.error('Error al agregar estudiante al curso:', error);
            throw error;
        }
    }
};
