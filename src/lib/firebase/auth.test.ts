import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import {
    registerStudent,
    registerTeacher,
    registerTutor,
    signIn,
    signOut,
    getCurrentUserData
} from './auth';

describe('Authentication Tests', () => {
    const testData = {
        student: {
            email: 'estudiante.test@example.com',
            password: 'Password123!',
            name: 'Estudiante Test',
            school: 'Escuela Test',
            grade: '8° Básico'
        },
        teacher: {
            email: 'profesor.test@example.com',
            password: 'Password123!',
            name: 'Profesor Test',
            school: 'Escuela Test',
            subjects: ['Matemáticas', 'Ciencias']
        },
        tutor: {
            email: 'tutor.test@example.com',
            password: 'Password123!',
            name: 'Tutor Test',
            relationship: 'Padre'
        }
    };

    // Limpiar el estado antes de las pruebas
    beforeAll(async () => {
        try {
            await signOut();
        } catch (error) {
            console.log('No hay sesión activa para cerrar');
        }
    });

    // Limpiar el estado después de las pruebas
    afterAll(async () => {
        try {
            await signOut();
        } catch (error) {
            console.log('No hay sesión activa para cerrar');
        }
    });

    describe('Student Authentication', () => {
        it('should register a new student', async () => {
            await expect(registerStudent(testData.student)).resolves.not.toThrow();
        });

        it('should sign in as student', async () => {
            const result = await signIn(testData.student.email, testData.student.password);
            expect(result.role).toBe('student');
        });

        it('should get student data', async () => {
            const userData = await getCurrentUserData();
            expect(userData?.role).toBe('student');
            expect(userData?.name).toBe(testData.student.name);
        });

        it('should sign out', async () => {
            await expect(signOut()).resolves.not.toThrow();
            const userData = await getCurrentUserData();
            expect(userData).toBeNull();
        });
    });

    describe('Teacher Authentication', () => {
        it('should register a new teacher', async () => {
            await expect(registerTeacher(testData.teacher)).resolves.not.toThrow();
        });

        it('should sign in as teacher', async () => {
            const result = await signIn(testData.teacher.email, testData.teacher.password);
            expect(result.role).toBe('teacher');
        });

        it('should get teacher data', async () => {
            const userData = await getCurrentUserData();
            expect(userData?.role).toBe('teacher');
            expect(userData?.name).toBe(testData.teacher.name);
        });

        it('should sign out', async () => {
            await expect(signOut()).resolves.not.toThrow();
            const userData = await getCurrentUserData();
            expect(userData).toBeNull();
        });
    });

    describe('Tutor Authentication', () => {
        it('should register a new tutor', async () => {
            await expect(registerTutor(testData.tutor)).resolves.not.toThrow();
        });

        it('should sign in as tutor', async () => {
            const result = await signIn(testData.tutor.email, testData.tutor.password);
            expect(result.role).toBe('tutor');
        });

        it('should get tutor data', async () => {
            const userData = await getCurrentUserData();
            expect(userData?.role).toBe('tutor');
            expect(userData?.name).toBe(testData.tutor.name);
        });

        it('should sign out', async () => {
            await expect(signOut()).resolves.not.toThrow();
            const userData = await getCurrentUserData();
            expect(userData).toBeNull();
        });
    });
});
