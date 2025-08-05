import express from 'express';
import bcrypt from 'bcryptjs';
import { authMiddleware, requireRole } from '../middleware/auth.js';
import { auditMiddleware } from '../middleware/audit.js';
import { getDatabase } from '../database/connection.js';
import { asyncHandler, errors } from '../middleware/errorHandler.js';
import { 
  validateTutorUpdate, 
  validatePasswordChange, 
  validateTutorConfig,
  validateStudentFilters,
  validateTutorRegistration,
  validateStudentAssignment,
  validateTutorReportFilters
} from '../validators/tutors.js';

const router = express.Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(authMiddleware);

/**
 * @route GET /api/tutors/profile
 * @desc Obtener perfil del tutor
 * @access Tutor
 */
router.get('/profile', requireRole(['tutor']), async (req, res) => {
  try {
    const db = getDatabase();
    
    const tutor = await db.get(`
      SELECT id, name, email, phone, avatar_url, role, status, 
             points, created_at, updated_at
      FROM users 
      WHERE id = ? AND role = 'tutor'
    `, [req.user.id]);

    if (!tutor) {
      return res.status(404).json({
        error: 'Tutor no encontrado'
      });
    }

    res.json({ data: tutor });

  } catch (error) {
    console.error('Error al obtener perfil del tutor:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      details: error.message
    });
  }
});

/**
 * @route PUT /api/tutors/profile
 * @desc Actualizar perfil del tutor
 * @access Tutor
 */
router.put('/profile', requireRole(['tutor']), auditMiddleware, async (req, res) => {
  try {
    const { error, value } = validateTutorUpdate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Datos inválidos',
        details: error.details.map(detail => detail.message)
      });
    }

    const db = getDatabase();

    // Verificar si el email ya está en uso por otro usuario
    if (value.email) {
      const existingUser = await db.get(`
        SELECT id FROM users 
        WHERE email = ? AND id != ?
      `, [value.email, req.user.id]);

      if (existingUser) {
        return res.status(400).json({
          error: 'El email ya está en uso por otro usuario'
        });
      }
    }

    // Construir consulta de actualización dinámicamente
    const updates = [];
    const params = [];

    Object.keys(value).forEach(key => {
      if (value[key] !== undefined) {
        updates.push(`${key} = ?`);
        params.push(value[key]);
      }
    });

    if (updates.length === 0) {
      return res.status(400).json({
        error: 'No hay campos para actualizar'
      });
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(req.user.id);

    await db.run(`
      UPDATE users 
      SET ${updates.join(', ')} 
      WHERE id = ?
    `, params);

    const updatedTutor = await db.get(`
      SELECT id, name, email, phone, avatar_url, role, status, 
             points, created_at, updated_at
      FROM users 
      WHERE id = ?
    `, [req.user.id]);

    res.json({
      message: 'Perfil actualizado exitosamente',
      data: updatedTutor
    });

  } catch (error) {
    console.error('Error al actualizar perfil del tutor:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      details: error.message
    });
  }
});

/**
 * @route PUT /api/tutors/password
 * @desc Cambiar contraseña del tutor
 * @access Tutor
 */
router.put('/password', requireRole(['tutor']), auditMiddleware, async (req, res) => {
  try {
    const { error, value } = validatePasswordChange(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Datos inválidos',
        details: error.details.map(detail => detail.message)
      });
    }

    const db = getDatabase();

    // Verificar contraseña actual
    const user = await db.get(`
      SELECT password FROM users WHERE id = ?
    `, [req.user.id]);

    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado'
      });
    }

    const isPasswordValid = await bcrypt.compare(value.currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'La contraseña actual es incorrecta'
      });
    }

    // Generar hash de la nueva contraseña
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(value.newPassword, saltRounds);

    // Actualizar contraseña
    await db.run(`
      UPDATE users 
      SET password = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `, [hashedPassword, req.user.id]);

    res.json({
      message: 'Contraseña actualizada exitosamente'
    });

  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      details: error.message
    });
  }
});

/**
 * @route GET /api/tutors/dashboard
 * @desc Obtener datos del dashboard del tutor
 * @access Tutor
 */
