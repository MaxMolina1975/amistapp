import express from 'express';
import { getDatabase } from '../database/connection.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';
import { asyncHandler, errors } from '../middleware/errorHandler.js';
import { validateReward, validateRewardUpdate, validateRewardClaim } from '../validators/rewards.js';

const router = express.Router();

/**
 * GET /api/rewards
 * Obtener todas las recompensas
 */
router.get('/', authMiddleware, asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, active, category, min_points, max_points } = req.query;
  const offset = (page - 1) * limit;
  const db = getDatabase();
  
  let whereConditions = [];
  let params = [];
  
  // Filtros
  if (active !== undefined) {
    whereConditions.push('active = ?');
    params.push(active === 'true' ? 1 : 0);
  }
  
  if (category) {
    whereConditions.push('category = ?');
    params.push(category);
  }
  
  if (min_points) {
    whereConditions.push('points >= ?');
    params.push(parseInt(min_points));
  }
  
  if (max_points) {
    whereConditions.push('points <= ?');
    params.push(parseInt(max_points));
  }
  
  const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
  
  // Consulta principal
  const query = `
    SELECT 
      r.*,
      u.name as created_by_name,
      (SELECT COUNT(*) FROM reward_redemptions rr WHERE rr.reward_id = r.id) as total_redemptions,
      (SELECT COUNT(*) FROM reward_redemptions rr WHERE rr.reward_id = r.id AND rr.status = 'pending') as pending_redemptions
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
 * GET /api/rewards/:id
 * Obtener una recompensa específica
 */
router.get('/:id', authMiddleware, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const db = getDatabase();
  
  let reward;
  if (typeof db.get === 'function') {
    reward = db.prepare(`
      SELECT 
        r.*,
        u.name as created_by_name,
        (SELECT COUNT(*) FROM reward_redemptions rr WHERE rr.reward_id = r.id) as total_redemptions,
        (SELECT COUNT(*) FROM reward_redemptions rr WHERE rr.reward_id = r.id AND rr.status = 'pending') as pending_redemptions
      FROM rewards r
      LEFT JOIN users u ON r.created_by = u.id
      WHERE r.id = ?
    `).get(id);
  } else {
    reward = await db.get(`
      SELECT 
        r.*,
        u.name as created_by_name,
        (SELECT COUNT(*) FROM reward_redemptions rr WHERE rr.reward_id = r.id) as total_redemptions,
        (SELECT COUNT(*) FROM reward_redemptions rr WHERE rr.reward_id = r.id AND rr.status = 'pending') as pending_redemptions
      FROM rewards r
      LEFT JOIN users u ON r.created_by = u.id
      WHERE r.id = ?
    `, [id]);
  }
  
  if (!reward) {
    throw errors.notFound('Recompensa no encontrada');
  }
  
  res.json(reward);
}));

/**
 * POST /api/rewards
 * Crear nueva recompensa
 */
router.post('/', authMiddleware, requireRole(['admin', 'teacher']), asyncHandler(async (req, res) => {
  const { error, value } = validateReward(req.body);
  if (error) {
    throw errors.badRequest('Datos de la recompensa inválidos');
  }
  
  const { name, description, points, stock, category, image_url, active = true } = value;
  const db = getDatabase();
  
  // Crear la recompensa
  let result;
  if (typeof db.run === 'function') {
    result = db.prepare(`
      INSERT INTO rewards (name, description, points, stock, category, image_url, active, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(name, description, points, stock, category, image_url, active ? 1 : 0, req.user.id);
  } else {
    result = await db.run(`
      INSERT INTO rewards (name, description, points, stock, category, image_url, active, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [name, description, points, stock, category, image_url, active ? 1 : 0, req.user.id]);
  }
  
  const rewardId = result.lastInsertRowid || result.insertId;
  
  res.status(201).json({
    message: 'Recompensa creada exitosamente',
    reward: {
      id: rewardId,
      name,
      description,
      points,
      stock,
      category,
      image_url,
      active,
      created_by: req.user.id
    }
  });
}));

/**
 * PUT /api/rewards/:id
 * Actualizar recompensa
 */
router.put('/:id', authMiddleware, requireRole(['admin', 'teacher']), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { error, value } = validateRewardUpdate(req.body);
  if (error) {
    throw errors.badRequest('Datos de actualización inválidos');
  }
  
  const db = getDatabase();
  
  // Verificar que la recompensa existe
  let reward;
  if (typeof db.get === 'function') {
    reward = db.prepare('SELECT * FROM rewards WHERE id = ?').get(id);
  } else {
    reward = await db.get('SELECT * FROM rewards WHERE id = ?', [id]);
  }
  
  if (!reward) {
    throw errors.notFound('Recompensa no encontrada');
  }
  
  // Solo el creador o un admin pueden editar
  if (req.user.role !== 'admin' && reward.created_by !== req.user.id) {
    throw errors.forbidden('No tienes permisos para editar esta recompensa');
  }
  
  // Actualizar la recompensa
  const updateFields = [];
  const updateValues = [];
  
  Object.keys(value).forEach(key => {
    if (value[key] !== undefined) {
      if (key === 'active') {
        updateFields.push(`${key} = ?`);
        updateValues.push(value[key] ? 1 : 0);
      } else {
        updateFields.push(`${key} = ?`);
        updateValues.push(value[key]);
      }
    }
  });
  
  if (updateFields.length === 0) {
    throw errors.badRequest('No hay campos para actualizar');
  }
  
  updateValues.push(id);
  
  if (typeof db.run === 'function') {
    db.prepare(`
      UPDATE rewards 
      SET ${updateFields.join(', ')}, updated_at = datetime('now')
      WHERE id = ?
    `).run(...updateValues);
  } else {
    await db.run(`
      UPDATE rewards 
      SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, updateValues);
  }
  
  res.json({
    message: 'Recompensa actualizada exitosamente'
  });
}));

