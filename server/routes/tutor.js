import express from 'express';
import { register, login, getProfile, getTutorConfig, updateTutorConfig, updateTutorProfile, changeTutorPassword } from '../controllers/tutorController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Rutas públicas
router.post('/register', register);
router.post('/login', login);

// Rutas protegidas
router.get('/profile', authenticateToken, getProfile);

// Rutas de configuración del tutor
router.get('/settings', authenticateToken, getTutorConfig);
router.put('/settings', authenticateToken, updateTutorConfig);
router.put('/profile', authenticateToken, updateTutorProfile);
router.put('/password', authenticateToken, changeTutorPassword);

export default router;
