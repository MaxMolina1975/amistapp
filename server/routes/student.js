import express from 'express';
import { register, getStudentConfig, updateStudentConfig, changeStudentPassword, updateStudentProfile } from '../controllers/studentController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Ruta pública para registro
router.post('/register', register);

// Aplicar middleware de autenticación a todas las rutas protegidas
router.use(authenticateToken);

// Rutas de configuración del estudiante (protegidas)
router.get('/config', getStudentConfig);
router.put('/config', updateStudentConfig);
router.post('/change-password', changeStudentPassword);
router.put('/profile', updateStudentProfile);

export default router;