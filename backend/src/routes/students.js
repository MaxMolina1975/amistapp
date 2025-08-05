import express from 'express';
import bcrypt from 'bcryptjs';
import { getDatabase } from '../database/connection.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';
import { asyncHandler, errors } from '../middleware/errorHandler.js';
import { validateStudentUpdate, validatePasswordChange, validateStudentConfig } from '../validators/students.js';

const router = express.Router();

// Aplicar middleware de autenticación
router.use(authMiddleware);

/**
 * GET /api/students/profile
 * Obtener perfil del estudiante
 */
router.get('/profile', requireRole(['student']), asyncHandler(async (req, res) => {
  const studentId = req.user.id;
  const db = getDatabase();
  
  // Obtener información del estudiante
  let student;
  if (typeof db.get === 'function') {
    student = db.prepare(`
      SELECT 
        u.id, u.name, u.email, u.avatar_url, u.status, u.created_at, u.last_login,
        s.points, s.level, s.grade, s.teacher_id,
        t.name as teacher_name
      FROM users u
      JOIN students s ON u.id = s.user_id
      LEFT JOIN teachers te ON s.teacher_id = te.id
      LEFT JOIN users t ON te.user_id = t.id
      WHERE u.id = ?
    `).get(studentId);
  } else {
    student = await db.get(`
      SELECT 
        u.id, u.name, u.email, u.avatar_url, u.status, u.created_at, u.last_login,
        s.points, s.level, s.grade, s.teacher_id,
        t.name as teacher_name
      FROM users u
      JOIN students s ON u.id = s.user_id
      LEFT JOIN teachers te ON s.teacher_id = te.id
      LEFT JOIN users t ON te.user_id = t.id
      WHERE u.id = ?
    `, [studentId]);
  }
  
  if (!student) {
    throw errors.notFound('Estudiante no encontrado');
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
    `).get(studentId, studentId, studentId, studentId, studentId);
  } else {
    stats = await db.get(`
      SELECT 
        (SELECT COUNT(*) FROM reports WHERE student_id = ?) as total_reports,
        (SELECT COUNT(*) FROM reports WHERE student_id = ? AND status = 'resolved') as resolved_reports,
        (SELECT COUNT(*) FROM reward_redemptions WHERE student_id = ?) as total_redemptions,
        (SELECT SUM(points_spent) FROM reward_redemptions WHERE student_id = ? AND status = 'approved') as total_points_spent,
        (SELECT COUNT(*) FROM student_achievements WHERE student_id = ?) as total_achievements
    `, [studentId, studentId, studentId, studentId, studentId]);
  }
  
  res.json({
    ...student,
    stats: stats || {}
  });
}));

/**
 * PUT /api/students/profile
 * Actualizar perfil del estudiante
 */
router.put('/profile', requireRole(['student']), asyncHandler(async (req, res) => {
  const studentId = req.user.id;
  const { error, value } = validateStudentUpdate(req.body);
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
      `).get(value.email, studentId);
    } else {
      existingUser = await db.get(`
        SELECT id FROM users WHERE email = ? AND id != ?
      `, [value.email, studentId]);
    }
    
    if (existingUser) {
      throw errors.conflict('El email ya está en uso por otro usuario');
    }
  }
  
  // Actualizar usuario
  const updateFields = [];
  const updateValues = [];
  
  if (value.name) {
    updateFields.push('name = ?');
    updateValues.push(value.name);
  }
  
  if (value.email) {
    updateFields.push('email = ?');
    updateValues.push(value.email);
  }
  
  if (value.avatar_url !== undefined) {
    updateFields.push('avatar_url = ?');
    updateValues.push(value.avatar_url);
  }
  
  if (updateFields.length > 0) {
    updateValues.push(studentId);
    
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
  }
  
  res.json({
    message: 'Perfil actualizado exitosamente'
  });
}));

/**
 * POST /api/students/change-password
 * Cambiar contraseña del estudiante
 */
