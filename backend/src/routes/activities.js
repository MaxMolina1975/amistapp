import express from 'express';
import { authMiddleware, requireRole, requireOwnership } from '../middleware/auth.js';
import { auditMiddleware } from '../middleware/audit.js';
import { asyncHandler, errors } from '../middleware/errorHandler.js';
import { getDatabase } from '../database/connection.js';
import { 
  validateActivityCreate, 
  validateActivityUpdate, 
  validateActivityFilters,
  validateActivityParticipation 
} from '../validators/activities.js';

const router = express.Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(authMiddleware);

/**
 * @route GET /api/activities
 * @desc Obtener actividades con filtros y paginación
 * @access Teacher, Admin
 */
router.get('/', requireRole(['teacher', 'admin']), async (req, res) => {
  try {
    const { error, value } = validateActivityFilters(req.query);
    if (error) {
      return res.status(400).json({
        error: 'Datos de filtro inválidos',
        details: error.details.map(detail => detail.message)
      });
    }

    const { page, limit, status, type, teacher_id, date_from, date_to, sort_by, sort_order } = value;
    const offset = (page - 1) * limit;
    const db = getDatabase();

    // Construir consulta base
    let query = `
      SELECT a.*, u.name as teacher_name,
             COUNT(ap.id) as participants_count
      FROM activities a
      LEFT JOIN users u ON a.teacher_id = u.id
      LEFT JOIN activity_participants ap ON a.id = ap.activity_id
      WHERE 1=1
    `;
    
    const params = [];

    // Aplicar filtros
    if (status) {
      query += ' AND a.status = ?';
      params.push(status);
    }

    if (type) {
      query += ' AND a.type = ?';
      params.push(type);
    }

    if (teacher_id) {
      query += ' AND a.teacher_id = ?';
      params.push(teacher_id);
    } else if (req.user.role === 'teacher') {
      // Los profesores solo ven sus propias actividades
      query += ' AND a.teacher_id = ?';
      params.push(req.user.id);
    }

    if (date_from) {
      query += ' AND a.start_date >= ?';
      params.push(date_from);
    }

    if (date_to) {
      query += ' AND a.end_date <= ?';
      params.push(date_to);
    }

    query += ' GROUP BY a.id';

    // Aplicar ordenamiento
    const validSortColumns = {
      'title': 'a.title',
      'start_date': 'a.start_date',
      'end_date': 'a.end_date',
      'points_reward': 'a.points_reward',
      'participants': 'participants_count',
      'created_at': 'a.created_at'
    };

    if (validSortColumns[sort_by]) {
      query += ` ORDER BY ${validSortColumns[sort_by]} ${sort_order.toUpperCase()}`;
    }

    // Aplicar paginación
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const activities = await db.all(query, params);

    // Contar total para paginación
    let countQuery = `
      SELECT COUNT(DISTINCT a.id) as total
      FROM activities a
      WHERE 1=1
    `;
    
    const countParams = [];
    let paramIndex = 0;

    if (status) {
      countQuery += ' AND a.status = ?';
      countParams.push(params[paramIndex++]);
    }

    if (type) {
      countQuery += ' AND a.type = ?';
      countParams.push(params[paramIndex++]);
    }

    if (teacher_id) {
      countQuery += ' AND a.teacher_id = ?';
      countParams.push(params[paramIndex++]);
    } else if (req.user.role === 'teacher') {
      countQuery += ' AND a.teacher_id = ?';
      countParams.push(req.user.id);
    }

    if (date_from) {
      countQuery += ' AND a.start_date >= ?';
      countParams.push(params[paramIndex++]);
    }

    if (date_to) {
      countQuery += ' AND a.end_date <= ?';
      countParams.push(params[paramIndex++]);
    }

    const totalResult = await db.get(countQuery, countParams);
    const total = totalResult.total;

    res.json({
      data: activities,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error al obtener actividades:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      details: error.message
    });
  }
});

/**
 * @route GET /api/activities/:id
 * @desc Obtener una actividad específica
 * @access Teacher, Admin, Student (si está inscrito)
 */
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const db = getDatabase();

  const activity = await db.get(`
    SELECT a.*, u.name as teacher_name,
           COUNT(ap.id) as participants_count
    FROM activities a
    LEFT JOIN users u ON a.teacher_id = u.id
    LEFT JOIN activity_participants ap ON a.id = ap.activity_id
    WHERE a.id = ?
    GROUP BY a.id
  `, [id]);

  if (!activity) {
    throw errors.notFound('Actividad no encontrada');
  }

  // Verificar permisos
  if (req.user.role === 'teacher' && activity.teacher_id !== req.user.id) {
    throw errors.forbidden('No tienes permisos para ver esta actividad');
  }

  if (req.user.role === 'student') {
    // Verificar si el estudiante está inscrito
    const participation = await db.get(`
      SELECT id FROM activity_participants 
      WHERE activity_id = ? AND student_id = ?
    `, [id, req.user.id]);

    if (!participation) {
      throw errors.forbidden('No tienes permisos para ver esta actividad');
    }
  }

  // Obtener participantes si es profesor o admin
  if (['teacher', 'admin'].includes(req.user.role)) {
    const participants = await db.all(`
      SELECT ap.*, u.name as student_name, u.email as student_email
      FROM activity_participants ap
      JOIN users u ON ap.student_id = u.id
      WHERE ap.activity_id = ?
      ORDER BY ap.joined_at DESC
    `, [id]);

    activity.participants = participants;
  }

  res.json({ data: activity });
}));

