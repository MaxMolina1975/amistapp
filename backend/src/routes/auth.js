import express from 'express';
import bcrypt from 'bcryptjs';
import { getDatabase } from '../database/connection.js';
import { generateToken, authMiddleware } from '../middleware/auth.js';
import { asyncHandler, errors } from '../middleware/errorHandler.js';
import { validateLogin, validateRegister } from '../validators/auth.js';

const router = express.Router();

/**
 * POST /api/auth/login
 * Iniciar sesión
 */
router.post('/login', asyncHandler(async (req, res) => {
  const { error, value } = validateLogin(req.body);
  if (error) {
    throw errors.badRequest('Datos de login inválidos');
  }
  
  const { email, password } = value;
  const db = getDatabase();
  
  // Buscar usuario por email
  let user;
  if (typeof db.get === 'function') {
    user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  } else {
    user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
  }
  
  if (!user) {
    throw errors.unauthorized('Credenciales inválidas');
  }
  
  // Verificar estado del usuario
  if (user.status !== 'active') {
    throw errors.forbidden('Cuenta inactiva o suspendida');
  }
  
  // Verificar contraseña
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw errors.unauthorized('Credenciales inválidas');
  }
  
  // Actualizar último login
  const now = new Date().toISOString();
  if (typeof db.run === 'function') {
    db.prepare('UPDATE users SET last_login = ? WHERE id = ?').run(now, user.id);
  } else {
    await db.run('UPDATE users SET last_login = ? WHERE id = ?', [now, user.id]);
  }
  
  // Generar token
  const token = generateToken(user);
  
  // Respuesta sin contraseña
  const { password: _, ...userWithoutPassword } = user;
  
  res.json({
    message: 'Login exitoso',
    token,
    user: userWithoutPassword
  });
}));

/**
 * POST /api/auth/register
 * Registrar nuevo usuario
 */
router.post('/register', asyncHandler(async (req, res) => {
  const { error, value } = validateRegister(req.body);
  if (error) {
    throw errors.badRequest('Datos de registro inválidos');
  }
  
  const { name, email, password, role = 'student' } = value;
  const db = getDatabase();
  
  // Verificar si el email ya existe
  let existingUser;
  if (typeof db.get === 'function') {
    existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  } else {
    existingUser = await db.get('SELECT id FROM users WHERE email = ?', [email]);
  }
  
  if (existingUser) {
    throw errors.conflict('El email ya está registrado');
  }
  
  // Hash de la contraseña
  const hashedPassword = await bcrypt.hash(password, 12);
  
  // Crear usuario
  let result;
  if (typeof db.run === 'function') {
    result = db.prepare(`
      INSERT INTO users (name, email, password, role, status)
      VALUES (?, ?, ?, ?, 'active')
    `).run(name, email, hashedPassword, role);
  } else {
    result = await db.run(`
      INSERT INTO users (name, email, password, role, status)
      VALUES (?, ?, ?, ?, 'active')
    `, [name, email, hashedPassword, role]);
  }
  
  const userId = result.lastInsertRowid || result.insertId;
  
  // Crear registro específico según el rol
  if (role === 'student') {
    if (typeof db.run === 'function') {
      db.prepare('INSERT INTO students (user_id) VALUES (?)').run(userId);
    } else {
      await db.run('INSERT INTO students (user_id) VALUES (?)', [userId]);
    }
  } else if (role === 'teacher') {
    if (typeof db.run === 'function') {
      db.prepare('INSERT INTO teachers (user_id) VALUES (?)').run(userId);
    } else {
      await db.run('INSERT INTO teachers (user_id) VALUES (?)', [userId]);
    }
  } else if (role === 'tutor') {
    if (typeof db.run === 'function') {
      db.prepare('INSERT INTO tutors (user_id, relationship) VALUES (?, ?)').run(userId, 'parent');
    } else {
      await db.run('INSERT INTO tutors (user_id, relationship) VALUES (?, ?)', [userId, 'parent']);
    }
  }
  
  res.status(201).json({
    message: 'Usuario registrado exitosamente',
    user: {
      id: userId,
      name,
      email,
      role,
      status: 'active'
    }
  });
}));

/**
 * GET /api/auth/profile
 * Obtener perfil del usuario autenticado
 */
