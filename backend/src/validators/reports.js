import Joi from 'joi';

/**
 * Validador para crear reporte
 */
export function validateReport(data) {
  const schema = Joi.object({
    student_id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'El ID del estudiante debe ser un número',
        'number.integer': 'El ID del estudiante debe ser un número entero',
        'number.positive': 'El ID del estudiante debe ser positivo',
        'any.required': 'El ID del estudiante es requerido'
      }),
    type: Joi.string()
      .valid('behavioral', 'academic', 'emotional', 'social', 'disciplinary', 'achievement')
      .required()
      .messages({
        'any.only': 'El tipo debe ser: behavioral, academic, emotional, social, disciplinary o achievement',
        'any.required': 'El tipo de reporte es requerido'
      }),
    title: Joi.string()
      .min(5)
      .max(200)
      .required()
      .messages({
        'string.min': 'El título debe tener al menos 5 caracteres',
        'string.max': 'El título no puede exceder 200 caracteres',
        'any.required': 'El título es requerido'
      }),
    description: Joi.string()
      .min(10)
      .max(2000)
      .required()
      .messages({
        'string.min': 'La descripción debe tener al menos 10 caracteres',
        'string.max': 'La descripción no puede exceder 2000 caracteres',
        'any.required': 'La descripción es requerida'
      }),
    severity: Joi.string()
      .valid('low', 'medium', 'high', 'critical')
      .default('medium')
      .messages({
        'any.only': 'La severidad debe ser: low, medium, high o critical'
      }),
    status: Joi.string()
      .valid('pending', 'in_progress', 'resolved', 'dismissed')
      .default('pending')
      .messages({
        'any.only': 'El estado debe ser: pending, in_progress, resolved o dismissed'
      }),
    metadata: Joi.object()
      .allow(null)
      .messages({
        'object.base': 'Los metadatos deben ser un objeto válido'
      })
  });
  
  return schema.validate(data);
}

/**
 * Validador para actualizar reporte
 */
export function validateReportUpdate(data) {
  const schema = Joi.object({
    title: Joi.string()
      .min(5)
      .max(200)
      .messages({
        'string.min': 'El título debe tener al menos 5 caracteres',
        'string.max': 'El título no puede exceder 200 caracteres'
      }),
    description: Joi.string()
      .min(10)
      .max(2000)
      .messages({
        'string.min': 'La descripción debe tener al menos 10 caracteres',
        'string.max': 'La descripción no puede exceder 2000 caracteres'
      }),
    severity: Joi.string()
      .valid('low', 'medium', 'high', 'critical')
      .messages({
        'any.only': 'La severidad debe ser: low, medium, high o critical'
      }),
    status: Joi.string()
      .valid('pending', 'in_progress', 'resolved', 'dismissed')
      .messages({
        'any.only': 'El estado debe ser: pending, in_progress, resolved o dismissed'
      }),
    metadata: Joi.object()
      .allow(null)
      .messages({
        'object.base': 'Los metadatos deben ser un objeto válido'
      })
  }).min(1).messages({
    'object.min': 'Debe proporcionar al menos un campo para actualizar'
  });
  
  return schema.validate(data);
}

/**
 * Validador para comentarios de reporte
 */
export function validateReportComment(data) {
  const schema = Joi.object({
    comment: Joi.string()
      .min(5)
      .max(1000)
      .required()
      .messages({
        'string.min': 'El comentario debe tener al menos 5 caracteres',
        'string.max': 'El comentario no puede exceder 1000 caracteres',
        'any.required': 'El comentario es requerido'
      })
  });
  
  return schema.validate(data);
}

/**
 * Validador para filtros de reportes
 */
export function validateReportFilters(data) {
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
      .valid('pending', 'in_progress', 'resolved', 'dismissed')
      .messages({
        'any.only': 'El estado debe ser: pending, in_progress, resolved o dismissed'
      }),
    type: Joi.string()
      .valid('behavioral', 'academic', 'emotional', 'social', 'disciplinary', 'achievement')
      .messages({
        'any.only': 'El tipo debe ser: behavioral, academic, emotional, social, disciplinary o achievement'
      }),
    severity: Joi.string()
      .valid('low', 'medium', 'high', 'critical')
      .messages({
        'any.only': 'La severidad debe ser: low, medium, high o critical'
      }),
    student_id: Joi.number()
      .integer()
      .positive()
      .messages({
        'number.base': 'El ID del estudiante debe ser un número',
        'number.integer': 'El ID del estudiante debe ser un número entero',
        'number.positive': 'El ID del estudiante debe ser positivo'
      }),
    teacher_id: Joi.number()
      .integer()
      .positive()
      .messages({
        'number.base': 'El ID del profesor debe ser un número',
        'number.integer': 'El ID del profesor debe ser un número entero',
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
      })
  });
  
  return schema.validate(data);
}