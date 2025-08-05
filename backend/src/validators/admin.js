import Joi from 'joi';

/**
 * Validador para actualización de usuarios por admin
 */
export const validateUserUpdate = (data) => {
  const schema = Joi.object({
    name: Joi.string()
      .min(2)
      .max(100)
      .trim()
      .messages({
        'string.min': 'El nombre debe tener al menos 2 caracteres',
        'string.max': 'El nombre no puede exceder 100 caracteres',
        'string.empty': 'El nombre no puede estar vacío'
      }),
    
    email: Joi.string()
      .email()
      .max(255)
      .lowercase()
      .trim()
      .messages({
        'string.email': 'Debe ser un email válido',
        'string.max': 'El email no puede exceder 255 caracteres'
      }),
    
    role: Joi.string()
      .valid('admin', 'teacher', 'student', 'tutor')
      .messages({
        'any.only': 'El rol debe ser admin, teacher, student o tutor'
      }),
    
    status: Joi.string()
      .valid('active', 'inactive', 'suspended')
      .messages({
        'any.only': 'El estado debe ser active, inactive o suspended'
      }),
    
    avatar_url: Joi.string()
      .uri()
      .allow(null, '')
      .messages({
        'string.uri': 'La URL del avatar debe ser válida'
      })
  }).min(1).messages({
    'object.min': 'Debe proporcionar al menos un campo para actualizar'
  });

  return schema.validate(data, { abortEarly: false });
};

/**
 * Validador para configuración del sistema
 */
