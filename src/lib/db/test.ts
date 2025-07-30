import { auth } from './auth';
import { studentAPI, teacherAPI, tutorAPI, courseAPI } from './api';

async function runTests() {
    try {
        console.log('🔥 Iniciando pruebas de la base de datos SQLite...\n');

        // 1. Registrar un estudiante
        console.log('1. Registrando estudiante...');
        await auth.registerStudent({
            email: 'estudiante@test.com',
            password: 'password123',
            name: 'Estudiante Test',
            school: 'Escuela Test',
            grade: '8° Básico',
            role: 'student'
        });
        console.log('✅ Estudiante registrado\n');

        // 2. Registrar un profesor
        console.log('2. Registrando profesor...');
        await auth.registerTeacher({
            email: 'profesor@test.com',
            password: 'password123',
            name: 'Profesor Test',
            school: 'Escuela Test',
            subjects: ['Matemáticas', 'Ciencias'],
            role: 'teacher'
        });
        console.log('✅ Profesor registrado\n');

        // 3. Registrar un tutor
        console.log('3. Registrando tutor...');
        await auth.registerTutor({
            email: 'tutor@test.com',
            password: 'password123',
            name: 'Tutor Test',
            relationship: 'Padre',
            role: 'tutor'
        });
        console.log('✅ Tutor registrado\n');

        // 4. Iniciar sesión como estudiante
        console.log('4. Iniciando sesión como estudiante...');
        const studentAuth = await auth.signIn('estudiante@test.com', 'password123');
        console.log('✅ Sesión iniciada:', studentAuth, '\n');

        // 5. Crear un curso
        console.log('5. Creando curso...');
        const teacherAuth = await auth.signIn('profesor@test.com', 'password123');
        const courseResult = await courseAPI.create({
            name: 'Curso Test',
            grade: '8° Básico',
            school: 'Escuela Test',
            teacherId: teacherAuth.id
        });
        console.log('✅ Curso creado:', courseResult, '\n');

        // 6. Asignar estudiante al curso
        console.log('6. Asignando estudiante al curso...');
        await courseAPI.addStudent(courseResult.lastInsertRowid, studentAuth.id);
        console.log('✅ Estudiante asignado al curso\n');

        // 7. Asignar tutor al estudiante
        console.log('7. Asignando tutor al estudiante...');
        const tutorAuth = await auth.signIn('tutor@test.com', 'password123');
        await tutorAPI.addStudent(tutorAuth.id, studentAuth.id);
        console.log('✅ Tutor asignado al estudiante\n');

        // 8. Obtener datos del estudiante
        console.log('8. Obteniendo datos del estudiante...');
        const studentData = await studentAPI.getById(studentAuth.id);
        console.log('✅ Datos del estudiante:', studentData, '\n');

        console.log('✨ Todas las pruebas completadas exitosamente');
    } catch (error) {
        console.error('❌ Error en las pruebas:', error);
    }
}

runTests();
