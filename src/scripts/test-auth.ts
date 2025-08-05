import { runAuthTests, runDBTests } from '../lib/firebase/tests.js';

async function runAllTests() {
    try {
        console.log('🔥 Iniciando pruebas completas del sistema...\n');
        
        console.log('📝 PRUEBAS DE AUTENTICACIÓN');
        console.log('===========================');
        await runAuthTests();
        console.log('\n');

        console.log('💾 PRUEBAS DE BASE DE DATOS');
        console.log('===========================');
        await runDBTests();
        console.log('\n');

        console.log('✨ Todas las pruebas completadas exitosamente');
    } catch (error) {
        console.error('❌ Error en las pruebas:', error);
        process.exit(1);
    }
}

runAllTests();