/**
 * @route POST /api/activities
 * @desc Crear nueva actividad
 * @access Teacher, Admin
 */
router.post('/', requireRole(['teacher', 'admin']), asyncHandler(async (req, res) => {
  const { error, value } = validateActivityCreate(req.body);
  if (error) {
    return res.status(400).json({
      error: 'Datos inválidos',
      details: error.details.map(detail => detail.message)
    });
  }

  const { title, description, type, start_date, end_date, max_participants, points_reward, requirements } = value;
  const db = getDatabase();

  // Validar fechas
  if (new Date(start_date) >= new Date(end_date)) {
    return res.status(400).json({
      error: 'La fecha de inicio debe ser anterior a la fecha de fin'
    });
  }

  if (new Date(start_date) <= new Date()) {
    return res.status(400).json({
      error: 'La fecha de inicio debe ser futura'
    });
  }

  const result = await db.run(`
    INSERT INTO activities (
      title, description, type, start_date, end_date, 
      max_participants, points_reward, requirements, 
      teacher_id, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
  `, [
    title, description, type, start_date, end_date,
    max_participants, points_reward, requirements ? JSON.stringify(requirements) : null,
    req.user.id
  ]);

  const activity = await db.get(`
    SELECT a.*, u.name as teacher_name
    FROM activities a
    LEFT JOIN users u ON a.teacher_id = u.id
    WHERE a.id = ?
  `, [result.lastID]);

  res.status(201).json({
    message: 'Actividad creada exitosamente',
    data: activity
  });
}));

/**
 * @route PUT /api/activities/:id
 * @desc Actualizar actividad
 * @access Teacher (owner), Admin
 */
router.put('/:id', requireRole(['teacher', 'admin']), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { error, value } = validateActivityUpdate(req.body);
  if (error) {
    return res.status(400).json({
      error: 'Datos inválidos',
      details: error.details.map(detail => detail.message)
    });
  }

  const db = getDatabase();

  // Verificar que la actividad existe
  const activity = await db.get('SELECT * FROM activities WHERE id = ?', [id]);
  if (!activity) {
    throw errors.notFound('Actividad no encontrada');
  }

  // Verificar permisos (solo el creador o admin pueden editar)
  if (req.user.role === 'teacher' && activity.teacher_id !== req.user.id) {
    throw errors.forbidden('No tienes permisos para editar esta actividad');
  }

  // Construir query de actualización
  const updates = [];
  const params = [];

  Object.keys(value).forEach(key => {
    if (value[key] !== undefined) {
      if (key === 'requirements') {
        updates.push(`${key} = ?`);
        params.push(JSON.stringify(value[key]));
      } else {
        updates.push(`${key} = ?`);
        params.push(value[key]);
      }
    }
  });

  if (updates.length === 0) {
    return res.status(400).json({
      error: 'No hay campos para actualizar'
    });
  }

  updates.push('updated_at = CURRENT_TIMESTAMP');
  params.push(id);

  await db.run(`
    UPDATE activities 
    SET ${updates.join(', ')} 
    WHERE id = ?
  `, params);

  const updatedActivity = await db.get(`
    SELECT a.*, u.name as teacher_name
    FROM activities a
    LEFT JOIN users u ON a.teacher_id = u.id
    WHERE a.id = ?
  `, [id]);

  res.json({
    message: 'Actividad actualizada exitosamente',
    data: updatedActivity
  });
}));

/**
 * @route DELETE /api/activities/:id
 * @desc Eliminar actividad (soft delete)
 * @access Teacher (owner), Admin
 */
router.delete('/:id', requireRole(['teacher', 'admin']), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const db = getDatabase();

  // Verificar que la actividad existe
  const activity = await db.get('SELECT * FROM activities WHERE id = ?', [id]);
  if (!activity) {
    throw errors.notFound('Actividad no encontrada');
  }

  // Verificar permisos
  if (req.user.role === 'teacher' && activity.teacher_id !== req.user.id) {
    throw errors.forbidden('No tienes permisos para eliminar esta actividad');
  }

  // Soft delete
  await db.run(`
    UPDATE activities 
    SET status = 'deleted', updated_at = CURRENT_TIMESTAMP 
    WHERE id = ?
  `, [id]);

  res.json({
    message: 'Actividad eliminada exitosamente'
  });
}));

