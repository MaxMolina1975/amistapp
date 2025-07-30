import { db } from './database.js';

try {
    console.log('Verificando estructura de la tabla users...');
    const tableInfo = db.prepare('PRAGMA table_info(users)').all();
    console.log('Columnas de la tabla users:');
    tableInfo.forEach(col => {
        console.log(`- ${col.name} (${col.type})`);
    });
    
    console.log('\nVerificando todos los usuarios en la base de datos...');
    const users = db.prepare('SELECT * FROM users').all();
    
    console.log('Usuarios encontrados:');
    users.forEach(user => {
        console.log(`- ID: ${user.id}, Email: ${user.email}, Nombre: ${user.name}, Rol: ${user.role}`);
    });
    
    console.log(`\nTotal de usuarios: ${users.length}`);
    
} catch (error) {
    console.error('Error:', error);
}