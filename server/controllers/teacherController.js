import { db } from '../database.js';
import bcrypt from 'bcryptjs';

// Obtener estudiantes del docente
export const getStudents = async (req, res) => {
    try {
        const teacherId = req.user.id;
        const students = await db.allAsync(
            `SELECT * FROM students WHERE teacher_id = ? ORDER BY name`,
            [teacherId]
        );
        res.json({ data: students });
    } catch (error) {
        console.error('Error al obtener estudiantes:', error);
        res.status(500).json({ 
            error: 'Error al obtener los estudiantes',
            details: error.message 
        });
    }
};

// Agregar nuevo estudiante
export const addStudent = async (req, res) => {
    try {
        const teacherId = req.user.id;
        const { name, avatarUrl } = req.body;

        if (!name) {
            return res.status(400).json({
                error: 'Datos incompletos',
                details: 'El nombre del estudiante es requerido'
            });
        }

        const result = await db.runAsync(
            `INSERT INTO students (teacher_id, name, avatar_url) VALUES (?, ?, ?)`,
            [teacherId, name, avatarUrl || null]
        );

        const newStudent = await db.getAsync(
            `SELECT * FROM students WHERE id = ?`,
            [result.lastID]
        );

        res.status(201).json({ data: newStudent });
    } catch (error) {
        console.error('Error al agregar estudiante:', error);
        res.status(500).json({
            error: 'Error al agregar el estudiante',
            details: error.message
        });
    }
};

