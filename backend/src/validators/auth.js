import Joi from 'joi';

/**
 * Validador para login
 */
export function validateLogin(data) {
  const schema = Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Debe ser un email válido',
        'any.required': 'El email es requerido'
      }),
    password: Joi.string()
      .min(6)
      .required()
      .messages({
        'string.min': 'La contraseña debe tener al menos 6 caracteres',
        'any.required': 'La contraseña es requerida'
      })
  });
  
  return schema.validate(data);
}

/**
 * Validador para registro
 */
export function validateRegister(data) {
  const schema = Joi.object({
    name: Joi.string()
      .min(2)
      .max(100)
      .required()
      .messages({
        'string.min': 'El nombre debe tener al menos 2 caracteres',
        'string.max': 'El nombre no puede exceder 100 caracteres',
        'any.required': 'El nombre es requerido'
      }),
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Debe ser un email válido',
        'any.required': 'El email es requerido'
      }),
    password: Joi.string()
      .min(6)
      .max(128)
      .required()
      .messages({
        'string.min': 'La contraseña debe tener al menos 6 caracteres',
        'string.max': 'La contraseña no puede exceder 128 caracteres',
        'any.required': 'La contraseña es requerida'
      }),
    role: Joi.string()
      .valid('admin', 'teacher', 'student', 'tutor')
      .default('student')
      .messages({
        'any.only': 'El rol debe ser: admin, teacher, student o tutor'
      })
  });
  
  return schema.validate(data);
}

/**
 * Validador para cambio de contraseña
 */
export function validateChangePassword(data) {
  const schema = Joi.object({
    currentPassword: Joi.string()
      .required()
      .messages({
        'any.required': 'La contraseña actual es requerida'
      }),
    newPassword: Joi.string()
      .min(6)
      .max(128)
      .required()
      .messages({
        'string.min': 'La nueva contraseña debe tener al menos 6 caracteres',
        'string.max': 'La nueva contraseña no puede exceder 128 caracteres',
        'any.required': 'La nueva contraseña es requerida'
      })
  });
  
  return schema.validate(data);
}

/**
 * Validador para actualización de perfil
 */
export function validateProfileUpdate(data) {
  const schema = Joi.object({
    name: Joi.string()
      .min(2)
      .max(100)
      .required()
      .messages({
        'string.min': 'El nombre debe tener al menos 2 caracteres',
        'string.max': 'El nombre no puede exceder 100 caracteres',
        'any.required': 'El nombre es requerido'
      }),
    avatar_url: Joi.string()
      .uri()
      .allow(null, '')
      .messages({
        'string.uri': 'La URL del avatar debe ser válida'
      })
  });
  
  return schema.validate(data);
}