import { db } from './database.js';
import bcrypt from 'bcryptjs';

async function resetAdminPassword() {
    try {
        console.log('Actualizando contraseña del administrador...');
        
        // Nueva contraseña
        const newPassword = 'admin123';
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        // Actualizar la contraseña del usuario existente
        const stmt = db.prepare('UPDATE users SET password = ? WHERE email = ?');
        const result = stmt.run(hashedPassword, 'admin@amistapp.cl');
        
        if (result.changes > 0) {
            console.log('✅ Contraseña actualizada exitosamente');
            console.log('📧 Email: admin@amistapp.cl');
            console.log('🔑 Nueva contraseña: admin123');
        } else {
            console.log('❌ No se pudo actualizar la contraseña');
        }
        
        // Verificar que la nueva contraseña funciona
        const admin = db.prepare('SELECT password FROM users WHERE email = ?').get('admin@amistapp.cl');
        const isValid = await bcrypt.compare(newPassword, admin.password);
        
        if (isValid) {
            console.log('✅ Verificación exitosa: La nueva contraseña funciona correctamente');
        } else {
            console.log('❌ Error: La nueva contraseña no funciona');
        }
        
    } catch (error) {
        console.error('Error al actualizar contraseña:', error);
    }
}

resetAdminPassword();