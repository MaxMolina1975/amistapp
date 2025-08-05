import jwt from 'jsonwebtoken';
import { serverConfig } from '../config/database.js';
import { getDatabase } from '../database/connection.js';
import { errors } from './errorHandler.js';

/**
 * Middleware de autenticación JWT
 */
export function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      throw errors.unauthorized('Token de autenticación requerido');
    }
    
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;
    
    if (!token) {
      throw errors.unauthorized('Formato de token inválido');
    }
    
    // Verificar el token
    const decoded = jwt.verify(token, serverConfig.jwt.secret);
    
    // Agregar información del usuario a la request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      name: decoded.name
    };
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(errors.unauthorized('Token inválido'));
    } else if (error.name === 'TokenExpiredError') {
      next(errors.unauthorized('Token expirado'));
    } else {
      next(error);
    }
  }
}

/**
 * Middleware para verificar roles específicos
 */
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw errors.unauthorized('Usuario no autenticado');
      }
      
      if (!allowedRoles.includes(req.user.role)) {
        throw errors.forbidden(`Acceso denegado. Roles permitidos: ${allowedRoles.join(', ')}`);
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Middleware para verificar que el usuario esté activo
 */
export async function requireActiveUser(req, res, next) {
  try {
    if (!req.user) {
      throw errors.unauthorized('Usuario no autenticado');
    }
    
    const db = getDatabase();
    let user;
    
    if (typeof db.get === 'function') {
      user = db.prepare('SELECT status FROM users WHERE id = ?').get(req.user.id);
    } else {
      user = await db.get('SELECT status FROM users WHERE id = ?', [req.user.id]);
    }
    
    if (!user) {
      throw errors.unauthorized('Usuario no encontrado');
    }
    
    if (user.status !== 'active') {
      throw errors.forbidden('Cuenta inactiva o suspendida');
    }
    
    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Middleware para verificar que el usuario sea propietario del recurso
 */
export function requireOwnership(userIdField = 'user_id') {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        throw errors.unauthorized('Usuario no autenticado');
      }
      
      // Los administradores pueden acceder a cualquier recurso
      if (req.user.role === 'admin') {
        return next();
      }
      
      const resourceUserId = req.params[userIdField] || req.body[userIdField];
      
      if (!resourceUserId) {
        throw errors.badRequest(`Campo ${userIdField} requerido`);
      }
      
      if (parseInt(resourceUserId) !== req.user.id) {
        throw errors.forbidden('No tienes permisos para acceder a este recurso');
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Middleware opcional de autenticación (no falla si no hay token)
 */
export function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return next();
    }
    
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;
    
    if (!token) {
      return next();
    }
    
    try {
      const decoded = jwt.verify(token, serverConfig.jwt.secret);
      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        name: decoded.name
      };
    } catch (jwtError) {
      // Ignorar errores de JWT en autenticación opcional
    }
    
    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Genera un token JWT
 */
export function generateToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name
  };
  
  return jwt.sign(payload, serverConfig.jwt.secret, {
    expiresIn: serverConfig.jwt.expiresIn,
    issuer: 'amistapp-backend',
    audience: 'amistapp-frontend'
  });
}

/**
 * Verifica un token JWT sin middleware
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, serverConfig.jwt.secret);
  } catch (error) {
    throw errors.unauthorized('Token inválido');
  }
}