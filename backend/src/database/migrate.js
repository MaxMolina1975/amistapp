import { initializeDatabase, getDatabase } from './connection.js';
import { defaultAdmin } from '../config/database.js';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Ejecuta las migraciones de la base de datos
 */
export async function runMigrations() {
  try {
    console.log('🔄 Iniciando migraciones de base de datos...');
    
    // Inicializar conexión
    await initializeDatabase();
    const db = getDatabase();
    
    // Leer y ejecutar el esquema
    const schemaPath = join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Para SQLite, ejecutar el esquema completo
    if (typeof db.exec === 'function') {
      db.exec(schema);
    } else {
      // Para MySQL/PostgreSQL, dividir y ejecutar cada statement
      const statements = schema.split(';').filter(stmt => stmt.trim());
      for (const statement of statements) {
        if (statement.trim()) {
          await db.query(statement);
        }
      }
    }
    
    console.log('✅ Esquema de base de datos creado exitosamente');
    
    // Crear usuario administrador por defecto
    await createDefaultAdmin(db);
    
    // Insertar configuración inicial del sistema
    await insertSystemConfig(db);
    
    // Insertar logros por defecto
    await insertDefaultAchievements(db);
    
    console.log('✅ Migraciones completadas exitosamente');
    
  } catch (error) {
    console.error('❌ Error durante las migraciones:', error);
    throw error;
  }
}

/**
 * Crea el usuario administrador por defecto
 */
async function createDefaultAdmin(db) {
  try {
    // Verificar si ya existe un administrador
    let adminExists;
    if (typeof db.prepare === 'function') {
      adminExists = db.prepare('SELECT 1 FROM users WHERE role = ? LIMIT 1').get('admin');
    } else {
      const result = await db.get('SELECT 1 FROM users WHERE role = ? LIMIT 1', ['admin']);
      adminExists = result;
    }
    
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(defaultAdmin.password, 12);
      
      if (typeof db.prepare === 'function') {
        db.prepare(`
          INSERT INTO users (name, email, password, role, status)
          VALUES (?, ?, ?, 'admin', 'active')
        `).run(defaultAdmin.name, defaultAdmin.email, hashedPassword);
      } else {
        await db.run(`
          INSERT INTO users (name, email, password, role, status)
          VALUES (?, ?, ?, 'admin', 'active')
        `, [defaultAdmin.name, defaultAdmin.email, hashedPassword]);
      }
      
      console.log(`✅ Usuario administrador creado: ${defaultAdmin.email}`);
      console.log(`🔑 Contraseña temporal: ${defaultAdmin.password}`);
      console.log('⚠️  IMPORTANTE: Cambia la contraseña en el primer inicio de sesión');
    } else {
      console.log('ℹ️  Usuario administrador ya existe');
    }
  } catch (error) {
    console.error('❌ Error al crear usuario administrador:', error);
    throw error;
  }
}

/**
 * Inserta configuración inicial del sistema
 */
async function insertSystemConfig(db) {
  const configs = [
    {
      key: 'app_name',
      value: 'AmistApp',
      description: 'Nombre de la aplicación'
    },
    {
      key: 'app_version',
      value: '1.0.0',
      description: 'Versión de la aplicación'
    },
    {
      key: 'points_per_report',
      value: '10',
      description: 'Puntos otorgados por reporte válido'
    },
    {
      key: 'max_daily_reports',
      value: '5',
      description: 'Máximo de reportes por día por usuario'
    },
    {
      key: 'email_notifications',
      value: 'true',
      description: 'Habilitar notificaciones por email'
    },
    {
      key: 'maintenance_mode',
      value: 'false',
      description: 'Modo de mantenimiento'
    }
  ];
  
  try {
    for (const config of configs) {
      if (typeof db.prepare === 'function') {
        const stmt = db.prepare(`
          INSERT OR IGNORE INTO system_config (config_key, config_value, description)
          VALUES (?, ?, ?)
        `);
        stmt.run(config.key, config.value, config.description);
      } else {
        await db.run(`
          INSERT IGNORE INTO system_config (config_key, config_value, description)
          VALUES (?, ?, ?)
        `, [config.key, config.value, config.description]);
      }
    }
    console.log('✅ Configuración inicial del sistema insertada');
  } catch (error) {
    console.error('❌ Error al insertar configuración del sistema:', error);
  }
}

/**
 * Inserta logros por defecto
 */
async function insertDefaultAchievements(db) {
  const achievements = [
    {
      title: 'Primer Reporte',
      description: 'Realizaste tu primer reporte',
      points_reward: 5,
      category: 'participation',
      icon_url: '/icons/first-report.svg'
    },
    {
      title: 'Reportero Activo',
      description: 'Realizaste 10 reportes',
      points_reward: 25,
      category: 'participation',
      icon_url: '/icons/active-reporter.svg'
    },
    {
      title: 'Ayudante Emocional',
      description: 'Completaste 5 reportes emocionales',
      points_reward: 20,
      category: 'emotional',
      icon_url: '/icons/emotional-helper.svg'
    },
    {
      title: 'Colaborador',
      description: 'Participaste en 3 actividades',
      points_reward: 30,
      category: 'social',
      icon_url: '/icons/collaborator.svg'
    },
    {
      title: 'Líder Estudiantil',
      description: 'Alcanzaste 500 puntos',
      points_reward: 50,
      category: 'leadership',
      icon_url: '/icons/student-leader.svg'
    }
  ];
  
  try {
    for (const achievement of achievements) {
      if (typeof db.prepare === 'function') {
        const stmt = db.prepare(`
          INSERT OR IGNORE INTO achievements (title, description, points_reward, category, icon_url)
          VALUES (?, ?, ?, ?, ?)
        `);
        stmt.run(
          achievement.title,
          achievement.description,
          achievement.points_reward,
          achievement.category,
          achievement.icon_url
        );
      } else {
        await db.run(`
          INSERT IGNORE INTO achievements (title, description, points_reward, category, icon_url)
          VALUES (?, ?, ?, ?, ?)
        `, [
          achievement.title,
          achievement.description,
          achievement.points_reward,
          achievement.category,
          achievement.icon_url
        ]);
      }
    }
    console.log('✅ Logros por defecto insertados');
  } catch (error) {
    console.error('❌ Error al insertar logros por defecto:', error);
  }
}

// Ejecutar migraciones si el archivo se ejecuta directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigrations()
    .then(() => {
      console.log('🎉 Migraciones completadas exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error en las migraciones:', error);
      process.exit(1);
    });
}