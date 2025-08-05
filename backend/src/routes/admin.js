import express from 'express';
import { getDatabase } from '../database/connection.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';
import { asyncHandler, errors } from '../middleware/errorHandler.js';
import { validateUserUpdate, validateSystemConfig } from '../validators/admin.js';

const router = express.Router();

// Aplicar middleware de autenticación y verificación de rol admin
router.use(authMiddleware);
router.use(requireRole(['admin']));

/**
 * GET /api/admin/dashboard/stats
 * Obtener estadísticas del dashboard administrativo
 */
router.get('/dashboard/stats', asyncHandler(async (req, res) => {
  const db = getDatabase();
  
  // Estadísticas de usuarios
  let userStats;
  if (typeof db.all === 'function') {
    userStats = db.prepare(`
      SELECT 
        role,
        COUNT(*) as count,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_count
      FROM users 
      GROUP BY role
    `).all();
  } else {
    userStats = await db.all(`
      SELECT 
        role,
        COUNT(*) as count,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_count
      FROM users 
      GROUP BY role
    `);
  }
  
  // Estadísticas de reportes
  let reportStats;
  if (typeof db.get === 'function') {
    reportStats = db.prepare(`
      SELECT 
        COUNT(*) as total_reports,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_reports,
        SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolved_reports,
        SUM(CASE WHEN created_at >= date('now', '-7 days') THEN 1 ELSE 0 END) as weekly_reports
      FROM reports
    `).get();
  } else {
    reportStats = await db.get(`
      SELECT 
        COUNT(*) as total_reports,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_reports,
        SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolved_reports,
        SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) as weekly_reports
      FROM reports
    `);
  }
  
  // Estadísticas de recompensas
  let rewardStats;
  if (typeof db.get === 'function') {
    rewardStats = db.prepare(`
      SELECT 
        COUNT(*) as total_rewards,
        SUM(CASE WHEN active = 1 THEN 1 ELSE 0 END) as active_rewards,
        (SELECT COUNT(*) FROM reward_redemptions) as total_redemptions,
        (SELECT SUM(points_spent) FROM reward_redemptions WHERE status = 'approved') as total_points_spent
      FROM rewards
    `).get();
  } else {
    rewardStats = await db.get(`
      SELECT 
        COUNT(*) as total_rewards,
        SUM(CASE WHEN active = 1 THEN 1 ELSE 0 END) as active_rewards,
        (SELECT COUNT(*) FROM reward_redemptions) as total_redemptions,
        (SELECT SUM(points_spent) FROM reward_redemptions WHERE status = 'approved') as total_points_spent
      FROM rewards
    `);
  }
  
  // Estadísticas de actividades
  let activityStats;
  if (typeof db.get === 'function') {
    activityStats = db.prepare(`
      SELECT 
        COUNT(*) as total_activities,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_activities,
        (SELECT COUNT(*) FROM activity_participants) as total_participants
      FROM activities
    `).get();
  } else {
    activityStats = await db.get(`
      SELECT 
        COUNT(*) as total_activities,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_activities,
        (SELECT COUNT(*) FROM activity_participants) as total_participants
      FROM activities
    `);
  }
  
  res.json({
    userStats,
    reportStats: reportStats || {},
    rewardStats: rewardStats || {},
    activityStats: activityStats || {}
  });
}));

/**
 * GET /api/admin/users
 * Obtener todos los usuarios con paginación
 */
