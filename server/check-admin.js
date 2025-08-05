import { db } from './database.js';
import bcrypt from 'bcryptjs';

try {
    const admin = db.prepare('SELECT id, email, password, role FROM users WHERE email = ?').get('admin@amistapp.cl');
    console.log('Usuario administrador:', {
        id: admin.id,
        email: admin.email,
        role: admin.role,
        password_hash: admin.password.substring(0, 20) + '...'
    });
    
    // Verificar si la contraseña 'admin123' coincide
    const isValidPassword = await bcrypt.compare('admin123', admin.password);
    console.log('¿Contraseña "admin123" es válida?:', isValidPassword);
    
    // Probar otras contraseñas comunes
    const passwords = ['admin', 'password', '123456', 'admin@amistapp.com'];
    for (const pwd of passwords) {
        const isValid = await bcrypt.compare(pwd, admin.password);
        if (isValid) {
            console.log(`Contraseña correcta encontrada: "${pwd}"`);
            break;
        }
    }
    
} catch (error) {
    console.error('Error:', error);
}