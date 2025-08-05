import Joi from 'joi';

/**
 * Validador para crear recompensa
 */
export function validateReward(data) {
  const schema = Joi.object({
    name: Joi.string()
      .min(3)
      .max(100)
      .required()
      .messages({
        'string.min': 'El nombre debe tener al menos 3 caracteres',
        'string.max': 'El nombre no puede exceder 100 caracteres',
        'any.required': 'El nombre es requerido'
      }),
    description: Joi.string()
      .min(10)
      .max(500)
      .required()
      .messages({
        'string.min': 'La descripción debe tener al menos 10 caracteres',
        'string.max': 'La descripción no puede exceder 500 caracteres',
        'any.required': 'La descripción es requerida'
      }),
    points: Joi.number()
      .integer()
      .min(1)
      .max(10000)
      .required()
      .messages({
        'number.base': 'Los puntos deben ser un número',
        'number.integer': 'Los puntos deben ser un número entero',
        'number.min': 'Los puntos deben ser mayor a 0',
        'number.max': 'Los puntos no pueden exceder 10,000',
        'any.required': 'Los puntos son requeridos'
      }),
    stock: Joi.number()
      .integer()
      .min(0)
      .allow(null)
      .messages({
        'number.base': 'El stock debe ser un número',
        'number.integer': 'El stock debe ser un número entero',
        'number.min': 'El stock no puede ser negativo'
      }),
    category: Joi.string()
      .valid('material', 'experience', 'privilege', 'digital', 'food', 'other')
      .default('other')
      .messages({
        'any.only': 'La categoría debe ser: material, experience, privilege, digital, food u other'
      }),
    image_url: Joi.string()
      .uri()
      .allow(null, '')
      .messages({
        'string.uri': 'La URL de la imagen debe ser válida'
      }),
    active: Joi.boolean()
      .default(true)
      .messages({
        'boolean.base': 'El estado activo debe ser verdadero o falso'
      })
  });
  
  return schema.validate(data);
}

/**
 * Validador para actualizar recompensa
 */
export function validateRewardUpdate(data) {
  const schema = Joi.object({
    name: Joi.string()
      .min(3)
      .max(100)
      .messages({
        'string.min': 'El nombre debe tener al menos 3 caracteres',
        'string.max': 'El nombre no puede exceder 100 caracteres'
      }),
    description: Joi.string()
      .min(10)
      .max(500)
      .messages({
        'string.min': 'La descripción debe tener al menos 10 caracteres',
        'string.max': 'La descripción no puede exceder 500 caracteres'
      }),
    points: Joi.number()
      .integer()
      .min(1)
      .max(10000)
      .messages({
        'number.base': 'Los puntos deben ser un número',
        'number.integer': 'Los puntos deben ser un número entero',
        'number.min': 'Los puntos deben ser mayor a 0',
        'number.max': 'Los puntos no pueden exceder 10,000'
      }),
    stock: Joi.number()
      .integer()
      .min(0)
      .allow(null)
      .messages({
        'number.base': 'El stock debe ser un número',
        'number.integer': 'El stock debe ser un número entero',
        'number.min': 'El stock no puede ser negativo'
      }),
    category: Joi.string()
      .valid('material', 'experience', 'privilege', 'digital', 'food', 'other')
      .messages({
        'any.only': 'La categoría debe ser: material, experience, privilege, digital, food u other'
      }),
    image_url: Joi.string()
      .uri()
      .allow(null, '')
      .messages({
        'string.uri': 'La URL de la imagen debe ser válida'
      }),
    active: Joi.boolean()
      .messages({
        'boolean.base': 'El estado activo debe ser verdadero o falso'
      })
  }).min(1).messages({
    'object.min': 'Debe proporcionar al menos un campo para actualizar'
  });
  
  return schema.validate(data);
}

/**
 * Validador para canje de recompensa
 */
export function validateRewardClaim(data) {
  const schema = Joi.object({
    quantity: Joi.number()
      .integer()
      .min(1)
      .max(10)
      .default(1)
      .messages({
        'number.base': 'La cantidad debe ser un número',
        'number.integer': 'La cantidad debe ser un número entero',
        'number.min': 'La cantidad debe ser mayor a 0',
        'number.max': 'La cantidad no puede exceder 10'
      })
  });
  
  return schema.validate(data);
}

/**
 * Validador para filtros de recompensas
 */
export function validateRewardFilters(data) {
  const schema = Joi.object({
    page: Joi.number()
      .integer()
      .min(1)
      .default(1)
      .messages({
        'number.base': 'La página debe ser un número',
        'number.integer': 'La página debe ser un número entero',
        'number.min': 'La página debe ser mayor a 0'
      }),
    limit: Joi.number()
      .integer()
      .min(1)
      .max(100)
      .default(10)
      .messages({
        'number.base': 'El límite debe ser un número',
        'number.integer': 'El límite debe ser un número entero',
        'number.min': 'El límite debe ser mayor a 0',
        'number.max': 'El límite no puede exceder 100'
      }),
    active: Joi.string()
      .valid('true', 'false')
      .messages({
        'any.only': 'El estado activo debe ser "true" o "false"'
      }),
    category: Joi.string()
      .valid('material', 'experience', 'privilege', 'digital', 'food', 'other')
      .messages({
        'any.only': 'La categoría debe ser: material, experience, privilege, digital, food u other'
      }),
    min_points: Joi.number()
      .integer()
      .min(0)
      .messages({
        'number.base': 'Los puntos mínimos deben ser un número',
        'number.integer': 'Los puntos mínimos deben ser un número entero',
        'number.min': 'Los puntos mínimos no pueden ser negativos'
      }),
    max_points: Joi.number()
      .integer()
      .min(Joi.ref('min_points'))
      .messages({
        'number.base': 'Los puntos máximos deben ser un número',
        'number.integer': 'Los puntos máximos deben ser un número entero',
        'number.min': 'Los puntos máximos deben ser mayores o iguales a los puntos mínimos'
      })
  });
  
  return schema.validate(data);
}

/**
 * Validador para filtros de redenciones
 */
export function validateRedemptionFilters(data) {
  const schema = Joi.object({
    page: Joi.number()
      .integer()
      .min(1)
      .default(1)
      .messages({
        'number.base': 'La página debe ser un número',
        'number.integer': 'La página debe ser un número entero',
        'number.min': 'La página debe ser mayor a 0'
      }),
    limit: Joi.number()
      .integer()
      .min(1)
      .max(100)
      .default(10)
      .messages({
        'number.base': 'El límite debe ser un número',
        'number.integer': 'El límite debe ser un número entero',
        'number.min': 'El límite debe ser mayor a 0',
        'number.max': 'El límite no puede exceder 100'
      }),
    status: Joi.string()
      .valid('pending', 'approved', 'rejected', 'delivered')
      .messages({
        'any.only': 'El estado debe ser: pending, approved, rejected o delivered'
      }),
    student_id: Joi.number()
      .integer()
      .positive()
      .messages({
        'number.base': 'El ID del estudiante debe ser un número',
        'number.integer': 'El ID del estudiante debe ser un número entero',
        'number.positive': 'El ID del estudiante debe ser positivo'
      })
  });
  
  return schema.validate(data);
}

/**
 * Validador para actualización de estado de redención
 */
export function validateRedemptionStatusUpdate(data) {
  const schema = Joi.object({
    status: Joi.string()
      .valid('pending', 'approved', 'rejected', 'delivered')
      .required()
      .messages({
        'any.only': 'El estado debe ser: pending, approved, rejected o delivered',
        'any.required': 'El estado es requerido'
      })
  });
  
  return schema.validate(data);
}