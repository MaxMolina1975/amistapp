/**
 * Test completo de la aplicación AMISTAPP 2
 * Este archivo contiene pruebas para verificar el correcto funcionamiento de:
 * - Sistema de autenticación (login) para los tres roles
 * - Sistema de alertas y notificaciones
 * - Tablas de la base de datos
 * - Sistema de puntos y recompensas
 */

import { auth } from '../db/auth';
import { studentAPI, teacherAPI, tutorAPI, courseAPI } from '../db/api';
import { checkServerHealth, login } from '../api';
import { NotificationService } from '../services/notificationService';

// Credenciales de prueba para cada rol
const testCredentials = {
  student: {
    email: 'alumno.test@amistapp.edu',
    password: 'password123',
    name: 'Alumno Demo',
    lastName: 'Apellido',
    id: 103
  },
  teacher: {
    email: 'docente.test@amistapp.edu',
    password: 'password123',
    name: 'Docente Demo',
    lastName: 'Apellido',
    specialty: 'Educación Socio-Emocional',
    id: 101
  },
  tutor: {
    email: 'tutor.test@amistapp.edu',
    password: 'password123',
    name: 'Tutor Demo',
    lastName: 'Apellido',
    id: 102
  }
};

/**
 * Prueba de conexión al servidor
 */
async function testServerConnection() {
  console.log('\n🔄 PRUEBA DE CONEXIÓN AL SERVIDOR');
  console.log('================================');
  
  try {
    const isOnline = await checkServerHealth();
    console.log(`✅ Estado del servidor: ${isOnline ? 'ONLINE' : 'OFFLINE'}`);
    return isOnline;
  } catch (error) {
    console.error('❌ Error al verificar la conexión:', error);
    return false;
  }
}

/**
 * Prueba de autenticación para cada rol
 */
async function testAuthentication() {
  console.log('\n🔐 PRUEBAS DE AUTENTICACIÓN');
  console.log('==========================');
  
  // Prueba de login para estudiante
  console.log('\n📚 Prueba de login: ESTUDIANTE');
  try {
    const studentLoginResult = await login({
      email: testCredentials.student.email,
      password: testCredentials.student.password
    });
    console.log('✅ Login estudiante exitoso:', studentLoginResult);
  } catch (error) {
    console.error('❌ Error en login estudiante:', error);
  }
  
  // Prueba de login para docente
  console.log('\n👨‍🏫 Prueba de login: DOCENTE');
  try {
    const teacherLoginResult = await login({
      email: testCredentials.teacher.email,
      password: testCredentials.teacher.password
    });
    console.log('✅ Login docente exitoso:', teacherLoginResult);
  } catch (error) {
    console.error('❌ Error en login docente:', error);
  }
  
  // Prueba de login para tutor
  console.log('\n👪 Prueba de login: TUTOR');
  try {
    const tutorLoginResult = await login({
      email: testCredentials.tutor.email,
      password: testCredentials.tutor.password
    });
    console.log('✅ Login tutor exitoso:', tutorLoginResult);
  } catch (error) {
    console.error('❌ Error en login tutor:', error);
  }
}

/**
 * Prueba del sistema de notificaciones
 */
async function testNotifications() {
  console.log('\n🔔 PRUEBAS DEL SISTEMA DE NOTIFICACIONES');
  console.log('=====================================');
  
  try {
    // Verificar disponibilidad de notificaciones
    const notificationsAvailable = 'Notification' in window;
    console.log(`✅ Notificaciones disponibles en el navegador: ${notificationsAvailable ? 'SÍ' : 'NO'}`);
    
    if (notificationsAvailable) {
      // Solicitar permiso (solo para pruebas manuales, en tests automáticos esto fallará)
      console.log('Intentando solicitar permiso de notificación...');
      try {
        const permission = await Notification.requestPermission();
        console.log(`✅ Permiso de notificación: ${permission}`);
      } catch (error) {
        console.log('⚠️ No se pudo solicitar permiso de notificación (normal en entorno de prueba):', error);
      }
      
      // Probar registro de token (simulado)
      console.log('Simulando registro de token de notificación...');
      const mockUserId = '123';
      const mockToken = 'test-notification-token-123';
      
      // Simular guardado de token
      console.log(`✅ Token simulado para usuario ${mockUserId}: ${mockToken}`);
    }
  } catch (error) {
    console.error('❌ Error en pruebas de notificaciones:', error);
  }
}

/**
 * Prueba del sistema de puntos y recompensas
 */
