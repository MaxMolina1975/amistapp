import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../database.js';

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

export const register = async (req, res) => {
    try {
        const { email, password, fullName, phone, relationship } = req.body;

        // Validaciones
        if (!email || !password || !fullName || !relationship) {
            return res.status(400).json({ 
                error: 'Por favor complete todos los campos requeridos',
                details: 'Email, contraseña, nombre completo y relación son obligatorios'
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
        const existingTutor = await db.getAsync('SELECT id FROM tutors WHERE email = ?', [email]);

        if (existingTutor) {
            return res.status(400).json({ 
                error: 'El email ya está registrado',
                details: 'Por favor utilice otro email o inicie sesión'
            });
        }

        // Hash de la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insertar nuevo usuario
        const userResult = await db.runAsync(
            `INSERT INTO users (email, password, name, role, created_at, updated_at)
             VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))`,
            [email, hashedPassword, fullName, 'tutor']
        );
        
        const userId = userResult.lastID;
        
        // Insertar nuevo tutor con datos iniciales
        const result = await db.runAsync(
            'INSERT INTO tutors (user_id, phone, relationship, points, assigned_students) VALUES (?, ?, ?, ?, ?)',
            [userId, phone, relationship, 0, JSON.stringify([])]
        );

        // Inicializar tabla de hijos a cargo (vacía inicialmente)
        await db.runAsync(
            'INSERT INTO tutor_student (tutor_id, created_at) VALUES (?, datetime(\'now\'))',
            [result.lastID]
        );

        // Generar token JWT
        const token = jwt.sign(
            { 
                id: result.lastID,
                email,
                role: 'tutor',
                fullName
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Enviar respuesta
        res.status(201).json({
            message: 'Registro exitoso',
            token,
            tutor: {
                id: result.lastID,
                email,
                fullName,
                phone,
                relationship,
                points: 0,
                assigned_students: []
            }
        });

    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ 
            error: 'Error al registrar tutor',
            details: error.message
        });
    }
};

// Obtener configuración del tutor
export const getTutorConfig = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Verificar si ya existe configuración para este usuario
        let config = await db.getAsync(
            `SELECT * FROM tutor_config WHERE user_id = ?`,
            [userId]
        );
        
        // Si no existe, crear una configuración por defecto
        if (!config) {
            await db.runAsync(
                `INSERT INTO tutor_config (user_id) VALUES (?)`,
                [userId]
            );
            
            config = await db.getAsync(
                `SELECT * FROM tutor_config WHERE user_id = ?`,
                [userId]
            );
        }
        
        // Parsear las configuraciones JSON
        if (config.notificaciones) {
            config.notificaciones = JSON.parse(config.notificaciones);
        } else {
            config.notificaciones = {
                recordatorios: true,
                actividadesNuevas: true,
                mensajesDirectos: true,
                actualizacionesSistema: false
            };
        }
        
        if (config.privacidad) {
            config.privacidad = JSON.parse(config.privacidad);
        } else {
            config.privacidad = {
                perfilPublico: true,
                mostrarProgreso: true,
                mostrarLogros: true
            };
        }
        
        res.json({ data: config });
    } catch (error) {
        console.error('Error al obtener configuración del tutor:', error);
        res.status(500).json({
            error: 'Error al obtener la configuración',
            details: error.message
        });
    }
};

// Actualizar configuración del tutor
export const updateTutorConfig = async (req, res) => {
    try {
        const userId = req.user.id;
        const { notificaciones, privacidad, tema_oscuro } = req.body;
        
        // Verificar si ya existe configuración para este usuario
        const configExists = await db.getAsync(
            `SELECT id FROM tutor_config WHERE user_id = ?`,
            [userId]
        );
        
        if (!configExists) {
            // Crear configuración si no existe
            await db.runAsync(
                `INSERT INTO tutor_config (user_id, notificaciones, privacidad, tema_oscuro) 
                 VALUES (?, ?, ?, ?)`,
                [
                    userId, 
                    notificaciones ? JSON.stringify(notificaciones) : '{}', 
                    privacidad ? JSON.stringify(privacidad) : '{}',
                    tema_oscuro !== undefined ? tema_oscuro : 0
                ]
            );
        } else {
            // Actualizar configuración existente
            const updates = [];
            const params = [];
            
            if (notificaciones !== undefined) {
                updates.push('notificaciones = ?');
                params.push(JSON.stringify(notificaciones));
            }
            
            if (privacidad !== undefined) {
                updates.push('privacidad = ?');
                params.push(JSON.stringify(privacidad));
            }
            
            if (tema_oscuro !== undefined) {
                updates.push('tema_oscuro = ?');
                params.push(tema_oscuro);
            }
            
            if (updates.length > 0) {
                updates.push('updated_at = CURRENT_TIMESTAMP');
                params.push(userId);
                
                await db.runAsync(
                    `UPDATE tutor_config SET ${updates.join(', ')} WHERE user_id = ?`,
                    params
                );
            }
        }
        
        // Obtener la configuración actualizada
        const updatedConfig = await db.getAsync(
            `SELECT * FROM tutor_config WHERE user_id = ?`,
            [userId]
        );
        
        // Parsear las configuraciones JSON
        if (updatedConfig.notificaciones) {
            updatedConfig.notificaciones = JSON.parse(updatedConfig.notificaciones);
        }
        
        if (updatedConfig.privacidad) {
            updatedConfig.privacidad = JSON.parse(updatedConfig.privacidad);
        }
        
        res.json({ data: updatedConfig });
    } catch (error) {
        console.error('Error al actualizar configuración del tutor:', error);
        res.status(500).json({
            error: 'Error al actualizar la configuración',
            details: error.message
        });
    }
};

// Actualizar perfil del tutor
export const updateTutorProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { fullName, email, phone, relation } = req.body;
        
        // Verificar si el email ya está en uso por otro usuario
        if (email) {
            const existingUser = await db.getAsync(
                `SELECT id FROM tutors WHERE email = ? AND id != ?`,
                [email, userId]
            );
            
            if (existingUser) {
                return res.status(400).json({
                    error: 'Email ya en uso',
                    details: 'El correo electrónico ya está siendo utilizado por otro usuario'
                });
            }
        }
        
        // Actualizar información del usuario
        const updates = [];
        const params = [];
        
        if (fullName) {
            updates.push('full_name = ?');
            params.push(fullName);
        }
        
        if (email) {
            updates.push('email = ?');
            params.push(email);
        }
        
        if (phone) {
            updates.push('phone = ?');
            params.push(phone);
        }
        
        if (relation) {
            updates.push('relation = ?');
            params.push(relation);
        }
        
        if (updates.length > 0) {
            updates.push('updated_at = CURRENT_TIMESTAMP');
            params.push(userId);
            
            await db.runAsync(
                `UPDATE tutors SET ${updates.join(', ')} WHERE id = ?`,
                params
            );
        }
        
        // Obtener el usuario actualizado
        const updatedUser = await db.getAsync(
            `SELECT id, email, full_name, phone, relation FROM tutors WHERE id = ?`,
            [userId]
        );
        
        res.json({ data: updatedUser });
    } catch (error) {
        console.error('Error al actualizar perfil del tutor:', error);
        res.status(500).json({
            error: 'Error al actualizar el perfil',
            details: error.message
        });
    }
};