export const validateSystemConfig = (data) => {
  const schema = Joi.object({
    app_name: Joi.string()
      .min(1)
      .max(100)
      .trim()
      .messages({
        'string.min': 'El nombre de la aplicación no puede estar vacío',
        'string.max': 'El nombre de la aplicación no puede exceder 100 caracteres'
      }),
    
    app_version: Joi.string()
      .pattern(/^\d+\.\d+\.\d+$/)
      .messages({
        'string.pattern.base': 'La versión debe tener el formato x.y.z'
      }),
    
    maintenance_mode: Joi.boolean()
      .messages({
        'boolean.base': 'El modo de mantenimiento debe ser verdadero o falso'
      }),
    
    max_file_size: Joi.number()
      .integer()
      .min(1)
      .max(100 * 1024 * 1024) // 100MB máximo
      .messages({
        'number.base': 'El tamaño máximo de archivo debe ser un número',
        'number.integer': 'El tamaño máximo de archivo debe ser un entero',
        'number.min': 'El tamaño máximo de archivo debe ser al menos 1 byte',
        'number.max': 'El tamaño máximo de archivo no puede exceder 100MB'
      }),
    
    allowed_file_types: Joi.string()
      .pattern(/^[a-zA-Z0-9,\s]+$/)
      .messages({
        'string.pattern.base': 'Los tipos de archivo permitidos deben ser una lista separada por comas'
      }),
    
    session_timeout: Joi.number()
      .integer()
      .min(300) // 5 minutos mínimo
      .max(86400) // 24 horas máximo
      .messages({
        'number.base': 'El tiempo de sesión debe ser un número',
        'number.integer': 'El tiempo de sesión debe ser un entero',
        'number.min': 'El tiempo de sesión debe ser al menos 5 minutos (300 segundos)',
        'number.max': 'El tiempo de sesión no puede exceder 24 horas (86400 segundos)'
      }),
    
    password_min_length: Joi.number()
      .integer()
      .min(6)
      .max(128)
      .messages({
        'number.base': 'La longitud mínima de contraseña debe ser un número',
        'number.integer': 'La longitud mínima de contraseña debe ser un entero',
        'number.min': 'La longitud mínima de contraseña debe ser al menos 6',
        'number.max': 'La longitud mínima de contraseña no puede exceder 128'
      }),
    
    require_password_uppercase: Joi.boolean()
      .messages({
        'boolean.base': 'El requisito de mayúsculas debe ser verdadero o falso'
      }),
    
    require_password_lowercase: Joi.boolean()
      .messages({
        'boolean.base': 'El requisito de minúsculas debe ser verdadero o falso'
      }),
    
    require_password_numbers: Joi.boolean()
      .messages({
        'boolean.base': 'El requisito de números debe ser verdadero o falso'
      }),
    
    require_password_symbols: Joi.boolean()
      .messages({
        'boolean.base': 'El requisito de símbolos debe ser verdadero o falso'
      }),
    
    max_login_attempts: Joi.number()
      .integer()
      .min(3)
      .max(10)
      .messages({
        'number.base': 'El máximo de intentos de login debe ser un número',
        'number.integer': 'El máximo de intentos de login debe ser un entero',
        'number.min': 'El máximo de intentos de login debe ser al menos 3',
        'number.max': 'El máximo de intentos de login no puede exceder 10'
      }),
    
    lockout_duration: Joi.number()
      .integer()
      .min(300) // 5 minutos mínimo
      .max(3600) // 1 hora máximo
      .messages({
        'number.base': 'La duración del bloqueo debe ser un número',
        'number.integer': 'La duración del bloqueo debe ser un entero',
        'number.min': 'La duración del bloqueo debe ser al menos 5 minutos (300 segundos)',
        'number.max': 'La duración del bloqueo no puede exceder 1 hora (3600 segundos)'
      }),
    
    email_notifications: Joi.boolean()
      .messages({
        'boolean.base': 'Las notificaciones por email deben ser verdadero o falso'
      }),
    
    push_notifications: Joi.boolean()
      .messages({
        'boolean.base': 'Las notificaciones push deben ser verdadero o falso'
      }),
    
    backup_frequency: Joi.string()
      .valid('daily', 'weekly', 'monthly')
      .messages({
        'any.only': 'La frecuencia de respaldo debe ser daily, weekly o monthly'
      }),
    
    backup_retention_days: Joi.number()
      .integer()
      .min(7)
      .max(365)
      .messages({
        'number.base': 'Los días de retención de respaldo deben ser un número',
        'number.integer': 'Los días de retención de respaldo deben ser un entero',
        'number.min': 'Los días de retención de respaldo deben ser al menos 7',
        'number.max': 'Los días de retención de respaldo no pueden exceder 365'
      }),
    
    log_level: Joi.string()
      .valid('error', 'warn', 'info', 'debug')
      .messages({
        'any.only': 'El nivel de log debe ser error, warn, info o debug'
      }),
    
    log_retention_days: Joi.number()
      .integer()
      .min(1)
      .max(90)
      .messages({
        'number.base': 'Los días de retención de logs deben ser un número',
        'number.integer': 'Los días de retención de logs deben ser un entero',
        'number.min': 'Los días de retención de logs deben ser al menos 1',
        'number.max': 'Los días de retención de logs no pueden exceder 90'
      }),
    
    rate_limit_requests: Joi.number()
      .integer()
      .min(10)
      .max(1000)
      .messages({
        'number.base': 'El límite de requests debe ser un número',
        'number.integer': 'El límite de requests debe ser un entero',
        'number.min': 'El límite de requests debe ser al menos 10',
        'number.max': 'El límite de requests no puede exceder 1000'
      }),
    
    rate_limit_window: Joi.number()
      .integer()
      .min(60) // 1 minuto mínimo
      .max(3600) // 1 hora máximo
      .messages({
        'number.base': 'La ventana de rate limit debe ser un número',
        'number.integer': 'La ventana de rate limit debe ser un entero',
        'number.min': 'La ventana de rate limit debe ser al menos 1 minuto (60 segundos)',
        'number.max': 'La ventana de rate limit no puede exceder 1 hora (3600 segundos)'
      }),
    
    default_points_per_report: Joi.number()
      .integer()
      .min(1)
      .max(100)
      .messages({
        'number.base': 'Los puntos por defecto por reporte deben ser un número',
        'number.integer': 'Los puntos por defecto por reporte deben ser un entero',
        'number.min': 'Los puntos por defecto por reporte deben ser al menos 1',
        'number.max': 'Los puntos por defecto por reporte no pueden exceder 100'
      }),
    
    default_points_per_activity: Joi.number()
      .integer()
      .min(1)
      .max(100)
      .messages({
        'number.base': 'Los puntos por defecto por actividad deben ser un número',
        'number.integer': 'Los puntos por defecto por actividad deben ser un entero',
        'number.min': 'Los puntos por defecto por actividad deben ser al menos 1',
        'number.max': 'Los puntos por defecto por actividad no pueden exceder 100'
      }),
    
    auto_approve_rewards: Joi.boolean()
      .messages({
        'boolean.base': 'La aprobación automática de recompensas debe ser verdadero o falso'
      }),
    
    require_teacher_approval: Joi.boolean()
      .messages({
        'boolean.base': 'El requisito de aprobación del profesor debe ser verdadero o falso'
      }),
    
    enable_emotional_reports: Joi.boolean()
      .messages({
        'boolean.base': 'Los reportes emocionales deben ser verdadero o falso'
      }),
    
    enable_achievements: Joi.boolean()
      .messages({
        'boolean.base': 'Los logros deben ser verdadero o falso'
      }),
    
    enable_notifications: Joi.boolean()
      .messages({
        'boolean.base': 'Las notificaciones deben ser verdadero o falso'
      }),
    
    theme_primary_color: Joi.string()
      .pattern(/^#[0-9A-Fa-f]{6}$/)
      .messages({
        'string.pattern.base': 'El color primario debe ser un código hexadecimal válido (ej: #FF0000)'
      }),
    
    theme_secondary_color: Joi.string()
      .pattern(/^#[0-9A-Fa-f]{6}$/)
      .messages({
        'string.pattern.base': 'El color secundario debe ser un código hexadecimal válido (ej: #FF0000)'
      }),
    
    contact_email: Joi.string()
      .email()
      .messages({
        'string.email': 'El email de contacto debe ser válido'
      }),
    
    support_phone: Joi.string()
      .pattern(/^[\+]?[0-9\s\-\(\)]+$/)
      .messages({
        'string.pattern.base': 'El teléfono de soporte debe ser un número válido'
      }),
    
    privacy_policy_url: Joi.string()
      .uri()
      .messages({
        'string.uri': 'La URL de la política de privacidad debe ser válida'
      }),
    
    terms_of_service_url: Joi.string()
      .uri()
      .messages({
        'string.uri': 'La URL de los términos de servicio debe ser válida'
      })
  }).min(1).messages({
    'object.min': 'Debe proporcionar al menos una configuración para actualizar'
  });

  return schema.validate(data, { abortEarly: false });
};

/**
 * Validador para filtros de logs de auditoría
 */
export const validateAuditLogFilters = (data) => {
  const schema = Joi.object({
    page: Joi.number()
      .integer()
      .min(1)
      .default(1)
      .messages({
        'number.base': 'La página debe ser un número',
        'number.integer': 'La página debe ser un entero',
        'number.min': 'La página debe ser al menos 1'
      }),
    
    limit: Joi.number()
      .integer()
      .min(1)
      .max(100)
      .default(10)
      .messages({
        'number.base': 'El límite debe ser un número',
        'number.integer': 'El límite debe ser un entero',
        'number.min': 'El límite debe ser al menos 1',
        'number.max': 'El límite no puede exceder 100'
      }),
    
    action: Joi.string()
      .valid('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT')
      .messages({
        'any.only': 'La acción debe ser CREATE, UPDATE, DELETE, LOGIN o LOGOUT'
      }),
    
    table_name: Joi.string()
      .min(1)
      .max(50)
      .messages({
        'string.min': 'El nombre de tabla no puede estar vacío',
        'string.max': 'El nombre de tabla no puede exceder 50 caracteres'
      }),
    
    user_id: Joi.number()
      .integer()
      .min(1)
      .messages({
        'number.base': 'El ID de usuario debe ser un número',
        'number.integer': 'El ID de usuario debe ser un entero',
        'number.min': 'El ID de usuario debe ser al menos 1'
      }),
    
    date_from: Joi.date()
      .iso()
      .messages({
        'date.base': 'La fecha desde debe ser una fecha válida',
        'date.format': 'La fecha desde debe estar en formato ISO'
      }),
    
    date_to: Joi.date()
      .iso()
      .min(Joi.ref('date_from'))
      .messages({
        'date.base': 'La fecha hasta debe ser una fecha válida',
        'date.format': 'La fecha hasta debe estar en formato ISO',
        'date.min': 'La fecha hasta debe ser posterior a la fecha desde'
      })
  });

  return schema.validate(data, { abortEarly: false });
};