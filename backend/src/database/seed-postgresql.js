import { initializeDatabase, closeDatabase, getDatabase } from './connection.js';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function seedDatabase() {
  try {
    console.log('🌱 Iniciando seed de la base de datos PostgreSQL...');
    
    // Inicializar conexión
    await initializeDatabase();
    const db = getDatabase();
    
    // Leer y ejecutar el esquema
    console.log('📋 Ejecutando esquema de base de datos...');
    const schemaSQL = fs.readFileSync(join(__dirname, 'schema-postgresql.sql'), 'utf8');
    await db.query(schemaSQL);
    
    // Crear usuario administrador
    console.log('👤 Creando usuario administrador...');
    const adminPassword = await bcrypt.hash('admin123', 10);
    
    await db.query(`
      INSERT INTO users (email, password, name, role, status) 
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (email) DO NOTHING
    `, ['admin@amistapp.com', adminPassword, 'Administrador Sistema', 'admin', 'active']);
    
    // Crear usuarios de prueba
    console.log('👥 Creando usuarios de prueba...');
    
    // Profesor de prueba
    const teacherPassword = await bcrypt.hash('teacher123', 10);
    const teacherResult = await db.query(`
      INSERT INTO users (email, password, name, role, status) 
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (email) DO UPDATE SET 
        password = EXCLUDED.password,
        name = EXCLUDED.name
      RETURNING id
    `, ['profesor@amistapp.com', teacherPassword, 'María García', 'teacher', 'active']);
    
    if (teacherResult.length > 0) {
      await db.query(`
        INSERT INTO teachers (user_id, school, subjects, department, phone)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (user_id) DO NOTHING
      `, [teacherResult[0].id, 'Escuela Primaria Central', 'Matemáticas, Ciencias', 'Primaria', '+1234567890']);
    }
    
    // Estudiante de prueba
    const studentPassword = await bcrypt.hash('student123', 10);
    const studentResult = await db.query(`
      INSERT INTO users (email, password, name, role, status) 
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (email) DO UPDATE SET 
        password = EXCLUDED.password,
        name = EXCLUDED.name
      RETURNING id
    `, ['estudiante@amistapp.com', studentPassword, 'Juan Pérez', 'student', 'active']);
    
    if (studentResult.length > 0 && teacherResult.length > 0) {
      await db.query(`
        INSERT INTO students (user_id, teacher_id, school, grade, course_code, points, level)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (user_id) DO NOTHING
      `, [studentResult[0].id, teacherResult[0].id, 'Escuela Primaria Central', '5to Grado', 'PRIM-5A', 150, 2]);
    }
    
    // Tutor de prueba
    const tutorPassword = await bcrypt.hash('tutor123', 10);
    const tutorResult = await db.query(`
      INSERT INTO users (email, password, name, role, status) 
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (email) DO UPDATE SET 
        password = EXCLUDED.password,
        name = EXCLUDED.name
      RETURNING id
    `, ['tutor@amistapp.com', tutorPassword, 'Ana Pérez', 'tutor', 'active']);
    
    if (tutorResult.length > 0) {
      await db.query(`
        INSERT INTO tutors (user_id, phone, relationship)
        VALUES ($1, $2, $3)
        ON CONFLICT (user_id) DO NOTHING
      `, [tutorResult[0].id, '+1234567891', 'parent']);
      
      // Relacionar tutor con estudiante
      if (studentResult.length > 0) {
        const studentData = await db.get('SELECT id FROM students WHERE user_id = $1', [studentResult[0].id]);
        const tutorData = await db.get('SELECT id FROM tutors WHERE user_id = $1', [tutorResult[0].id]);
        
        if (studentData && tutorData) {
          await db.query(`
            INSERT INTO tutor_student (tutor_id, student_id, relationship_type, is_primary)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (tutor_id, student_id) DO NOTHING
          `, [tutorData.id, studentData.id, 'parent', true]);
        }
      }
    }
    
    // Crear recompensas de ejemplo
    console.log('🎁 Creando recompensas de ejemplo...');
    const rewards = [
      {
        title: 'Tiempo extra de recreo',
        description: '15 minutos adicionales de recreo',
        points_cost: 50,
        category: 'privilege',
        stock: 10
      },
      {
        title: 'Stickers especiales',
        description: 'Pack de stickers coleccionables',
        points_cost: 25,
        category: 'material',
        stock: 20
      },
      {
        title: 'Certificado de reconocimiento',
        description: 'Certificado personalizado de buen comportamiento',
        points_cost: 100,
        category: 'academic',
        stock: 5
      }
    ];
    
    for (const reward of rewards) {
      await db.query(`
        INSERT INTO rewards (title, description, points_cost, category, stock, active)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT DO NOTHING
      `, [reward.title, reward.description, reward.points_cost, reward.category, reward.stock, true]);
    }
    
    // Crear notificaciones de ejemplo
    console.log('🔔 Creando notificaciones de ejemplo...');
    if (studentResult.length > 0) {
      await db.query(`
        INSERT INTO notifications (user_id, title, message, type)
        VALUES ($1, $2, $3, $4)
      `, [studentResult[0].id, 'Bienvenido a AmistApp', 'Te damos la bienvenida a nuestra plataforma de gestión socioemocional', 'info']);
    }
    
    if (teacherResult.length > 0) {
      await db.query(`
        INSERT INTO notifications (user_id, title, message, type)
        VALUES ($1, $2, $3, $4)
      `, [teacherResult[0].id, 'Panel de profesor activado', 'Ya puedes gestionar a tus estudiantes desde el panel de profesor', 'success']);
    }
    
    console.log('✅ Seed de base de datos completado exitosamente');
    console.log('📋 Usuarios creados:');
    console.log('   - Admin: admin@amistapp.com / admin123');
    console.log('   - Profesor: profesor@amistapp.com / teacher123');
    console.log('   - Estudiante: estudiante@amistapp.com / student123');
    console.log('   - Tutor: tutor@amistapp.com / tutor123');
    
  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    throw error;
  } finally {
    await closeDatabase();
  }
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase().catch(console.error);
}

export { seedDatabase };