import express from 'express';
import { db } from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Middleware para verificar rol de administrador
const requireAdmin = async (req, res, next) => {
  const userId = req.user.id;

  db.get(
    'SELECT role FROM users WHERE id = ?',
    [userId],
    (err, user) => {
      if (err || !user || user.role !== 'admin') {
        return res.status(403).json({ error: 'Acceso no autorizado' });
      }
      next();
    }
  );
};

// Usar middleware de autenticación y verificar rol de administrador
router.use(authenticateToken);
router.use(requireAdmin);

// Estadísticas del dashboard
router.get('/dashboard/stats', (req, res) => {
  const queries = {
    totalUsers: 'SELECT COUNT(*) as count FROM users',
    totalStudents: 'SELECT COUNT(*) as count FROM users WHERE role = "student"',
    totalTeachers: 'SELECT COUNT(*) as count FROM users WHERE role = "teacher"',
    totalTutors: 'SELECT COUNT(*) as count FROM users WHERE role = "tutor"',
    totalReports: 'SELECT COUNT(*) as count FROM reports',
    pendingReports: 'SELECT COUNT(*) as count FROM reports WHERE status = "pending"',
    totalRewards: 'SELECT COUNT(*) as count FROM rewards',
    totalActivities: 'SELECT COUNT(*) as count FROM activities'
  };

  const stats = {};
  let completed = 0;
  const total = Object.keys(queries).length;

  Object.entries(queries).forEach(([key, query]) => {
    db.get(query, (err, result) => {
      if (err) {
        console.error(`Error en consulta ${key}:`, err);
        stats[key] = 0;
      } else {
        stats[key] = result.count || 0;
      }
      
      completed++;
      if (completed === total) {
        res.json(stats);
      }
    });
  });
});

// Obtener todos los usuarios
router.get('/users', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  db.all(
    `SELECT id, email, full_name, role, created_at, avatar_url 
     FROM users 
     ORDER BY created_at DESC 
     LIMIT ? OFFSET ?`,
    [limit, offset],
    (err, users) => {
      if (err) {
        console.error('Error al obtener usuarios:', err);
        return res.status(500).json({ error: 'Error al obtener usuarios' });
      }

      db.get('SELECT COUNT(*) as total FROM users', (err, countResult) => {
        if (err) {
          console.error('Error al contar usuarios:', err);
          return res.status(500).json({ error: 'Error al contar usuarios' });
        }

        res.json({
          users: users || [],
          pagination: {
            page,
            limit,
            total: countResult.total,
            pages: Math.ceil(countResult.total / limit)
          }
        });
      });
    }
  );
});

// Obtener todos los tutores
router.get('/tutors', (req, res) => {
  db.all(
    `SELECT u.id, u.email, u.full_name, u.created_at, u.avatar_url,
            t.phone, t.relationship, t.emergency_contact
     FROM users u
     LEFT JOIN tutors t ON u.id = t.id
     WHERE u.role = 'tutor'
     ORDER BY u.created_at DESC`,
    (err, tutors) => {
      if (err) {
        console.error('Error al obtener tutores:', err);
        return res.status(500).json({ error: 'Error al obtener tutores' });
      }
      res.json(tutors || []);
    }
  );
});

// Obtener todos los reportes
router.get('/reports', (req, res) => {
  db.all(
    `SELECT r.*, u.full_name as student_name, t.full_name as teacher_name
     FROM reports r
     LEFT JOIN users u ON r.student_id = u.id
     LEFT JOIN users t ON r.teacher_id = t.id
     ORDER BY r.created_at DESC`,
    (err, reports) => {
      if (err) {
        console.error('Error al obtener reportes:', err);
        return res.status(500).json({ error: 'Error al obtener reportes' });
      }
      res.json(reports || []);
    }
  );
});

// Obtener todas las recompensas
router.get('/rewards', (req, res) => {
  db.all(
    `SELECT r.*, t.full_name as teacher_name
     FROM rewards r
     LEFT JOIN users t ON r.teacher_id = t.id
     ORDER BY r.created_at DESC`,
    (err, rewards) => {
      if (err) {
        console.error('Error al obtener recompensas:', err);
        return res.status(500).json({ error: 'Error al obtener recompensas' });
      }
      res.json(rewards || []);
    }
  );
});

// Obtener todas las actividades
router.get('/activities', (req, res) => {
  db.all(
    `SELECT a.*, t.full_name as teacher_name
     FROM activities a
     LEFT JOIN users t ON a.teacher_id = t.id
     ORDER BY a.created_at DESC`,
    (err, activities) => {
      if (err) {
        console.error('Error al obtener actividades:', err);
        return res.status(500).json({ error: 'Error al obtener actividades' });
      }
      res.json(activities || []);
    }
  );
});

// Obtener todos los logros
router.get('/achievements', (req, res) => {
  db.all(
    `SELECT a.*, u.full_name as student_name
     FROM achievements a
     LEFT JOIN users u ON a.student_id = u.id
     ORDER BY a.created_at DESC`,
    (err, achievements) => {
      if (err) {
        console.error('Error al obtener logros:', err);
        return res.status(500).json({ error: 'Error al obtener logros' });
      }
      res.json(achievements || []);
    }
  );
});

export default router;