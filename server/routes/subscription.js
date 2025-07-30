import express from 'express';
import { db } from '../database.js';

const router = express.Router();

// Get subscription details
router.get('/', (req, res) => {
  const userId = req.query.userId; // TODO: Get from auth
  
  db.get(
    'SELECT * FROM subscriptions WHERE user_id = ?',
    [userId],
    (err, subscription) => {
      if (err) {
        res.status(500).json({ error: 'Error al obtener la suscripción' });
        return;
      }
      res.json(subscription || {
        isActive: false,
        expiresAt: null,
        availablePoints: 0
      });
    }
  );
});

// Process subscription renewal
router.post('/renew', (req, res) => {
  const userId = req.query.userId; // TODO: Get from auth
  const { cardNumber, expiryDate, cvv, cardHolder } = req.body;

  // TODO: Implement payment processing
  
  // Update subscription
  db.run(
    `UPDATE subscriptions 
     SET expires_at = datetime('now', '+1 year'),
         available_points = available_points + 1000,
         is_active = 1
     WHERE user_id = ?`,
    [userId],
    (err) => {
      if (err) {
        res.status(500).json({ error: 'Error al renovar la suscripción' });
        return;
      }
      res.json({ success: true });
    }
  );
});

export default router;