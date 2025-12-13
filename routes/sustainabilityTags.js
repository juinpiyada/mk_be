// routes/sustainabilityTags.js

const express = require('express');
const router = express.Router();
const db = require('../config/db_conn');  // Import database connection

// GET all sustainability tags
router.get('/', async (req, res) => {
  try {
    const result = await db.pool.query('SELECT * FROM public.sustainability_tag ORDER BY code');
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching sustainability tags:', err);
    res.status(500).json({ error: 'Error fetching sustainability tags' });
  }
});

// GET a specific sustainability tag by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.pool.query('SELECT * FROM public.sustainability_tag WHERE id = $1', [id]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Sustainability tag not found' });
    }
  } catch (err) {
    console.error('❌ Error fetching sustainability tag:', err);
    res.status(500).json({ error: 'Error fetching sustainability tag' });
  }
});

// POST a new sustainability tag
router.post('/', async (req, res) => {
  const { code, label, icon_hint, color_hex } = req.body;
  try {
    const result = await db.pool.query(
      'INSERT INTO public.sustainability_tag (code, label, icon_hint, color_hex) VALUES ($1, $2, $3, $4) RETURNING *',
      [code, label, icon_hint, color_hex]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('❌ Error creating sustainability tag:', err);
    res.status(500).json({ error: 'Error creating sustainability tag' });
  }
});

// PUT (update) a sustainability tag by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { code, label, icon_hint, color_hex } = req.body;
  try {
    const result = await db.pool.query(
      'UPDATE public.sustainability_tag SET code = $1, label = $2, icon_hint = $3, color_hex = $4 WHERE id = $5 RETURNING *',
      [code, label, icon_hint, color_hex, id]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Sustainability tag not found' });
    }
  } catch (err) {
    console.error('❌ Error updating sustainability tag:', err);
    res.status(500).json({ error: 'Error updating sustainability tag' });
  }
});

// DELETE a sustainability tag by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.pool.query('DELETE FROM public.sustainability_tag WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length > 0) {
      res.json({ message: 'Sustainability tag deleted successfully' });
    } else {
      res.status(404).json({ message: 'Sustainability tag not found' });
    }
  } catch (err) {
    console.error('❌ Error deleting sustainability tag:', err);
    res.status(500).json({ error: 'Error deleting sustainability tag' });
  }
});

module.exports = router;
