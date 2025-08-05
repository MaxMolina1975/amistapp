import Database from 'better-sqlite3';
import mysql from 'mysql2/promise';
import pg from 'pg';
import { dbConfig } from '../config/database.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let db = null;

/**
 * Inicializa la conexión a la base de datos según el tipo configurado
 */
export async function initializeDatabase() {
  try {
    switch (dbConfig.type) {
      case 'sqlite':
        db = await initializeSQLite();
        break;
      case 'mysql':
        db = await initializeMySQL();
        break;
      case 'postgresql':
        db = await initializePostgreSQL();
        break;
      default:
        throw new Error(`Tipo de base de datos no soportado: ${dbConfig.type}`);
    }
    
    console.log(`✅ Conexión a base de datos ${dbConfig.type.toUpperCase()} establecida`);
    return db;
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error);
    throw error;
  }
}

/**
 * Inicializa SQLite
 */
async function initializeSQLite() {
  // Asegurar que el directorio existe
  const dbDir = dirname(dbConfig.sqlite.path);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  
  const database = new Database(dbConfig.sqlite.path, dbConfig.sqlite.options);
  
  // Habilitar claves foráneas
  database.exec('PRAGMA foreign_keys = ON');
  database.exec('PRAGMA journal_mode = WAL');
  
  // Agregar métodos async para compatibilidad
  database.runAsync = function(sql, params = []) {
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
  
  database.getAsync = function(sql, params = []) {
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
  
  database.allAsync = function(sql, params = []) {
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
  
  return database;
}

/**
 * Inicializa MySQL
 */
async function initializeMySQL() {
  const pool = mysql.createPool(dbConfig.mysql);
  
  // Probar la conexión
  const connection = await pool.getConnection();
  await connection.ping();
  connection.release();
  
  return {
    async query(sql, params = []) {
      const [rows] = await pool.execute(sql, params);
      return rows;
    },
    
    async get(sql, params = []) {
      const [rows] = await pool.execute(sql, params);
      return rows[0] || null;
    },
    
    async run(sql, params = []) {
      const [result] = await pool.execute(sql, params);
      return result;
    },
    
    async close() {
      await pool.end();
    }
  };
}

/**
 * Inicializa PostgreSQL
 */
async function initializePostgreSQL() {
  const { Pool } = pg;
  const pool = new Pool(dbConfig.postgresql);
  
  // Probar la conexión
  const client = await pool.connect();
  await client.query('SELECT NOW()');
  client.release();
  
  return {
    async query(sql, params = []) {
      const result = await pool.query(sql, params);
      return result.rows;
    },
    
    async get(sql, params = []) {
      const result = await pool.query(sql, params);
      return result.rows[0] || null;
    },
    
    async run(sql, params = []) {
      const result = await pool.query(sql, params);
      return result;
    },
    
    async close() {
      await pool.end();
    }
  };
}

/**
 * Obtiene la instancia de la base de datos
 */
export function getDatabase() {
  if (!db) {
    throw new Error('Base de datos no inicializada. Llama a initializeDatabase() primero.');
  }
  return db;
}

/**
 * Cierra la conexión a la base de datos
 */
export async function closeDatabase() {
  if (db && typeof db.close === 'function') {
    await db.close();
    db = null;
    console.log('✅ Conexión a base de datos cerrada');
  }
}