router.get('/dashboard', requireRole(['tutor']), async (req, res) => {
  try {
    const db = getDatabase();

    // Obtener estadísticas básicas
    const stats = await db.get(`
      SELECT 
        (SELECT COUNT(*) FROM tutor_students WHERE tutor_id = ?) as total_students,
        (SELECT COUNT(*) FROM reports r 
         JOIN tutor_students ts ON r.student_id = ts.student_id 
         WHERE ts.tutor_id = ?) as total_reports,
        (SELECT COUNT(*) FROM reports r 
         JOIN tutor_students ts ON r.student_id = ts.student_id 
         WHERE ts.tutor_id = ? AND r.status = 'pending') as pending_reports,
        (SELECT COUNT(*) FROM activities a
         JOIN activity_participants ap ON a.id = ap.activity_id
         JOIN tutor_students ts ON ap.student_id = ts.student_id
         WHERE ts.tutor_id = ?) as student_activities
    `, [req.user.id, req.user.id, req.user.id, req.user.id]);

    // Obtener reportes recientes de estudiantes
    const recentReports = await db.all(`
      SELECT r.*, u.name as student_name, u2.name as reporter_name
      FROM reports r
      JOIN tutor_students ts ON r.student_id = ts.student_id
      JOIN users u ON r.student_id = u.id
      LEFT JOIN users u2 ON r.reporter_id = u2.id
      WHERE ts.tutor_id = ?
      ORDER BY r.created_at DESC
      LIMIT 5
    `, [req.user.id]);

    // Obtener estudiantes con más reportes
    const topStudents = await db.all(`
      SELECT u.id, u.name, u.avatar_url, COUNT(r.id) as report_count
      FROM users u
      JOIN tutor_students ts ON u.id = ts.student_id
      LEFT JOIN reports r ON u.id = r.student_id
      WHERE ts.tutor_id = ?
      GROUP BY u.id, u.name, u.avatar_url
      ORDER BY report_count DESC
      LIMIT 5
    `, [req.user.id]);

    res.json({
      data: {
        stats,
        recent_reports: recentReports,
        top_students: topStudents
      }
    });

  } catch (error) {
    console.error('Error al obtener dashboard del tutor:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      details: error.message
    });
  }
});

/**
 * @route GET /api/tutors/students
 * @desc Obtener estudiantes asignados al tutor
 * @access Tutor
 */
router.get('/students', requireRole(['tutor']), async (req, res) => {
  try {
    const { error, value } = validateStudentFilters(req.query);
    if (error) {
      return res.status(400).json({
        error: 'Parámetros de filtro inválidos',
        details: error.details.map(detail => detail.message)
      });
    }

    const { page, limit, search, status, sort_by, sort_order } = value;
    const offset = (page - 1) * limit;
    const db = getDatabase();

    // Construir consulta base
    let query = `
      SELECT u.id, u.name, u.email, u.avatar_url, u.points, u.status,
             u.created_at, ts.assigned_at,
             COUNT(r.id) as report_count,
             COUNT(CASE WHEN r.status = 'pending' THEN 1 END) as pending_reports
      FROM users u
      JOIN tutor_students ts ON u.id = ts.student_id
      LEFT JOIN reports r ON u.id = r.student_id
      WHERE ts.tutor_id = ? AND u.role = 'student'
    `;
    
    const params = [req.user.id];

    // Aplicar filtros
    if (search) {
      query += ' AND (u.name LIKE ? OR u.email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (status) {
      query += ' AND u.status = ?';
      params.push(status);
    }

    query += ' GROUP BY u.id, u.name, u.email, u.avatar_url, u.points, u.status, u.created_at, ts.assigned_at';

    // Aplicar ordenamiento
    const validSortColumns = {
      'name': 'u.name',
      'email': 'u.email',
      'points': 'u.points',
      'report_count': 'report_count',
      'assigned_at': 'ts.assigned_at',
      'created_at': 'u.created_at'
    };

    if (validSortColumns[sort_by]) {
      query += ` ORDER BY ${validSortColumns[sort_by]} ${sort_order.toUpperCase()}`;
    }

    // Aplicar paginación
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const students = await db.all(query, params);

    // Contar total para paginación
    let countQuery = `
      SELECT COUNT(DISTINCT u.id) as total
      FROM users u
      JOIN tutor_students ts ON u.id = ts.student_id
      WHERE ts.tutor_id = ? AND u.role = 'student'
    `;
    
    const countParams = [req.user.id];

    if (search) {
      countQuery += ' AND (u.name LIKE ? OR u.email LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`);
    }

    if (status) {
      countQuery += ' AND u.status = ?';
      countParams.push(status);
    }

    const totalResult = await db.get(countQuery, countParams);
    const total = totalResult.total;

    res.json({
      data: students,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error al obtener estudiantes del tutor:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      details: error.message
    });
  }
});

