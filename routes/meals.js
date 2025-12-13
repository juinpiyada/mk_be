// routes/meals.js

const express = require('express');
const router = express.Router();
const db = require('../config/db_conn');  // Import database connection

// GET all meals
router.get('/', async (req, res) => {
  try {
    const result = await db.pool.query('SELECT * FROM public.meal ORDER BY meal_date DESC, start_time');
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching meals:', err);
    res.status(500).json({ error: 'Error fetching meals' });
  }
});

// GET a specific meal by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.pool.query('SELECT * FROM public.meal WHERE id = $1', [id]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Meal not found' });
    }
  } catch (err) {
    console.error('❌ Error fetching meal:', err);
    res.status(500).json({ error: 'Error fetching meal' });
  }
});

// POST a new meal
router.post('/', async (req, res) => {
  const { title, meal_type, meal_date, start_time, subtitle, starts_in_min, is_active } = req.body;
  try {
    const result = await db.pool.query(
      'INSERT INTO public.meal (title, meal_type, meal_date, start_time, subtitle, starts_in_min, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [title, meal_type, meal_date, start_time, subtitle, starts_in_min, is_active]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('❌ Error creating meal:', err);
    res.status(500).json({ error: 'Error creating meal' });
  }
});

// PUT (update) a meal by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, meal_type, meal_date, start_time, subtitle, starts_in_min, is_active } = req.body;
  try {
    const result = await db.pool.query(
      'UPDATE public.meal SET title = $1, meal_type = $2, meal_date = $3, start_time = $4, subtitle = $5, starts_in_min = $6, is_active = $7 WHERE id = $8 RETURNING *',
      [title, meal_type, meal_date, start_time, subtitle, starts_in_min, is_active, id]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Meal not found' });
    }
  } catch (err) {
    console.error('❌ Error updating meal:', err);
    res.status(500).json({ error: 'Error updating meal' });
  }
});

// DELETE a meal by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.pool.query('DELETE FROM public.meal WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length > 0) {
      res.json({ message: 'Meal deleted successfully' });
    } else {
      res.status(404).json({ message: 'Meal not found' });
    }
  } catch (err) {
    console.error('❌ Error deleting meal:', err);
    res.status(500).json({ error: 'Error deleting meal' });
  }
});

module.exports = router;
