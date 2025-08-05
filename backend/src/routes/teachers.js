import express from 'express';
import { getDatabase } from '../database/connection.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';
import { asyncHandler, errors } from '../middleware/errorHandler.js';
import { validateTeacherUpdate, validateStudentCreate, validateStudentUpdate } from '../validators/teachers.js';

const router = express.Router();

// Aplicar middleware de autenticación y verificación de rol teacher
router.use(authMiddleware);
router.use(requireRole(['teacher', 'admin']));

/**
 * GET /api/teachers/dashboard
 * Obtener datos del dashboard del profesor
 */
router.get('/dashboard', asyncHandler(async (req, res) => {
  const teacherId = req.user.id;
  const db = getDatabase();
  
  // Obtener estadísticas del profesor
  let stats;
  if (typeof db.get === 'function') {
    stats = db.prepare(`
      SELECT 
        (SELECT COUNT(*) FROM students s 
         JOIN teachers t ON s.teacher_id = t.id 
         WHERE t.user_id = ?) as total_students,
        (SELECT COUNT(*) FROM reports r 
         WHERE r.teacher_id = ?) as total_reports,
        (SELECT COUNT(*) FROM reports r 
         WHERE r.teacher_id = ? AND r.status = 'pending') as pending_reports,
        (SELECT COUNT(*) FROM rewards rw 
         WHERE rw.created_by = ?) as total_rewards,
        (SELECT COUNT(*) FROM reward_redemptions rr 
         JOIN rewards rw ON rr.reward_id = rw.id 
         WHERE rw.created_by = ? AND rr.status = 'pending') as pending_redemptions
    `).get(teacherId, teacherId, teacherId, teacherId, teacherId);
  } else {
    stats = await db.get(`
      SELECT 
        (SELECT COUNT(*) FROM students s 
         JOIN teachers t ON s.teacher_id = t.id 
         WHERE t.user_id = ?) as total_students,
        (SELECT COUNT(*) FROM reports r 
         WHERE r.teacher_id = ?) as total_reports,
        (SELECT COUNT(*) FROM reports r 
         WHERE r.teacher_id = ? AND r.status = 'pending') as pending_reports,
        (SELECT COUNT(*) FROM rewards rw 
         WHERE rw.created_by = ?) as total_rewards,
        (SELECT COUNT(*) FROM reward_redemptions rr 
         JOIN rewards rw ON rr.reward_id = rw.id 
         WHERE rw.created_by = ? AND rr.status = 'pending') as pending_redemptions
    `, [teacherId, teacherId, teacherId, teacherId, teacherId]);
  }
  
  // Obtener reportes recientes
  let recentReports;
  if (typeof db.all === 'function') {
    recentReports = db.prepare(`
      SELECT r.*, s.name as student_name
      FROM reports r
      LEFT JOIN users s ON r.student_id = s.id
      WHERE r.teacher_id = ?
      ORDER BY r.created_at DESC
      LIMIT 5
    `).all(teacherId);
  } else {
    recentReports = await db.all(`
      SELECT r.*, s.name as student_name
      FROM reports r
      LEFT JOIN users s ON r.student_id = s.id
      WHERE r.teacher_id = ?
      ORDER BY r.created_at DESC
      LIMIT 5
    `, [teacherId]);
  }
  
  // Obtener estudiantes con más reportes
  let topStudents;
  if (typeof db.all === 'function') {
    topStudents = db.prepare(`
      SELECT s.name, COUNT(r.id) as report_count
      FROM users s
      JOIN reports r ON s.id = r.student_id
      WHERE r.teacher_id = ?
      GROUP BY s.id, s.name
      ORDER BY report_count DESC
      LIMIT 5
    `).all(teacherId);
  } else {
    topStudents = await db.all(`
      SELECT s.name, COUNT(r.id) as report_count
      FROM users s
      JOIN reports r ON s.id = r.student_id
      WHERE r.teacher_id = ?
      GROUP BY s.id, s.name
      ORDER BY report_count DESC
      LIMIT 5
    `, [teacherId]);
  }
  
  res.json({
    stats: stats || {},
    recentReports: recentReports || [],
    topStudents: topStudents || []
  });
}));

/**
 * GET /api/teachers/students
 * Obtener estudiantes del profesor
 */