/**
 * @route GET /api/tutors/students/:id
 * @desc Obtener detalles de un estudiante específico
 * @access Tutor
 */
router.get('/students/:id', requireRole(['tutor']), async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();

    // Verificar que el estudiante está asignado al tutor
    const student = await db.get(`
      SELECT u.*, ts.assigned_at
      FROM users u
      JOIN tutor_students ts ON u.id = ts.student_id
      WHERE u.id = ? AND ts.tutor_id = ? AND u.role = 'student'
    `, [id, req.user.id]);

    if (!student) {
      return res.status(404).json({
        error: 'Estudiante no encontrado o no asignado'
      });
    }

    // Obtener reportes del estudiante
    const reports = await db.all(`
      SELECT r.*, u.name as reporter_name
      FROM reports r
      LEFT JOIN users u ON r.reporter_id = u.id
      WHERE r.student_id = ?
      ORDER BY r.created_at DESC
      LIMIT 10
    `, [id]);

    // Obtener actividades del estudiante
    const activities = await db.all(`
      SELECT a.title, a.type, ap.completed, ap.completed_at, ap.points_awarded
      FROM activities a
      JOIN activity_participants ap ON a.id = ap.activity_id
      WHERE ap.student_id = ?
      ORDER BY ap.joined_at DESC
      LIMIT 10
    `, [id]);

    // Obtener estadísticas del estudiante
    const stats = await db.get(`
      SELECT 
        COUNT(r.id) as total_reports,
        COUNT(CASE WHEN r.status = 'pending' THEN 1 END) as pending_reports,
        COUNT(CASE WHEN r.status = 'resolved' THEN 1 END) as resolved_reports,
        COUNT(ap.id) as total_activities,
        COUNT(CASE WHEN ap.completed = 1 THEN 1 END) as completed_activities
      FROM reports r
      LEFT JOIN activity_participants ap ON r.student_id = ap.student_id
      WHERE r.student_id = ?
    `, [id]);

    res.json({
      data: {
        student,
        reports,
        activities,
        stats
      }
    });

  } catch (error) {
    console.error('Error al obtener detalles del estudiante:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      details: error.message
    });
  }
});

/**
 * @route GET /api/tutors/config
 * @desc Obtener configuración del tutor
 * @access Tutor
 */
router.get('/config', requireRole(['tutor']), async (req, res) => {
  try {
    const db = getDatabase();

    let config = await db.get(`
      SELECT * FROM tutor_config WHERE user_id = ?
    `, [req.user.id]);

    // Si no existe configuración, crear una por defecto
    if (!config) {
      const defaultConfig = {
        notifications: {
          email: true,
          push: true,
          reports: true,
          activities: true,
          student_updates: true
        },
        privacy: {
          show_profile: true,
          allow_messages: true,
          show_students: false
        },
        preferences: {
          theme: 'light',
          language: 'es',
          timezone: 'America/Mexico_City',
          dashboard_layout: 'grid'
        }
      };

      await db.run(`
        INSERT INTO tutor_config (user_id, notifications, privacy, preferences)
        VALUES (?, ?, ?, ?)
      `, [
        req.user.id,
        JSON.stringify(defaultConfig.notifications),
        JSON.stringify(defaultConfig.privacy),
        JSON.stringify(defaultConfig.preferences)
      ]);

      config = await db.get(`
        SELECT * FROM tutor_config WHERE user_id = ?
      `, [req.user.id]);
    }

    // Parsear configuraciones JSON
    if (config.notifications) {
      config.notifications = JSON.parse(config.notifications);
    }
    if (config.privacy) {
      config.privacy = JSON.parse(config.privacy);
    }
    if (config.preferences) {
      config.preferences = JSON.parse(config.preferences);
    }

    res.json({ data: config });

  } catch (error) {
    console.error('Error al obtener configuración del tutor:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      details: error.message
    });
  }
});

