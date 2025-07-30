import {
    registerStudent,
    registerTeacher,
    registerTutor,
    signIn,
    signOut,
    getCurrentUserData
} from './auth.js';
import { studentAPI, teacherAPI, tutorAPI, courseAPI } from './db.js';

// Datos de prueba
const testData = {
    student: {
        email: 'estudiante.prueba@test.com',
        password: 'Password123!',
        name: 'Estudiante Prueba',
        school: 'Escuela Test',
        grade: '8° Básico'
    },
    teacher: {
        email: 'profesor.prueba@test.com',
        password: 'Password123!',
        name: 'Profesor Prueba',
        school: 'Escuela Test',
        subjects: ['Matemáticas', 'Ciencias']
    },
    tutor: {
        email: 'tutor.prueba@test.com',
        password: 'Password123!',
        name: 'Tutor Prueba',
        relationship: 'Padre'
    }
};

// Función principal de pruebas
export async function runAuthTests() {
    console.log('Iniciando pruebas de autenticación...');
    
    try {
        // 1. Prueba de registro de estudiante
        console.log('1. Registrando estudiante...');
        await registerStudent(testData.student);
        console.log('✅ Registro de estudiante exitoso');

        // 2. Prueba de inicio de sesión de estudiante
        console.log('2. Iniciando sesión como estudiante...');
        const studentAuth = await signIn(testData.student.email, testData.student.password);
        console.log('✅ Inicio de sesión de estudiante exitoso');
        console.log('Role:', studentAuth.role);

        // 3. Obtener datos del estudiante
        console.log('3. Obteniendo datos del estudiante...');
        const studentData = await getCurrentUserData();
        console.log('✅ Datos del estudiante:', studentData);

        // 4. Cerrar sesión
        console.log('4. Cerrando sesión...');
        await signOut();
        console.log('✅ Cierre de sesión exitoso');

        // 5. Prueba de registro de docente
        console.log('5. Registrando docente...');
        await registerTeacher(testData.teacher);
        console.log('✅ Registro de docente exitoso');

        // 6. Prueba de inicio de sesión de docente
        console.log('6. Iniciando sesión como docente...');
        const teacherAuth = await signIn(testData.teacher.email, testData.teacher.password);
        console.log('✅ Inicio de sesión de docente exitoso');
        console.log('Role:', teacherAuth.role);

        // 7. Cerrar sesión
        console.log('7. Cerrando sesión...');
        await signOut();
        console.log('✅ Cierre de sesión exitoso');

        // 8. Prueba de registro de tutor
        console.log('8. Registrando tutor...');
        await registerTutor(testData.tutor);
        console.log('✅ Registro de tutor exitoso');

        // 9. Prueba de inicio de sesión de tutor
        console.log('9. Iniciando sesión como tutor...');
        const tutorAuth = await signIn(testData.tutor.email, testData.tutor.password);
        console.log('✅ Inicio de sesión de tutor exitoso');
        console.log('Role:', tutorAuth.role);

        // 10. Cerrar sesión final
        console.log('10. Cerrando sesión...');
        await signOut();
        console.log('✅ Cierre de sesión exitoso');

        console.log('✅ Todas las pruebas completadas exitosamente');

    } catch (error) {
        console.error('❌ Error en las pruebas:', error);
        throw error;
    }
}

// Función para probar operaciones de base de datos
export async function runDBTests() {
    console.log('Iniciando pruebas de base de datos...');

    try {
        // 1. Crear un curso
        console.log('1. Creando curso...');
        const courseId = await courseAPI.create({
            name: 'Curso de Prueba',
            grade: '8° Básico',
            school: 'Escuela Test',
            teacherId: 'teacher_test_id',
            students: []
        });
        console.log('✅ Curso creado con ID:', courseId);

        // 2. Obtener curso por ID
        console.log('2. Obteniendo curso...');
        const course = await courseAPI.getById(courseId);
        console.log('✅ Curso obtenido:', course);

        // 3. Agregar estudiante al curso
        console.log('3. Agregando estudiante al curso...');
        await courseAPI.addStudent(courseId, 'student_test_id');
        console.log('✅ Estudiante agregado al curso');

        // 4. Obtener estudiantes del curso
        console.log('4. Obteniendo estudiantes del curso...');
        const students = await studentAPI.getByCourse(courseId);
        console.log('✅ Estudiantes obtenidos:', students);

        // 5. Actualizar datos del estudiante
        console.log('5. Actualizando datos del estudiante...');
        await studentAPI.update('student_test_id', {
            grade: '9° Básico'
        });
        console.log('✅ Datos del estudiante actualizados');

        // 6. Asociar estudiante a tutor
        console.log('6. Asociando estudiante a tutor...');
        await tutorAPI.addStudent('tutor_test_id', 'student_test_id');
        console.log('✅ Estudiante asociado al tutor');

        // 7. Obtener estudiantes del tutor
        console.log('7. Obteniendo estudiantes del tutor...');
        const tutorStudents = await tutorAPI.getStudents('tutor_test_id');
        console.log('✅ Estudiantes del tutor:', tutorStudents);

        console.log('✅ Todas las pruebas de base de datos completadas exitosamente');

    } catch (error) {
        console.error('❌ Error en las pruebas de base de datos:', error);
        throw error;
    }
}