router.get('/students', asyncHandler(async (req, res) => {
  const teacherId = req.user.id;
  const { page = 1, limit = 10, search } = req.query;
  const offset = (page - 1) * limit;
  const db = getDatabase();
  
  // Obtener el ID del teacher en la tabla teachers
  let teacher;
  if (typeof db.get === 'function') {
    teacher = db.prepare('SELECT id FROM teachers WHERE user_id = ?').get(teacherId);
  } else {
    teacher = await db.get('SELECT id FROM teachers WHERE user_id = ?', [teacherId]);
  }
  
  if (!teacher) {
    throw errors.notFound('Profesor no encontrado');
  }
  
  let whereConditions = ['s.teacher_id = ?'];
  let params = [teacher.id];
  
  if (search) {
    whereConditions.push('u.name LIKE ?');
    params.push(`%${search}%`);
  }
  
  const whereClause = `WHERE ${whereConditions.join(' AND ')}`;
  
  // Consulta principal
  const query = `
    SELECT 
      u.id, u.name, u.email, u.avatar_url, u.status,
      s.points, s.level, s.created_at,
      (SELECT COUNT(*) FROM reports r WHERE r.student_id = u.id) as total_reports,
      (SELECT COUNT(*) FROM reward_redemptions rr WHERE rr.student_id = u.id) as total_redemptions
    FROM students s
    JOIN users u ON s.user_id = u.id
    ${whereClause}
    ORDER BY u.name
    LIMIT ? OFFSET ?
  `;
  
  params.push(parseInt(limit), offset);
  
  let students;
  if (typeof db.all === 'function') {
    students = db.prepare(query).all(...params);
  } else {
    students = await db.all(query, params);
  }
  
  // Contar total
  const countQuery = `
    SELECT COUNT(*) as total
    FROM students s
    JOIN users u ON s.user_id = u.id
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
    students,
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
 * GET /api/teachers/students/:id
 * Obtener un estudiante específico del profesor
 */
router.get('/students/:id', asyncHandler(async (req, res) => {
  const teacherId = req.user.id;
  const { id } = req.params;
  const db = getDatabase();
  
  // Obtener el ID del teacher en la tabla teachers
  let teacher;
  if (typeof db.get === 'function') {
    teacher = db.prepare('SELECT id FROM teachers WHERE user_id = ?').get(teacherId);
  } else {
    teacher = await db.get('SELECT id FROM teachers WHERE user_id = ?', [teacherId]);
  }
  
  if (!teacher) {
    throw errors.notFound('Profesor no encontrado');
  }
  
  // Obtener el estudiante
  let student;
  if (typeof db.get === 'function') {
    student = db.prepare(`
      SELECT 
        u.id, u.name, u.email, u.avatar_url, u.status, u.created_at,
        s.points, s.level, s.teacher_id
      FROM students s
      JOIN users u ON s.user_id = u.id
      WHERE u.id = ? AND s.teacher_id = ?
    `).get(id, teacher.id);
  } else {
    student = await db.get(`
      SELECT 
        u.id, u.name, u.email, u.avatar_url, u.status, u.created_at,
        s.points, s.level, s.teacher_id
      FROM students s
      JOIN users u ON s.user_id = u.id
      WHERE u.id = ? AND s.teacher_id = ?
    `, [id, teacher.id]);
  }
  
  if (!student) {
    throw errors.notFound('Estudiante no encontrado o no pertenece a este profesor');
  }
  
  // Obtener estadísticas del estudiante
  let stats;
  if (typeof db.get === 'function') {
    stats = db.prepare(`
      SELECT 
        (SELECT COUNT(*) FROM reports WHERE student_id = ?) as total_reports,
        (SELECT COUNT(*) FROM reports WHERE student_id = ? AND status = 'resolved') as resolved_reports,
        (SELECT COUNT(*) FROM reward_redemptions WHERE student_id = ?) as total_redemptions,
        (SELECT SUM(points_spent) FROM reward_redemptions WHERE student_id = ? AND status = 'approved') as total_points_spent,
        (SELECT COUNT(*) FROM student_achievements WHERE student_id = ?) as total_achievements
    `).get(id, id, id, id, id);
  } else {
    stats = await db.get(`
      SELECT 
        (SELECT COUNT(*) FROM reports WHERE student_id = ?) as total_reports,
        (SELECT COUNT(*) FROM reports WHERE student_id = ? AND status = 'resolved') as resolved_reports,
        (SELECT COUNT(*) FROM reward_redemptions WHERE student_id = ?) as total_redemptions,
        (SELECT SUM(points_spent) FROM reward_redemptions WHERE student_id = ? AND status = 'approved') as total_points_spent,
        (SELECT COUNT(*) FROM student_achievements WHERE student_id = ?) as total_achievements
    `, [id, id, id, id, id]);
  }
  
  // Obtener reportes recientes del estudiante
  let recentReports;
  if (typeof db.all === 'function') {
    recentReports = db.prepare(`
      SELECT id, type, title, severity, status, created_at
      FROM reports
      WHERE student_id = ?
      ORDER BY created_at DESC
      LIMIT 5
    `).all(id);
  } else {
    recentReports = await db.all(`
      SELECT id, type, title, severity, status, created_at
      FROM reports
      WHERE student_id = ?
      ORDER BY created_at DESC
      LIMIT 5
    `, [id]);
  }
  
  res.json({
    ...student,
    stats: stats || {},
    recentReports: recentReports || []
  });
}));

/**
 * PUT /api/teachers/students/:id/points
 * Actualizar puntos de un estudiante
 */
router.put('/students/:id/points', asyncHandler(async (req, res) => {
  const teacherId = req.user.id;
  const { id } = req.params;
  const { points, reason } = req.body;
  const db = getDatabase();
  
  if (!points || !reason) {
    throw errors.badRequest('Los puntos y la razón son requeridos');
  }
  
  if (typeof points !== 'number' || points === 0) {
    throw errors.badRequest('Los puntos deben ser un número diferente de cero');
  }
  
  // Obtener el ID del teacher en la tabla teachers
  let teacher;
  if (typeof db.get === 'function') {
    teacher = db.prepare('SELECT id FROM teachers WHERE user_id = ?').get(teacherId);
  } else {
    teacher = await db.get('SELECT id FROM teachers WHERE user_id = ?', [teacherId]);
  }
  
  if (!teacher) {
    throw errors.notFound('Profesor no encontrado');
  }
  
  // Verificar que el estudiante pertenece al profesor
  let student;
  if (typeof db.get === 'function') {
    student = db.prepare(`
      SELECT s.*, u.name
      FROM students s
      JOIN users u ON s.user_id = u.id
      WHERE u.id = ? AND s.teacher_id = ?
    `).get(id, teacher.id);
  } else {
    student = await db.get(`
      SELECT s.*, u.name
      FROM students s
      JOIN users u ON s.user_id = u.id
      WHERE u.id = ? AND s.teacher_id = ?
    `, [id, teacher.id]);
  }
  
  if (!student) {
    throw errors.notFound('Estudiante no encontrado o no pertenece a este profesor');
  }
  
  // Verificar que los puntos no dejen al estudiante con puntos negativos
  const newPoints = student.points + points;
  if (newPoints < 0) {
    throw errors.badRequest('No se pueden quitar más puntos de los que tiene el estudiante');
  }
  
  // Actualizar puntos del estudiante
  if (typeof db.run === 'function') {
    db.prepare(`
      UPDATE students 
      SET points = ?, updated_at = datetime('now')
      WHERE user_id = ?
    `).run(newPoints, id);
  } else {
    await db.run(`
      UPDATE students 
      SET points = ?, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?
    `, [newPoints, id]);
  }
  
  // Registrar la transacción de puntos (si existe tabla de transacciones)
  try {
    if (typeof db.run === 'function') {
      db.prepare(`
        INSERT INTO point_transactions (student_id, teacher_id, points, reason, created_at)
        VALUES (?, ?, ?, ?, datetime('now'))
      `).run(id, teacherId, points, reason);
    } else {
      await db.run(`
        INSERT INTO point_transactions (student_id, teacher_id, points, reason, created_at)
        VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
      `, [id, teacherId, points, reason]);
    }
  } catch (error) {
    // Si la tabla no existe, continuar sin error
    console.log('Tabla point_transactions no existe, continuando...');
  }
  
  res.json({
    message: 'Puntos actualizados exitosamente',
    student: {
      id,
      name: student.name,
      previousPoints: student.points,
      newPoints,
      pointsChanged: points,
      reason
    }
  });
}));

/**
 * PUT /api/teachers/profile
 * Actualizar perfil del profesor
 */
router.put('/profile', asyncHandler(async (req, res) => {
  const teacherId = req.user.id;
  const { error, value } = validateTeacherUpdate(req.body);
  if (error) {
    throw errors.badRequest('Datos de actualización inválidos');
  }
  
  const db = getDatabase();
  
  // Verificar si el email ya está en uso por otro usuario
  if (value.email) {
    let existingUser;
    if (typeof db.get === 'function') {
      existingUser = db.prepare(`
        SELECT id FROM users WHERE email = ? AND id != ?
      `).get(value.email, teacherId);
    } else {
      existingUser = await db.get(`
        SELECT id FROM users WHERE email = ? AND id != ?
      `, [value.email, teacherId]);
    }
    
    if (existingUser) {
      throw errors.conflict('El email ya está en uso por otro usuario');
    }
  }
  
  // Actualizar usuario
  const userUpdateFields = [];
  const userUpdateValues = [];
  
  if (value.name) {
    userUpdateFields.push('name = ?');
    userUpdateValues.push(value.name);
  }
  
  if (value.email) {
    userUpdateFields.push('email = ?');
    userUpdateValues.push(value.email);
  }
  
  if (value.avatar_url !== undefined) {
    userUpdateFields.push('avatar_url = ?');
    userUpdateValues.push(value.avatar_url);
  }
  
  if (userUpdateFields.length > 0) {
    userUpdateValues.push(teacherId);
    
    if (typeof db.run === 'function') {
      db.prepare(`
        UPDATE users 
        SET ${userUpdateFields.join(', ')}, updated_at = datetime('now')
        WHERE id = ?
      `).run(...userUpdateValues);
    } else {
      await db.run(`
        UPDATE users 
        SET ${userUpdateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, userUpdateValues);
    }
  }
  
  // Actualizar tabla teachers si hay campos específicos
  const teacherUpdateFields = [];
  const teacherUpdateValues = [];
  
  if (value.phone) {
    teacherUpdateFields.push('phone = ?');
    teacherUpdateValues.push(value.phone);
  }
  
  if (value.subject) {
    teacherUpdateFields.push('subject = ?');
    teacherUpdateValues.push(value.subject);
  }
  
  if (value.grade) {
    teacherUpdateFields.push('grade = ?');
    teacherUpdateValues.push(value.grade);
  }
  
  if (teacherUpdateFields.length > 0) {
    teacherUpdateValues.push(teacherId);
    
    if (typeof db.run === 'function') {
      db.prepare(`
        UPDATE teachers 
        SET ${teacherUpdateFields.join(', ')}, updated_at = datetime('now')
        WHERE user_id = ?
      `).run(...teacherUpdateValues);
    } else {
      await db.run(`
        UPDATE teachers 
        SET ${teacherUpdateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
      `, teacherUpdateValues);
    }
  }
  
  res.json({
    message: 'Perfil actualizado exitosamente'
  });
}));

