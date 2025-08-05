import Joi from 'joi';

/**
 * Validador para actualización de perfil de estudiante
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
      })
  }).min(1).messages({
    'object.min': 'Debe proporcionar al menos un campo para actualizar'
  });

  return schema.validate(data, { abortEarly: false });
};

/**
 * Validador para cambio de contraseña
 */
export const validatePasswordChange = (data) => {
  const schema = Joi.object({
    currentPassword: Joi.string()
      .required()
      .messages({
        'string.empty': 'La contraseña actual es requerida',
        'any.required': 'La contraseña actual es requerida'
      }),
    
    newPassword: Joi.string()
      .min(6)
      .max(128)
      .required()
      .messages({
        'string.min': 'La nueva contraseña debe tener al menos 6 caracteres',
        'string.max': 'La nueva contraseña no puede exceder 128 caracteres',
        'string.empty': 'La nueva contraseña es requerida',
        'any.required': 'La nueva contraseña es requerida'
      }),
    
    confirmPassword: Joi.string()
      .valid(Joi.ref('newPassword'))
      .required()
      .messages({
        'any.only': 'La confirmación de contraseña debe coincidir con la nueva contraseña',
        'any.required': 'La confirmación de contraseña es requerida'
      })
  });

  return schema.validate(data, { abortEarly: false });
};

/**
 * Validador para configuración de estudiante
 */
export const validateStudentConfig = (data) => {
  const schema = Joi.object({
    notifications: Joi.object({
      email: Joi.boolean().default(true),
      push: Joi.boolean().default(true),
      reports: Joi.boolean().default(true),
      rewards: Joi.boolean().default(true),
      achievements: Joi.boolean().default(true),
      activities: Joi.boolean().default(true),
      reminders: Joi.boolean().default(true)
    }).default({}),
    
    privacy: Joi.object({
      show_profile: Joi.boolean().default(true),
      show_achievements: Joi.boolean().default(true),
      show_points: Joi.boolean().default(true),
      allow_messages: Joi.boolean().default(true),
      show_activity: Joi.boolean().default(true)
    }).default({}),
    
    preferences: Joi.object({
      theme: Joi.string().valid('light', 'dark', 'auto').default('light'),
      language: Joi.string().valid('es', 'en').default('es'),
      timezone: Joi.string().default('America/Mexico_City'),
      dashboard_layout: Joi.string().valid('grid', 'list').default('grid'),
      items_per_page: Joi.number().integer().min(5).max(50).default(10),
      auto_save: Joi.boolean().default(true),
      sound_effects: Joi.boolean().default(true),
      animations: Joi.boolean().default(true)
    }).default({})
  });

  return schema.validate(data, { abortEarly: false });
};

/**
 * Validador para filtros de actividades
 */
export const validateActivityFilters = (data) => {
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
      .max(50)
      .default(10)
      .messages({
        'number.base': 'El límite debe ser un número',
        'number.integer': 'El límite debe ser un entero',
        'number.min': 'El límite debe ser al menos 1',
        'number.max': 'El límite no puede exceder 50'
      }),
    
    status: Joi.string()
      .valid('active', 'completed', 'cancelled')
      .messages({
        'any.only': 'El estado debe ser active, completed o cancelled'
      }),
    
    type: Joi.string()
      .valid('academic', 'social', 'sports', 'arts', 'community', 'other')
      .messages({
        'any.only': 'El tipo debe ser academic, social, sports, arts, community u other'
      }),
    
    completed: Joi.boolean()
      .messages({
        'boolean.base': 'Completado debe ser verdadero o falso'
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

/**
 * Validador para filtros de logros
 */
export const validateAchievementFilters = (data) => {
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
      .max(50)
      .default(10)
      .messages({
        'number.base': 'El límite debe ser un número',
        'number.integer': 'El límite debe ser un entero',
        'number.min': 'El límite debe ser al menos 1',
        'number.max': 'El límite no puede exceder 50'
      }),
    
    category: Joi.string()
      .valid('academic', 'social', 'participation', 'leadership', 'creativity', 'other')
      .messages({
        'any.only': 'La categoría debe ser academic, social, participation, leadership, creativity u other'
      }),
    
    earned: Joi.boolean()
      .messages({
        'boolean.base': 'Obtenido debe ser verdadero o falso'
      }),
    
    sort_by: Joi.string()
      .valid('name', 'points_reward', 'earned_at', 'difficulty')
      .default('earned_at')
      .messages({
        'any.only': 'El ordenamiento debe ser por name, points_reward, earned_at o difficulty'
      }),
    
    sort_order: Joi.string()
      .valid('asc', 'desc')
      .default('desc')
      .messages({
        'any.only': 'El orden debe ser asc o desc'
      })
  });

  return schema.validate(data, { abortEarly: false });
};

/**
 * Validador para registro de estudiante
 */
export const validateStudentRegistration = (data) => {
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
    
    confirmPassword: Joi.string()
      .valid(Joi.ref('password'))
      .required()
      .messages({
        'any.only': 'La confirmación de contraseña debe coincidir con la contraseña',
        'any.required': 'La confirmación de contraseña es requerida'
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
    
    teacher_code: Joi.string()
      .alphanum()
      .min(6)
      .max(20)
      .allow(null, '')
      .messages({
        'string.alphanum': 'El código del profesor debe contener solo letras y números',
        'string.min': 'El código del profesor debe tener al menos 6 caracteres',
        'string.max': 'El código del profesor no puede exceder 20 caracteres'
      }),
    
    avatar_url: Joi.string()
      .uri()
      .allow(null, '')
      .messages({
        'string.uri': 'La URL del avatar debe ser válida'
      })
  });

  return schema.validate(data, { abortEarly: false });
};

/**
 * Validador para filtros de reportes del estudiante
 */
export const validateStudentReportFilters = (data) => {
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
      .max(50)
      .default(10)
      .messages({
        'number.base': 'El límite debe ser un número',
        'number.integer': 'El límite debe ser un entero',
        'number.min': 'El límite debe ser al menos 1',
        'number.max': 'El límite no puede exceder 50'
      }),
    
    type: Joi.string()
      .valid('behavioral', 'academic', 'social', 'emotional', 'other')
      .messages({
        'any.only': 'El tipo debe ser behavioral, academic, social, emotional u other'
      }),
    
    status: Joi.string()
      .valid('pending', 'in_progress', 'resolved', 'closed')
      .messages({
        'any.only': 'El estado debe ser pending, in_progress, resolved o closed'
      }),
    
    severity: Joi.string()
      .valid('low', 'medium', 'high', 'critical')
      .messages({
        'any.only': 'La severidad debe ser low, medium, high o critical'
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