import { db } from './database.js';
import bcrypt from 'bcryptjs';

async function createAdmin() {
    try {
        // Verificar si ya existe un administrador
        const existingAdmin = db.prepare('SELECT id FROM users WHERE role = ?').get('admin');
        
        if (existingAdmin) {
            console.log('Ya existe un usuario administrador');
            return;
        }
        
        // Crear hash de la contraseña
        const password = 'admin123';
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Insertar usuario administrador
        const result = db.prepare(`
            INSERT INTO users (email, password, name, role, created_at, updated_at)
            VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))
        `).run('admin@amistapp.cl', hashedPassword, 'Administrador', 'admin');
        
        console.log('Usuario administrador creado exitosamente');
        console.log('Email: admin@amistapp.cl');
        console.log('Contraseña: admin123');
        console.log('ID:', result.lastInsertRowid);
        
    } catch (error) {
        console.error('Error al crear administrador:', error);
    }
}

createAdmin();