/**
 * DELETE /api/rewards/:id
 * Eliminar recompensa
 */
router.delete('/:id', authMiddleware, requireRole(['admin']), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const db = getDatabase();
  
  // Verificar que la recompensa existe
  let reward;
  if (typeof db.get === 'function') {
    reward = db.prepare('SELECT id FROM rewards WHERE id = ?').get(id);
  } else {
    reward = await db.get('SELECT id FROM rewards WHERE id = ?', [id]);
  }
  
  if (!reward) {
    throw errors.notFound('Recompensa no encontrada');
  }
  
  // Verificar si hay redenciones pendientes
  let pendingRedemptions;
  if (typeof db.get === 'function') {
    pendingRedemptions = db.prepare('SELECT COUNT(*) as count FROM reward_redemptions WHERE reward_id = ? AND status = "pending"').get(id);
  } else {
    pendingRedemptions = await db.get('SELECT COUNT(*) as count FROM reward_redemptions WHERE reward_id = ? AND status = ?', [id, 'pending']);
  }
  
  if (pendingRedemptions.count > 0) {
    throw errors.conflict('No se puede eliminar la recompensa porque tiene redenciones pendientes');
  }
  
  // Eliminar la recompensa
  if (typeof db.run === 'function') {
    db.prepare('DELETE FROM rewards WHERE id = ?').run(id);
  } else {
    await db.run('DELETE FROM rewards WHERE id = ?', [id]);
  }
  
  res.json({
    message: 'Recompensa eliminada exitosamente'
  });
}));

/**
 * POST /api/rewards/:id/redeem
 * Canjear recompensa
 */
