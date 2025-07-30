import { db } from './database.js';
import fs from 'fs';
import path from 'path';

async function cleanAllTestData() {
    try {
        console.log('🧹 Iniciando limpieza de datos de prueba...');
        
        // Leer y ejecutar script SQL de limpieza
        const sqlScript = fs.readFileSync(new URL('./clean-database.sql', import.meta.url), 'utf8');
        const statements = sqlScript.split(';').filter(stmt => stmt.trim());
        
        for (const statement of statements) {
            if (statement.trim()) {
                await db.runAsync(statement);
            }
        }
        
        console.log('✅ Base de datos limpiada exitosamente');
        
        // Verificar limpieza
        const userCount = await db.getAsync('SELECT COUNT(*) as count FROM users');
        const studentCount = await db.getAsync('SELECT COUNT(*) as count FROM students');
        const teacherCount = await db.getAsync('SELECT COUNT(*) as count FROM teachers');
        const tutorCount = await db.getAsync('SELECT COUNT(*) as count FROM tutors');
        
        console.log('📊 Estado actual de la base de datos:');
        console.log(`   - Usuarios: ${userCount.count}`);
        console.log(`   - Estudiantes: ${studentCount.count}`);
        console.log(`   - Profesores: ${teacherCount.count}`);
        console.log(`   - Tutores: ${tutorCount.count}`);
        
    } catch (error) {
        console.error('❌ Error durante la limpieza:', error);
    }
}

// Ejecutar limpieza
(async () => {
    await cleanAllTestData();
    process.exit(0);
})();