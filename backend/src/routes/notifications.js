import express from 'express';
import { getDatabase } from '../database/connection.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';
import { asyncHandler, errors } from '../middleware/errorHandler.js';
import { validateNotificationCreate, validateNotificationFilters } from '../validators/notifications.js';

const router = express.Router();

/**
 * GET /api/notifications
 * Obtener notificaciones del usuario
 */
router.get('/', asyncHandler(async (req, res) => {
  const { error, value } = validateNotificationFilters(req.query);
  if (error) {
    return res.status(400).json({
      error: 'Parámetros inválidos',
      details: error.details.map(detail => detail.message)
    });
  }
  
  const { page = 1, limit = 20, unread_only = false } = value;
  const offset = (page - 1) * limit;
  const db = getDatabase();
  
  let whereConditions = ['user_id = ?'];
  let params = [req.user.id];
  
  if (unread_only === 'true') {
    whereConditions.push('read_at IS NULL');
  }
  
  const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
  
  // Obtener notificaciones
  const notifications = await db.all(`
    SELECT * FROM notifications 
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `, [...params, parseInt(limit), offset]);
  
  // Contar total
  const totalResult = await db.get(`
    SELECT COUNT(*) as total FROM notifications ${whereClause}
  `, params);
  
  const total = totalResult.total;
  const totalPages = Math.ceil(total / limit);
  
  res.json({
    data: notifications,
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
 * PUT /api/notifications/:id/read
 * Marcar notificación como leída
 */
router.put('/:id/read', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const db = getDatabase();
  
  // Verificar que la notificación pertenece al usuario
  const notification = await db.get(
    'SELECT * FROM notifications WHERE id = ? AND user_id = ?',
    [id, req.user.id]
  );
  
  if (!notification) {
    throw errors.notFound('Notificación no encontrada');
  }
  
  if (notification.read_at) {
    return res.json({
      message: 'La notificación ya estaba marcada como leída',
      data: notification
    });
  }
  
  // Marcar como leída
  await db.run(
    'UPDATE notifications SET read_at = CURRENT_TIMESTAMP WHERE id = ?',
    [id]
  );
  
  const updatedNotification = await db.get(
    'SELECT * FROM notifications WHERE id = ?',
    [id]
  );
  
  res.json({
    message: 'Notificación marcada como leída',
    data: updatedNotification
  });
}));

/**
 * PUT /api/notifications/read-all
 * Marcar todas las notificaciones como leídas
 */
router.put('/read-all', asyncHandler(async (req, res) => {
  const db = getDatabase();
  
  const result = await db.run(
    'UPDATE notifications SET read_at = CURRENT_TIMESTAMP WHERE user_id = ? AND read_at IS NULL',
    [req.user.id]
  );
  
  res.json({
    message: 'Todas las notificaciones han sido marcadas como leídas',
    updated_count: result.changes
  });
}));

/**
 * DELETE /api/notifications/:id
 * Eliminar notificación
 */
router.delete('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const db = getDatabase();
  
  // Verificar que la notificación pertenece al usuario
  const notification = await db.get(
    'SELECT * FROM notifications WHERE id = ? AND user_id = ?',
    [id, req.user.id]
  );
  
  if (!notification) {
    throw errors.notFound('Notificación no encontrada');
  }
  
  await db.run('DELETE FROM notifications WHERE id = ?', [id]);
  
  res.json({
    message: 'Notificación eliminada exitosamente'
  });
}));

/**
 * GET /api/notifications/unread-count
 * Obtener cantidad de notificaciones no leídas
 */
router.get('/unread-count', asyncHandler(async (req, res) => {
  const db = getDatabase();
  
  const result = await db.get(
    'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND read_at IS NULL',
    [req.user.id]
  );
  
  res.json({
    unread_count: result.count
  });
}));

/**
 * POST /api/notifications (Solo para administradores)
 * Crear notificación
 */
router.post('/', requireRole(['admin']), asyncHandler(async (req, res) => {
  const { error, value } = validateNotificationCreate(req.body);
  if (error) {
    return res.status(400).json({
      error: 'Datos inválidos',
      details: error.details.map(detail => detail.message)
    });
  }
  
  const { user_id, title, message, type = 'info', action_url } = value;
  const db = getDatabase();
  
  // Verificar que el usuario existe
  const user = await db.get('SELECT id FROM users WHERE id = ?', [user_id]);
  if (!user) {
    throw errors.notFound('Usuario no encontrado');
  }
  
  const result = await db.run(`
    INSERT INTO notifications (user_id, title, message, type, action_url)
    VALUES (?, ?, ?, ?, ?)
  `, [user_id, title, message, type, action_url]);
  
  const notification = await db.get(
    'SELECT * FROM notifications WHERE id = ?',
    [result.lastID]
  );
  
  res.status(201).json({
    message: 'Notificación creada exitosamente',
    data: notification
  });
}));

export default router;