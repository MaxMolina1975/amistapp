import { serverConfig } from '../config/database.js';

/**
 * Middleware de manejo de errores centralizado
 */
export function errorHandler(err, req, res, next) {
  // Log del error
  console.error('❌ Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });
  
  // Errores de validación de Joi
  if (err.isJoi) {
    return res.status(400).json({
      error: 'Error de validación',
      message: 'Los datos enviados no son válidos',
      details: err.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      })),
      timestamp: new Date().toISOString()
    });
  }
  
  // Errores de JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Token inválido',
      message: 'El token de autenticación no es válido',
      timestamp: new Date().toISOString()
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token expirado',
      message: 'El token de autenticación ha expirado',
      timestamp: new Date().toISOString()
    });
  }
  
  // Errores de base de datos
  if (err.code === 'SQLITE_CONSTRAINT_UNIQUE' || err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      error: 'Conflicto de datos',
      message: 'Ya existe un registro con estos datos',
      timestamp: new Date().toISOString()
    });
  }
  
  if (err.code === 'SQLITE_CONSTRAINT_FOREIGNKEY' || err.code === 'ER_NO_REFERENCED_ROW') {
    return res.status(400).json({
      error: 'Referencia inválida',
      message: 'Los datos hacen referencia a un registro que no existe',
      timestamp: new Date().toISOString()
    });
  }
  
  // Errores de sintaxis JSON
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      error: 'JSON inválido',
      message: 'El formato de los datos enviados no es válido',
      timestamp: new Date().toISOString()
    });
  }
  
  // Errores de tamaño de payload
  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      error: 'Archivo demasiado grande',
      message: 'El archivo enviado excede el tamaño máximo permitido',
      timestamp: new Date().toISOString()
    });
  }
  
  // Error por defecto
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Error interno del servidor';
  
  const errorResponse = {
    error: statusCode === 500 ? 'Error interno del servidor' : 'Error',
    message: statusCode === 500 && serverConfig.nodeEnv === 'production' 
      ? 'Ha ocurrido un error interno' 
      : message,
    timestamp: new Date().toISOString()
  };
  
  // En desarrollo, incluir stack trace
  if (serverConfig.nodeEnv === 'development') {
    errorResponse.stack = err.stack;
    errorResponse.details = {
      name: err.name,
      code: err.code
    };
  }
  
  res.status(statusCode).json(errorResponse);
}

/**
 * Wrapper para funciones async que maneja errores automáticamente
 */
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Crea un error personalizado
 */
export class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.timestamp = new Date().toISOString();
    
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Errores comunes predefinidos
 */
export const errors = {
  notFound: (resource = 'Recurso') => new AppError(`${resource} no encontrado`, 404),
  unauthorized: (message = 'No autorizado') => new AppError(message, 401),
  forbidden: (message = 'Acceso denegado') => new AppError(message, 403),
  badRequest: (message = 'Solicitud inválida') => new AppError(message, 400),
  conflict: (message = 'Conflicto de datos') => new AppError(message, 409),
  tooManyRequests: (message = 'Demasiadas solicitudes') => new AppError(message, 429),
  internal: (message = 'Error interno del servidor') => new AppError(message, 500)
};