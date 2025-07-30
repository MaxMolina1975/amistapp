import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ 
                error: 'No se proporcionó token de autenticación'
            });
        }

        const user = jwt.verify(token, JWT_SECRET);
        req.user = user;
        
        if (typeof next === 'function') {
            next();
        } else {
            console.error('next is not a function');
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    } catch (error) {
        console.error('Error en authenticateToken:', error);
        return res.status(403).json({ 
            error: 'Token inválido',
            details: error.message
        });
    }
};