router.post('/:id/redeem', authMiddleware, requireRole(['student']), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { error, value } = validateRewardClaim(req.body);
  if (error) {
    throw errors.badRequest('Datos del canje inválidos');
  }
  
  const { quantity = 1 } = value;
  const db = getDatabase();
  
  // Verificar que la recompensa existe y está activa
  let reward;
  if (typeof db.get === 'function') {
    reward = db.prepare('SELECT * FROM rewards WHERE id = ? AND active = 1').get(id);
  } else {
    reward = await db.get('SELECT * FROM rewards WHERE id = ? AND active = ?', [id, 1]);
  }
  
  if (!reward) {
    throw errors.notFound('Recompensa no encontrada o no disponible');
  }
  
  // Verificar stock disponible
  if (reward.stock !== null && reward.stock < quantity) {
    throw errors.conflict('Stock insuficiente');
  }
  
  // Obtener puntos del estudiante
  let student;
  if (typeof db.get === 'function') {
    student = db.prepare('SELECT points FROM students WHERE user_id = ?').get(req.user.id);
  } else {
    student = await db.get('SELECT points FROM students WHERE user_id = ?', [req.user.id]);
  }
  
  if (!student) {
    throw errors.notFound('Estudiante no encontrado');
  }
  
  const totalCost = reward.points * quantity;
  
  if (student.points < totalCost) {
    throw errors.conflict('Puntos insuficientes');
  }
  
  // Iniciar transacción
  if (typeof db.run === 'function') {
    // SQLite
    db.prepare('BEGIN TRANSACTION').run();
    
    try {
      // Crear redención
      const redemptionResult = db.prepare(`
        INSERT INTO reward_redemptions (reward_id, student_id, quantity, points_spent, status)
        VALUES (?, ?, ?, ?, 'pending')
      `).run(id, req.user.id, quantity, totalCost);
      
      // Descontar puntos
      db.prepare('UPDATE students SET points = points - ? WHERE user_id = ?').run(totalCost, req.user.id);
      
      // Actualizar stock si aplica
      if (reward.stock !== null) {
        db.prepare('UPDATE rewards SET stock = stock - ? WHERE id = ?').run(quantity, id);
      }
      
      db.prepare('COMMIT').run();
      
      res.status(201).json({
        message: 'Recompensa canjeada exitosamente',
        redemption: {
          id: redemptionResult.lastInsertRowid,
          reward_id: id,
          student_id: req.user.id,
          quantity,
          points_spent: totalCost,
          status: 'pending'
        }
      });
    } catch (error) {
      db.prepare('ROLLBACK').run();
      throw error;
    }
  } else {
    // MySQL/PostgreSQL
    await db.run('START TRANSACTION');
    
    try {
      // Crear redención
      const redemptionResult = await db.run(`
        INSERT INTO reward_redemptions (reward_id, student_id, quantity, points_spent, status)
        VALUES (?, ?, ?, ?, 'pending')
      `, [id, req.user.id, quantity, totalCost]);
      
      // Descontar puntos
      await db.run('UPDATE students SET points = points - ? WHERE user_id = ?', [totalCost, req.user.id]);
      
      // Actualizar stock si aplica
      if (reward.stock !== null) {
        await db.run('UPDATE rewards SET stock = stock - ? WHERE id = ?', [quantity, id]);
      }
      
      await db.run('COMMIT');
      
      res.status(201).json({
        message: 'Recompensa canjeada exitosamente',
        redemption: {
          id: redemptionResult.insertId,
          reward_id: id,
          student_id: req.user.id,
          quantity,
          points_spent: totalCost,
          status: 'pending'
        }
      });
    } catch (error) {
      await db.run('ROLLBACK');
      throw error;
    }
  }
}));

/**
 * GET /api/rewards/redemptions
 * Obtener redenciones del usuario o todas (admin/teacher)
 */
