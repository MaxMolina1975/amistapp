import express from 'express';
import { db } from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Middleware para verificar rol de administrador
const requireAdmin = (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = db.prepare('SELECT role FROM users WHERE id = ?').get(userId);
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Acceso no autorizado' });
    }
    next();
  } catch (error) {
    console.error('Error al verificar rol de administrador:', error);
    return res.status(500).json({ error: 'Error al verificar permisos' });
  }
};

// Usar middleware de autenticación y verificar rol de administrador
router.use(authenticateToken);
router.use(requireAdmin);

// Estadísticas del dashboard
router.get('/dashboard/stats', (req, res) => {
  try {
    const stats = {
      totalUsers: db.prepare('SELECT COUNT(*) as count FROM users').get().count,
      totalStudents: db.prepare('SELECT COUNT(*) as count FROM users WHERE role = "student"').get().count,
      totalTeachers: db.prepare('SELECT COUNT(*) as count FROM users WHERE role = "teacher"').get().count,
      totalTutors: db.prepare('SELECT COUNT(*) as count FROM users WHERE role = "tutor"').get().count,
      totalReports: db.prepare('SELECT COUNT(*) as count FROM reports').get().count,
      pendingReports: db.prepare('SELECT COUNT(*) as count FROM reports WHERE status = "pending"').get().count,
      totalRewards: db.prepare('SELECT COUNT(*) as count FROM rewards').get().count,
      totalActivities: db.prepare('SELECT COUNT(*) as count FROM activities').get().count
    };

    res.json(stats);
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

// Obtener todos los usuarios
router.get('/users', (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const users = db.prepare(`
      SELECT id, email, name, role, created_at, status 
      FROM users 
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `).all(limit, offset);

    const countResult = db.prepare('SELECT COUNT(*) as total FROM users').get();

    res.json({
      users: users || [],
      pagination: {
        page,
        limit,
        total: countResult.total,
        pages: Math.ceil(countResult.total / limit)
      }
    });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// Obtener todos los tutores
router.get('/tutors', (req, res) => {
  try {
    const tutors = db.prepare(`
      SELECT u.id, u.email, u.name, u.created_at, u.status,
             t.phone, t.relationship
      FROM users u
      LEFT JOIN tutors t ON u.id = t.user_id
      WHERE u.role = 'tutor'
      ORDER BY u.created_at DESC
    `).all();

    res.json(tutors || []);
  } catch (error) {
    console.error('Error al obtener tutores:', error);
    res.status(500).json({ error: 'Error al obtener tutores' });
  }
});

// Obtener todos los reportes
router.get('/reports', (req, res) => {
  try {
    const reports = db.prepare(`
      SELECT r.*, u.name as user_name
      FROM reports r
      LEFT JOIN users u ON r.user_id = u.id
      ORDER BY r.created_at DESC
    `).all();

    res.json(reports || []);
  } catch (error) {
    console.error('Error al obtener reportes:', error);
    res.status(500).json({ error: 'Error al obtener reportes' });
  }
});

// Obtener todas las recompensas
router.get('/rewards', (req, res) => {
  try {
    const rewards = db.prepare(`
      SELECT * FROM rewards 
      ORDER BY created_at DESC
    `).all();

    res.json(rewards || []);
  } catch (error) {
    console.error('Error al obtener recompensas:', error);
    res.status(500).json({ error: 'Error al obtener recompensas' });
  }
});

// Obtener todas las actividades
router.get('/activities', (req, res) => {
  try {
    const activities = db.prepare(`
      SELECT a.*, u.name as teacher_name
      FROM activities a
      LEFT JOIN teachers t ON a.teacher_id = t.id
      LEFT JOIN users u ON t.user_id = u.id
      ORDER BY a.created_at DESC
    `).all();

    res.json(activities || []);
  } catch (error) {
    console.error('Error al obtener actividades:', error);
    res.status(500).json({ error: 'Error al obtener actividades' });
  }
});

// Obtener todos los logros
router.get('/achievements', (req, res) => {
  try {
    const achievements = db.prepare(`
      SELECT * FROM achievements
      ORDER BY created_at DESC
    `).all();

    res.json(achievements || []);
  } catch (error) {
    console.error('Error al obtener logros:', error);
    res.status(500).json({ error: 'Error al obtener logros' });
  }
});

export default router;