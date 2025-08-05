import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// Configuración
import { serverConfig } from './config/database.js';
import { initializeDatabase, closeDatabase } from './database/connection.js';

// Middlewares
import { errorHandler } from './middleware/errorHandler.js';
import { authMiddleware } from './middleware/auth.js';
import { auditMiddleware } from './middleware/audit.js';

// Rutas
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import reportsRoutes from './routes/reports.js';
import rewardsRoutes from './routes/rewards.js';
import teachersRoutes from './routes/teachers.js';
import studentsRoutes from './routes/students.js';
import tutorsRoutes from './routes/tutors.js';
import activitiesRoutes from './routes/activities.js';
import notificationsRoutes from './routes/notifications.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno
dotenv.config();

// Crear aplicación Express
const app = express();

// Configurar logging
const logDir = join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Middlewares de seguridad
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: serverConfig.rateLimit.windowMs,
  max: serverConfig.rateLimit.max,
  message: {
    error: 'Demasiadas solicitudes desde esta IP, intenta de nuevo más tarde.',
    retryAfter: Math.ceil(serverConfig.rateLimit.windowMs / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/', limiter);

// CORS
app.use(cors({
  origin: serverConfig.cors.origins,
  credentials: serverConfig.cors.credentials,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Middlewares generales
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (serverConfig.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', {
    stream: fs.createWriteStream(join(logDir, 'access.log'), { flags: 'a' })
  }));
}

// Middleware de auditoría
app.use(auditMiddleware);

// Health check
app.get('/api/health', async (req, res) => {
  try {
    const db = await import('./database/connection.js').then(m => m.getDatabase());
    
    // Test de conexión a la base de datos
    let dbStatus = 'connected';
    try {
      if (typeof db.get === 'function') {
        db.prepare('SELECT 1').get();
      } else {
        await db.get('SELECT 1');
      }
    } catch (dbError) {
      dbStatus = 'disconnected';
    }
    
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: serverConfig.nodeEnv,
      database: dbStatus,
      uptime: process.uptime()
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      message: 'Service unavailable',
      timestamp: new Date().toISOString()
    });
  }
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/rewards', rewardsRoutes);
app.use('/api/teachers', teachersRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/tutors', tutorsRoutes);
app.use('/api/activities', activitiesRoutes);
app.use('/api/notifications', authMiddleware, notificationsRoutes);

// Ruta para servir archivos estáticos (avatares, imágenes, etc.)
app.use('/uploads', express.static(join(__dirname, '../uploads')));

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint no encontrado',
    message: `La ruta ${req.originalUrl} no existe`,
    timestamp: new Date().toISOString()
  });
});

// Middleware de manejo de errores
app.use(errorHandler);

// Función para iniciar el servidor
async function startServer() {
  try {
    // Inicializar base de datos
    console.log('🔄 Inicializando base de datos...');
    await initializeDatabase();
    console.log('✅ Base de datos inicializada');
    
    // Iniciar servidor
    const server = app.listen(serverConfig.port, serverConfig.host, () => {
      console.log(`🚀 Servidor iniciado en http://${serverConfig.host}:${serverConfig.port}`);
      console.log(`📊 Entorno: ${serverConfig.nodeEnv}`);
      console.log(`🔒 CORS habilitado para: ${serverConfig.cors.origins.join(', ')}`);
    });
    
    // Manejo de cierre graceful
    const gracefulShutdown = async (signal) => {
      console.log(`\n🛑 Recibida señal ${signal}. Cerrando servidor...`);
      
      server.close(async () => {
        console.log('🔌 Servidor HTTP cerrado');
        
        try {
          await closeDatabase();
          console.log('💾 Conexión a base de datos cerrada');
          process.exit(0);
        } catch (error) {
          console.error('❌ Error al cerrar la base de datos:', error);
          process.exit(1);
        }
      });
      
      // Forzar cierre después de 10 segundos
      setTimeout(() => {
        console.error('⏰ Forzando cierre del servidor...');
        process.exit(1);
      }, 10000);
    };
    
    // Escuchar señales de cierre
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    
    // Manejo de errores no capturados
    process.on('unhandledRejection', (reason, promise) => {
      console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    });
    
    process.on('uncaughtException', (error) => {
      console.error('❌ Uncaught Exception:', error);
      process.exit(1);
    });
    
  } catch (error) {
    console.error('💥 Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

// Iniciar servidor
startServer();

export default app;