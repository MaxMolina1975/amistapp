import { db } from './database.js';
import fs from 'fs';
import path from 'path';

async function cleanAllData() {
    try {
        console.log('🧹 Iniciando limpieza completa de la base de datos...');
        
        // Leer y ejecutar script SQL de limpieza
        const sqlScript = fs.readFileSync(new URL('./clean-all-data.sql', import.meta.url), 'utf8');
        const statements = sqlScript.split(';').filter(stmt => stmt.trim());
        
        for (const statement of statements) {
            if (statement.trim()) {
                await db.runAsync(statement);
            }
        }
        
        console.log('✅ Base de datos limpiada exitosamente');
        
        // Verificar estado de la base de datos
        const tables = await db.allAsync("SELECT name FROM sqlite_master WHERE type='table'");
        console.log('\n📊 Estado actual de la base de datos:');
        
        for (const table of tables) {
            if (table.name !== 'sqlite_sequence') {
                const count = await db.getAsync(`SELECT COUNT(*) as count FROM ${table.name}`);
                console.log(`   - ${table.name}: ${count.count} registros`);
            }
        }
        
        // Verificar usuario administrador
        const adminUser = await db.getAsync('SELECT * FROM users WHERE role = \'admin\'');
        if (adminUser) {
            console.log('\n✅ Usuario administrador verificado');
            console.log(`   - Email: ${adminUser.email}`);
            console.log(`   - Nombre: ${adminUser.name}`);
        } else {
            console.log('\n❌ Error: No se encontró el usuario administrador');
        }
        
    } catch (error) {
        console.error('❌ Error durante la limpieza:', error);
        process.exit(1);
    }
    process.exit(0);
}

// Ejecutar limpieza
cleanAllData();