router.get('/profile', authMiddleware, asyncHandler(async (req, res) => {
  const db = getDatabase();
  
  // Obtener información completa del usuario
  let user;
  if (typeof db.get === 'function') {
    user = db.prepare(`
      SELECT id, name, email, role, status, avatar_url, last_login, created_at
      FROM users 
      WHERE id = ?
    `).get(req.user.id);
  } else {
    user = await db.get(`
      SELECT id, name, email, role, status, avatar_url, last_login, created_at
      FROM users 
      WHERE id = ?
    `, [req.user.id]);
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
      `).get(user.id) || {};
    } else {
      roleData = await db.get(`
        SELECT s.*, t.name as teacher_name
        FROM students s
        LEFT JOIN teachers te ON s.teacher_id = te.id
        LEFT JOIN users t ON te.user_id = t.id
        WHERE s.user_id = ?
      `, [user.id]) || {};
    }
  } else if (user.role === 'teacher') {
    if (typeof db.get === 'function') {
      roleData = db.prepare('SELECT * FROM teachers WHERE user_id = ?').get(user.id) || {};
    } else {
      roleData = await db.get('SELECT * FROM teachers WHERE user_id = ?', [user.id]) || {};
    }
  } else if (user.role === 'tutor') {
    if (typeof db.get === 'function') {
      roleData = db.prepare('SELECT * FROM tutors WHERE user_id = ?').get(user.id) || {};
    } else {
      roleData = await db.get('SELECT * FROM tutors WHERE user_id = ?', [user.id]) || {};
    }
  }
  
  res.json({
    ...user,
    roleData
  });
}));

/**
 * POST /api/auth/logout
 * Cerrar sesión (invalidar token del lado del cliente)
 */
router.post('/logout', authMiddleware, asyncHandler(async (req, res) => {
  // En una implementación más avanzada, aquí se podría agregar el token a una blacklist
  res.json({
    message: 'Sesión cerrada exitosamente'
  });
}));

/**
 * PUT /api/auth/profile
 * Actualizar perfil del usuario
 */
router.put('/profile', authMiddleware, asyncHandler(async (req, res) => {
  const { name, avatar_url } = req.body;
  const db = getDatabase();
  
  if (!name) {
    throw errors.badRequest('El nombre es requerido');
  }
  
  // Actualizar usuario
  if (typeof db.run === 'function') {
    db.prepare(`
      UPDATE users 
      SET name = ?, avatar_url = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(name, avatar_url || null, req.user.id);
  } else {
    await db.run(`
      UPDATE users 
      SET name = ?, avatar_url = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [name, avatar_url || null, req.user.id]);
  }
  
  res.json({
    message: 'Perfil actualizado exitosamente'
  });
}));

/**
 * POST /api/auth/change-password
 * Cambiar contraseña
 */
router.post('/change-password', authMiddleware, asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  if (!currentPassword || !newPassword) {
    throw errors.badRequest('Contraseña actual y nueva son requeridas');
  }
  
  if (newPassword.length < 6) {
    throw errors.badRequest('La nueva contraseña debe tener al menos 6 caracteres');
  }
  
  const db = getDatabase();
  
  // Obtener contraseña actual
  let user;
  if (typeof db.get === 'function') {
    user = db.prepare('SELECT password FROM users WHERE id = ?').get(req.user.id);
  } else {
    user = await db.get('SELECT password FROM users WHERE id = ?', [req.user.id]);
  }
  
  if (!user) {
    throw errors.notFound('Usuario no encontrado');
  }
  
  // Verificar contraseña actual
  const isValidPassword = await bcrypt.compare(currentPassword, user.password);
  if (!isValidPassword) {
    throw errors.unauthorized('Contraseña actual incorrecta');
  }
  
  // Hash de la nueva contraseña
  const hashedNewPassword = await bcrypt.hash(newPassword, 12);
  
  // Actualizar contraseña
  if (typeof db.run === 'function') {
    db.prepare(`
      UPDATE users 
      SET password = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(hashedNewPassword, req.user.id);
  } else {
    await db.run(`
      UPDATE users 
      SET password = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [hashedNewPassword, req.user.id]);
  }
  
  res.json({
    message: 'Contraseña cambiada exitosamente'
  });
}));

export default router;