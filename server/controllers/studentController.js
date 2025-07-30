import { db } from '../database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Validación de email
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Validación de contraseña
const isValidPassword = (password) => {
    return password.length >= 6;
};

// Registro de estudiante
export const register = async (req, res) => {
    try {
        const { email, password, name, school, grade } = req.body;

        // Validaciones
        if (!email || !password || !name || !school || !grade) {
            return res.status(400).json({ 
                error: 'Por favor complete todos los campos requeridos',
                details: 'Email, contraseña, nombre, escuela y grado son obligatorios'
            });
        }

        if (!isValidEmail(email)) {
            return res.status(400).json({
                error: 'Email inválido',
                details: 'Por favor ingrese un email válido'
            });
        }

        if (!isValidPassword(password)) {
            return res.status(400).json({
                error: 'Contraseña inválida',
                details: 'La contraseña debe tener al menos 6 caracteres'
            });
        }

        // Verificar si el email ya existe
        const existingUser = await db.getAsync('SELECT id FROM users WHERE email = ?', [email]);

        if (existingUser) {
            return res.status(400).json({ 
                error: 'El email ya está registrado',
                details: 'Por favor utilice otro email o inicie sesión'
            });
        }

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insertar nuevo usuario
        const userResult = await db.runAsync(
            `INSERT INTO users (email, password, name, role, created_at, updated_at)
             VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))`,
            [email, hashedPassword, name, 'student']
        );
        
        const userId = userResult.lastID;
        
        // Insertar en la tabla students con datos iniciales
        await db.runAsync(
            `INSERT INTO students (user_id, school, grade, points, achievements, emotional_state, created_at)
             VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`,
            [userId, school, grade, 0, JSON.stringify([]), JSON.stringify({current: 'neutral', history: []})]
        );

        // Generar token JWT
        const token = jwt.sign(
            { 
                id: userId, 
                email, 
                role: 'student',
                name 
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Enviar respuesta
        res.status(201).json({
            message: 'Registro exitoso',
            token,
            user: {
                id: userId,
                email,
                name,
                role: 'student',
                school,
                grade
            }
        });
    } catch (error) {
        console.error('Error en registro de estudiante:', error);
        res.status(500).json({ 
            error: 'Error al registrar estudiante',
            details: error.message
        });
    }
};

// Obtener la configuración del estudiante
export const getStudentConfig = async (req, res) => {
    try {
        const studentId = req.user.id;

        // Verificar que el usuario sea un estudiante
        if (req.user.role !== 'student') {
            return res.status(403).json({
                error: 'Acceso denegado',
                details: 'Solo los estudiantes pueden acceder a esta función'
            });
        }

        // Buscar la configuración en la base de datos
        const config = await db.getAsync(
            `SELECT * FROM student_config WHERE user_id = ?`,
            [studentId]
        );

        // Si no existe configuración, devolver valores predeterminados
        if (!config) {
            return res.json({
                data: {
                    notificaciones: {
                        recordatorios: true,
                        actividadesNuevas: true,
                        mensajesDirectos: true,
                        actualizacionesSistema: false
                    },
                    privacidad: {
                        perfilPublico: true,
                        mostrarProgreso: true,
                        mostrarLogros: true
                    },
                    temaOscuro: false
                }
            });
        }

        // Parsear la configuración almacenada en JSON
        const notificaciones = JSON.parse(config.notificaciones || '{}');
        const privacidad = JSON.parse(config.privacidad || '{}');

        res.json({
            data: {
                notificaciones: {
                    recordatorios: notificaciones.recordatorios ?? true,
                    actividadesNuevas: notificaciones.actividadesNuevas ?? true,
                    mensajesDirectos: notificaciones.mensajesDirectos ?? true,
                    actualizacionesSistema: notificaciones.actualizacionesSistema ?? false
                },
                privacidad: {
                    perfilPublico: privacidad.perfilPublico ?? true,
                    mostrarProgreso: privacidad.mostrarProgreso ?? true,
                    mostrarLogros: privacidad.mostrarLogros ?? true
                },
                temaOscuro: config.tema_oscuro === 1
            }
        });
    } catch (error) {
        console.error('Error al obtener configuración del estudiante:', error);
        res.status(500).json({
            error: 'Error al obtener la configuración',
            details: error.message
        });
    }
};

// Actualizar la configuración del estudiante
export const updateStudentConfig = async (req, res) => {
    try {
        const studentId = req.user.id;
        const { notificaciones, privacidad, temaOscuro } = req.body;

        // Verificar que el usuario sea un estudiante
        if (req.user.role !== 'student') {
            return res.status(403).json({
                error: 'Acceso denegado',
                details: 'Solo los estudiantes pueden acceder a esta función'
            });
        }

        // Verificar si ya existe una configuración para este estudiante
        const existingConfig = await db.getAsync(
            `SELECT * FROM student_config WHERE user_id = ?`,
            [studentId]
        );

        // Convertir objetos a JSON para almacenar
        const notificacionesJson = JSON.stringify(notificaciones || {});
        const privacidadJson = JSON.stringify(privacidad || {});
        const temaOscuroValue = temaOscuro ? 1 : 0;

        if (existingConfig) {
            // Actualizar configuración existente
            await db.runAsync(
                `UPDATE student_config 
                 SET notificaciones = ?, privacidad = ?, tema_oscuro = ?, updated_at = CURRENT_TIMESTAMP 
                 WHERE user_id = ?`,
                [notificacionesJson, privacidadJson, temaOscuroValue, studentId]
            );
        } else {
            // Crear nueva configuración
            await db.runAsync(
                `INSERT INTO student_config (user_id, notificaciones, privacidad, tema_oscuro, created_at, updated_at) 
                 VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
                [studentId, notificacionesJson, privacidadJson, temaOscuroValue]
            );
        }

        res.json({
            message: 'Configuración actualizada correctamente',
            data: {
                notificaciones,
                privacidad,
                temaOscuro
            }
        });
    } catch (error) {
        console.error('Error al actualizar configuración del estudiante:', error);
        res.status(500).json({
            error: 'Error al actualizar la configuración',
            details: error.message
        });
    }
};

// Cambiar contraseña del estudiante
export const changeStudentPassword = async (req, res) => {
    try {
        const studentId = req.user.id;
        const { passwordActual, passwordNuevo } = req.body;

        // Verificar que el usuario sea un estudiante
        if (req.user.role !== 'student') {
            return res.status(403).json({
                error: 'Acceso denegado',
                details: 'Solo los estudiantes pueden acceder a esta función'
            });
        }

        // Validar que se proporcionaron las contraseñas
        if (!passwordActual || !passwordNuevo) {
            return res.status(400).json({
                error: 'Datos incompletos',
                details: 'Se requiere la contraseña actual y la nueva contraseña'
            });
        }

        // Validar longitud de la nueva contraseña
        if (passwordNuevo.length < 6) {
            return res.status(400).json({
                error: 'Contraseña inválida',
                details: 'La nueva contraseña debe tener al menos 6 caracteres'
            });
        }

        // Obtener la contraseña actual del usuario
        const user = await db.getAsync(
            'SELECT password FROM users WHERE id = ?',
            [studentId]
        );

        if (!user) {
            return res.status(404).json({
                error: 'Usuario no encontrado',
                details: 'No se encontró el usuario en la base de datos'
            });
        }

        // Verificar que la contraseña actual sea correcta
        const validPassword = await bcrypt.compare(passwordActual, user.password);
        if (!validPassword) {
            return res.status(401).json({
                error: 'Contraseña incorrecta',
                details: 'La contraseña actual es incorrecta'
            });
        }

        // Hash de la nueva contraseña
        const hashedPassword = await bcrypt.hash(passwordNuevo, 10);

        // Actualizar la contraseña en la base de datos
        await db.runAsync(
            'UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [hashedPassword, studentId]
        );

        res.json({
            message: 'Contraseña actualizada correctamente'
        });
    } catch (error) {
        console.error('Error al cambiar contraseña del estudiante:', error);
        res.status(500).json({
            error: 'Error al cambiar la contraseña',
            details: error.message
        });
    }
};

// Actualizar perfil del estudiante
export const updateStudentProfile = async (req, res) => {
    try {
        const studentId = req.user.id;
        const { name, avatarUrl } = req.body;

        // Verificar que el usuario sea un estudiante
        if (req.user.role !== 'student') {
            return res.status(403).json({
                error: 'Acceso denegado',
                details: 'Solo los estudiantes pueden acceder a esta función'
            });
        }

        // Validar que se proporcionó al menos un campo para actualizar
        if (!name && !avatarUrl) {
            return res.status(400).json({
                error: 'Datos incompletos',
                details: 'Se requiere al menos un campo para actualizar'
            });
        }

        // Actualizar el perfil en la tabla users
        if (name) {
            await db.runAsync(
                'UPDATE users SET name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
                [name, studentId]
            );
        }

        // Actualizar el avatar en la tabla students si existe
        if (avatarUrl) {
            const student = await db.getAsync(
                'SELECT * FROM students WHERE user_id = ?',
                [studentId]
            );

            if (student) {
                await db.runAsync(
                    'UPDATE students SET avatar_url = ? WHERE user_id = ?',
                    [avatarUrl, studentId]
                );
            }
        }

        // Obtener el perfil actualizado
        const updatedUser = await db.getAsync(
            'SELECT id, email, name, role FROM users WHERE id = ?',
            [studentId]
        );

        const studentInfo = await db.getAsync(
            'SELECT * FROM students WHERE user_id = ?',
            [studentId]
        );

        res.json({
            message: 'Perfil actualizado correctamente',
            data: {
                ...updatedUser,
                avatarUrl: studentInfo?.avatar_url || null,
                school: studentInfo?.school || '',
                grade: studentInfo?.grade || ''
            }
        });
    } catch (error) {
        console.error('Error al actualizar perfil del estudiante:', error);
        res.status(500).json({
            error: 'Error al actualizar el perfil',
            details: error.message
        });
    }
};