// Actualizar puntos de un estudiante
export const updateStudentPoints = async (req, res) => {
    try {
        const teacherId = req.user.id;
        const { studentId } = req.params;
        const { points, reason } = req.body;

        if (!points) {
            return res.status(400).json({
                error: 'Datos incompletos',
                details: 'Los puntos son requeridos'
            });
        }

        // Verificar que el estudiante pertenece al docente
        const student = await db.getAsync(
            `SELECT * FROM students WHERE id = ? AND teacher_id = ?`,
            [studentId, teacherId]
        );

        if (!student) {
            return res.status(404).json({
                error: 'Estudiante no encontrado',
                details: 'El estudiante no existe o no pertenece a este docente'
            });
        }

        // Actualizar puntos
        await db.runAsync(
            `UPDATE students SET points = points + ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
            [points, studentId]
        );

        const updatedStudent = await db.getAsync(
            `SELECT * FROM students WHERE id = ?`,
            [studentId]
        );

        res.json({ data: updatedStudent });
    } catch (error) {
        console.error('Error al actualizar puntos:', error);
        res.status(500).json({
            error: 'Error al actualizar los puntos',
            details: error.message
        });
    }
};

// Obtener premios del docente
export const getRewards = async (req, res) => {
    try {
        const teacherId = req.user.id;
        const rewards = await db.allAsync(
            `SELECT * FROM rewards WHERE teacher_id = ? ORDER BY created_at DESC`,
            [teacherId]
        );
        res.json({ data: rewards });
    } catch (error) {
        console.error('Error al obtener premios:', error);
        res.status(500).json({
            error: 'Error al obtener los premios',
            details: error.message
        });
    }
};

// Crear nuevo premio
export const createReward = async (req, res) => {
    try {
        const teacherId = req.user.id;
        const { title, description, pointsCost } = req.body;

        if (!title || !pointsCost) {
            return res.status(400).json({
                error: 'Datos incompletos',
                details: 'El título y el costo en puntos son requeridos'
            });
        }

        const result = await db.runAsync(
            `INSERT INTO rewards (teacher_id, title, description, points_cost) 
             VALUES (?, ?, ?, ?)`,
            [teacherId, title, description || null, pointsCost]
        );

        const newReward = await db.getAsync(
            `SELECT * FROM rewards WHERE id = ?`,
            [result.lastID]
        );

        res.status(201).json({ data: newReward });
    } catch (error) {
        console.error('Error al crear premio:', error);
        res.status(500).json({
            error: 'Error al crear el premio',
            details: error.message
        });
    }
};

// Obtener reportes emocionales de los estudiantes
export const getEmotionalReports = async (req, res) => {
    try {
        const teacherId = req.user.id;
        const reports = await db.allAsync(
            `SELECT er.*, s.name as student_name 
             FROM emotional_reports er 
             JOIN students s ON er.student_id = s.id 
             WHERE s.teacher_id = ? 
             ORDER BY er.reported_at DESC`,
            [teacherId]
        );
        res.json({ data: reports });
    } catch (error) {
        console.error('Error al obtener reportes emocionales:', error);
        res.status(500).json({
            error: 'Error al obtener los reportes emocionales',
            details: error.message
        });
    }
};

// Crear actividad
export const createActivity = async (req, res) => {
    try {
        const teacherId = req.user.id;
        const { title, description, points } = req.body;

        if (!title) {
            return res.status(400).json({
                error: 'Datos incompletos',
                details: 'El título de la actividad es requerido'
            });
        }

        const result = await db.runAsync(
            `INSERT INTO activities (teacher_id, title, description, points) 
             VALUES (?, ?, ?, ?)`,
            [teacherId, title, description || null, points || 0]
        );

        const newActivity = await db.getAsync(
            `SELECT * FROM activities WHERE id = ?`,
            [result.lastID]
        );

        res.status(201).json({ data: newActivity });
    } catch (error) {
        console.error('Error al crear actividad:', error);
        res.status(500).json({
            error: 'Error al crear la actividad',
            details: error.message
        });
    }
};

// Obtener actividades
export const getActivities = async (req, res) => {
    try {
        const teacherId = req.user.id;
        const activities = await db.allAsync(
            `SELECT * FROM activities WHERE teacher_id = ? ORDER BY created_at DESC`,
            [teacherId]
        );
        res.json({ data: activities });
    } catch (error) {
        console.error('Error al obtener actividades:', error);
        res.status(500).json({
            error: 'Error al obtener las actividades',
            details: error.message
        });
    }
};

// Obtener configuración del profesor
export const getTeacherConfig = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Verificar si ya existe configuración para este usuario
        let config = await db.getAsync(
            `SELECT * FROM teacher_config WHERE user_id = ?`,
            [userId]
        );
        
        // Si no existe, crear una configuración por defecto
        if (!config) {
            await db.runAsync(
                `INSERT INTO teacher_config (user_id) VALUES (?)`,
                [userId]
            );
            
            config = await db.getAsync(
                `SELECT * FROM teacher_config WHERE user_id = ?`,
                [userId]
            );
        }
        
        // Parsear las configuraciones JSON
        if (config.notificaciones) {
            config.notificaciones = JSON.parse(config.notificaciones);
        } else {
            config.notificaciones = {};
        }
        
        if (config.privacidad) {
            config.privacidad = JSON.parse(config.privacidad);
        } else {
            config.privacidad = {};
        }
        
        res.json({ data: config });
    } catch (error) {
        console.error('Error al obtener configuración:', error);
        res.status(500).json({
            error: 'Error al obtener la configuración',
            details: error.message
        });
    }
};

// Actualizar configuración del profesor
export const updateTeacherConfig = async (req, res) => {
    try {
        const userId = req.user.id;
        const { notificaciones, privacidad, tema_oscuro } = req.body;
        
        // Verificar si ya existe configuración para este usuario
        const configExists = await db.getAsync(
            `SELECT id FROM teacher_config WHERE user_id = ?`,
            [userId]
        );
        
        if (!configExists) {
            // Crear configuración si no existe
            await db.runAsync(
                `INSERT INTO teacher_config (user_id, notificaciones, privacidad, tema_oscuro) 
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
                    `UPDATE teacher_config SET ${updates.join(', ')} WHERE user_id = ?`,
                    params
                );
            }
        }
        
        // Obtener la configuración actualizada
        const updatedConfig = await db.getAsync(
            `SELECT * FROM teacher_config WHERE user_id = ?`,
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
        console.error('Error al actualizar configuración:', error);
        res.status(500).json({
            error: 'Error al actualizar la configuración',
            details: error.message
        });
    }
};

// Actualizar perfil del profesor
export const updateTeacherProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { fullName, email, phone } = req.body;
        
        // Verificar si el email ya está en uso por otro usuario
        if (email) {
            const existingUser = await db.getAsync(
                `SELECT id FROM users WHERE email = ? AND id != ?`,
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
            updates.push('name = ?');
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
        
        if (updates.length > 0) {
            updates.push('updated_at = CURRENT_TIMESTAMP');
            params.push(userId);
            
            await db.runAsync(
                `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
                params
            );
        }
        
        // Obtener el usuario actualizado
        const updatedUser = await db.getAsync(
            `SELECT id, name, email, phone, role, avatar_url FROM users WHERE id = ?`,
            [userId]
        );
        
        res.json({ data: updatedUser });
    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        res.status(500).json({
            error: 'Error al actualizar el perfil',
            details: error.message
        });
    }
};

// Cambiar contraseña del profesor
export const changeTeacherPassword = async (req, res) => {
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
            `SELECT password FROM users WHERE id = ?`,
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
            `UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
            [hashedPassword, userId]
        );
        
        res.json({ message: 'Contraseña actualizada correctamente' });
    } catch (error) {
        console.error('Error al cambiar contraseña:', error);
        res.status(500).json({
            error: 'Error al cambiar la contraseña',
            details: error.message
        });
    }
};
