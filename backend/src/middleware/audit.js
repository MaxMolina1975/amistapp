import { getDatabase } from '../database/connection.js';

/**
 * Middleware de auditoría para registrar acciones de usuarios
 */
export function auditMiddleware(req, res, next) {
  // Solo auditar ciertas rutas y métodos
  const shouldAudit = shouldAuditRequest(req);
  
  if (!shouldAudit) {
    return next();
  }
  
  // Capturar la respuesta original
  const originalSend = res.send;
  const originalJson = res.json;
  
  let responseData = null;
  let responseStatus = null;
  
  // Interceptar res.send
  res.send = function(data) {
    responseData = data;
    responseStatus = res.statusCode;
    return originalSend.call(this, data);
  };
  
  // Interceptar res.json
  res.json = function(data) {
    responseData = data;
    responseStatus = res.statusCode;
    return originalJson.call(this, data);
  };
  
  // Cuando la respuesta termine, registrar la auditoría
  res.on('finish', async () => {
    try {
      await logAuditEvent(req, responseStatus, responseData);
    } catch (error) {
      console.error('Error al registrar auditoría:', error);
    }
  });
  
  next();
}

/**
 * Determina si una request debe ser auditada
 */
function shouldAuditRequest(req) {
  const { method, path } = req;
  
  // No auditar health checks ni archivos estáticos
  if (path.includes('/health') || path.includes('/uploads')) {
    return false;
  }
  
  // Solo auditar operaciones de modificación y algunas consultas importantes
  const auditMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];
  const auditPaths = [
    '/api/auth/login',
    '/api/auth/logout',
    '/api/reports',
    '/api/rewards',
    '/api/admin'
  ];
  
  return auditMethods.includes(method) || 
         auditPaths.some(auditPath => path.startsWith(auditPath));
}

/**
 * Registra un evento de auditoría en la base de datos
 */
async function logAuditEvent(req, responseStatus, responseData) {
  try {
    const db = getDatabase();
    
    const auditData = {
      user_id: req.user?.id || null,
      action: `${req.method} ${req.path}`,
      table_name: extractTableName(req.path),
      record_id: extractRecordId(req, responseData),
      old_values: req.method === 'PUT' || req.method === 'PATCH' ? JSON.stringify(req.body) : null,
      new_values: responseStatus < 400 ? JSON.stringify(responseData) : null,
      ip_address: getClientIP(req),
      user_agent: req.get('User-Agent') || null
    };
    
    if (typeof db.run === 'function') {
      const stmt = db.prepare(`
        INSERT INTO audit_log (
          user_id, action, table_name, record_id, old_values, 
          new_values, ip_address, user_agent
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run(
        auditData.user_id,
        auditData.action,
        auditData.table_name,
        auditData.record_id,
        auditData.old_values,
        auditData.new_values,
        auditData.ip_address,
        auditData.user_agent
      );
    } else {
      await db.run(`
        INSERT INTO audit_log (
          user_id, action, table_name, record_id, old_values, 
          new_values, ip_address, user_agent
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        auditData.user_id,
        auditData.action,
        auditData.table_name,
        auditData.record_id,
        auditData.old_values,
        auditData.new_values,
        auditData.ip_address,
        auditData.user_agent
      ]);
    }
  } catch (error) {
    console.error('Error al insertar registro de auditoría:', error);
  }
}

/**
 * Extrae el nombre de la tabla basado en la ruta
 */
function extractTableName(path) {
  const pathSegments = path.split('/').filter(segment => segment);
  
  if (pathSegments.length >= 2) {
    const resource = pathSegments[1]; // api/[resource]
    
    // Mapear recursos a nombres de tabla
    const tableMap = {
      'reports': 'reports',
      'rewards': 'rewards',
      'users': 'users',
      'students': 'students',
      'teachers': 'teachers',
      'tutors': 'tutors',
      'activities': 'activities',
      'notifications': 'notifications',
      'auth': 'users'
    };
    
    return tableMap[resource] || resource;
  }
  
  return 'unknown';
}

/**
 * Extrae el ID del registro de la request o response
 */
function extractRecordId(req, responseData) {
  // Intentar obtener ID de los parámetros de la URL
  if (req.params.id) {
    return parseInt(req.params.id);
  }
  
  // Intentar obtener ID de la respuesta (para operaciones CREATE)
  if (responseData && typeof responseData === 'object') {
    if (responseData.id) {
      return parseInt(responseData.id);
    }
    
    if (responseData.data && responseData.data.id) {
      return parseInt(responseData.data.id);
    }
  }
  
  return null;
}

/**
 * Obtiene la IP real del cliente
 */
function getClientIP(req) {
  return req.ip ||
         req.connection?.remoteAddress ||
         req.socket?.remoteAddress ||
         req.headers['x-forwarded-for']?.split(',')[0] ||
         req.headers['x-real-ip'] ||
         'unknown';
}

/**
 * Función para consultar logs de auditoría
 */
export async function getAuditLogs(filters = {}) {
  try {
    const db = getDatabase();
    
    let query = `
      SELECT 
        al.*,
        u.name as user_name,
        u.email as user_email
      FROM audit_log al
      LEFT JOIN users u ON al.user_id = u.id
      WHERE 1=1
    `;
    
    const params = [];
    
    // Filtros opcionales
    if (filters.user_id) {
      query += ' AND al.user_id = ?';
      params.push(filters.user_id);
    }
    
    if (filters.table_name) {
      query += ' AND al.table_name = ?';
      params.push(filters.table_name);
    }
    
    if (filters.action) {
      query += ' AND al.action LIKE ?';
      params.push(`%${filters.action}%`);
    }
    
    if (filters.date_from) {
      query += ' AND al.created_at >= ?';
      params.push(filters.date_from);
    }
    
    if (filters.date_to) {
      query += ' AND al.created_at <= ?';
      params.push(filters.date_to);
    }
    
    query += ' ORDER BY al.created_at DESC';
    
    if (filters.limit) {
      query += ' LIMIT ?';
      params.push(parseInt(filters.limit));
    }
    
    if (typeof db.all === 'function') {
      return db.prepare(query).all(params);
    } else {
      return await db.query(query, params);
    }
  } catch (error) {
    console.error('Error al obtener logs de auditoría:', error);
    throw error;
  }
}