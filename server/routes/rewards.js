import express from 'express';
import { db } from '../database.js';

const router = express.Router();

// Get all rewards
router.get('/', (req, res) => {
  db.all('SELECT * FROM rewards ORDER BY created_at DESC', [], (err, rewards) => {
    if (err) {
      res.status(500).json({ error: 'Error al obtener los premios' });
      return;
    }
    res.json(rewards || []);
  });
});

// Get reward stats
router.get('/stats', (req, res) => {
  const queries = {
    activeRewards: 'SELECT COUNT(*) as count FROM rewards WHERE active = 1',
    totalClaims: 'SELECT COUNT(*) as count FROM reward_claims',
    pointsSpent: 'SELECT SUM(points) as total FROM reward_claims WHERE status = "approved"'
  };

  Promise.all([
    new Promise((resolve, reject) => {
      db.get(queries.activeRewards, [], (err, result) => {
        if (err) reject(err);
        else resolve(result?.count || 0);
      });
    }),
    new Promise((resolve, reject) => {
      db.get(queries.totalClaims, [], (err, result) => {
        if (err) reject(err);
        else resolve(result?.count || 0);
      });
    }),
    new Promise((resolve, reject) => {
      db.get(queries.pointsSpent, [], (err, result) => {
        if (err) reject(err);
        else resolve(result?.total || 0);
      });
    })
  ])
    .then(([activeRewards, totalClaims, pointsSpent]) => {
      res.json({
        activeRewards,
        totalClaims,
        pointsSpent
      });
    })
    .catch(err => {
      res.status(500).json({ error: 'Error al obtener las estadísticas' });
    });
});

// Create reward
router.post('/', (req, res) => {
  const { name, description, points, stock, active } = req.body;
  const userId = req.query.userId; // TODO: Get from auth

  db.run(
    `INSERT INTO rewards (
      name, description, points, stock, active, created_by, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`,
    [name, description, points, stock, active ? 1 : 0, userId],
    function(err) {
      if (err) {
        res.status(500).json({ error: 'Error al crear el premio' });
        return;
      }

      db.get('SELECT * FROM rewards WHERE id = ?', [this.lastID], (err, reward) => {
        if (err) {
          res.status(500).json({ error: 'Error al obtener el premio creado' });
          return;
        }
        res.status(201).json(reward);
      });
    }
  );
});

// Update reward
router.patch('/:id', (req, res) => {
  const { name, description, points, stock, active } = req.body;
  
  db.run(
    `UPDATE rewards 
     SET name = ?, description = ?, points = ?, stock = ?, active = ?
     WHERE id = ?`,
    [name, description, points, stock, active ? 1 : 0, req.params.id],
    (err) => {
      if (err) {
        res.status(500).json({ error: 'Error al actualizar el premio' });
        return;
      }

      db.get('SELECT * FROM rewards WHERE id = ?', [req.params.id], (err, reward) => {
        if (err) {
          res.status(500).json({ error: 'Error al obtener el premio actualizado' });
          return;
        }
        res.json(reward);
      });
    }
  );
});

// Delete reward
router.delete('/:id', (req, res) => {
  db.run('DELETE FROM rewards WHERE id = ?', [req.params.id], (err) => {
    if (err) {
      res.status(500).json({ error: 'Error al eliminar el premio' });
      return;
    }
    res.status(204).send();
  });
});

// Get user claims
router.get('/claims', (req, res) => {
  const userId = req.query.userId; // TODO: Get from auth

  db.all(
    `SELECT c.*, r.name as reward_name, r.points as reward_points
     FROM reward_claims c
     JOIN rewards r ON c.reward_id = r.id
     WHERE c.user_id = ?
     ORDER BY c.claimed_at DESC`,
    [userId],
    (err, claims) => {
      if (err) {
        res.status(500).json({ error: 'Error al obtener los canjes' });
        return;
      }
      res.json(claims || []);
    }
  );
});

// Create claim
router.post('/claims', (req, res) => {
  const { rewardId, points } = req.body;
  const userId = req.query.userId; // TODO: Get from auth

  db.run(
    `INSERT INTO reward_claims (
      reward_id, user_id, points, status, claimed_at
    ) VALUES (?, ?, ?, 'pending', datetime('now'))`,
    [rewardId, userId, points],
    function(err) {
      if (err) {
        res.status(500).json({ error: 'Error al crear el canje' });
        return;
      }

      db.get('SELECT * FROM reward_claims WHERE id = ?', [this.lastID], (err, claim) => {
        if (err) {
          res.status(500).json({ error: 'Error al obtener el canje creado' });
          return;
        }
        res.status(201).json(claim);
      });
    }
  );
});

// Update claim status
router.patch('/claims/:id', (req, res) => {
  const { status } = req.body;

  db.run(
    'UPDATE reward_claims SET status = ? WHERE id = ?',
    [status, req.params.id],
    (err) => {
      if (err) {
        res.status(500).json({ error: 'Error al actualizar el estado del canje' });
        return;
      }

      db.get('SELECT * FROM reward_claims WHERE id = ?', [req.params.id], (err, claim) => {
        if (err) {
          res.status(500).json({ error: 'Error al obtener el canje actualizado' });
          return;
        }
        res.json(claim);
      });
    }
  );
});

export default router;