router.get('/users', asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, role, status, search } = req.query;
  const offset = (page - 1) * limit;
  const db = getDatabase();
  
  let whereConditions = [];
  let params = [];
  
  if (role) {
    whereConditions.push('role = ?');
    params.push(role);
  }
  
  if (status) {
    whereConditions.push('status = ?');
    params.push(status);
  }
  
  if (search) {
    whereConditions.push('(name LIKE ? OR email LIKE ?)');
    params.push(`%${search}%`, `%${search}%`);
  }
  
  const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
  
  // Consulta principal
  const query = `
    SELECT 
      id, name, email, role, status, avatar_url, last_login, created_at, updated_at
    FROM users
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `;
  
  params.push(parseInt(limit), offset);
  
  let users;
  if (typeof db.all === 'function') {
    users = db.prepare(query).all(...params);
  } else {
    users = await db.all(query, params);
  }
  
  // Contar total
  const countQuery = `
    SELECT COUNT(*) as total
    FROM users
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
    users,
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
 * GET /api/admin/users/:id
 * Obtener un usuario específico con información detallada
 */
router.get('/users/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const db = getDatabase();
  
  // Obtener información básica del usuario
  let user;
  if (typeof db.get === 'function') {
    user = db.prepare(`
      SELECT id, name, email, role, status, avatar_url, last_login, created_at, updated_at
      FROM users 
      WHERE id = ?
    `).get(id);
  } else {
    user = await db.get(`
      SELECT id, name, email, role, status, avatar_url, last_login, created_at, updated_at
      FROM users 
      WHERE id = ?
    `, [id]);
  }
  
  if (!user) {
    throw errors.notFound('Usuario no encontrado');
  }
  
  // Obtener información específica según el rol
  let roleData = {};
  
  if (user.role === 'student') {
    if (typeof db.get === 'function') {
      roleData = db.prepare(`
        SELECT s.*, t.name as teacher_name
        FROM students s
        LEFT JOIN teachers te ON s.teacher_id = te.id
        LEFT JOIN users t ON te.user_id = t.id
        WHERE s.user_id = ?
      `).get(id) || {};
    } else {
      roleData = await db.get(`
        SELECT s.*, t.name as teacher_name
        FROM students s
        LEFT JOIN teachers te ON s.teacher_id = te.id
        LEFT JOIN users t ON te.user_id = t.id
        WHERE s.user_id = ?
      `, [id]) || {};
    }
  } else if (user.role === 'teacher') {
    if (typeof db.get === 'function') {
      roleData = db.prepare(`
        SELECT t.*, 
               (SELECT COUNT(*) FROM students s WHERE s.teacher_id = t.id) as student_count
        FROM teachers t 
        WHERE t.user_id = ?
      `).get(id) || {};
    } else {
      roleData = await db.get(`
        SELECT t.*, 
               (SELECT COUNT(*) FROM students s WHERE s.teacher_id = t.id) as student_count
        FROM teachers t 
        WHERE t.user_id = ?
      `, [id]) || {};
    }
  } else if (user.role === 'tutor') {
    if (typeof db.get === 'function') {
      roleData = db.prepare(`
        SELECT t.*,
               (SELECT COUNT(*) FROM tutor_student ts WHERE ts.tutor_id = t.id) as student_count
        FROM tutors t 
        WHERE t.user_id = ?
      `).get(id) || {};
    } else {
      roleData = await db.get(`
        SELECT t.*,
               (SELECT COUNT(*) FROM tutor_student ts WHERE ts.tutor_id = t.id) as student_count
        FROM tutors t 
        WHERE t.user_id = ?
      `, [id]) || {};
    }
  }
  
  res.json({
    ...user,
    roleData
  });
}));

/**
 * PUT /api/admin/users/:id
 * Actualizar un usuario
 */
router.put('/users/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { error, value } = validateUserUpdate(req.body);
  if (error) {
    throw errors.badRequest('Datos de actualización inválidos');
  }
  
  const db = getDatabase();
  
  // Verificar que el usuario existe
  let user;
  if (typeof db.get === 'function') {
    user = db.prepare('SELECT id FROM users WHERE id = ?').get(id);
  } else {
    user = await db.get('SELECT id FROM users WHERE id = ?', [id]);
  }
  
  if (!user) {
    throw errors.notFound('Usuario no encontrado');
  }
  
  // Actualizar el usuario
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
      UPDATE users 
      SET ${updateFields.join(', ')}, updated_at = datetime('now')
      WHERE id = ?
    `).run(...updateValues);
  } else {
    await db.run(`
      UPDATE users 
      SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, updateValues);
  }
  
  res.json({
    message: 'Usuario actualizado exitosamente'
  });
}));

/**
 * DELETE /api/admin/users/:id
 * Eliminar un usuario (soft delete)
 */
router.delete('/users/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const db = getDatabase();
  
  // Verificar que el usuario existe y no es admin
  let user;
  if (typeof db.get === 'function') {
    user = db.prepare('SELECT id, role FROM users WHERE id = ?').get(id);
  } else {
    user = await db.get('SELECT id, role FROM users WHERE id = ?', [id]);
  }
  
  if (!user) {
    throw errors.notFound('Usuario no encontrado');
  }
  
  if (user.role === 'admin') {
    throw errors.forbidden('No se puede eliminar un usuario administrador');
  }
  
  // Soft delete - cambiar estado a 'deleted'
  if (typeof db.run === 'function') {
    db.prepare(`
      UPDATE users 
      SET status = 'deleted', updated_at = datetime('now')
      WHERE id = ?
    `).run(id);
  } else {
    await db.run(`
      UPDATE users 
      SET status = 'deleted', updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [id]);
  }
  
  res.json({
    message: 'Usuario eliminado exitosamente'
  });
}));

/**
 * GET /api/admin/reports
 * Obtener todos los reportes para administración
 */
