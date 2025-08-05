import Joi from 'joi';

/**
 * Validador para actualización de perfil de tutor
 */
export const validateTutorUpdate = (data) => {
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
      .pattern(/^[\+]?[1-9][\d]{0,15}$/)
      .allow(null, '')
      .messages({
        'string.pattern.base': 'El teléfono debe tener un formato válido'
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
 * Validador para configuración de tutor
 */
export const validateTutorConfig = (data) => {
  const schema = Joi.object({
    notifications: Joi.object({
      email: Joi.boolean().default(true),
      push: Joi.boolean().default(true),
      reports: Joi.boolean().default(true),
      activities: Joi.boolean().default(true),
      student_updates: Joi.boolean().default(true),
      reminders: Joi.boolean().default(true),
      weekly_summary: Joi.boolean().default(true),
      urgent_alerts: Joi.boolean().default(true)
    }).default({}),
    
    privacy: Joi.object({
      show_profile: Joi.boolean().default(true),
      allow_messages: Joi.boolean().default(true),
      show_students: Joi.boolean().default(false),
      show_contact_info: Joi.boolean().default(false),
      allow_student_contact: Joi.boolean().default(true)
    }).default({}),
    
    preferences: Joi.object({
      theme: Joi.string().valid('light', 'dark', 'auto').default('light'),
      language: Joi.string().valid('es', 'en').default('es'),
      timezone: Joi.string().default('America/Mexico_City'),
      dashboard_layout: Joi.string().valid('grid', 'list', 'cards').default('grid'),
      items_per_page: Joi.number().integer().min(5).max(50).default(10),
      auto_refresh: Joi.boolean().default(true),
      sound_notifications: Joi.boolean().default(true),
      email_frequency: Joi.string().valid('immediate', 'daily', 'weekly', 'never').default('daily'),
      report_view: Joi.string().valid('summary', 'detailed').default('summary')
    }).default({})
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
      .max(50)
      .default(10)
      .messages({
        'number.base': 'El límite debe ser un número',
        'number.integer': 'El límite debe ser un entero',
        'number.min': 'El límite debe ser al menos 1',
        'number.max': 'El límite no puede exceder 50'
      }),
    
    search: Joi.string()
      .max(100)
      .trim()
      .allow('')
      .messages({
        'string.max': 'La búsqueda no puede exceder 100 caracteres'
      }),
    
    status: Joi.string()
      .valid('active', 'inactive', 'suspended')
      .messages({
        'any.only': 'El estado debe ser active, inactive o suspended'
      }),
    
    sort_by: Joi.string()
      .valid('name', 'email', 'points', 'report_count', 'assigned_at', 'created_at')
      .default('name')
      .messages({
        'any.only': 'El ordenamiento debe ser por name, email, points, report_count, assigned_at o created_at'
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
 * Validador para registro de tutor
 */
export const validateTutorRegistration = (data) => {
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
    
    phone: Joi.string()
      .pattern(/^[\+]?[1-9][\d]{0,15}$/)
      .allow(null, '')
      .messages({
        'string.pattern.base': 'El teléfono debe tener un formato válido'
      }),
    
    avatar_url: Joi.string()
      .uri()
      .allow(null, '')
      .messages({
        'string.uri': 'La URL del avatar debe ser válida'
      }),
    
    specialization: Joi.string()
      .max(200)
      .trim()
      .allow(null, '')
      .messages({
        'string.max': 'La especialización no puede exceder 200 caracteres'
      }),
    
    experience_years: Joi.number()
      .integer()
      .min(0)
      .max(50)
      .allow(null)
      .messages({
        'number.base': 'Los años de experiencia deben ser un número',
        'number.integer': 'Los años de experiencia deben ser un entero',
        'number.min': 'Los años de experiencia no pueden ser negativos',
        'number.max': 'Los años de experiencia no pueden exceder 50'
      }),
    
    certifications: Joi.array()
      .items(Joi.string().trim().max(200))
      .max(10)
      .allow(null)
      .messages({
        'array.max': 'No puede haber más de 10 certificaciones',
        'string.max': 'Cada certificación no puede exceder 200 caracteres'
      })
  });

  return schema.validate(data, { abortEarly: false });
};

/**
 * Validador para asignación de estudiantes a tutor
 */
export const validateStudentAssignment = (data) => {
  const schema = Joi.object({
    student_ids: Joi.array()
      .items(Joi.number().integer().positive())
      .min(1)
      .max(50)
      .required()
      .messages({
        'array.min': 'Debe seleccionar al menos un estudiante',
        'array.max': 'No puede asignar más de 50 estudiantes a la vez',
        'number.base': 'Los IDs de estudiantes deben ser números',
        'number.integer': 'Los IDs de estudiantes deben ser enteros',
        'number.positive': 'Los IDs de estudiantes deben ser positivos',
        'any.required': 'Los IDs de estudiantes son requeridos'
      }),
    
    notes: Joi.string()
      .max(1000)
      .trim()
      .allow(null, '')
      .messages({
        'string.max': 'Las notas no pueden exceder 1000 caracteres'
      })
  });

  return schema.validate(data, { abortEarly: false });
};

/**
 * Validador para filtros de reportes de tutor
 */
export const validateTutorReportFilters = (data) => {
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
    
    student_id: Joi.number()
      .integer()
      .positive()
      .messages({
        'number.base': 'El ID del estudiante debe ser un número',
        'number.integer': 'El ID del estudiante debe ser un entero',
        'number.positive': 'El ID del estudiante debe ser positivo'
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
      }),
    
    sort_by: Joi.string()
      .valid('created_at', 'updated_at', 'severity', 'status', 'student_name')
      .default('created_at')
      .messages({
        'any.only': 'El ordenamiento debe ser por created_at, updated_at, severity, status o student_name'
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