router.post('/change-password', requireRole(['student']), asyncHandler(async (req, res) => {
  const studentId = req.user.id;
  const { error, value } = validatePasswordChange(req.body);
  if (error) {
    throw errors.badRequest('Datos de cambio de contraseña inválidos');
  }
  
  const { currentPassword, newPassword } = value;
  const db = getDatabase();
  
  // Obtener la contraseña actual del usuario
  let user;
  if (typeof db.get === 'function') {
    user = db.prepare('SELECT password FROM users WHERE id = ?').get(studentId);
  } else {
    user = await db.get('SELECT password FROM users WHERE id = ?', [studentId]);
  }
  
  if (!user) {
    throw errors.notFound('Usuario no encontrado');
  }
  
  // Verificar la contraseña actual
  const isValidPassword = await bcrypt.compare(currentPassword, user.password);
  if (!isValidPassword) {
    throw errors.unauthorized('La contraseña actual es incorrecta');
  }
  
  // Encriptar la nueva contraseña
  const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  
  // Actualizar la contraseña
  if (typeof db.run === 'function') {
    db.prepare(`
      UPDATE users 
      SET password = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(hashedNewPassword, studentId);
  } else {
    await db.run(`
      UPDATE users 
      SET password = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [hashedNewPassword, studentId]);
  }
  
  res.json({
    message: 'Contraseña cambiada exitosamente'
  });
}));

/**
 * GET /api/students/dashboard
 * Obtener datos del dashboard del estudiante
 */
router.get('/dashboard', requireRole(['student']), asyncHandler(async (req, res) => {
  const studentId = req.user.id;
  const db = getDatabase();
  
  // Obtener información básica del estudiante
  let studentInfo;
  if (typeof db.get === 'function') {
    studentInfo = db.prepare(`
      SELECT s.points, s.level, s.grade, u.name
      FROM students s
      JOIN users u ON s.user_id = u.id
      WHERE u.id = ?
    `).get(studentId);
  } else {
    studentInfo = await db.get(`
      SELECT s.points, s.level, s.grade, u.name
      FROM students s
      JOIN users u ON s.user_id = u.id
      WHERE u.id = ?
    `, [studentId]);
  }
  
  if (!studentInfo) {
    throw errors.notFound('Estudiante no encontrado');
  }
  
  // Obtener reportes recientes
  let recentReports;
  if (typeof db.all === 'function') {
    recentReports = db.prepare(`
      SELECT id, type, title, severity, status, created_at
      FROM reports
      WHERE student_id = ?
      ORDER BY created_at DESC
      LIMIT 5
    `).all(studentId);
  } else {
    recentReports = await db.all(`
      SELECT id, type, title, severity, status, created_at
      FROM reports
      WHERE student_id = ?
      ORDER BY created_at DESC
      LIMIT 5
    `, [studentId]);
  }
  
  // Obtener recompensas disponibles
  let availableRewards;
  if (typeof db.all === 'function') {
    availableRewards = db.prepare(`
      SELECT id, name, description, points_required, category, image_url
      FROM rewards
      WHERE active = 1 AND points_required <= ?
      ORDER BY points_required ASC
      LIMIT 5
    `).all(studentInfo.points);
  } else {
    availableRewards = await db.all(`
      SELECT id, name, description, points_required, category, image_url
      FROM rewards
      WHERE active = 1 AND points_required <= ?
      ORDER BY points_required ASC
      LIMIT 5
    `, [studentInfo.points]);
  }
  
  // Obtener logros recientes
  let recentAchievements;
  if (typeof db.all === 'function') {
    recentAchievements = db.prepare(`
      SELECT a.name, a.description, a.icon, sa.earned_at
      FROM student_achievements sa
      JOIN achievements a ON sa.achievement_id = a.id
      WHERE sa.student_id = ?
      ORDER BY sa.earned_at DESC
      LIMIT 3
    `).all(studentId);
  } else {
    recentAchievements = await db.all(`
      SELECT a.name, a.description, a.icon, sa.earned_at
      FROM student_achievements sa
      JOIN achievements a ON sa.achievement_id = a.id
      WHERE sa.student_id = ?
      ORDER BY sa.earned_at DESC
      LIMIT 3
    `, [studentId]);
  }
  
  // Obtener estadísticas
  let stats;
  if (typeof db.get === 'function') {
    stats = db.prepare(`
      SELECT 
        (SELECT COUNT(*) FROM reports WHERE student_id = ?) as total_reports,
        (SELECT COUNT(*) FROM reward_redemptions WHERE student_id = ?) as total_redemptions,
        (SELECT COUNT(*) FROM student_achievements WHERE student_id = ?) as total_achievements,
        (SELECT COUNT(*) FROM activity_participants WHERE student_id = ?) as total_activities
    `).get(studentId, studentId, studentId, studentId);
  } else {
    stats = await db.get(`
      SELECT 
        (SELECT COUNT(*) FROM reports WHERE student_id = ?) as total_reports,
        (SELECT COUNT(*) FROM reward_redemptions WHERE student_id = ?) as total_redemptions,
        (SELECT COUNT(*) FROM student_achievements WHERE student_id = ?) as total_achievements,
        (SELECT COUNT(*) FROM activity_participants WHERE student_id = ?) as total_activities
    `, [studentId, studentId, studentId, studentId]);
  }
  
  res.json({
    student: studentInfo,
    recentReports: recentReports || [],
    availableRewards: availableRewards || [],
    recentAchievements: recentAchievements || [],
    stats: stats || {}
  });
}));

