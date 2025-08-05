import { auth, db } from '../firebase.js';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    sendPasswordResetEmail,
    updateProfile,
    User
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { COLLECTIONS } from './schema.js';
import type { Student, Teacher, Tutor } from './schema.js';

// Función helper para verificar que auth esté disponible
function ensureAuthAvailable() {
    if (!auth) {
        throw new Error('Firebase Auth no está disponible. Verifica la configuración de Firebase.');
    }
    return auth;
}

// Función helper para verificar que db esté disponible
function ensureDbAvailable() {
    if (!db) {
        throw new Error('Firebase Firestore no está disponible. Verifica la configuración de Firebase.');
    }
    return db;
}

// Registro de estudiante
export async function registerStudent(data: {
    email: string;
    password: string;
    name: string;
    school: string;
    grade: string;
}): Promise<void> {
    try {
        const authInstance = ensureAuthAvailable();
        const database = ensureDbAvailable();
        
        // Crear usuario en Authentication
        const userCredential = await createUserWithEmailAndPassword(authInstance, data.email, data.password);
        const user = userCredential.user;

        // Actualizar el perfil con el nombre
        await updateProfile(user, { displayName: data.name });

        // Crear documento del estudiante en Firestore
        const studentData: Omit<Student, 'uid'> = {
            email: data.email,
            name: data.name,
            role: 'student',
            school: data.school,
            grade: data.grade,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        await setDoc(doc(database, COLLECTIONS.USERS, user.uid), studentData);
        await setDoc(doc(database, COLLECTIONS.STUDENTS, user.uid), studentData);

    } catch (error) {
        console.error('Error en el registro del estudiante:', error);
        throw error;
    }
}

// Registro de docente
export async function registerTeacher(data: {
    email: string;
    password: string;
    name: string;
    school: string;
    subjects: string[];
}): Promise<void> {
    try {
        const authInstance = ensureAuthAvailable();
        const database = ensureDbAvailable();
        
        const userCredential = await createUserWithEmailAndPassword(authInstance, data.email, data.password);
        const user = userCredential.user;

        await updateProfile(user, { displayName: data.name });

        const teacherData: Omit<Teacher, 'uid'> = {
            email: data.email,
            name: data.name,
            role: 'teacher',
            school: data.school,
            subjects: data.subjects,
            courses: [],
            createdAt: new Date(),
            updatedAt: new Date()
        };

        await setDoc(doc(database, COLLECTIONS.USERS, user.uid), teacherData);
        await setDoc(doc(database, COLLECTIONS.TEACHERS, user.uid), teacherData);

    } catch (error) {
        console.error('Error en el registro del docente:', error);
        throw error;
    }
}

// Registro de tutor
export async function registerTutor(data: {
    email: string;
    password: string;
    name: string;
    relationship: string;
}): Promise<void> {
    try {
        const authInstance = ensureAuthAvailable();
        const database = ensureDbAvailable();
        
        const userCredential = await createUserWithEmailAndPassword(authInstance, data.email, data.password);
        const user = userCredential.user;

        await updateProfile(user, { displayName: data.name });

        const tutorData: Omit<Tutor, 'uid'> = {
            email: data.email,
            name: data.name,
            role: 'tutor',
            relationship: data.relationship,
            students: [],
            createdAt: new Date(),
            updatedAt: new Date()
        };

        await setDoc(doc(database, COLLECTIONS.USERS, user.uid), tutorData);
        await setDoc(doc(database, COLLECTIONS.TUTORS, user.uid), tutorData);

    } catch (error) {
        console.error('Error en el registro del tutor:', error);
        throw error;
    }
}

// Inicio de sesión
export async function signIn(email: string, password: string): Promise<{ user: User; role: string }> {
    try {
        const authInstance = ensureAuthAvailable();
        const database = ensureDbAvailable();
        
        const userCredential = await signInWithEmailAndPassword(authInstance, email, password);
        const user = userCredential.user;

        // Obtener el rol del usuario desde Firestore
        const userDoc = await getDoc(doc(database, COLLECTIONS.USERS, user.uid));
        const userData = userDoc.data();

        if (!userData || !userData.role) {
            throw new Error('Usuario no encontrado o rol no definido');
        }

        return { user, role: userData.role };

    } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        throw error;
    }
}

// Cerrar sesión
export async function signOut(): Promise<void> {
    try {
        const authInstance = ensureAuthAvailable();
        await firebaseSignOut(authInstance);
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        throw error;
    }
}

// Recuperación de contraseña
export async function resetPassword(email: string): Promise<void> {
    try {
        const authInstance = ensureAuthAvailable();
        await sendPasswordResetEmail(authInstance, email);
    } catch (error) {
        console.error('Error al enviar el correo de recuperación:', error);
        throw error;
    }
}

// Obtener datos del usuario actual
export async function getCurrentUserData(): Promise<Student | Teacher | Tutor | null> {
    try {
        const authInstance = ensureAuthAvailable();
        const database = ensureDbAvailable();
        
        const user = authInstance.currentUser;
        if (!user) return null;

        const userDoc = await getDoc(doc(database, COLLECTIONS.USERS, user.uid));
        return userDoc.data() as Student | Teacher | Tutor;

    } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
        throw error;
    }
}
