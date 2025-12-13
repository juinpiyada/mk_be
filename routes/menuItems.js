// routes/menuItems.js

const express = require('express');
const router = express.Router();
const db = require('../config/db_conn');  // Import database connection

// GET all menu items
router.get('/', async (req, res) => {
  try {
    const result = await db.pool.query('SELECT * FROM public.menu_item ORDER BY display_order');
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching menu items:', err);
    res.status(500).json({ error: 'Error fetching menu items' });
  }
});

// GET a specific menu item by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.pool.query('SELECT * FROM public.menu_item WHERE id = $1', [id]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Menu item not found' });
    }
  } catch (err) {
    console.error('❌ Error fetching menu item:', err);
    res.status(500).json({ error: 'Error fetching menu item' });
  }
});

// POST a new menu item
router.post('/', async (req, res) => {
  const { meal_id, name, description, price_paise, tag_id, servings_total, servings_left, image_url, display_order, is_active } = req.body;
  try {
    const result = await db.pool.query(
      'INSERT INTO public.menu_item (meal_id, name, description, price_paise, tag_id, servings_total, servings_left, image_url, display_order, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
      [meal_id, name, description, price_paise, tag_id, servings_total, servings_left, image_url, display_order, is_active]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('❌ Error creating menu item:', err);
    res.status(500).json({ error: 'Error creating menu item' });
  }
});

// PUT (update) a menu item by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { meal_id, name, description, price_paise, tag_id, servings_total, servings_left, image_url, display_order, is_active } = req.body;
  try {
    const result = await db.pool.query(
      'UPDATE public.menu_item SET meal_id = $1, name = $2, description = $3, price_paise = $4, tag_id = $5, servings_total = $6, servings_left = $7, image_url = $8, display_order = $9, is_active = $10 WHERE id = $11 RETURNING *',
      [meal_id, name, description, price_paise, tag_id, servings_total, servings_left, image_url, display_order, is_active, id]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Menu item not found' });
    }
  } catch (err) {
    console.error('❌ Error updating menu item:', err);
    res.status(500).json({ error: 'Error updating menu item' });
  }
});

// DELETE a menu item by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.pool.query('DELETE FROM public.menu_item WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length > 0) {
      res.json({ message: 'Menu item deleted successfully' });
    } else {
      res.status(404).json({ message: 'Menu item not found' });
    }
  } catch (err) {
    console.error('❌ Error deleting menu item:', err);
    res.status(500).json({ error: 'Error deleting menu item' });
  }
});

module.exports = router;
