// routes/login.js

const express = require('express');
const router = express.Router();
const db = require('../config/db_conn');

// GET all login attempts for a user
router.get('/:user_id', async (req, res) => {
  const { user_id } = req.params;
  try {
    const result = await db.pool.query(
      'SELECT * FROM public.master_login WHERE user_id = $1 ORDER BY login_time DESC',
      [user_id]
    );
    if (result.rows.length > 0) {
      res.json(result.rows);
    } else {
      res.status(404).json({ message: 'No login attempts found for this user.' });
    }
  } catch (err) {
    console.error('❌ Error fetching login attempts:', err);
    res.status(500).json({ error: 'Error fetching login attempts' });
  }
});

// POST a new login attempt (record a login)
router.post('/', async (req, res) => {
  const { user_id, ip_address, user_agent, login_status } = req.body;
  const login_id = `login_${Math.floor(Math.random() * 1000)}`; // Example login_id generation, use your trigger to handle this automatically.
  try {
    const result = await db.pool.query(
      'INSERT INTO public.master_login (login_id, user_id, ip_address, user_agent, login_status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [login_id, user_id, ip_address, user_agent, login_status]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('❌ Error recording login attempt:', err);
    res.status(500).json({ error: 'Error recording login attempt' });
  }
});

// PUT (update) a login attempt by login_id
router.put('/:login_id', async (req, res) => {
  const { login_id } = req.params;
  const { ip_address, user_agent, login_status, failed_attempts, last_failed_attempt } = req.body;
  try {
    const result = await db.pool.query(
      'UPDATE public.master_login SET ip_address = $1, user_agent = $2, login_status = $3, failed_attempts = $4, last_failed_attempt = $5 WHERE login_id = $6 RETURNING *',
      [ip_address, user_agent, login_status, failed_attempts, last_failed_attempt, login_id]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Login attempt not found' });
    }
  } catch (err) {
    console.error('❌ Error updating login attempt:', err);
    res.status(500).json({ error: 'Error updating login attempt' });
  }
});

// DELETE a login attempt by login_id
router.delete('/:login_id', async (req, res) => {
  const { login_id } = req.params;
  try {
    const result = await db.pool.query(
      'DELETE FROM public.master_login WHERE login_id = $1 RETURNING *',
      [login_id]
    );
    if (result.rows.length > 0) {
      res.json({ message: 'Login attempt deleted successfully' });
    } else {
      res.status(404).json({ message: 'Login attempt not found' });
    }
  } catch (err) {
    console.error('❌ Error deleting login attempt:', err);
    res.status(500).json({ error: 'Error deleting login attempt' });
  }
});

module.exports = router;
