import express from 'express';
import { db } from '../database.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { 
  getTeacherConfig, 
  updateTeacherConfig, 
  updateTeacherProfile, 
  changeTeacherPassword 
} from '../controllers/teacherController.js';

const router = express.Router();

// Middleware para verificar rol de profesor
const requireTeacher = async (req, res, next) => {
  const userId = req.user.id;

  db.get(
    'SELECT role FROM users WHERE id = ?',
    [userId],
    (err, user) => {
      if (err || !user || user.role !== 'teacher') {
        return res.status(403).json({ error: 'Acceso no autorizado' });
      }
      next();
    }
  );
};

// Usar middleware de autenticación y verificar rol de profesor
router.use(authenticateToken);
router.use(requireTeacher);

// Obtener información del panel
router.get('/dashboard', (req, res) => {
  const teacherId = req.user.id;

  db.get(
    `SELECT t.*, 
     (SELECT COUNT(*) FROM students s WHERE s.teacher_id = t.id) as student_count,
     (SELECT COUNT(*) FROM rewards r WHERE r.teacher_id = t.id AND strftime('%Y-%m', r.created_at) = strftime('%Y-%m', 'now')) as monthly_rewards
     FROM teachers t 
     WHERE t.id = ?`,
    [teacherId],
    (err, teacher) => {
      if (err) {
        console.error('Error al obtener datos del dashboard:', err);
        return res.status(500).json({ 
          error: 'Error al obtener datos del panel',
          details: err.message
        });
      }

      if (!teacher) {
        return res.status(404).json({ 
          error: 'Docente no encontrado',
          details: 'No se encontró el docente con el ID proporcionado'
        });
      }

      // Obtener estadísticas adicionales
      db.get(
        `SELECT 
         COUNT(*) as total_rewards,
         SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_alerts
         FROM rewards 
         WHERE teacher_id = ?`,
        [teacherId],
        (err, stats) => {
          if (err) {
            console.error('Error al obtener estadísticas:', err);
            return res.status(500).json({ 
              error: 'Error al obtener estadísticas',
              details: err.message
            });
          }

          res.json({
            teacher: {
              id: teacher.id,
              email: teacher.email,
              fullName: teacher.full_name,
              school: teacher.school,
              subject: teacher.subject
            },
            stats: {
              studentCount: teacher.student_count || 0,
              monthlyRewards: teacher.monthly_rewards || 0,
              totalRewards: stats?.total_rewards || 0,
              pendingAlerts: stats?.pending_alerts || 0
            }
          });
        }
      );
    }
  );
});

// Obtener lista de estudiantes
router.get('/students', (req, res) => {
  const teacherId = req.user.id;

  db.all(
    `SELECT * FROM students WHERE teacher_id = ? ORDER BY name`,
    [teacherId],
    (err, students) => {
      if (err) {
        console.error('Error al obtener estudiantes:', err);
        return res.status(500).json({ 
          error: 'Error al obtener la lista de estudiantes',
          details: err.message
        });
      }
      res.json(students || []);
    }
  );
});

// Obtener premios disponibles
router.get('/rewards', (req, res) => {
  const teacherId = req.user.id;

  db.all(
    `SELECT * FROM rewards WHERE teacher_id = ? ORDER BY created_at DESC`,
    [teacherId],
    (err, rewards) => {
      if (err) {
        console.error('Error al obtener premios:', err);
        return res.status(500).json({ 
          error: 'Error al obtener la lista de premios',
          details: err.message
        });
      }
      res.json(rewards || []);
    }
  );
});

// Crear nuevo premio
router.post('/rewards', (req, res) => {
  const teacherId = req.user.id;
  const { name, description, points, quantity } = req.body;

  if (!name || !points) {
    return res.status(400).json({ 
      error: 'Datos incompletos',
      details: 'El nombre y los puntos son requeridos'
    });
  }

  db.run(
    `INSERT INTO rewards (name, description, points, quantity, teacher_id, created_at)
     VALUES (?, ?, ?, ?, ?, datetime('now'))`,
    [name, description, points, quantity || null, teacherId],
    function(err) {
      if (err) {
        console.error('Error al crear premio:', err);
        return res.status(500).json({ 
          error: 'Error al crear el premio',
          details: err.message
        });
      }

      res.status(201).json({
        id: this.lastID,
        name,
        description,
        points,
        quantity,
        teacher_id: teacherId
      });
    }
  );
});

// Rutas de cursos
router.get('/courses', (req, res) => {
  const userId = req.user.id;

  db.all(
    'SELECT * FROM courses WHERE teacher_id = ?',
    [userId],
    (err, courses) => {
      if (err) {
        res.status(500).json({ error: 'Error al obtener los cursos' });
        return;
      }
      res.json(courses || []);
    }
  );
});

router.post('/courses', (req, res) => {
  const userId = req.user.id;
  const { name, code } = req.body;

  db.run(
    `INSERT INTO courses (name, code, teacher_id, created_at)
     VALUES (?, ?, ?, datetime('now'))`,
    [name, code, userId],
    function(err) {
      if (err) {
        res.status(500).json({ error: 'Error al crear el curso' });
        return;
      }

      db.get('SELECT * FROM courses WHERE id = ?', [this.lastID], (err, course) => {
        if (err) {
          res.status(500).json({ error: 'Error al obtener el curso creado' });
          return;
        }
        res.status(201).json(course);
      });
    }
  );
});

