// routes/appOrderItems.js

const express = require('express');
const router = express.Router();
const db = require('../config/db_conn');  // Import database connection

// GET all items for a specific order
router.get('/:order_id', async (req, res) => {
  const { order_id } = req.params;
  try {
    const result = await db.pool.query(
      'SELECT * FROM public.app_order_items WHERE order_id = $1 ORDER BY created_at DESC',
      [order_id]
    );
    if (result.rows.length > 0) {
      res.json(result.rows);
    } else {
      res.status(404).json({ message: 'No items found for this order.' });
    }
  } catch (err) {
    console.error('❌ Error fetching order items:', err);
    res.status(500).json({ error: 'Error fetching order items' });
  }
});

// POST a new order item
router.post('/', async (req, res) => {
  const { order_id, item_name, qty, unit_price } = req.body;
  try {
    const result = await db.pool.query(
      'INSERT INTO public.app_order_items (order_id, item_name, qty, unit_price) VALUES ($1, $2, $3, $4) RETURNING *',
      [order_id, item_name, qty, unit_price]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('❌ Error creating order item:', err);
    res.status(500).json({ error: 'Error creating order item' });
  }
});

// PUT (update) an order item by id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { item_name, qty, unit_price } = req.body;
  try {
    const result = await db.pool.query(
      'UPDATE public.app_order_items SET item_name = $1, qty = $2, unit_price = $3, created_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
      [item_name, qty, unit_price, id]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Order item not found' });
    }
  } catch (err) {
    console.error('❌ Error updating order item:', err);
    res.status(500).json({ error: 'Error updating order item' });
  }
});

// DELETE an order item by id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.pool.query(
      'DELETE FROM public.app_order_items WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rows.length > 0) {
      res.json({ message: 'Order item deleted successfully' });
    } else {
      res.status(404).json({ message: 'Order item not found' });
    }
  } catch (err) {
    console.error('❌ Error deleting order item:', err);
    res.status(500).json({ error: 'Error deleting order item' });
  }
});

module.exports = router;
