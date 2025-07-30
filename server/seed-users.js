import bcrypt from 'bcryptjs';
import { db } from './database.js';

// Función para crear usuario administrador
async function createAdminUser() {
    try {
        // Verificar si ya existe un administrador
        const existingAdmin = db.prepare('SELECT * FROM users WHERE role = ?').get('admin');

        if (existingAdmin) {
            console.log('Usuario administrador ya existe:', existingAdmin.email);
            return;
        }

        // Crear usuario administrador
        const hashedPassword = await bcrypt.hash('Admin@2023', 10);
        
        const stmt = db.prepare(`
            INSERT INTO users (email, password, full_name, role, created_at) 
            VALUES (?, ?, ?, ?, datetime('now'))
        `);
        
        const result = stmt.run('admin@amistapp.com', hashedPassword, 'Administrador', 'admin');

        console.log('Usuario administrador creado exitosamente');
        console.log('Email: admin@amistapp.com');
        console.log('Password: Admin@2023');
        console.log('ID:', result.lastInsertRowid);
    } catch (error) {
        console.error('Error al crear usuario administrador:', error);
    }
}

// Función para verificar estado de la base de datos
function checkDatabaseStatus() {
    try {
        const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
        console.log(`Base de datos inicializada. Usuarios registrados: ${userCount.count}`);
    } catch (error) {
        console.error('Error al verificar estado de la base de datos:', error);
    }
}

// Ejecutar funciones
(async () => {
    console.log('Verificando estado de la base de datos...');
    checkDatabaseStatus();
    await createAdminUser();
    checkDatabaseStatus();
    process.exit(0);
})();
