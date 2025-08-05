import { auth } from './auth';
import { studentAPI, teacherAPI, courseAPI } from './api';

async function testCourseCodeSystem() {
    console.log('🔑 PRUEBAS DEL SISTEMA DE CÓDIGOS DE CURSO');
    console.log('========================================');

    try {
        // 1. Registrar profesor principal
        console.log('1. Registrando profesor principal...');
        await auth.registerTeacher({
            email: 'profesor.principal@escuela.com',
            password: 'Teacher123!',
            name: 'Carlos Profesor',
            school: 'Escuela Primaria',
            subjects: ['Matemáticas'],
            role: 'teacher'
        });
        const mainTeacher = await auth.signIn('profesor.principal@escuela.com', 'Teacher123!');
        console.log('✅ Profesor principal registrado:', mainTeacher);

        // 2. Registrar profesores adicionales
        console.log('\n2. Registrando profesores adicionales...');
        await auth.registerTeacher({
            email: 'profesor.ciencias@escuela.com',
            password: 'Teacher123!',
            name: 'Ana Profesora',
            school: 'Escuela Primaria',
            subjects: ['Ciencias'],
            role: 'teacher'
        });
        const scienceTeacher = await auth.signIn('profesor.ciencias@escuela.com', 'Teacher123!');

        await auth.registerTeacher({
            email: 'profesor.historia@escuela.com',
            password: 'Teacher123!',
            name: 'Pedro Profesor',
            school: 'Escuela Primaria',
            subjects: ['Historia'],
            role: 'teacher'
        });
        const historyTeacher = await auth.signIn('profesor.historia@escuela.com', 'Teacher123!');
        console.log('✅ Profesores adicionales registrados');

        // 3. Crear curso con código
        console.log('\n3. Creando curso...');
        const courseResult = await courseAPI.create({
            name: 'Curso 7° Básico A',
            grade: '7° Básico',
            school: 'Escuela Primaria',
            teacherId: mainTeacher.id
        });
        console.log('✅ Curso creado:', courseResult);

        // 4. Asignar profesores adicionales al curso
        console.log('\n4. Asignando profesores al curso...');
        await teacherAPI.assignToCourse(scienceTeacher.id, courseResult.lastInsertRowid, 'Ciencias');
        await teacherAPI.assignToCourse(historyTeacher.id, courseResult.lastInsertRowid, 'Historia');
        console.log('✅ Profesores asignados al curso');

        // 5. Registrar estudiante
        console.log('\n5. Registrando estudiante...');
        await auth.registerStudent({
            email: 'estudiante.nuevo@escuela.com',
            password: 'Student123!',
            name: 'Ana Estudiante',
            school: 'Escuela Primaria',
            grade: '7° Básico',
            role: 'student'
        });
        const student = await auth.signIn('estudiante.nuevo@escuela.com', 'Student123!');
        console.log('✅ Estudiante registrado:', student);

        // 6. Obtener código del curso
        console.log('\n6. Obteniendo información del curso...');
        const courseInfo = await courseAPI.getById(courseResult.lastInsertRowid);
        console.log('✅ Información del curso:', courseInfo);
        console.log('📝 Código del curso:', courseInfo.code);

        // 7. Estudiante se une al curso usando el código
        console.log('\n7. Estudiante uniéndose al curso con código...');
        await studentAPI.joinCourseByCode(student.id, courseInfo.code);
        console.log('✅ Estudiante unido al curso');

        // 8. Verificar perfil completo del estudiante
        console.log('\n8. Verificando perfil del estudiante...');
        const studentProfile = await studentAPI.getFullProfile(student.id);
        console.log('✅ Perfil completo del estudiante:', studentProfile);

        console.log('\n✨ TODAS LAS PRUEBAS COMPLETADAS EXITOSAMENTE');
    } catch (error) {
        console.error('\n❌ ERROR EN LAS PRUEBAS:', error);
        process.exit(1);
    }
}

// Ejecutar las pruebas
testCourseCodeSystem();
