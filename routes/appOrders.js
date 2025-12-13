// routes/appOrders.js

const express = require('express');
const router = express.Router();
const db = require('../config/db_conn');  // Import database connection

// GET all orders
router.get('/', async (req, res) => {
  try {
    const result = await db.pool.query('SELECT * FROM public.app_orders ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching orders:', err);
    res.status(500).json({ error: 'Error fetching orders' });
  }
});

// GET a specific order by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.pool.query('SELECT * FROM public.app_orders WHERE id = $1', [id]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (err) {
    console.error('❌ Error fetching order:', err);
    res.status(500).json({ error: 'Error fetching order' });
  }
});

// POST a new order
router.post('/', async (req, res) => {
  const { order_no, user_id, title, subtitle, price_amount, currency, image_url, status, status_text, is_active } = req.body;
  try {
    const result = await db.pool.query(
      'INSERT INTO public.app_orders (order_no, user_id, title, subtitle, price_amount, currency, image_url, status, status_text, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
      [order_no, user_id, title, subtitle, price_amount, currency, image_url, status, status_text, is_active]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('❌ Error creating order:', err);
    res.status(500).json({ error: 'Error creating order' });
  }
});

// PUT (update) an order by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { order_no, user_id, title, subtitle, price_amount, currency, image_url, status, status_text, is_active } = req.body;
  try {
    const result = await db.pool.query(
      'UPDATE public.app_orders SET order_no = $1, user_id = $2, title = $3, subtitle = $4, price_amount = $5, currency = $6, image_url = $7, status = $8, status_text = $9, is_active = $10, updated_at = CURRENT_TIMESTAMP WHERE id = $11 RETURNING *',
      [order_no, user_id, title, subtitle, price_amount, currency, image_url, status, status_text, is_active, id]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (err) {
    console.error('❌ Error updating order:', err);
    res.status(500).json({ error: 'Error updating order' });
  }
});

// DELETE an order by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.pool.query('DELETE FROM public.app_orders WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length > 0) {
      res.json({ message: 'Order deleted successfully' });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (err) {
    console.error('❌ Error deleting order:', err);
    res.status(500).json({ error: 'Error deleting order' });
  }
});

module.exports = router;
