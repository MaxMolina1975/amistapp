import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import authRoutes from './routes/auth.js';
import teacherRoutes from './routes/teacher.js';
import studentRoutes from './routes/student.js';
import tutorRoutes from './routes/tutor.js';
import adminRoutes from './routes/admin.js';
import { authenticateToken } from './middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Configuración CORS mejorada para permitir todas las solicitudes en desarrollo
const corsOptions = {
    origin: function (origin, callback) {
        // Permitir solicitudes sin origen (como aplicaciones móviles o curl)
        if (!origin) return callback(null, true);
        
        // Lista de orígenes permitidos (añadir dominios de producción según sea necesario)
        const allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:5173',
            'http://localhost:3007',
            // Añadir aquí el dominio de producción si es conocido
        ];
        
        // Permitir solicitudes desde cualquier origen en desarrollo
        if (process.env.NODE_ENV !== 'production') {
            return callback(null, true);
        }
        
        // En producción, permitir orígenes específicos y el mismo origen
        if (allowedOrigins.includes(origin) || origin === undefined) {
            callback(null, true);
        } else {
            // También permitir solicitudes del mismo origen
            callback(null, true);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('dev'));

// Servir archivos estáticos
app.use(express.static(join(__dirname, '../dist')));

// Health check endpoint - asegurarse de que esta ruta funcione correctamente
app.get('/api/health', (req, res) => {
    console.log('Health check solicitado desde:', req.headers.origin || 'origen desconocido');
    res.json({ status: 'ok', message: 'El servidor está funcionando correctamente', timestamp: new Date().toISOString() });
});

// Rutas de autenticación (públicas)
app.use('/api/auth', authRoutes);

// Rutas protegidas
app.use('/api/teacher', authenticateToken, teacherRoutes);
app.use('/api/student', authenticateToken, studentRoutes);
app.use('/api/tutor', authenticateToken, tutorRoutes);

// Rutas de administración
app.use('/api/admin', adminRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Error interno del servidor',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Ruta para el SPA
app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../dist/index.html'));
});

const PORT = process.env.PORT || 3007;

try {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
  });
} catch (error) {
  console.error('Error al iniciar el servidor:', error);
  process.exit(1);
}