router.get('/reports', asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, type, severity } = req.query;
  const offset = (page - 1) * limit;
  const db = getDatabase();
  
  let whereConditions = [];
  let params = [];
  
  if (status) {
    whereConditions.push('r.status = ?');
    params.push(status);
  }
  
  if (type) {
    whereConditions.push('r.type = ?');
    params.push(type);
  }
  
  if (severity) {
    whereConditions.push('r.severity = ?');
    params.push(severity);
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
  
  // Contar total
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
 * GET /api/admin/rewards
 * Obtener todas las recompensas para administración
 */
router.get('/rewards', asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, active, category } = req.query;
  const offset = (page - 1) * limit;
  const db = getDatabase();
  
  let whereConditions = [];
  let params = [];
  
  if (active !== undefined) {
    whereConditions.push('r.active = ?');
    params.push(active === 'true' ? 1 : 0);
  }
  
  if (category) {
    whereConditions.push('r.category = ?');
    params.push(category);
  }
  
  const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
  
  // Consulta principal
  const query = `
    SELECT 
      r.*,
      u.name as created_by_name,
      (SELECT COUNT(*) FROM reward_redemptions rr WHERE rr.reward_id = r.id) as total_redemptions
    FROM rewards r
    LEFT JOIN users u ON r.created_by = u.id
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

/**
 * GET /api/admin/activities
 * Obtener todas las actividades para administración
 */
router.get('/activities', asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, type } = req.query;
  const offset = (page - 1) * limit;
  const db = getDatabase();
  
  let whereConditions = [];
  let params = [];
  
  if (status) {
    whereConditions.push('a.status = ?');
    params.push(status);
  }
  
  if (type) {
    whereConditions.push('a.type = ?');
    params.push(type);
  }
  
  const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
  
  // Consulta principal
  const query = `
    SELECT 
      a.*,
      u.name as created_by_name,
      (SELECT COUNT(*) FROM activity_participants ap WHERE ap.activity_id = a.id) as participants_count
    FROM activities a
    LEFT JOIN users u ON a.created_by = u.id
    ${whereClause}
    ORDER BY a.created_at DESC
    LIMIT ? OFFSET ?
  `;
  
  params.push(parseInt(limit), offset);
  
  let activities;
  if (typeof db.all === 'function') {
    activities = db.prepare(query).all(...params);
  } else {
    activities = await db.all(query, params);
  }
  
  // Contar total
  const countQuery = `
    SELECT COUNT(*) as total
    FROM activities a
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
    activities,
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
 * GET /api/admin/system-config
 * Obtener configuración del sistema
 */
router.get('/system-config', asyncHandler(async (req, res) => {
  const db = getDatabase();
  
  let config;
  if (typeof db.all === 'function') {
    config = db.prepare('SELECT * FROM system_config').all();
  } else {
    config = await db.all('SELECT * FROM system_config');
  }
  
  // Convertir array de configuraciones a objeto
  const configObj = {};
  config.forEach(item => {
    configObj[item.key] = item.value;
  });
  
  res.json(configObj);
}));

/**
 * PUT /api/admin/system-config
 * Actualizar configuración del sistema
 */
router.put('/system-config', asyncHandler(async (req, res) => {
  const { error, value } = validateSystemConfig(req.body);
  if (error) {
    throw errors.badRequest('Datos de configuración inválidos');
  }
  
  const db = getDatabase();
  
  // Actualizar cada configuración
  for (const [key, val] of Object.entries(value)) {
    if (typeof db.run === 'function') {
      db.prepare(`
        INSERT OR REPLACE INTO system_config (key, value, updated_at)
        VALUES (?, ?, datetime('now'))
      `).run(key, val);
    } else {
      await db.run(`
        INSERT INTO system_config (key, value, updated_at)
        VALUES (?, ?, CURRENT_TIMESTAMP)
        ON DUPLICATE KEY UPDATE value = VALUES(value), updated_at = VALUES(updated_at)
      `, [key, val]);
    }
  }
  
  res.json({
    message: 'Configuración del sistema actualizada exitosamente'
  });
}));

/**
 * GET /api/admin/audit-logs
 * Obtener logs de auditoría
 */
router.get('/audit-logs', asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, action, table_name, user_id } = req.query;
  const offset = (page - 1) * limit;
  const db = getDatabase();
  
  let whereConditions = [];
  let params = [];
  
  if (action) {
    whereConditions.push('action = ?');
    params.push(action);
  }
  
  if (table_name) {
    whereConditions.push('table_name = ?');
    params.push(table_name);
  }
  
  if (user_id) {
    whereConditions.push('user_id = ?');
    params.push(user_id);
  }
  
  const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
  
  // Consulta principal
  const query = `
    SELECT 
      al.*,
      u.name as user_name
    FROM audit_logs al
    LEFT JOIN users u ON al.user_id = u.id
    ${whereClause}
    ORDER BY al.created_at DESC
    LIMIT ? OFFSET ?
  `;
  
  params.push(parseInt(limit), offset);
  
  let logs;
  if (typeof db.all === 'function') {
    logs = db.prepare(query).all(...params);
  } else {
    logs = await db.all(query, params);
  }
  
  // Contar total
  const countQuery = `
    SELECT COUNT(*) as total
    FROM audit_logs al
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
    logs,
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