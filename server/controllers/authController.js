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
        const { email, password, name, role, school, subjects } = req.body;

        // Validaciones
        if (!email || !password || !name) {
            return res.status(400).json({ 
                error: 'Por favor complete todos los campos requeridos',
                details: 'Email, contraseña y nombre son obligatorios'
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
        const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);

        if (existingUser) {
            return res.status(400).json({ 
                error: 'El email ya está registrado',
                details: 'Por favor utilice otro email o inicie sesión'
            });
        }

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insertar nuevo usuario
        const userResult = db.prepare(
            `INSERT INTO users (email, password, name, role, created_at, updated_at)
             VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))`
        ).run(email, hashedPassword, name, role || 'teacher');
        
        const userId = userResult.lastInsertRowid;
        
        // Si es docente, insertar en la tabla teachers con datos iniciales
        if (role === 'teacher') {
            db.prepare(
                `INSERT INTO teachers (user_id, school, subjects, assigned_students, statistics)
                 VALUES (?, ?, ?, ?, ?)`
            ).run(userId, school || '', subjects || '', JSON.stringify([]), JSON.stringify({activities: 0, reports: 0, rewards: 0}));
        }
        
        // Si es tutor, insertar en la tabla tutors
        if (role === 'tutor') {
            db.prepare(
                `INSERT INTO tutors (user_id, relationship)
                 VALUES (?, ?)`
            ).run(userId, req.body.relationship || 'No especificado');
        }

        // Generar token JWT
        const token = jwt.sign(
            { 
                id: userId, 
                email, 
                role: role || 'teacher',
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
                role: role || 'teacher'
            }
        });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ 
            error: 'Error al registrar usuario',
            details: error.message
        });
    }
};

export const login = async (req, res) => {
    try {
        console.log('Intento de login con:', req.body.email);
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

        // Buscar usuario por email
        const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

        if (!user) {
            console.log('Usuario no encontrado:', email);
            return res.status(401).json({ 
                error: 'Credenciales inválidas',
                details: 'El email o la contraseña son incorrectos'
            });
        }

        // Verificar contraseña
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            console.log('Contraseña inválida para:', email);
            return res.status(401).json({ 
                error: 'Credenciales inválidas',
                details: 'El email o la contraseña son incorrectos'
            });
        }

        // Obtener información adicional según el rol
        let additionalInfo = {};
        
        if (user.role === 'teacher') {
            const teacherInfo = db.prepare('SELECT * FROM teachers WHERE user_id = ?').get(user.id);
            additionalInfo = {
                school: teacherInfo?.school || '',
                subjects: teacherInfo?.subjects || ''
            };
        } else if (user.role === 'tutor') {
            const tutorInfo = db.prepare('SELECT * FROM tutors WHERE user_id = ?').get(user.id);
            additionalInfo = {
                relationship: tutorInfo?.relationship || ''
            };
        } else if (user.role === 'student') {
            const studentInfo = db.prepare('SELECT * FROM students WHERE user_id = ?').get(user.id);
            additionalInfo = {
                school: studentInfo?.school || '',
                grade: studentInfo?.grade || ''
            };
        }

        // Generar token JWT
        const token = jwt.sign(
            { 
                id: user.id, 
                email: user.email, 
                role: user.role,
                name: user.name
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        console.log('Login exitoso para:', email);
        
        // Enviar respuesta
        res.json({
            message: 'Login exitoso',
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                ...additionalInfo
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
        const userId = req.user.id;
        const userRole = req.user.role;

        const user = db.prepare('SELECT id, email, name, role FROM users WHERE id = ?').get(userId);

        if (!user) {
            return res.status(404).json({
                error: 'Perfil no encontrado',
                details: 'No se encontró el perfil del usuario'
            });
        }

        // Obtener información adicional según el rol
        let additionalInfo = {};
        
        if (userRole === 'teacher') {
            const teacherInfo = db.prepare('SELECT * FROM teachers WHERE user_id = ?').get(userId);
            additionalInfo = {
                school: teacherInfo?.school || '',
                subjects: teacherInfo?.subjects || ''
            };
        } else if (userRole === 'tutor') {
            const tutorInfo = db.prepare('SELECT * FROM tutors WHERE user_id = ?').get(userId);
            additionalInfo = {
                relationship: tutorInfo?.relationship || ''
            };
        } else if (userRole === 'student') {
            const studentInfo = db.prepare('SELECT * FROM students WHERE user_id = ?').get(userId);
            additionalInfo = {
                school: studentInfo?.school || '',
                grade: studentInfo?.grade || ''
            };
        }

        res.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                ...additionalInfo
            }
        });
    } catch (error) {
        console.error('Error al obtener perfil:', error);
        res.status(500).json({
            error: 'Error al obtener el perfil',
            details: error.message
        });
    }
};
