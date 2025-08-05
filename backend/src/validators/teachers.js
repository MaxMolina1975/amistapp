import Joi from 'joi';

/**
 * Validador para actualización de perfil de profesor
 */
export const validateTeacherUpdate = (data) => {
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
    
    phone: Joi.string()
      .pattern(/^[\+]?[0-9\s\-\(\)]+$/)
      .min(10)
      .max(20)
      .allow(null, '')
      .messages({
        'string.pattern.base': 'El teléfono debe contener solo números, espacios, guiones y paréntesis',
        'string.min': 'El teléfono debe tener al menos 10 caracteres',
        'string.max': 'El teléfono no puede exceder 20 caracteres'
      }),
    
    subject: Joi.string()
      .min(2)
      .max(100)
      .trim()
      .allow(null, '')
      .messages({
        'string.min': 'La materia debe tener al menos 2 caracteres',
        'string.max': 'La materia no puede exceder 100 caracteres'
      }),
    
    grade: Joi.string()
      .min(1)
      .max(50)
      .trim()
      .allow(null, '')
      .messages({
        'string.min': 'El grado debe tener al menos 1 caracter',
        'string.max': 'El grado no puede exceder 50 caracteres'
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
 * Validador para creación de estudiante
 */
export const validateStudentCreate = (data) => {
  const schema = Joi.object({
    name: Joi.string()
      .min(2)
      .max(100)
      .trim()
      .required()
      .messages({
        'string.min': 'El nombre debe tener al menos 2 caracteres',
        'string.max': 'El nombre no puede exceder 100 caracteres',
        'string.empty': 'El nombre es requerido',
        'any.required': 'El nombre es requerido'
      }),
    
    email: Joi.string()
      .email()
      .max(255)
      .lowercase()
      .trim()
      .required()
      .messages({
        'string.email': 'Debe ser un email válido',
        'string.max': 'El email no puede exceder 255 caracteres',
        'string.empty': 'El email es requerido',
        'any.required': 'El email es requerido'
      }),
    
    password: Joi.string()
      .min(6)
      .max(128)
      .required()
      .messages({
        'string.min': 'La contraseña debe tener al menos 6 caracteres',
        'string.max': 'La contraseña no puede exceder 128 caracteres',
        'string.empty': 'La contraseña es requerida',
        'any.required': 'La contraseña es requerida'
      }),
    
    avatar_url: Joi.string()
      .uri()
      .allow(null, '')
      .messages({
        'string.uri': 'La URL del avatar debe ser válida'
      }),
    
    grade: Joi.string()
      .min(1)
      .max(50)
      .trim()
      .allow(null, '')
      .messages({
        'string.min': 'El grado debe tener al menos 1 caracter',
        'string.max': 'El grado no puede exceder 50 caracteres'
      }),
    
    points: Joi.number()
      .integer()
      .min(0)
      .default(0)
      .messages({
        'number.base': 'Los puntos deben ser un número',
        'number.integer': 'Los puntos deben ser un entero',
        'number.min': 'Los puntos no pueden ser negativos'
      })
  });

  return schema.validate(data, { abortEarly: false });
};

/**
 * Validador para actualización de estudiante
 */
export const validateStudentUpdate = (data) => {
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
    
    avatar_url: Joi.string()
      .uri()
      .allow(null, '')
      .messages({
        'string.uri': 'La URL del avatar debe ser válida'
      }),
    
    grade: Joi.string()
      .min(1)
      .max(50)
      .trim()
      .allow(null, '')
      .messages({
        'string.min': 'El grado debe tener al menos 1 caracter',
        'string.max': 'El grado no puede exceder 50 caracteres'
      }),
    
    status: Joi.string()
      .valid('active', 'inactive', 'suspended')
      .messages({
        'any.only': 'El estado debe ser active, inactive o suspended'
      })
  }).min(1).messages({
    'object.min': 'Debe proporcionar al menos un campo para actualizar'
  });

  return schema.validate(data, { abortEarly: false });
};

/**
 * Validador para actualización de puntos de estudiante
 */
export const validatePointsUpdate = (data) => {
  const schema = Joi.object({
    points: Joi.number()
      .integer()
      .not(0)
      .min(-1000)
      .max(1000)
      .required()
      .messages({
        'number.base': 'Los puntos deben ser un número',
        'number.integer': 'Los puntos deben ser un entero',
        'any.invalid': 'Los puntos no pueden ser cero',
        'number.min': 'No se pueden quitar más de 1000 puntos a la vez',
        'number.max': 'No se pueden agregar más de 1000 puntos a la vez',
        'any.required': 'Los puntos son requeridos'
      }),
    
    reason: Joi.string()
      .min(3)
      .max(255)
      .trim()
      .required()
      .messages({
        'string.min': 'La razón debe tener al menos 3 caracteres',
        'string.max': 'La razón no puede exceder 255 caracteres',
        'string.empty': 'La razón es requerida',
        'any.required': 'La razón es requerida'
      })
  });

  return schema.validate(data, { abortEarly: false });
};

/**
 * Validador para filtros de estudiantes
 */
export const validateStudentFilters = (data) => {
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
    
    search: Joi.string()
      .min(1)
      .max(100)
      .trim()
      .allow('')
      .messages({
        'string.min': 'La búsqueda debe tener al menos 1 caracter',
        'string.max': 'La búsqueda no puede exceder 100 caracteres'
      }),
    
    status: Joi.string()
      .valid('active', 'inactive', 'suspended')
      .messages({
        'any.only': 'El estado debe ser active, inactive o suspended'
      }),
    
    grade: Joi.string()
      .min(1)
      .max(50)
      .trim()
      .messages({
        'string.min': 'El grado debe tener al menos 1 caracter',
        'string.max': 'El grado no puede exceder 50 caracteres'
      }),
    
    min_points: Joi.number()
      .integer()
      .min(0)
      .messages({
        'number.base': 'Los puntos mínimos deben ser un número',
        'number.integer': 'Los puntos mínimos deben ser un entero',
        'number.min': 'Los puntos mínimos no pueden ser negativos'
      }),
    
    max_points: Joi.number()
      .integer()
      .min(0)
      .when('min_points', {
        is: Joi.exist(),
        then: Joi.number().min(Joi.ref('min_points')),
        otherwise: Joi.number()
      })
      .messages({
        'number.base': 'Los puntos máximos deben ser un número',
        'number.integer': 'Los puntos máximos deben ser un entero',
        'number.min': 'Los puntos máximos deben ser mayor o igual a los puntos mínimos'
      }),
    
    sort_by: Joi.string()
      .valid('name', 'points', 'created_at', 'last_login')
      .default('name')
      .messages({
        'any.only': 'El ordenamiento debe ser por name, points, created_at o last_login'
      }),
    
    sort_order: Joi.string()
      .valid('asc', 'desc')
      .default('asc')
      .messages({
        'any.only': 'El orden debe ser asc o desc'
      })
  });

  return schema.validate(data, { abortEarly: false });
};

/**
 * Validador para configuración de profesor
 */
export const validateTeacherConfig = (data) => {
  const schema = Joi.object({
    notifications: Joi.object({
      email: Joi.boolean().default(true),
      push: Joi.boolean().default(true),
      reports: Joi.boolean().default(true),
      rewards: Joi.boolean().default(true),
      achievements: Joi.boolean().default(true)
    }).default({}),
    
    privacy: Joi.object({
      show_email: Joi.boolean().default(false),
      show_phone: Joi.boolean().default(false),
      allow_messages: Joi.boolean().default(true)
    }).default({}),
    
    preferences: Joi.object({
      theme: Joi.string().valid('light', 'dark', 'auto').default('light'),
      language: Joi.string().valid('es', 'en').default('es'),
      timezone: Joi.string().default('America/Mexico_City'),
      items_per_page: Joi.number().integer().min(5).max(100).default(10)
    }).default({})
  });

  return schema.validate(data, { abortEarly: false });
};