/**
 * @route POST /api/activities/:id/join
 * @desc Unirse a una actividad
 * @access Student
 */
router.post('/:id/join', requireRole(['student']), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const db = getDatabase();

  // Verificar que la actividad existe y está activa
  const activity = await db.get(`
    SELECT * FROM activities 
    WHERE id = ? AND status = 'active' AND start_date > CURRENT_TIMESTAMP
  `, [id]);

  if (!activity) {
    throw errors.notFound('Actividad no encontrada o no disponible');
  }

  // Verificar si ya está inscrito
  const existingParticipation = await db.get(`
    SELECT id FROM activity_participants 
    WHERE activity_id = ? AND student_id = ?
  `, [id, req.user.id]);

  if (existingParticipation) {
    return res.status(400).json({
      error: 'Ya estás inscrito en esta actividad'
    });
  }

  // Verificar límite de participantes
  if (activity.max_participants) {
    const currentParticipants = await db.get(`
      SELECT COUNT(*) as count FROM activity_participants 
      WHERE activity_id = ?
    `, [id]);

    if (currentParticipants.count >= activity.max_participants) {
      return res.status(400).json({
        error: 'La actividad ha alcanzado el límite máximo de participantes'
      });
    }
  }

  // Inscribir al estudiante
  await db.run(`
    INSERT INTO activity_participants (activity_id, student_id, status)
    VALUES (?, ?, 'joined')
  `, [id, req.user.id]);

  res.status(201).json({
    message: 'Te has unido a la actividad exitosamente'
  });
}));

/**
 * @route DELETE /api/activities/:id/leave
 * @desc Salir de una actividad
 * @access Student
 */
router.delete('/:id/leave', requireRole(['student']), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const db = getDatabase();

  // Verificar que está inscrito
  const participation = await db.get(`
    SELECT * FROM activity_participants 
    WHERE activity_id = ? AND student_id = ?
  `, [id, req.user.id]);

  if (!participation) {
    throw errors.notFound('No estás inscrito en esta actividad');
  }

  // Verificar que la actividad no ha comenzado
  const activity = await db.get(`
    SELECT start_date FROM activities WHERE id = ?
  `, [id]);

  if (new Date(activity.start_date) <= new Date()) {
    return res.status(400).json({
      error: 'No puedes salir de una actividad que ya ha comenzado'
    });
  }

  // Eliminar participación
  await db.run(`
    DELETE FROM activity_participants 
    WHERE activity_id = ? AND student_id = ?
  `, [id, req.user.id]);

  res.json({
    message: 'Has salido de la actividad exitosamente'
  });
}));

/**
 * @route POST /api/activities/:id/complete
 * @desc Marcar participación como completada y otorgar puntos
 * @access Teacher (owner), Admin
 */
router.post('/:id/complete', requireRole(['teacher', 'admin']), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { student_id, points_awarded } = req.body;
  const db = getDatabase();

  // Verificar que la actividad existe
  const activity = await db.get('SELECT * FROM activities WHERE id = ?', [id]);
  if (!activity) {
    throw errors.notFound('Actividad no encontrada');
  }

  // Verificar permisos
  if (req.user.role === 'teacher' && activity.teacher_id !== req.user.id) {
    throw errors.forbidden('No tienes permisos para gestionar esta actividad');
  }

  // Verificar que el estudiante está inscrito
  const participation = await db.get(`
    SELECT * FROM activity_participants 
    WHERE activity_id = ? AND student_id = ?
  `, [id, student_id]);

  if (!participation) {
    throw errors.notFound('El estudiante no está inscrito en esta actividad');
  }

  if (participation.status === 'completed') {
    return res.status(400).json({
      error: 'La participación ya está marcada como completada'
    });
  }

  // Obtener información de la actividad
  const finalPoints = points_awarded || activity.points_reward || 0;

  await db.run('BEGIN TRANSACTION');

  try {
    // Marcar como completada
    await db.run(`
      UPDATE activity_participants 
      SET status = 'completed', points_awarded = ?, completed_at = CURRENT_TIMESTAMP
      WHERE activity_id = ? AND student_id = ?
    `, [finalPoints, id, student_id]);

    // Otorgar puntos al estudiante
    if (finalPoints > 0) {
      await db.run(`
        UPDATE users 
        SET points = points + ? 
        WHERE id = ?
      `, [finalPoints, student_id]);
    }

    await db.run('COMMIT');

    res.json({
      message: 'Participación marcada como completada y puntos otorgados',
      points_awarded: finalPoints
    });

  } catch (error) {
    await db.run('ROLLBACK');
    throw error;
  }
}));

export default router;