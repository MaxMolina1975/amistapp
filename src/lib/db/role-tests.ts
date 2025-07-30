import { auth } from './auth';
import { studentAPI, teacherAPI, tutorAPI, courseAPI } from './api';

async function testStudentRole() {
    console.log('\n📚 PRUEBAS DE ROL: ESTUDIANTE');
    console.log('==============================');
    
    try {
        // Registro
        console.log('1. Registrando estudiante...');
        await auth.registerStudent({
            email: 'estudiante.test@escuela.com',
            password: 'Student123!',
            name: 'Juan Estudiante',
            school: 'Escuela Primaria',
            grade: '7° Básico',
            role: 'student'
        });
        console.log('✅ Estudiante registrado exitosamente');

        // Inicio de sesión
        console.log('\n2. Iniciando sesión como estudiante...');
        const studentAuth = await auth.signIn('estudiante.test@escuela.com', 'Student123!');
        console.log('✅ Sesión iniciada:', studentAuth);

        // Verificar datos del perfil
        console.log('\n3. Verificando datos del perfil...');
        const studentData = await studentAPI.getById(studentAuth.id);
        console.log('✅ Datos del estudiante:', studentData);

        return studentAuth.id;
    } catch (error) {
        console.error('❌ Error en pruebas de estudiante:', error);
        throw error;
    }
}

async function testTeacherRole() {
    console.log('\n👨‍🏫 PRUEBAS DE ROL: PROFESOR');
    console.log('============================');
    
    try {
        // Registro
        console.log('1. Registrando profesor...');
        await auth.registerTeacher({
            email: 'profesor.test@escuela.com',
            password: 'Teacher123!',
            name: 'María Profesora',
            school: 'Escuela Primaria',
            subjects: ['Matemáticas', 'Ciencias', 'Historia'],
            role: 'teacher'
        });
        console.log('✅ Profesor registrado exitosamente');

        // Inicio de sesión
        console.log('\n2. Iniciando sesión como profesor...');
        const teacherAuth = await auth.signIn('profesor.test@escuela.com', 'Teacher123!');
        console.log('✅ Sesión iniciada:', teacherAuth);

        // Crear curso
        console.log('\n3. Creando curso...');
        const courseResult = await courseAPI.create({
            name: 'Matemáticas Avanzadas',
            grade: '7° Básico',
            school: 'Escuela Primaria',
            teacherId: teacherAuth.id
        });
        console.log('✅ Curso creado:', courseResult);

        // Verificar datos del profesor
        console.log('\n4. Verificando datos del profesor...');
        const teacherData = await teacherAPI.getById(teacherAuth.id);
        console.log('✅ Datos del profesor:', teacherData);

        return { teacherId: teacherAuth.id, courseId: courseResult.lastInsertRowid };
    } catch (error) {
        console.error('❌ Error en pruebas de profesor:', error);
        throw error;
    }
}

async function testTutorRole() {
    console.log('\n👪 PRUEBAS DE ROL: TUTOR');
    console.log('========================');
    
    try {
        // Registro
        console.log('1. Registrando tutor...');
        await auth.registerTutor({
            email: 'tutor.test@familia.com',
            password: 'Tutor123!',
            name: 'Pedro Tutor',
            relationship: 'Padre',
            role: 'tutor'
        });
        console.log('✅ Tutor registrado exitosamente');

        // Inicio de sesión
        console.log('\n2. Iniciando sesión como tutor...');
        const tutorAuth = await auth.signIn('tutor.test@familia.com', 'Tutor123!');
        console.log('✅ Sesión iniciada:', tutorAuth);

        // Verificar datos del tutor
        console.log('\n3. Verificando datos del tutor...');
        const tutorData = await tutorAPI.getById(tutorAuth.id);
        console.log('✅ Datos del tutor:', tutorData);

        return tutorAuth.id;
    } catch (error) {
        console.error('❌ Error en pruebas de tutor:', error);
        throw error;
    }
}

async function testRoleInteractions(studentId: number, teacherData: { teacherId: number, courseId: number }, tutorId: number) {
    console.log('\n🤝 PRUEBAS DE INTERACCIÓN ENTRE ROLES');
    console.log('===================================');
    
    try {
        // Asignar estudiante al curso
        console.log('1. Asignando estudiante al curso...');
        await courseAPI.addStudent(teacherData.courseId, studentId);
        console.log('✅ Estudiante asignado al curso');

        // Asignar tutor al estudiante
        console.log('\n2. Asignando tutor al estudiante...');
        await tutorAPI.addStudent(tutorId, studentId);
        console.log('✅ Tutor asignado al estudiante');

        // Verificar estudiantes del tutor
        console.log('\n3. Verificando estudiantes del tutor...');
        const tutorStudents = await tutorAPI.getStudents(tutorId);
        console.log('✅ Estudiantes del tutor:', tutorStudents);

        // Verificar estudiantes del curso
        console.log('\n4. Verificando estudiantes del curso...');
        const courseStudents = await studentAPI.getByCourse(teacherData.courseId);
        console.log('✅ Estudiantes del curso:', courseStudents);
    } catch (error) {
        console.error('❌ Error en pruebas de interacción:', error);
        throw error;
    }
}

async function runAllRoleTests() {
    console.log('🔥 INICIANDO PRUEBAS DE ROLES');
    console.log('=============================');
    
    try {
        // Probar cada rol individualmente
        const studentId = await testStudentRole();
        const teacherData = await testTeacherRole();
        const tutorId = await testTutorRole();

        // Probar interacciones entre roles
        await testRoleInteractions(studentId, teacherData, tutorId);

        console.log('\n✨ TODAS LAS PRUEBAS COMPLETADAS EXITOSAMENTE');
    } catch (error) {
        console.error('\n❌ ERROR EN LAS PRUEBAS:', error);
        process.exit(1);
    }
}

// Ejecutar todas las pruebas
runAllRoleTests();
