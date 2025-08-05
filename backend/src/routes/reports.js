import express from 'express';
import { getDatabase } from '../database/connection.js';
import { authMiddleware, requireRole, requireOwnership } from '../middleware/auth.js';
import { asyncHandler, errors } from '../middleware/errorHandler.js';
import { validateReport, validateReportUpdate, validateReportComment } from '../validators/reports.js';

const router = express.Router();

/**
 * GET /api/reports
 * Obtener reportes (filtrados según el rol del usuario)
 */
router.get('/', authMiddleware, asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, type, student_id, teacher_id } = req.query;
  const offset = (page - 1) * limit;
  const db = getDatabase();
  
  let whereConditions = [];
  let params = [];
  
  // Filtros según el rol del usuario
  if (req.user.role === 'student') {
    whereConditions.push('r.student_id = ?');
    params.push(req.user.id);
  } else if (req.user.role === 'teacher') {
    whereConditions.push('r.teacher_id = ?');
    params.push(req.user.id);
  } else if (req.user.role === 'tutor') {
    // Los tutores solo ven reportes de sus estudiantes asignados
    whereConditions.push(`r.student_id IN (
      SELECT ts.student_id FROM tutor_student ts 
      JOIN tutors t ON ts.tutor_id = t.id 
      WHERE t.user_id = ?
    )`);
    params.push(req.user.id);
  }
  
  // Filtros adicionales
  if (status) {
    whereConditions.push('r.status = ?');
    params.push(status);
  }
  
  if (type) {
    whereConditions.push('r.type = ?');
    params.push(type);
  }
  
  if (student_id && (req.user.role === 'admin' || req.user.role === 'teacher')) {
    whereConditions.push('r.student_id = ?');
    params.push(student_id);
  }
  
  if (teacher_id && req.user.role === 'admin') {
    whereConditions.push('r.teacher_id = ?');
    params.push(teacher_id);
  }
  
  const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
  
  // Consulta principal
  const query = `
    SELECT 
      r.*,
      s.name as student_name,
      t.name as teacher_name,
      (SELECT COUNT(*) FROM report_comments rc WHERE rc.report_id = r.id) as comments_count
    FROM reports r
    LEFT JOIN users s ON r.student_id = s.id
    LEFT JOIN users t ON r.teacher_id = t.id
    ${whereClause}
    ORDER BY r.created_at DESC
    LIMIT ? OFFSET ?
  `;
  
  params.push(parseInt(limit), offset);
  
  let reports;
  if (typeof db.all === 'function') {
    reports = db.prepare(query).all(...params);
  } else {
    reports = await db.all(query, params);
  }
  
  // Contar total de reportes
  const countQuery = `
    SELECT COUNT(*) as total
    FROM reports r
    ${whereClause}
  `;
  
  let totalResult;
  if (typeof db.get === 'function') {
    totalResult = db.prepare(countQuery).get(...params.slice(0, -2));
  } else {
    totalResult = await db.get(countQuery, params.slice(0, -2));
  }
  
  const total = totalResult.total;
  const totalPages = Math.ceil(total / limit);
  
  res.json({
    reports,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  });
}));

/**
 * GET /api/reports/:id
 * Obtener un reporte específico con comentarios
 */
router.get('/:id', authMiddleware, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const db = getDatabase();
  
  // Obtener el reporte
  let report;
  if (typeof db.get === 'function') {
    report = db.prepare(`
      SELECT 
        r.*,
        s.name as student_name,
        t.name as teacher_name
      FROM reports r
      LEFT JOIN users s ON r.student_id = s.id
      LEFT JOIN users t ON r.teacher_id = t.id
      WHERE r.id = ?
    `).get(id);
  } else {
    report = await db.get(`
      SELECT 
        r.*,
        s.name as student_name,
        t.name as teacher_name
      FROM reports r
      LEFT JOIN users s ON r.student_id = s.id
      LEFT JOIN users t ON r.teacher_id = t.id
      WHERE r.id = ?
    `, [id]);
  }
  
  if (!report) {
    throw errors.notFound('Reporte no encontrado');
  }
  
  // Verificar permisos
  const canView = req.user.role === 'admin' || 
                  report.student_id === req.user.id || 
                  report.teacher_id === req.user.id ||
                  (req.user.role === 'tutor' && await isTutorOfStudent(req.user.id, report.student_id, db));
  
  if (!canView) {
    throw errors.forbidden('No tienes permisos para ver este reporte');
  }
  
  // Obtener comentarios del reporte
  let comments;
  if (typeof db.all === 'function') {
    comments = db.prepare(`
      SELECT 
        rc.*,
        u.name as author_name,
        u.role as author_role
      FROM report_comments rc
      JOIN users u ON rc.user_id = u.id
      WHERE rc.report_id = ?
      ORDER BY rc.created_at ASC
    `).all(id);
  } else {
    comments = await db.all(`
      SELECT 
        rc.*,
        u.name as author_name,
        u.role as author_role
      FROM report_comments rc
      JOIN users u ON rc.user_id = u.id
      WHERE rc.report_id = ?
      ORDER BY rc.created_at ASC
    `, [id]);
  }
  
  res.json({
    ...report,
    comments
  });
}));

