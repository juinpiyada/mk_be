const express = require('express');
const router = express.Router();
const db = require('../config/db_conn');

// GET all users
router.get('/', async (req, res) => {
  try {
    const result = await db.pool.query('SELECT * FROM public.master_user');
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching users:', err);
    res.status(500).json({ error: 'Error fetching users' });
  }
});

// GET a user by user_id
router.get('/:user_id', async (req, res) => {
  const { user_id } = req.params;
  try {
    const result = await db.pool.query('SELECT * FROM public.master_user WHERE user_id = $1', [user_id]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    console.error('❌ Error fetching user:', err);
    res.status(500).json({ error: 'Error fetching user' });
  }
});

// POST a new user
router.post('/', async (req, res) => {
  const { username, email, password, role } = req.body;
  const user_id = `user_${Math.floor(Math.random() * 1000)}`; // Example user_id generation. Use your trigger to handle this automatically.
  try {
    const result = await db.pool.query(
      'INSERT INTO public.master_user (user_id, username, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [user_id, username, email, password, role]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('❌ Error creating user:', err);
    res.status(500).json({ error: 'Error creating user' });
  }
});

// PUT (update) a user by user_id
router.put('/:user_id', async (req, res) => {
  const { user_id } = req.params;
  const { username, email, password, role } = req.body;
  try {
    const result = await db.pool.query(
      'UPDATE public.master_user SET username = $1, email = $2, password = $3, role = $4, updated_at = CURRENT_TIMESTAMP WHERE user_id = $5 RETURNING *',
      [username, email, password, role, user_id]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    console.error('❌ Error updating user:', err);
    res.status(500).json({ error: 'Error updating user' });
  }
});

// DELETE a user by user_id
router.delete('/:user_id', async (req, res) => {
  const { user_id } = req.params;
  try {
    const result = await db.pool.query(
      'DELETE FROM public.master_user WHERE user_id = $1 RETURNING *',
      [user_id]
    );
    if (result.rows.length > 0) {
      res.json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    console.error('❌ Error deleting user:', err);
    res.status(500).json({ error: 'Error deleting user' });
  }
});

module.exports = router;