/**
 * GET /api/teachers/rewards
 * Obtener recompensas creadas por el profesor
 */
router.get('/rewards', asyncHandler(async (req, res) => {
  const teacherId = req.user.id;
  const { page = 1, limit = 10, active } = req.query;
  const offset = (page - 1) * limit;
  const db = getDatabase();
  
  let whereConditions = ['created_by = ?'];
  let params = [teacherId];
  
  if (active !== undefined) {
    whereConditions.push('active = ?');
    params.push(active === 'true' ? 1 : 0);
  }
  
  const whereClause = `WHERE ${whereConditions.join(' AND ')}`;
  
  // Consulta principal
  const query = `
    SELECT 
      r.*,
      (SELECT COUNT(*) FROM reward_redemptions rr WHERE rr.reward_id = r.id) as total_redemptions,
      (SELECT COUNT(*) FROM reward_redemptions rr WHERE rr.reward_id = r.id AND rr.status = 'pending') as pending_redemptions
    FROM rewards r
    ${whereClause}
    ORDER BY r.created_at DESC
    LIMIT ? OFFSET ?
  `;
  
  params.push(parseInt(limit), offset);
  
  let rewards;
  if (typeof db.all === 'function') {
    rewards = db.prepare(query).all(...params);
  } else {
    rewards = await db.all(query, params);
  }
  
  // Contar total
  const countQuery = `
    SELECT COUNT(*) as total
    FROM rewards r
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
    rewards,
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

export default router;