/**
 * POST /api/reports
 * Crear un nuevo reporte
 */
router.post('/', authMiddleware, requireRole(['teacher', 'admin']), asyncHandler(async (req, res) => {
  const { error, value } = validateReport(req.body);
  if (error) {
    throw errors.badRequest('Datos del reporte inválidos');
  }
  
  const { student_id, type, title, description, severity, status = 'pending' } = value;
  const db = getDatabase();
  
  // Verificar que el estudiante existe
  let student;
  if (typeof db.get === 'function') {
    student = db.prepare('SELECT id FROM users WHERE id = ? AND role = "student"').get(student_id);
  } else {
    student = await db.get('SELECT id FROM users WHERE id = ? AND role = ?', [student_id, 'student']);
  }
  
  if (!student) {
    throw errors.notFound('Estudiante no encontrado');
  }
  
  // Crear el reporte
  let result;
  if (typeof db.run === 'function') {
    result = db.prepare(`
      INSERT INTO reports (student_id, teacher_id, type, title, description, severity, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(student_id, req.user.id, type, title, description, severity, status);
  } else {
    result = await db.run(`
      INSERT INTO reports (student_id, teacher_id, type, title, description, severity, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [student_id, req.user.id, type, title, description, severity, status]);
  }
  
  const reportId = result.lastInsertRowid || result.insertId;
  
  res.status(201).json({
    message: 'Reporte creado exitosamente',
    report: {
      id: reportId,
      student_id,
      teacher_id: req.user.id,
      type,
      title,
      description,
      severity,
      status
    }
  });
}));

/**
 * PUT /api/reports/:id
 * Actualizar un reporte
 */
router.put('/:id', authMiddleware, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { error, value } = validateReportUpdate(req.body);
  if (error) {
    throw errors.badRequest('Datos de actualización inválidos');
  }
  
  const db = getDatabase();
  
  // Verificar que el reporte existe y permisos
  let report;
  if (typeof db.get === 'function') {
    report = db.prepare('SELECT * FROM reports WHERE id = ?').get(id);
  } else {
    report = await db.get('SELECT * FROM reports WHERE id = ?', [id]);
  }
  
  if (!report) {
    throw errors.notFound('Reporte no encontrado');
  }
  
  // Solo el profesor que creó el reporte o un admin pueden editarlo
  if (req.user.role !== 'admin' && report.teacher_id !== req.user.id) {
    throw errors.forbidden('No tienes permisos para editar este reporte');
  }
  
  // Actualizar el reporte
  const updateFields = [];
  const updateValues = [];
  
  Object.keys(value).forEach(key => {
    if (value[key] !== undefined) {
      updateFields.push(`${key} = ?`);
      updateValues.push(value[key]);
    }
  });
  
  if (updateFields.length === 0) {
    throw errors.badRequest('No hay campos para actualizar');
  }
  
  updateValues.push(id);
  
  if (typeof db.run === 'function') {
    db.prepare(`
      UPDATE reports 
      SET ${updateFields.join(', ')}, updated_at = datetime('now')
      WHERE id = ?
    `).run(...updateValues);
  } else {
    await db.run(`
      UPDATE reports 
      SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, updateValues);
  }
  
  res.json({
    message: 'Reporte actualizado exitosamente'
  });
}));

/**
 * DELETE /api/reports/:id
 * Eliminar un reporte
 */
router.delete('/:id', authMiddleware, requireRole(['admin']), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const db = getDatabase();
  
  // Verificar que el reporte existe
  let report;
  if (typeof db.get === 'function') {
    report = db.prepare('SELECT id FROM reports WHERE id = ?').get(id);
  } else {
    report = await db.get('SELECT id FROM reports WHERE id = ?', [id]);
  }
  
  if (!report) {
    throw errors.notFound('Reporte no encontrado');
  }
  
  // Eliminar comentarios primero (por restricción de clave foránea)
  if (typeof db.run === 'function') {
    db.prepare('DELETE FROM report_comments WHERE report_id = ?').run(id);
    db.prepare('DELETE FROM reports WHERE id = ?').run(id);
  } else {
    await db.run('DELETE FROM report_comments WHERE report_id = ?', [id]);
    await db.run('DELETE FROM reports WHERE id = ?', [id]);
  }
  
  res.json({
    message: 'Reporte eliminado exitosamente'
  });
}));

/**
 * POST /api/reports/:id/comments
 * Agregar comentario a un reporte
 */
router.post('/:id/comments', authMiddleware, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { error, value } = validateReportComment(req.body);
  if (error) {
    throw errors.badRequest('Datos del comentario inválidos');
  }
  
  const { comment } = value;
  const db = getDatabase();
  
  // Verificar que el reporte existe y permisos
  let report;
  if (typeof db.get === 'function') {
    report = db.prepare('SELECT * FROM reports WHERE id = ?').get(id);
  } else {
    report = await db.get('SELECT * FROM reports WHERE id = ?', [id]);
  }
  
  if (!report) {
    throw errors.notFound('Reporte no encontrado');
  }
  
  // Verificar permisos para comentar
  const canComment = req.user.role === 'admin' || 
                     report.student_id === req.user.id || 
                     report.teacher_id === req.user.id ||
                     (req.user.role === 'tutor' && await isTutorOfStudent(req.user.id, report.student_id, db));
  
  if (!canComment) {
    throw errors.forbidden('No tienes permisos para comentar en este reporte');
  }
  
  // Crear el comentario
  let result;
  if (typeof db.run === 'function') {
    result = db.prepare(`
      INSERT INTO report_comments (report_id, user_id, comment)
      VALUES (?, ?, ?)
    `).run(id, req.user.id, comment);
  } else {
    result = await db.run(`
      INSERT INTO report_comments (report_id, user_id, comment)
      VALUES (?, ?, ?)
    `, [id, req.user.id, comment]);
  }
  
  const commentId = result.lastInsertRowid || result.insertId;
  
  res.status(201).json({
    message: 'Comentario agregado exitosamente',
    comment: {
      id: commentId,
      report_id: id,
      user_id: req.user.id,
      comment,
      author_name: req.user.name,
      author_role: req.user.role
    }
  });
}));

/**
 * GET /api/reports/stats
 * Obtener estadísticas de reportes
 */
router.get('/stats', authMiddleware, requireRole(['admin', 'teacher']), asyncHandler(async (req, res) => {
  const db = getDatabase();
  
  let whereCondition = '';
  let params = [];
  
  // Filtrar por profesor si no es admin
  if (req.user.role === 'teacher') {
    whereCondition = 'WHERE teacher_id = ?';
    params.push(req.user.id);
  }
  
  // Estadísticas por estado
  let statusStats;
  if (typeof db.all === 'function') {
    statusStats = db.prepare(`
      SELECT status, COUNT(*) as count
      FROM reports
      ${whereCondition}
      GROUP BY status
    `).all(...params);
  } else {
    statusStats = await db.all(`
      SELECT status, COUNT(*) as count
      FROM reports
      ${whereCondition}
      GROUP BY status
    `, params);
  }
  
  // Estadísticas por tipo
  let typeStats;
  if (typeof db.all === 'function') {
    typeStats = db.prepare(`
      SELECT type, COUNT(*) as count
      FROM reports
      ${whereCondition}
      GROUP BY type
    `).all(...params);
  } else {
    typeStats = await db.all(`
      SELECT type, COUNT(*) as count
      FROM reports
      ${whereCondition}
      GROUP BY type
    `, params);
  }
  
  // Estadísticas por severidad
  let severityStats;
  if (typeof db.all === 'function') {
    severityStats = db.prepare(`
      SELECT severity, COUNT(*) as count
      FROM reports
      ${whereCondition}
      GROUP BY severity
    `).all(...params);
  } else {
    severityStats = await db.all(`
      SELECT severity, COUNT(*) as count
      FROM reports
      ${whereCondition}
      GROUP BY severity
    `, params);
  }
  
  res.json({
    statusStats,
    typeStats,
    severityStats
  });
}));

/**
 * Función auxiliar para verificar si un usuario es tutor de un estudiante
 */
async function isTutorOfStudent(tutorUserId, studentId, db) {
  let result;
  if (typeof db.get === 'function') {
    result = db.prepare(`
      SELECT 1 FROM tutor_student ts
      JOIN tutors t ON ts.tutor_id = t.id
      WHERE t.user_id = ? AND ts.student_id = ?
    `).get(tutorUserId, studentId);
  } else {
    result = await db.get(`
      SELECT 1 FROM tutor_student ts
      JOIN tutors t ON ts.tutor_id = t.id
      WHERE t.user_id = ? AND ts.student_id = ?
    `, [tutorUserId, studentId]);
  }
  
  return !!result;
}

export default router;