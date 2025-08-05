import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './database.js';
import reportsRouter from './routes/reports.js';
import rewardsRouter from './routes/rewards.js';
import teacherRouter from './routes/teacher.js';
import tutorRouter from './routes/tutor.js';
import subscriptionRouter from './routes/subscription.js';
import authRouter from './routes/auth.js';
import adminRouter from './routes/admin.js';

dotenv.config();

// Debug de variables de entorno
console.log('PORT:', process.env.PORT);
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Configurado' : 'No configurado');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5174', 'http://127.0.0.1:5174'],
  credentials: true
}));
app.use(express.json());

// Debug middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    // Verificar la conexión a la base de datos
    await db.get('SELECT 1');
    res.json({ 
      status: 'ok',
      message: 'Server is running',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error en health check:', error);
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      details: error.message
    });
  }
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/rewards', rewardsRouter);
app.use('/api/teacher', teacherRouter);
app.use('/api/tutor', tutorRouter);
app.use('/api/subscription', subscriptionRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    details: err.message
  });
});

// Start server
const server = app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`El puerto ${port} está en uso. Por favor, cierre otras aplicaciones que puedan estar usando este puerto.`);
  } else {
    console.error('Error al iniciar el servidor:', err);
  }
  process.exit(1);
});