/**
 * GET /api/students/achievements
 * Obtener logros del estudiante
 */
router.get('/achievements', requireRole(['student']), asyncHandler(async (req, res) => {
  const studentId = req.user.id;
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  const db = getDatabase();
  
  // Obtener logros obtenidos
  let earnedAchievements;
  if (typeof db.all === 'function') {
    earnedAchievements = db.prepare(`
      SELECT a.*, sa.earned_at, sa.progress
      FROM student_achievements sa
      JOIN achievements a ON sa.achievement_id = a.id
      WHERE sa.student_id = ?
      ORDER BY sa.earned_at DESC
      LIMIT ? OFFSET ?
    `).all(studentId, parseInt(limit), offset);
  } else {
    earnedAchievements = await db.all(`
      SELECT a.*, sa.earned_at, sa.progress
      FROM student_achievements sa
      JOIN achievements a ON sa.achievement_id = a.id
      WHERE sa.student_id = ?
      ORDER BY sa.earned_at DESC
      LIMIT ? OFFSET ?
    `, [studentId, parseInt(limit), offset]);
  }
  
  // Obtener logros disponibles (no obtenidos)
  let availableAchievements;
  if (typeof db.all === 'function') {
    availableAchievements = db.prepare(`
      SELECT a.*
      FROM achievements a
      WHERE a.id NOT IN (
        SELECT sa.achievement_id 
        FROM student_achievements sa 
        WHERE sa.student_id = ?
      )
      AND a.active = 1
      ORDER BY a.points_reward DESC
    `).all(studentId);
  } else {
    availableAchievements = await db.all(`
      SELECT a.*
      FROM achievements a
      WHERE a.id NOT IN (
        SELECT sa.achievement_id 
        FROM student_achievements sa 
        WHERE sa.student_id = ?
      )
      AND a.active = 1
      ORDER BY a.points_reward DESC
    `, [studentId]);
  }
  
  // Contar total de logros obtenidos
  let totalEarned;
  if (typeof db.get === 'function') {
    totalEarned = db.prepare(`
      SELECT COUNT(*) as total
      FROM student_achievements
      WHERE student_id = ?
    `).get(studentId);
  } else {
    totalEarned = await db.get(`
      SELECT COUNT(*) as total
      FROM student_achievements
      WHERE student_id = ?
    `, [studentId]);
  }
  
  const total = totalEarned.total;
  const totalPages = Math.ceil(total / limit);
  
  res.json({
    earnedAchievements: earnedAchievements || [],
    availableAchievements: availableAchievements || [],
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
 * GET /api/students/config
 * Obtener configuración del estudiante
 */
router.get('/config', requireRole(['student']), asyncHandler(async (req, res) => {
  const studentId = req.user.id;
  const db = getDatabase();
  
  // Obtener configuración del estudiante
  let config;
  if (typeof db.get === 'function') {
    config = db.prepare(`
      SELECT notifications, privacy, preferences
      FROM student_config
      WHERE user_id = ?
    `).get(studentId);
  } else {
    config = await db.get(`
      SELECT notifications, privacy, preferences
      WHERE user_id = ?
    `, [studentId]);
  }
  
  // Si no existe configuración, devolver valores por defecto
  if (!config) {
    config = {
      notifications: {
        email: true,
        push: true,
        reports: true,
        rewards: true,
        achievements: true
      },
      privacy: {
        show_profile: true,
        allow_messages: true
      },
      preferences: {
        theme: 'light',
        language: 'es'
      }
    };
  } else {
    // Parsear JSON si es necesario
    if (typeof config.notifications === 'string') {
      config.notifications = JSON.parse(config.notifications);
    }
    if (typeof config.privacy === 'string') {
      config.privacy = JSON.parse(config.privacy);
    }
    if (typeof config.preferences === 'string') {
      config.preferences = JSON.parse(config.preferences);
    }
  }
  
  res.json(config);
}));

/**
 * PUT /api/students/config
 * Actualizar configuración del estudiante
 */
router.put('/config', requireRole(['student']), asyncHandler(async (req, res) => {
  const studentId = req.user.id;
  const { error, value } = validateStudentConfig(req.body);
  if (error) {
    throw errors.badRequest('Datos de configuración inválidos');
  }
  
  const db = getDatabase();
  
  // Verificar si ya existe configuración
  let existingConfig;
  if (typeof db.get === 'function') {
    existingConfig = db.prepare(`
      SELECT id FROM student_config WHERE user_id = ?
    `).get(studentId);
  } else {
    existingConfig = await db.get(`
      SELECT id FROM student_config WHERE user_id = ?
    `, [studentId]);
  }
  
  const notificationsJson = JSON.stringify(value.notifications);
  const privacyJson = JSON.stringify(value.privacy);
  const preferencesJson = JSON.stringify(value.preferences);
  
  if (existingConfig) {
    // Actualizar configuración existente
    if (typeof db.run === 'function') {
      db.prepare(`
        UPDATE student_config 
        SET notifications = ?, privacy = ?, preferences = ?, updated_at = datetime('now')
        WHERE user_id = ?
      `).run(notificationsJson, privacyJson, preferencesJson, studentId);
    } else {
      await db.run(`
        UPDATE student_config 
        SET notifications = ?, privacy = ?, preferences = ?, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
      `, [notificationsJson, privacyJson, preferencesJson, studentId]);
    }
  } else {
    // Crear nueva configuración
    if (typeof db.run === 'function') {
      db.prepare(`
        INSERT INTO student_config (user_id, notifications, privacy, preferences, created_at, updated_at)
        VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))
      `).run(studentId, notificationsJson, privacyJson, preferencesJson);
    } else {
      await db.run(`
        INSERT INTO student_config (user_id, notifications, privacy, preferences, created_at, updated_at)
        VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `, [studentId, notificationsJson, privacyJson, preferencesJson]);
    }
  }
  
  res.json({
    message: 'Configuración actualizada exitosamente'
  });
}));

/**
 * GET /api/students/activities
 * Obtener actividades del estudiante
 */
router.get('/activities', requireRole(['student']), asyncHandler(async (req, res) => {
  const studentId = req.user.id;
  const { page = 1, limit = 10, status } = req.query;
  const offset = (page - 1) * limit;
  const db = getDatabase();
  
  let whereConditions = ['ap.student_id = ?'];
  let params = [studentId];
  
  if (status) {
    whereConditions.push('a.status = ?');
    params.push(status);
  }
  
  const whereClause = `WHERE ${whereConditions.join(' AND ')}`;
  
  // Consulta principal
  const query = `
    SELECT 
      a.*,
      ap.participation_date,
      ap.completed,
      ap.points_earned,
      u.name as created_by_name
    FROM activity_participants ap
    JOIN activities a ON ap.activity_id = a.id
    LEFT JOIN users u ON a.created_by = u.id
    ${whereClause}
    ORDER BY ap.participation_date DESC
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
    FROM activity_participants ap
    JOIN activities a ON ap.activity_id = a.id
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
    activities: activities || [],
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