router.get('/redemptions', authMiddleware, asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, student_id } = req.query;
  const offset = (page - 1) * limit;
  const db = getDatabase();
  
  let whereConditions = [];
  let params = [];
  
  // Filtros según el rol
  if (req.user.role === 'student') {
    whereConditions.push('rr.student_id = ?');
    params.push(req.user.id);
  } else if (student_id && (req.user.role === 'admin' || req.user.role === 'teacher')) {
    whereConditions.push('rr.student_id = ?');
    params.push(student_id);
  }
  
  if (status) {
    whereConditions.push('rr.status = ?');
    params.push(status);
  }
  
  const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
  
  // Consulta principal
  const query = `
    SELECT 
      rr.*,
      r.name as reward_name,
      r.description as reward_description,
      r.image_url as reward_image,
      u.name as student_name
    FROM reward_redemptions rr
    JOIN rewards r ON rr.reward_id = r.id
    JOIN users u ON rr.student_id = u.id
    ${whereClause}
    ORDER BY rr.created_at DESC
    LIMIT ? OFFSET ?
  `;
  
  params.push(parseInt(limit), offset);
  
  let redemptions;
  if (typeof db.all === 'function') {
    redemptions = db.prepare(query).all(...params);
  } else {
    redemptions = await db.all(query, params);
  }
  
  // Contar total
  const countQuery = `
    SELECT COUNT(*) as total
    FROM reward_redemptions rr
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
    redemptions,
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
 * PUT /api/rewards/redemptions/:id/status
 * Actualizar estado de redención (solo admin/teacher)
 */
router.put('/redemptions/:id/status', authMiddleware, requireRole(['admin', 'teacher']), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  if (!['pending', 'approved', 'rejected', 'delivered'].includes(status)) {
    throw errors.badRequest('Estado inválido');
  }
  
  const db = getDatabase();
  
  // Verificar que la redención existe
  let redemption;
  if (typeof db.get === 'function') {
    redemption = db.prepare('SELECT * FROM reward_redemptions WHERE id = ?').get(id);
  } else {
    redemption = await db.get('SELECT * FROM reward_redemptions WHERE id = ?', [id]);
  }
  
  if (!redemption) {
    throw errors.notFound('Redención no encontrada');
  }
  
  // Si se rechaza, devolver puntos al estudiante
  if (status === 'rejected' && redemption.status === 'pending') {
    if (typeof db.run === 'function') {
      db.prepare('BEGIN TRANSACTION').run();
      
      try {
        // Actualizar estado
        db.prepare('UPDATE reward_redemptions SET status = ?, updated_at = datetime("now") WHERE id = ?').run(status, id);
        
        // Devolver puntos
        db.prepare('UPDATE students SET points = points + ? WHERE user_id = ?').run(redemption.points_spent, redemption.student_id);
        
        // Devolver stock si aplica
        const reward = db.prepare('SELECT stock FROM rewards WHERE id = ?').get(redemption.reward_id);
        if (reward.stock !== null) {
          db.prepare('UPDATE rewards SET stock = stock + ? WHERE id = ?').run(redemption.quantity, redemption.reward_id);
        }
        
        db.prepare('COMMIT').run();
      } catch (error) {
        db.prepare('ROLLBACK').run();
        throw error;
      }
    } else {
      await db.run('START TRANSACTION');
      
      try {
        // Actualizar estado
        await db.run('UPDATE reward_redemptions SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [status, id]);
        
        // Devolver puntos
        await db.run('UPDATE students SET points = points + ? WHERE user_id = ?', [redemption.points_spent, redemption.student_id]);
        
        // Devolver stock si aplica
        const reward = await db.get('SELECT stock FROM rewards WHERE id = ?', [redemption.reward_id]);
        if (reward.stock !== null) {
          await db.run('UPDATE rewards SET stock = stock + ? WHERE id = ?', [redemption.quantity, redemption.reward_id]);
        }
        
        await db.run('COMMIT');
      } catch (error) {
        await db.run('ROLLBACK');
        throw error;
      }
    }
  } else {
    // Solo actualizar estado
    if (typeof db.run === 'function') {
      db.prepare('UPDATE reward_redemptions SET status = ?, updated_at = datetime("now") WHERE id = ?').run(status, id);
    } else {
      await db.run('UPDATE reward_redemptions SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [status, id]);
    }
  }
  
  res.json({
    message: 'Estado de redención actualizado exitosamente'
  });
}));

/**
 * GET /api/rewards/stats
 * Obtener estadísticas de recompensas
 */
router.get('/stats', authMiddleware, requireRole(['admin', 'teacher']), asyncHandler(async (req, res) => {
  const db = getDatabase();
  
  let whereCondition = '';
  let params = [];
  
  // Filtrar por creador si no es admin
  if (req.user.role === 'teacher') {
    whereCondition = 'WHERE created_by = ?';
    params.push(req.user.id);
  }
  
  // Estadísticas de recompensas
  let rewardStats;
  if (typeof db.all === 'function') {
    rewardStats = db.prepare(`
      SELECT 
        COUNT(*) as total_rewards,
        SUM(CASE WHEN active = 1 THEN 1 ELSE 0 END) as active_rewards,
        SUM(CASE WHEN stock IS NOT NULL AND stock = 0 THEN 1 ELSE 0 END) as out_of_stock
      FROM rewards
      ${whereCondition}
    `).get(...params);
  } else {
    rewardStats = await db.get(`
      SELECT 
        COUNT(*) as total_rewards,
        SUM(CASE WHEN active = 1 THEN 1 ELSE 0 END) as active_rewards,
        SUM(CASE WHEN stock IS NOT NULL AND stock = 0 THEN 1 ELSE 0 END) as out_of_stock
      FROM rewards
      ${whereCondition}
    `, params);
  }
  
  // Estadísticas de redenciones
  let redemptionStats;
  if (typeof db.all === 'function') {
    redemptionStats = db.prepare(`
      SELECT 
        status,
        COUNT(*) as count,
        SUM(points_spent) as total_points
      FROM reward_redemptions rr
      ${req.user.role === 'teacher' ? 'JOIN rewards r ON rr.reward_id = r.id WHERE r.created_by = ?' : ''}
      GROUP BY status
    `).all(...(req.user.role === 'teacher' ? [req.user.id] : []));
  } else {
    redemptionStats = await db.all(`
      SELECT 
        status,
        COUNT(*) as count,
        SUM(points_spent) as total_points
      FROM reward_redemptions rr
      ${req.user.role === 'teacher' ? 'JOIN rewards r ON rr.reward_id = r.id WHERE r.created_by = ?' : ''}
      GROUP BY status
    `, req.user.role === 'teacher' ? [req.user.id] : []);
  }
  
  res.json({
    rewardStats,
    redemptionStats
  });
}));

export default router;