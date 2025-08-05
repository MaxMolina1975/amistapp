import Joi from 'joi';

/**
 * Validador para creación de actividades
 */
export const validateActivityCreate = (data) => {
  const schema = Joi.object({
    title: Joi.string()
      .min(3)
      .max(200)
      .trim()
      .required()
      .messages({
        'string.min': 'El título debe tener al menos 3 caracteres',
        'string.max': 'El título no puede exceder 200 caracteres',
        'string.empty': 'El título es requerido',
        'any.required': 'El título es requerido'
      }),
    
    description: Joi.string()
      .max(2000)
      .trim()
      .allow(null, '')
      .messages({
        'string.max': 'La descripción no puede exceder 2000 caracteres'
      }),
    
    type: Joi.string()
      .valid('academic', 'social', 'sports', 'arts', 'community', 'other')
      .required()
      .messages({
        'any.only': 'El tipo debe ser academic, social, sports, arts, community u other',
        'any.required': 'El tipo de actividad es requerido'
      }),
    
    start_date: Joi.date()
      .iso()
      .min('now')
      .required()
      .messages({
        'date.base': 'La fecha de inicio debe ser una fecha válida',
        'date.format': 'La fecha de inicio debe estar en formato ISO',
        'date.min': 'La fecha de inicio debe ser futura',
        'any.required': 'La fecha de inicio es requerida'
      }),
    
    end_date: Joi.date()
      .iso()
      .min(Joi.ref('start_date'))
      .required()
      .messages({
        'date.base': 'La fecha de fin debe ser una fecha válida',
        'date.format': 'La fecha de fin debe estar en formato ISO',
        'date.min': 'La fecha de fin debe ser posterior a la fecha de inicio',
        'any.required': 'La fecha de fin es requerida'
      }),
    
    max_participants: Joi.number()
      .integer()
      .min(1)
      .max(1000)
      .allow(null)
      .messages({
        'number.base': 'El máximo de participantes debe ser un número',
        'number.integer': 'El máximo de participantes debe ser un entero',
        'number.min': 'El máximo de participantes debe ser al menos 1',
        'number.max': 'El máximo de participantes no puede exceder 1000'
      }),
    
    points_reward: Joi.number()
      .integer()
      .min(0)
      .max(10000)
      .default(0)
      .messages({
        'number.base': 'Los puntos de recompensa deben ser un número',
        'number.integer': 'Los puntos de recompensa deben ser un entero',
        'number.min': 'Los puntos de recompensa no pueden ser negativos',
        'number.max': 'Los puntos de recompensa no pueden exceder 10000'
      }),
    
    requirements: Joi.array()
      .items(Joi.string().trim().max(500))
      .max(20)
      .allow(null)
      .messages({
        'array.max': 'No puede haber más de 20 requisitos',
        'string.max': 'Cada requisito no puede exceder 500 caracteres'
      }),
    
    location: Joi.string()
      .max(500)
      .trim()
      .allow(null, '')
      .messages({
        'string.max': 'La ubicación no puede exceder 500 caracteres'
      }),
    
    materials: Joi.array()
      .items(Joi.string().trim().max(200))
      .max(50)
      .allow(null)
      .messages({
        'array.max': 'No puede haber más de 50 materiales',
        'string.max': 'Cada material no puede exceder 200 caracteres'
      }),
    
    teacher_id: Joi.number()
      .integer()
      .positive()
      .messages({
        'number.base': 'El ID del profesor debe ser un número',
        'number.integer': 'El ID del profesor debe ser un entero',
        'number.positive': 'El ID del profesor debe ser positivo'
      }),
    
    metadata: Joi.object()
      .allow(null)
      .messages({
        'object.base': 'Los metadatos deben ser un objeto válido'
      })
  });

  return schema.validate(data, { abortEarly: false });
};

/**
 * Validador para actualización de actividades
 */
