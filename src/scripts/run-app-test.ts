/**
 * Script para ejecutar el test completo de la aplicación AMISTAPP 2 desde la línea de comandos
 */

import { runCompleteAppTest } from '../lib/tests/app-test';

console.log('Iniciando test completo de AMISTAPP 2 desde línea de comandos...');

// Ejecutar todas las pruebas
runCompleteAppTest()
  .then(() => {
    console.log('\nTest completado. Saliendo...');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\nError fatal durante la ejecución del test:', error);
    process.exit(1);
  });