// Cambiar contraseña del tutor
export const changeTutorPassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;
        
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                error: 'Datos incompletos',
                details: 'La contraseña actual y la nueva contraseña son requeridas'
            });
        }
        
        // Verificar contraseña actual
        const user = await db.getAsync(
            `SELECT password FROM tutors WHERE id = ?`,
            [userId]
        );
        
        if (!user) {
            return res.status(404).json({
                error: 'Usuario no encontrado',
                details: 'No se encontró el usuario'
            });
        }
        
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({
                error: 'Contraseña incorrecta',
                details: 'La contraseña actual es incorrecta'
            });
        }
        
        // Generar hash de la nueva contraseña
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        
        // Actualizar contraseña
        await db.runAsync(
            `UPDATE tutors SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
            [hashedPassword, userId]
        );
        
        res.json({ message: 'Contraseña actualizada correctamente' });
    } catch (error) {
        console.error('Error al cambiar contraseña del tutor:', error);
        res.status(500).json({
            error: 'Error al cambiar la contraseña',
            details: error.message
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validaciones
        if (!email || !password) {
            return res.status(400).json({ 
                error: 'Datos incompletos',
                details: 'Por favor ingrese email y contraseña'
            });
        }

        if (!isValidEmail(email)) {
            return res.status(400).json({
                error: 'Email inválido',
                details: 'Por favor ingrese un email válido'
            });
        }

        // Buscar tutor por email
        const tutor = await db.getAsync(
            'SELECT * FROM tutors WHERE email = ?',
            [email]
        );

        if (!tutor) {
            return res.status(401).json({ 
                error: 'Credenciales inválidas',
                details: 'El email o la contraseña son incorrectos'
            });
        }

        // Verificar contraseña
        const validPassword = await bcrypt.compare(password, tutor.password);
        if (!validPassword) {
            return res.status(401).json({ 
                error: 'Credenciales inválidas',
                details: 'El email o la contraseña son incorrectos'
            });
        }

        // Generar token JWT
        const token = jwt.sign(
            { 
                id: tutor.id,
                email: tutor.email,
                role: 'tutor',
                fullName: tutor.full_name
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Obtener estudiantes asociados
        const students = await db.allAsync(`
            SELECT s.* 
            FROM students s
            JOIN tutor_student ts ON s.id = ts.student_id
            WHERE ts.tutor_id = ?
        `, [tutor.id]);

        // Enviar respuesta
        res.json({
            message: 'Login exitoso',
            token,
            tutor: {
                id: tutor.id,
                email: tutor.email,
                fullName: tutor.full_name,
                phone: tutor.phone,
                relation: tutor.relation,
                students
            }
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ 
            error: 'Error al iniciar sesión',
            details: error.message
        });
    }
};

export const getProfile = async (req, res) => {
    try {
        const tutorId = req.user.id;

        // Obtener datos del tutor
        const tutor = await db.getAsync(
            'SELECT id, email, full_name, phone, relation FROM tutors WHERE id = ?',
            [tutorId]
        );

        if (!tutor) {
            return res.status(404).json({
                error: 'Tutor no encontrado',
                details: 'No se encontró el tutor en la base de datos'
            });
        }

        // Obtener estudiantes asociados
        const students = await db.allAsync(`
            SELECT s.* 
            FROM students s
            JOIN tutor_student ts ON s.id = ts.student_id
            WHERE ts.tutor_id = ?
        `, [tutorId]);

        // Enviar respuesta
        res.json({
            tutor: {
                ...tutor,
                students
            }
        });
    } catch (error) {
        console.error('Error al obtener perfil:', error);
        res.status(500).json({
            error: 'Error al obtener perfil',
            details: error.message
        });
    }
};
