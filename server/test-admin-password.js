import { db } from './database.js';
import bcrypt from 'bcryptjs';

async function testAdminPassword() {
    try {
        const admin = db.prepare('SELECT * FROM users WHERE role = ?').get('admin');
        console.log('Usuario administrador encontrado:', admin.email);
        
        // Probar contraseñas comunes
        const passwords = ['admin123', 'admin', 'password', '123456', 'amistapp123'];
        
        for (const pwd of passwords) {
            const isValid = await bcrypt.compare(pwd, admin.password);
            if (isValid) {
                console.log(`✅ Contraseña correcta: "${pwd}"`);
                return;
            } else {
                console.log(`❌ Contraseña incorrecta: "${pwd}"`);
            }
        }
        
        console.log('No se encontró la contraseña entre las opciones probadas');
        
    } catch (error) {
        console.error('Error:', error);
    }
}

testAdminPassword();