/**
 * @route PUT /api/tutors/config
 * @desc Actualizar configuración del tutor
 * @access Tutor
 */
router.put('/config', requireRole(['tutor']), auditMiddleware, async (req, res) => {
  try {
    const { error, value } = validateTutorConfig(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Datos de configuración inválidos',
        details: error.details.map(detail => detail.message)
      });
    }

    const db = getDatabase();

    // Verificar si existe configuración
    const existingConfig = await db.get(`
      SELECT id FROM tutor_config WHERE user_id = ?
    `, [req.user.id]);

    if (!existingConfig) {
      // Crear nueva configuración
      await db.run(`
        INSERT INTO tutor_config (user_id, notifications, privacy, preferences)
        VALUES (?, ?, ?, ?)
      `, [
        req.user.id,
        value.notifications ? JSON.stringify(value.notifications) : '{}',
        value.privacy ? JSON.stringify(value.privacy) : '{}',
        value.preferences ? JSON.stringify(value.preferences) : '{}'
      ]);
    } else {
      // Actualizar configuración existente
      const updates = [];
      const params = [];

      if (value.notifications !== undefined) {
        updates.push('notifications = ?');
        params.push(JSON.stringify(value.notifications));
      }

      if (value.privacy !== undefined) {
        updates.push('privacy = ?');
        params.push(JSON.stringify(value.privacy));
      }

      if (value.preferences !== undefined) {
        updates.push('preferences = ?');
        params.push(JSON.stringify(value.preferences));
      }

      if (updates.length > 0) {
        updates.push('updated_at = CURRENT_TIMESTAMP');
        params.push(req.user.id);

        await db.run(`
          UPDATE tutor_config 
          SET ${updates.join(', ')} 
          WHERE user_id = ?
        `, params);
      }
    }

    // Obtener configuración actualizada
    const updatedConfig = await db.get(`
      SELECT * FROM tutor_config WHERE user_id = ?
    `, [req.user.id]);

    // Parsear configuraciones JSON
    if (updatedConfig.notifications) {
      updatedConfig.notifications = JSON.parse(updatedConfig.notifications);
    }
    if (updatedConfig.privacy) {
      updatedConfig.privacy = JSON.parse(updatedConfig.privacy);
    }
    if (updatedConfig.preferences) {
      updatedConfig.preferences = JSON.parse(updatedConfig.preferences);
    }

    res.json({
      message: 'Configuración actualizada exitosamente',
      data: updatedConfig
    });

  } catch (error) {
    console.error('Error al actualizar configuración del tutor:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      details: error.message
    });
  }
});

/**
 * @route POST /api/tutors/register
 * @desc Registrar nuevo tutor (solo admin)
 * @access Admin
 */
router.post('/register', requireRole(['admin']), auditMiddleware, async (req, res) => {
  try {
    const { error, value } = validateTutorRegistration(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Datos de registro inválidos',
        details: error.details.map(detail => detail.message)
      });
    }

    const db = getDatabase();

    // Verificar si el email ya existe
    const existingUser = await db.get(`
      SELECT id FROM users WHERE email = ?
    `, [value.email]);

    if (existingUser) {
      return res.status(400).json({
        error: 'El email ya está registrado'
      });
    }

    // Generar hash de la contraseña
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(value.password, saltRounds);

    // Crear usuario tutor
    const result = await db.run(`
      INSERT INTO users (name, email, password, role, phone, avatar_url, status)
      VALUES (?, ?, ?, 'tutor', ?, ?, 'active')
    `, [
      value.name,
      value.email,
      hashedPassword,
      value.phone,
      value.avatar_url
    ]);

    const newTutor = await db.get(`
      SELECT id, name, email, phone, avatar_url, role, status, created_at
      FROM users WHERE id = ?
    `, [result.lastID]);

    res.status(201).json({
      message: 'Tutor registrado exitosamente',
      data: newTutor
    });

  } catch (error) {
    console.error('Error al registrar tutor:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      details: error.message
    });
  }
});

export default router;