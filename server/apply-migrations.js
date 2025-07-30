import { db } from './database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function applyMigrations() {
    try {
        console.log('Aplicando migraciones...');
        
        // Directorio de migraciones
        const migrationsDir = path.join(__dirname, 'migrations');
        
        // Leer archivos de migración
        const migrationFiles = fs.readdirSync(migrationsDir)
            .filter(file => file.endsWith('.sql'))
            .sort(); // Ordenar para aplicar en secuencia
        
        // Crear tabla de migraciones si no existe
        await db.runAsync(`
            CREATE TABLE IF NOT EXISTS migrations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE,
                applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        // Obtener migraciones ya aplicadas
        const appliedMigrations = await db.allAsync('SELECT name FROM migrations');
        const appliedMigrationNames = appliedMigrations.map(m => m.name);
        
        // Aplicar migraciones pendientes
        for (const file of migrationFiles) {
            if (!appliedMigrationNames.includes(file)) {
                console.log(`Aplicando migración: ${file}`);
                
                // Leer contenido del archivo SQL
                const sqlContent = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
                
                // Ejecutar las sentencias SQL
                const statements = sqlContent.split(';').filter(stmt => stmt.trim());
                
                for (const stmt of statements) {
                    await db.runAsync(stmt);
                }
                
                // Registrar migración como aplicada
                await db.runAsync('INSERT INTO migrations (name) VALUES (?)', [file]);
                
                console.log(`Migración aplicada: ${file}`);
            } else {
                console.log(`Migración ya aplicada: ${file}`);
            }
        }
        
        console.log('Todas las migraciones han sido aplicadas correctamente.');
    } catch (error) {
        console.error('Error al aplicar migraciones:', error);
    } finally {
        // Cerrar conexión
        db.close();
    }
}

// Ejecutar migraciones
applyMigrations();