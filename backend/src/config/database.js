import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuración de base de datos basada en variables de entorno
export const dbConfig = {
  type: process.env.DB_TYPE || 'sqlite',
  
  // Configuración SQLite
  sqlite: {
    path: process.env.DB_PATH || join(__dirname, '../../data/amistapp.db'),
    options: {
      verbose: process.env.NODE_ENV === 'development' ? console.log : null,
      fileMustExist: false
    }
  },
  
  // Configuración MySQL
  mysql: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    database: process.env.DB_NAME || 'amistapp',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    connectionLimit: 10,
    acquireTimeout: 60000,
    timeout: 60000
  },
  
  // Configuración PostgreSQL
  postgresql: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || 'amistapp',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
  }
};

// Configuración del servidor
export const serverConfig = {
  port: parseInt(process.env.PORT) || 3001,
  host: process.env.HOST || 'localhost',
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Configuración JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback_secret_key',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  },
  
  // Configuración CORS
  cors: {
    origins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'],
    credentials: true
  },
  
  // Configuración Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
  },
  
  // Configuración de logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || './logs/app.log'
  }
};

// Configuración del admin por defecto
export const defaultAdmin = {
  email: process.env.DEFAULT_ADMIN_EMAIL || 'admin@amistapp.com',
  password: process.env.DEFAULT_ADMIN_PASSWORD || 'admin123',
  name: process.env.DEFAULT_ADMIN_NAME || 'Administrador Sistema'
};