// Actualizar curso
router.patch('/courses/:id', (req, res) => {
  const courseId = req.params.id;
  const teacherId = req.user.id;
  const updateData = req.body;
  
  // Verificar que el curso pertenezca al profesor
  db.get(
    'SELECT * FROM courses WHERE id = ? AND teacher_id = ?',
    [courseId, teacherId],
    (err, course) => {
      if (err) {
        return res.status(500).json({ error: 'Error al verificar el curso' });
      }
      
      if (!course) {
        return res.status(404).json({ error: 'Curso no encontrado o no autorizado' });
      }
      
      // Verificar si el código ya existe (si se está actualizando el código)
      if (updateData.code) {
        db.get(
          'SELECT id FROM courses WHERE code = ? AND id != ?',
          [updateData.code, courseId],
          (err, existingCourse) => {
            if (err) {
              return res.status(500).json({ error: 'Error al verificar el código' });
            }
            
            if (existingCourse) {
              return res.status(400).json({ error: 'El código ya está en uso por otro curso' });
            }
            
            // Actualizar el curso
            updateCourse();
          }
        );
      } else {
        // Actualizar el curso sin verificar el código
        updateCourse();
      }
      
      function updateCourse() {
        // Construir la consulta de actualización dinámicamente
        const fields = Object.keys(updateData)
          .filter(key => key !== 'id' && key !== 'teacher_id')
          .map(key => `${key} = ?`)
          .join(', ');
        
        const values = Object.keys(updateData)
          .filter(key => key !== 'id' && key !== 'teacher_id')
          .map(key => updateData[key]);
        
        if (fields.length === 0) {
          return res.status(400).json({ error: 'No hay campos para actualizar' });
        }
        
        // Añadir updated_at
        const query = `UPDATE courses SET ${fields}, updated_at = datetime('now') WHERE id = ? AND teacher_id = ?`;
        values.push(courseId, teacherId);
        
        db.run(query, values, function(err) {
          if (err) {
            return res.status(500).json({ error: 'Error al actualizar el curso' });
          }
          
          if (this.changes === 0) {
            return res.status(404).json({ error: 'No se pudo actualizar el curso' });
          }
          
          // Devolver el curso actualizado
          db.get('SELECT * FROM courses WHERE id = ?', [courseId], (err, updatedCourse) => {
            if (err) {
              return res.status(500).json({ error: 'Error al obtener el curso actualizado' });
            }
            
            res.json(updatedCourse);
          });
        });
      }
    }
  );
});

// Rutas de miembros del curso
router.get('/courses/:courseId/members', (req, res) => {
  db.all(
    `SELECT m.*, u.full_name, u.avatar_url
     FROM course_members m
     JOIN users u ON m.user_id = u.id
     WHERE m.course_id = ?`,
    [req.params.courseId],
    (err, members) => {
      if (err) {
        res.status(500).json({ error: 'Error al obtener los miembros' });
        return;
      }
      res.json(members || []);
    }
  );
});

// Rutas de puntos
router.post('/points/award', (req, res) => {
  const { courseId, userId, amount, type, description } = req.body;
  const teacherId = req.user.id;

  db.run(
    `INSERT INTO point_transactions (
      course_id, user_id, amount, type, description, created_by, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`,
    [courseId, userId, amount, type, description, teacherId],
    function(err) {
      if (err) {
        res.status(500).json({ error: 'Error al otorgar puntos' });
        return;
      }

      db.get(
        'SELECT * FROM point_transactions WHERE id = ?',
        [this.lastID],
        (err, transaction) => {
          if (err) {
            res.status(500).json({ error: 'Error al obtener la transacción' });
            return;
          }
          res.status(201).json(transaction);
        }
      );
    }
  );
});

// Rutas de estadísticas
router.get('/stats', (req, res) => {
  const { courseId } = req.query;
  const teacherId = req.user.id;

  const queries = {
    totalStudents: `
      SELECT COUNT(*) as count 
      FROM course_members 
      WHERE course_id ${courseId ? '= ?' : 'IN (SELECT id FROM courses WHERE teacher_id = ?)'}`
    ,
    activeReports: `
      SELECT COUNT(*) as count 
      FROM reports 
      WHERE status = 'pending'`
    ,
    pointsDistributed: `
      SELECT SUM(amount) as total 
      FROM point_transactions 
      WHERE created_by = ?`
  };

  Promise.all([
    new Promise((resolve, reject) => {
      db.get(queries.totalStudents, [courseId || teacherId], (err, result) => {
        if (err) reject(err);
        else resolve(result?.count || 0);
      });
    }),
    new Promise((resolve, reject) => {
      db.get(queries.activeReports, [], (err, result) => {
        if (err) reject(err);
        else resolve(result?.count || 0);
      });
    }),
    new Promise((resolve, reject) => {
      db.get(queries.pointsDistributed, [teacherId], (err, result) => {
        if (err) reject(err);
        else resolve(result?.total || 0);
      });
    })
  ])
    .then(([totalStudents, activeReports, pointsDistributed]) => {
      res.json({
        totalStudents,
        activeReports,
        pointsDistributed,
        activeRewards: 0, // TODO: Implementar
        averageEmotionalIndex: 0 // TODO: Implementar
      });
    })
    .catch(err => {
      res.status(500).json({ error: 'Error al obtener las estadísticas' });
    });
});

// Rutas de configuración del profesor
router.get('/settings', getTeacherConfig);
router.put('/settings', updateTeacherConfig);
router.put('/profile', updateTeacherProfile);
router.put('/password', changeTeacherPassword);

export default router;