export const validateActivityUpdate = (data) => {
  const schema = Joi.object({
    title: Joi.string()
      .min(3)
      .max(200)
      .trim()
      .messages({
        'string.min': 'El título debe tener al menos 3 caracteres',
        'string.max': 'El título no puede exceder 200 caracteres'
      }),
    
    description: Joi.string()
      .max(2000)
      .trim()
      .allow(null, '')
      .messages({
        'string.max': 'La descripción no puede exceder 2000 caracteres'
      }),
    
    type: Joi.string()
      .valid('academic', 'social', 'sports', 'arts', 'community', 'other')
      .messages({
        'any.only': 'El tipo debe ser academic, social, sports, arts, community u other'
      }),
    
    start_date: Joi.date()
      .iso()
      .messages({
        'date.base': 'La fecha de inicio debe ser una fecha válida',
        'date.format': 'La fecha de inicio debe estar en formato ISO'
      }),
    
    end_date: Joi.date()
      .iso()
      .min(Joi.ref('start_date'))
      .messages({
        'date.base': 'La fecha de fin debe ser una fecha válida',
        'date.format': 'La fecha de fin debe estar en formato ISO',
        'date.min': 'La fecha de fin debe ser posterior a la fecha de inicio'
      }),
    
    max_participants: Joi.number()
      .integer()
      .min(1)
      .max(1000)
      .allow(null)
      .messages({
        'number.base': 'El máximo de participantes debe ser un número',
        'number.integer': 'El máximo de participantes debe ser un entero',
        'number.min': 'El máximo de participantes debe ser al menos 1',
        'number.max': 'El máximo de participantes no puede exceder 1000'
      }),
    
    points_reward: Joi.number()
      .integer()
      .min(0)
      .max(10000)
      .messages({
        'number.base': 'Los puntos de recompensa deben ser un número',
        'number.integer': 'Los puntos de recompensa deben ser un entero',
        'number.min': 'Los puntos de recompensa no pueden ser negativos',
        'number.max': 'Los puntos de recompensa no pueden exceder 10000'
      }),
    
    requirements: Joi.array()
      .items(Joi.string().trim().max(500))
      .max(20)
      .allow(null)
      .messages({
        'array.max': 'No puede haber más de 20 requisitos',
        'string.max': 'Cada requisito no puede exceder 500 caracteres'
      }),
    
    location: Joi.string()
      .max(500)
      .trim()
      .allow(null, '')
      .messages({
        'string.max': 'La ubicación no puede exceder 500 caracteres'
      }),
    
    materials: Joi.array()
      .items(Joi.string().trim().max(200))
      .max(50)
      .allow(null)
      .messages({
        'array.max': 'No puede haber más de 50 materiales',
        'string.max': 'Cada material no puede exceder 200 caracteres'
      }),
    
    status: Joi.string()
      .valid('active', 'completed', 'cancelled')
      .messages({
        'any.only': 'El estado debe ser active, completed o cancelled'
      }),
    
    metadata: Joi.object()
      .allow(null)
      .messages({
        'object.base': 'Los metadatos deben ser un objeto válido'
      })
  }).min(1).messages({
    'object.min': 'Debe proporcionar al menos un campo para actualizar'
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
      .max(100)
      .default(10)
      .messages({
        'number.base': 'El límite debe ser un número',
        'number.integer': 'El límite debe ser un entero',
        'number.min': 'El límite debe ser al menos 1',
        'number.max': 'El límite no puede exceder 100'
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
    
    teacher_id: Joi.number()
      .integer()
      .positive()
      .messages({
        'number.base': 'El ID del profesor debe ser un número',
        'number.integer': 'El ID del profesor debe ser un entero',
        'number.positive': 'El ID del profesor debe ser positivo'
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
      .valid('title', 'start_date', 'end_date', 'points_reward', 'participants', 'created_at')
      .default('created_at')
      .messages({
        'any.only': 'El ordenamiento debe ser por title, start_date, end_date, points_reward, participants o created_at'
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
 * Validador para participación en actividades
 */
export const validateActivityParticipation = (data) => {
  const schema = Joi.object({
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
 * Validador para completar participación
 */
export const validateActivityCompletion = (data) => {
  const schema = Joi.object({
    notes: Joi.string()
      .max(1000)
      .trim()
      .allow(null, '')
      .messages({
        'string.max': 'Las notas no pueden exceder 1000 caracteres'
      }),
    
    points_awarded: Joi.number()
      .integer()
      .min(0)
      .max(10000)
      .messages({
        'number.base': 'Los puntos otorgados deben ser un número',
        'number.integer': 'Los puntos otorgados deben ser un entero',
        'number.min': 'Los puntos otorgados no pueden ser negativos',
        'number.max': 'Los puntos otorgados no pueden exceder 10000'
      })
  });

  return schema.validate(data, { abortEarly: false });
};

/**
 * Validador para búsqueda de actividades
 */
export const validateActivitySearch = (data) => {
  const schema = Joi.object({
    q: Joi.string()
      .min(1)
      .max(100)
      .trim()
      .messages({
        'string.min': 'El término de búsqueda debe tener al menos 1 caracter',
        'string.max': 'El término de búsqueda no puede exceder 100 caracteres'
      }),
    
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
      .valid('academic', 'social', 'sports', 'arts', 'community', 'other')
      .messages({
        'any.only': 'El tipo debe ser academic, social, sports, arts, community u other'
      }),
    
    available_only: Joi.boolean()
      .default(false)
      .messages({
        'boolean.base': 'Disponible solo debe ser verdadero o falso'
      })
  });

  return schema.validate(data, { abortEarly: false });
};