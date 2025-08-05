import express from 'express';
import { db } from '../database.js';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Middleware de autenticación y verificación de rol admin
router.use(authenticateToken);
router.use(requireAdmin);

// Estadísticas generales del dashboard
router.get('/stats', async (req, res) => {
  try {
    const stats = await db.all(`
      SELECT 
        (SELECT COUNT(*) FROM users) as totalUsers,
        (SELECT COUNT(*) FROM users WHERE role = 'student') as totalStudents,
        (SELECT COUNT(*) FROM users WHERE role = 'teacher') as totalTeachers,
        (SELECT COUNT(*) FROM users WHERE role = 'tutor') as totalTutors,
        (SELECT COUNT(*) FROM reports) as totalReports,
        (SELECT COUNT(*) FROM reports WHERE status = 'pending') as pendingReports,
        (SELECT COUNT(*) FROM rewards) as totalRewards,
        (SELECT COUNT(*) FROM activities) as totalActivities
    `);
    
    res.json(stats[0]);
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

// Gestión de usuarios
router.get('/users', async (req, res) => {
  try {
    const users = await db.all('SELECT * FROM users ORDER BY created_at DESC');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// Actualizar usuario
router.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, role, status } = req.body;
  
  try {
    await db.run(
      'UPDATE users SET name = ?, email = ?, role = ?, status = ? WHERE id = ?',
      [name, email, role, status, id]
    );
    res.json({ message: 'Usuario actualizado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

// Gestión de reportes
router.get('/reports', async (req, res) => {
  try {
    const reports = await db.all(`
      SELECT r.*, u.name as reporter_name 
      FROM reports r 
      LEFT JOIN users u ON r.user_id = u.id 
      ORDER BY r.created_at DESC
    `);
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener reportes' });
  }
});

// Actualizar estado de reporte
router.put('/reports/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status, resolution } = req.body;
  
  try {
    await db.run(
      'UPDATE reports SET status = ?, resolution = ?, resolved_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, resolution, id]
    );
    res.json({ message: 'Estado del reporte actualizado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar estado del reporte' });
  }
});

// Gestión de recompensas
router.get('/rewards', async (req, res) => {
  try {
    const rewards = await db.all('SELECT * FROM rewards ORDER BY created_at DESC');
    res.json(rewards);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener recompensas' });
  }
});

// Crear nueva recompensa
router.post('/rewards', async (req, res) => {
  const { title, description, points_cost, stock, category } = req.body;
  
  try {
    await db.run(
      'INSERT INTO rewards (title, description, points_cost, stock, category) VALUES (?, ?, ?, ?, ?)',
      [title, description, points_cost, stock, category]
    );
    res.json({ message: 'Recompensa creada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear recompensa' });
  }
});

// Actualizar recompensa
router.put('/rewards/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, points_cost, stock, category, active } = req.body;
  
  try {
    await db.run(
      'UPDATE rewards SET title = ?, description = ?, points_cost = ?, stock = ?, category = ?, active = ? WHERE id = ?',
      [title, description, points_cost, stock, category, active, id]
    );
    res.json({ message: 'Recompensa actualizada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar recompensa' });
  }
});

// Configuración del sistema
router.get('/config', async (req, res) => {
  try {
    const config = await db.get('SELECT * FROM system_config WHERE id = 1');
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener configuración' });
  }
});

// Actualizar configuración
router.put('/config', async (req, res) => {
  const { points_per_report, min_points_reward, max_daily_reports } = req.body;
  
  try {
    await db.run(
      'UPDATE system_config SET points_per_report = ?, min_points_reward = ?, max_daily_reports = ? WHERE id = 1',
      [points_per_report, min_points_reward, max_daily_reports]
    );
    res.json({ message: 'Configuración actualizada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar configuración' });
  }
});

export default router;