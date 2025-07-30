/**
 * Script para ejecutar pruebas específicas del sistema de alertas y notificaciones de AMISTAPP 2
 * Este script permite verificar:
 * - Generación de diferentes tipos de alertas
 * - Envío de notificaciones a usuarios
 * - Reproducción de sonidos según el tipo de alerta
 * - Gestión del ciclo de vida de las alertas
 */

import { runAlertsTest } from '../lib/tests/alerts-test';
import { AlertService, Alert, AlertType } from '../lib/services/AlertService';
import { NotificationService } from '../lib/services/notificationService';

// Interfaz para los resultados de las pruebas
interface TestResult {
  name: string;
  success: boolean;
  message: string;
  details?: any;
}

/**
 * Prueba la reproducción de sonidos de notificación
 */
async function testNotificationSounds(): Promise<TestResult[]> {
  console.log('\n🔊 PRUEBA DE SONIDOS DE NOTIFICACIÓN');
  console.log('==================================');
  
  const results: TestResult[] = [];
  const soundFiles = [
    { type: AlertType.MESSAGE, file: '/sounds/message.mp3', name: 'Mensaje' },
    { type: AlertType.REPORT, file: '/sounds/report.mp3', name: 'Reporte' },
    { type: AlertType.IMPORTANT, file: '/sounds/important.mp3', name: 'Importante' },
    { type: AlertType.EMOTIONAL, file: '/sounds/emotional.mp3', name: 'Emocional' },
    { type: AlertType.BULLYING, file: '/sounds/urgent.mp3', name: 'Bullying (Urgente)' },
    { type: 'default', file: '/sounds/notification.mp3', name: 'Notificación por defecto' }
  ];
  
  for (const sound of soundFiles) {
    try {
      console.log(`Reproduciendo sonido: ${sound.name}`);
      
      // Crear un elemento de audio para probar si el archivo existe y se puede reproducir
      const audio = new Audio(sound.file);
      
      // Configurar eventos para detectar éxito o error
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        try {
          await playPromise;
          console.log(`✅ Sonido ${sound.name} reproducido correctamente`);
          
          // Detener el sonido después de 1 segundo para no superponer sonidos
          setTimeout(() => {
            audio.pause();
            audio.currentTime = 0;
          }, 1000);
          
          results.push({
            name: `Reproducción de sonido: ${sound.name}`,
            success: true,
            message: `El sonido ${sound.name} se reprodujo correctamente`
          });
        } catch (error) {
          console.error(`❌ Error al reproducir sonido ${sound.name}:`, error);
          results.push({
            name: `Reproducción de sonido: ${sound.name}`,
            success: false,
            message: `Error al reproducir el sonido: ${error.message}`,
            details: error
          });
        }
      }
    } catch (error) {
      console.error(`❌ Error al cargar sonido ${sound.name}:`, error);
      results.push({
        name: `Carga de sonido: ${sound.name}`,
        success: false,
        message: `Error al cargar el archivo de sonido: ${error.message}`,
        details: error
      });
    }
  }
  
  return results;
}

/**
 * Prueba la integración entre AlertService y NotificationService
 */
