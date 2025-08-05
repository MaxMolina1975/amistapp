import { db } from './database.js';
import bcrypt from 'bcryptjs';

try {
    const admin = db.prepare('SELECT id, email, password, role FROM users WHERE email = ?').get('admin@amistapp.cl');
    
    if (!admin) {
        console.log('No se encontró el usuario administrador');
        process.exit(1);
    }
    
    console.log('Usuario administrador encontrado:', {
        id: admin.id,
        email: admin.email,
        role: admin.role,
        password_hash: admin.password.substring(0, 20) + '...'
    });
    
    // Probar diferentes contraseñas
    const passwords = [
        'admin123',
        'Admin@2023', 
        'admin',
        'password',
        '123456',
        'admin@amistapp.cl',
        'amistapp',
        'Amistapp2023',
        'admin@123',
        'Admin123'
    ];
    
    console.log('\nProbando contraseñas...');
    for (const pwd of passwords) {
        try {
            const isValid = await bcrypt.compare(pwd, admin.password);
            if (isValid) {
                console.log(`✅ Contraseña correcta encontrada: "${pwd}"`);
                process.exit(0);
            } else {
                console.log(`❌ "${pwd}" - Incorrecta`);
            }
        } catch (error) {
            console.log(`❌ "${pwd}" - Error: ${error.message}`);
        }
    }
    
    console.log('\n❌ No se encontró la contraseña correcta entre las opciones probadas');
    
} catch (error) {
    console.error('Error:', error);
}