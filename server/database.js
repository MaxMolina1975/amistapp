import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Asegurar que el directorio de la base de datos existe
const dbDir = join(__dirname);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Crear conexión a la base de datos con better-sqlite3
let db;
try {
  db = new Database(join(__dirname, 'amistapp.db'), { 
    verbose: console.log,
    fileMustExist: false // Permite crear la base de datos si no existe
  });
  console.log('Conectado a la base de datos SQLite con better-sqlite3');
  initializeDatabase();
} catch (err) {
  console.error('Error al conectar con la base de datos:', err);
  process.exit(1); // Terminar el proceso si no podemos conectar a la DB
}

// Adaptadores para mantener la compatibilidad con el código existente que usa Async
db.runAsync = function(sql, params = []) {
  return new Promise((resolve, reject) => {
    try {
      const stmt = this.prepare(sql);
      const result = stmt.run(params);
      resolve(result);
    } catch (err) {
      reject(err);
    }
  });
};

db.getAsync = function(sql, params = []) {
  return new Promise((resolve, reject) => {
    try {
      const stmt = this.prepare(sql);
      const result = stmt.get(params);
      resolve(result);
    } catch (err) {
      reject(err);
    }
  });
};

db.allAsync = function(sql, params = []) {
  return new Promise((resolve, reject) => {
    try {
      const stmt = this.prepare(sql);
      const result = stmt.all(params);
      resolve(result);
    } catch (err) {
      reject(err);
    }
  });
};

// Inicializar esquema de la base de datos
function initializeDatabase() {
  const schemaPath = join(__dirname, 'schema.sql');
  
  try {
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Habilitar claves foráneas
    db.exec('PRAGMA foreign_keys = ON');
    
    // Ejecutar el esquema completo
    db.exec(schema);
    
    // Insertar usuario administrador por defecto si no existe
    const adminExists = db.prepare('SELECT 1 FROM users WHERE role = \'admin\' LIMIT 1').get();
    
    if (!adminExists) {
      db.prepare(`
        INSERT INTO users (name, email, password, role, status)
        VALUES (?, ?, ?, 'admin', 'active')
      `).run(
        'Administrador',
        'admin@amistapp.cl',
        // Contraseña: admin123 (debe ser cambiada en el primer inicio de sesión)
        '$2b$10$8Kvh3IxH8tKe3YOIXnBk7.u.oL5QYt1kRnJyW9DQGQ3YNh8kflZPy'
      );
      console.log('Usuario administrador creado');
    }
    
    console.log('Esquema de base de datos inicializado correctamente');
  } catch (err) {
    if (!err.message.includes('already exists')) {
      console.error('Error al inicializar la base de datos:', err);
      process.exit(1);
    }
  }
}

// Función para ejecutar una transacción
db.transaction = function(callback) {
  try {
    db.exec('BEGIN');
    const result = callback();
    db.exec('COMMIT');
    return result;
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
};

// Función para obtener estadísticas generales para el panel de administrador
db.getAdminStats = function() {
  return {
    users: db.prepare('SELECT COUNT(*) as total, role FROM users GROUP BY role').all(),
    reports: db.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
        SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolved,
        SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) as closed
      FROM reports
    `).get(),
    rewards: db.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN active = 1 THEN 1 ELSE 0 END) as active,
        SUM(stock) as total_stock
      FROM rewards
    `).get(),
    reward_claims: db.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected
      FROM reward_redemptions
    `).get()
  };
};

export { db };