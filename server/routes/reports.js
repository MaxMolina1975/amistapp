import express from 'express';
import { db } from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Usar middleware de autenticación
router.use(authenticateToken);

// Obtener todos los reportes
router.get('/', (req, res) => {
    const userId = req.user.id;
    
    db.all(
        'SELECT * FROM reports WHERE user_id = ? ORDER BY created_at DESC',
        [userId],
        (err, reports) => {
            if (err) {
                console.error('Error al obtener reportes:', err);
                return res.status(500).json({
                    error: 'Error al obtener los reportes',
                    details: err.message
                });
            }
            res.json(reports || []);
        }
    );
});

// Crear nuevo reporte
router.post('/', (req, res) => {
    const userId = req.user.id;
    const { type, title, description, priority, anonymous } = req.body;

    if (!type || !title || !description || !priority) {
        return res.status(400).json({
            error: 'Datos incompletos',
            details: 'Todos los campos son requeridos'
        });
    }

    db.run(
        `INSERT INTO reports (
            user_id, type, title, description, priority, anonymous, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
        [userId, type, title, description, priority, anonymous ? 1 : 0],
        function(err) {
            if (err) {
                console.error('Error al crear reporte:', err);
                return res.status(500).json({
                    error: 'Error al crear el reporte',
                    details: err.message
                });
            }

            res.status(201).json({
                id: this.lastID,
                user_id: userId,
                type,
                title,
                description,
                priority,
                anonymous: anonymous ? 1 : 0,
                status: 'pending'
            });
        }
    );
});

// Actualizar estado de reporte
router.patch('/:id', (req, res) => {
    const reportId = req.params.id;
    const userId = req.user.id;
    const { status, resolution } = req.body;

    if (!status) {
        return res.status(400).json({
            error: 'Datos incompletos',
            details: 'El estado es requerido'
        });
    }

    db.run(
        `UPDATE reports 
         SET status = ?, 
             resolution = ?,
             resolved_at = CASE WHEN ? = 'resolved' THEN datetime('now') ELSE null END,
             updated_at = datetime('now')
         WHERE id = ? AND user_id = ?`,
        [status, resolution || null, status, reportId, userId],
        function(err) {
            if (err) {
                console.error('Error al actualizar reporte:', err);
                return res.status(500).json({
                    error: 'Error al actualizar el reporte',
                    details: err.message
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    error: 'Reporte no encontrado',
                    details: 'El reporte no existe o no tienes permiso para modificarlo'
                });
            }

            res.json({
                message: 'Reporte actualizado exitosamente'
            });
        }
    );
});

export default router;