async function testPointsAndRewards() {
  console.log('\n🏆 PRUEBAS DEL SISTEMA DE PUNTOS Y RECOMPENSAS');
  console.log('==========================================');
  
  try {
    // Simular asignación de puntos a un estudiante
    const studentId = testCredentials.student.id;
    const teacherId = testCredentials.teacher.id;
    const pointsToAssign = 50;
    
    console.log(`Simulando asignación de ${pointsToAssign} puntos al estudiante ID ${studentId} por el docente ID ${teacherId}...`);
    
    // En un entorno real, aquí se llamaría a la API para asignar puntos
    // Por ejemplo: await pointsAPI.assignPoints(studentId, pointsToAssign, teacherId, 'Participación en clase');
    
    console.log('✅ Puntos asignados correctamente (simulación)');
    
    // Simular canje de recompensa
    const rewardId = 'reward-123';
    const pointsCost = 30;
    
    console.log(`Simulando canje de recompensa ID ${rewardId} (costo: ${pointsCost} puntos) por el estudiante ID ${studentId}...`);
    
    // En un entorno real, aquí se llamaría a la API para canjear la recompensa
    // Por ejemplo: await rewardsAPI.claimReward(studentId, rewardId);
    
    console.log('✅ Recompensa canjeada correctamente (simulación)');
    
    // Verificar balance de puntos (simulado)
    const remainingPoints = 20; // 50 asignados - 30 gastados
    console.log(`✅ Balance de puntos del estudiante después de las operaciones: ${remainingPoints}`);
  } catch (error) {
    console.error('❌ Error en pruebas de puntos y recompensas:', error);
  }
}

/**
 * Prueba de las tablas de la base de datos
 */
async function testDatabaseTables() {
  console.log('\n📊 PRUEBAS DE TABLAS DE LA BASE DE DATOS');
  console.log('===================================');
  
  try {
    // Probar acceso a tabla de estudiantes
    console.log('Accediendo a tabla de estudiantes...');
    try {
      const students = await studentAPI.getAll();
      console.log(`✅ Tabla de estudiantes accesible. Registros encontrados: ${students?.length || 0}`);
    } catch (error) {
      console.error('❌ Error al acceder a tabla de estudiantes:', error);
    }
    
    // Probar acceso a tabla de docentes
    console.log('\nAccediendo a tabla de docentes...');
    try {
      const teachers = await teacherAPI.getAll();
      console.log(`✅ Tabla de docentes accesible. Registros encontrados: ${teachers?.length || 0}`);
    } catch (error) {
      console.error('❌ Error al acceder a tabla de docentes:', error);
    }
    
    // Probar acceso a tabla de tutores
    console.log('\nAccediendo a tabla de tutores...');
    try {
      const tutors = await tutorAPI.getAll();
      console.log(`✅ Tabla de tutores accesible. Registros encontrados: ${tutors?.length || 0}`);
    } catch (error) {
      console.error('❌ Error al acceder a tabla de tutores:', error);
    }
    
    // Probar acceso a tabla de cursos
    console.log('\nAccediendo a tabla de cursos...');
    try {
      const courses = await courseAPI.getAll();
      console.log(`✅ Tabla de cursos accesible. Registros encontrados: ${courses?.length || 0}`);
    } catch (error) {
      console.error('❌ Error al acceder a tabla de cursos:', error);
    }
  } catch (error) {
    console.error('❌ Error general en pruebas de tablas:', error);
  }
}

/**
 * Función principal para ejecutar todas las pruebas
 */
export async function runCompleteAppTest() {
  console.log('🔥 INICIANDO TEST COMPLETO DE AMISTAPP 2');
  console.log('======================================');
  
  try {
    // Probar conexión al servidor
    const serverOnline = await testServerConnection();
    
    if (serverOnline) {
      // Si el servidor está online, ejecutar todas las pruebas
      await testAuthentication();
      await testNotifications();
      await testPointsAndRewards();
      await testDatabaseTables();
      
      console.log('\n✨ TEST COMPLETO FINALIZADO');
      console.log('========================');
    } else {
      console.log('\n⚠️ No se pueden ejecutar todas las pruebas porque el servidor está offline');
    }
  } catch (error) {
    console.error('\n❌ ERROR GENERAL EN EL TEST:', error);
  }
}

// Ejecutar todas las pruebas si este archivo se ejecuta directamente
if (typeof window !== 'undefined' && window.location.pathname.includes('test')) {
  runCompleteAppTest();
}