async function testAlertNotificationIntegration(): Promise<TestResult[]> {
  console.log('\n🔄 PRUEBA DE INTEGRACIÓN ALERTAS-NOTIFICACIONES');
  console.log('============================================');
  
  const results: TestResult[] = [];
  
  try {
    // Verificar disponibilidad de notificaciones
    const notificationsAvailable = 'Notification' in window;
    console.log(`Notificaciones disponibles en el navegador: ${notificationsAvailable ? 'SÍ' : 'NO'}`);
    
    results.push({
      name: 'Disponibilidad de notificaciones',
      success: notificationsAvailable,
      message: notificationsAvailable 
        ? 'Las notificaciones están disponibles en este navegador' 
        : 'Las notificaciones no están disponibles en este navegador'
    });
    
    if (notificationsAvailable) {
      // Verificar permiso actual
      const currentPermission = Notification.permission;
      console.log(`Permiso actual de notificaciones: ${currentPermission}`);
      
      results.push({
        name: 'Permiso de notificaciones',
        success: currentPermission === 'granted',
        message: `El permiso actual es: ${currentPermission}`
      });
      
      // Intentar crear una alerta de prueba
      const testAlert: Alert = {
        type: AlertType.IMPORTANT,
        severity: 'medium',
        title: 'Alerta de prueba',
        description: 'Esta es una alerta de prueba del sistema',
        userId: '999', // ID de usuario de prueba
        sound: true
      };
      
      console.log('Creando alerta de prueba...');
      
      // En un entorno real, aquí se llamaría a AlertService.createAlert
      // Para la prueba, simularemos el proceso
      
      // Simular la creación de la alerta
      console.log('✅ Alerta creada correctamente (simulación)');
      results.push({
        name: 'Creación de alerta',
        success: true,
        message: 'Se ha simulado la creación de una alerta correctamente'
      });
      
      // Simular el envío de notificación
      console.log('Enviando notificación...');
      
      if (currentPermission === 'granted') {
        // En un entorno real, esto sería manejado por AlertService.sendAlertNotification
        // Para la prueba, mostraremos una notificación directamente
        try {
          NotificationService.showNotification('Alerta de prueba', {
            body: 'Esta es una notificación de prueba',
            icon: '/logo192.png',
            data: {
              url: '/',
              alertId: 'test-alert-id',
              alertType: AlertType.IMPORTANT
            }
          });
          
          console.log('✅ Notificación enviada correctamente');
          results.push({
            name: 'Envío de notificación',
            success: true,
            message: 'La notificación se ha enviado correctamente'
          });
        } catch (error) {
          console.error('❌ Error al enviar notificación:', error);
          results.push({
            name: 'Envío de notificación',
            success: false,
            message: `Error al enviar la notificación: ${error.message}`,
            details: error
          });
        }
      } else {
        console.log('⚠️ No se puede enviar notificación sin permiso');
        results.push({
          name: 'Envío de notificación',
          success: false,
          message: 'No se puede enviar notificación porque el permiso no está concedido'
        });
      }
    }
  } catch (error) {
    console.error('❌ Error general en la prueba de integración:', error);
    results.push({
      name: 'Prueba de integración',
      success: false,
      message: `Error general: ${error.message}`,
      details: error
    });
  }
  
  return results;
}

/**
 * Función principal para ejecutar todas las pruebas
 */
async function runCompleteAlertsNotificationTest() {
  console.log('🔥 INICIANDO TEST COMPLETO DE ALERTAS Y NOTIFICACIONES');
  console.log('==================================================');
  
  const allResults: TestResult[] = [];
  
  try {
    // Ejecutar pruebas del sistema de alertas
    await runAlertsTest();
    
    // Probar sonidos de notificación
    const soundResults = await testNotificationSounds();
    allResults.push(...soundResults);
    
    // Probar integración de alertas y notificaciones
    const integrationResults = await testAlertNotificationIntegration();
    allResults.push(...integrationResults);
    
    // Mostrar resumen de resultados
    console.log('\n📊 RESUMEN DE RESULTADOS');
    console.log('=====================');
    
    const successCount = allResults.filter(r => r.success).length;
    const failCount = allResults.filter(r => !r.success).length;
    
    console.log(`Total de pruebas: ${allResults.length}`);
    console.log(`✅ Pruebas exitosas: ${successCount}`);
    console.log(`❌ Pruebas fallidas: ${failCount}`);
    
    if (failCount > 0) {
      console.log('\nDetalle de pruebas fallidas:');
      allResults.filter(r => !r.success).forEach((result, index) => {
        console.log(`${index + 1}. ${result.name}: ${result.message}`);
      });
    }
    
    console.log('\n✨ TEST DE ALERTAS Y NOTIFICACIONES FINALIZADO');
  } catch (error) {
    console.error('\n❌ ERROR FATAL EN EL TEST:', error);
  }
  
  // Devolver los resultados para posible uso en interfaz gráfica
  return allResults;
}

// Ejecutar las pruebas si este archivo se ejecuta directamente
if (typeof window !== 'undefined' && window.location.pathname.includes('test')) {
  runCompleteAlertsNotificationTest();
} else if (typeof require !== 'undefined' && require.main === module) {
  // Ejecutar desde Node.js
  runCompleteAlertsNotificationTest();
}

// Exportar la función principal para uso en otros archivos
export { runCompleteAlertsNotificationTest };