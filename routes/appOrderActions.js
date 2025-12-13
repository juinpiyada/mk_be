// routes/appOrderActions.js

const express = require('express');
const router = express.Router();
const db = require('../config/db_conn');  // Import database connection

// GET all actions for a specific order
router.get('/:order_id', async (req, res) => {
  const { order_id } = req.params;
  try {
    const result = await db.pool.query(
      'SELECT * FROM public.app_order_actions WHERE order_id = $1 ORDER BY created_at DESC',
      [order_id]
    );
    if (result.rows.length > 0) {
      res.json(result.rows);
    } else {
      res.status(404).json({ message: 'No actions found for this order.' });
    }
  } catch (err) {
    console.error('❌ Error fetching order actions:', err);
    res.status(500).json({ error: 'Error fetching order actions' });
  }
});

// POST a new order action
router.post('/', async (req, res) => {
  const { order_id, action_text, action_type, action_primary } = req.body;
  try {
    const result = await db.pool.query(
      'INSERT INTO public.app_order_actions (order_id, action_text, action_type, action_primary) VALUES ($1, $2, $3, $4) RETURNING *',
      [order_id, action_text, action_type, action_primary]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('❌ Error creating order action:', err);
    res.status(500).json({ error: 'Error creating order action' });
  }
});

// PUT (update) an order action by id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { action_text, action_type, action_primary } = req.body;
  try {
    const result = await db.pool.query(
      'UPDATE public.app_order_actions SET action_text = $1, action_type = $2, action_primary = $3, created_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
      [action_text, action_type, action_primary, id]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Order action not found' });
    }
  } catch (err) {
    console.error('❌ Error updating order action:', err);
    res.status(500).json({ error: 'Error updating order action' });
  }
});

// DELETE an order action by id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.pool.query(
      'DELETE FROM public.app_order_actions WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rows.length > 0) {
      res.json({ message: 'Order action deleted successfully' });
    } else {
      res.status(404).json({ message: 'Order action not found' });
    }
  } catch (err) {
    console.error('❌ Error deleting order action:', err);
    res.status(500).json({ error: 'Error deleting order action' });
  }
});

module.exports = router;
