import express from 'express';
import { 
    getStudents,
    addStudent,
    updateStudentPoints,
    getRewards,
    createReward,
    getEmotionalReports,
    createActivity,
    getActivities
} from '../controllers/teacherController.js';

const router = express.Router();

// Rutas de estudiantes
router.get('/students', getStudents);
router.post('/students', addStudent);
router.put('/students/:studentId/points', updateStudentPoints);

// Rutas de premios
router.get('/rewards', getRewards);
router.post('/rewards', createReward);

// Rutas de reportes emocionales
router.get('/emotional-reports', getEmotionalReports);

// Rutas de actividades
router.get('/activities', getActivities);
router.post('/activities', createActivity);

export default router;
