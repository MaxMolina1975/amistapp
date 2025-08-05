import Joi from 'joi';

/**
 * Validador para crear notificación
 */
export const validateNotificationCreate = (data) => {
  const schema = Joi.object({
    user_id: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'El ID del usuario debe ser un número',
        'number.integer': 'El ID del usuario debe ser un número entero',
        'number.positive': 'El ID del usuario debe ser positivo',
        'any.required': 'El ID del usuario es requerido'
      }),
    
    title: Joi.string()
      .min(1)
      .max(200)
      .required()
      .messages({
        'string.base': 'El título debe ser una cadena de texto',
        'string.min': 'El título debe tener al menos 1 carácter',
        'string.max': 'El título no puede exceder 200 caracteres',
        'any.required': 'El título es requerido'
      }),
    
    message: Joi.string()
      .min(1)
      .max(1000)
      .required()
      .messages({
        'string.base': 'El mensaje debe ser una cadena de texto',
        'string.min': 'El mensaje debe tener al menos 1 carácter',
        'string.max': 'El mensaje no puede exceder 1000 caracteres',
        'any.required': 'El mensaje es requerido'
      }),
    
    type: Joi.string()
      .valid('info', 'success', 'warning', 'error', 'achievement', 'reminder')
      .default('info')
      .messages({
        'string.base': 'El tipo debe ser una cadena de texto',
        'any.only': 'El tipo debe ser uno de: info, success, warning, error, achievement, reminder'
      }),
    
    action_url: Joi.string()
      .uri({ allowRelative: true })
      .allow(null, '')
      .optional()
      .messages({
        'string.base': 'La URL de acción debe ser una cadena de texto',
        'string.uri': 'La URL de acción debe ser una URL válida'
      })
  });

  return schema.validate(data, { abortEarly: false });
};

/**
 * Validador para filtros de notificaciones
 */
export const validateNotificationFilters = (data) => {
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
      .default(20)
      .messages({
        'number.base': 'El límite debe ser un número',
        'number.integer': 'El límite debe ser un número entero',
        'number.min': 'El límite debe ser mayor a 0',
        'number.max': 'El límite no puede ser mayor a 100'
      }),
    
    unread_only: Joi.boolean()
      .default(false)
      .messages({
        'boolean.base': 'unread_only debe ser un valor booleano'
      }),
    
    type: Joi.string()
      .valid('info', 'success', 'warning', 'error', 'achievement', 'reminder')
      .optional()
      .messages({
        'string.base': 'El tipo debe ser una cadena de texto',
        'any.only': 'El tipo debe ser uno de: info, success, warning, error, achievement, reminder'
      })
  });

  return schema.validate(data, { abortEarly: false });
};

/**
 * Validador para notificación masiva
 */
export const validateBulkNotification = (data) => {
  const schema = Joi.object({
    user_ids: Joi.array()
      .items(
        Joi.number()
          .integer()
          .positive()
          .messages({
            'number.base': 'Cada ID de usuario debe ser un número',
            'number.integer': 'Cada ID de usuario debe ser un número entero',
            'number.positive': 'Cada ID de usuario debe ser positivo'
          })
      )
      .min(1)
      .max(1000)
      .required()
      .messages({
        'array.base': 'Los IDs de usuario deben ser un array',
        'array.min': 'Debe especificar al menos un usuario',
        'array.max': 'No se pueden notificar más de 1000 usuarios a la vez',
        'any.required': 'Los IDs de usuario son requeridos'
      }),
    
    title: Joi.string()
      .min(1)
      .max(200)
      .required()
      .messages({
        'string.base': 'El título debe ser una cadena de texto',
        'string.min': 'El título debe tener al menos 1 carácter',
        'string.max': 'El título no puede exceder 200 caracteres',
        'any.required': 'El título es requerido'
      }),
    
    message: Joi.string()
      .min(1)
      .max(1000)
      .required()
      .messages({
        'string.base': 'El mensaje debe ser una cadena de texto',
        'string.min': 'El mensaje debe tener al menos 1 carácter',
        'string.max': 'El mensaje no puede exceder 1000 caracteres',
        'any.required': 'El mensaje es requerido'
      }),
    
    type: Joi.string()
      .valid('info', 'success', 'warning', 'error', 'achievement', 'reminder')
      .default('info')
      .messages({
        'string.base': 'El tipo debe ser una cadena de texto',
        'any.only': 'El tipo debe ser uno de: info, success, warning, error, achievement, reminder'
      }),
    
    action_url: Joi.string()
      .uri({ allowRelative: true })
      .allow(null, '')
      .optional()
      .messages({
        'string.base': 'La URL de acción debe ser una cadena de texto',
        'string.uri': 'La URL de acción debe ser una URL válida'
      })
  });

  return schema.validate(data, { abortEarly: false });
};