// routes/auditlog.js

const express = require('express');
const router = express.Router();
const db = require('../config/db_conn');

// GET all audit logs for a user
router.get('/:user_id', async (req, res) => {
  const { user_id } = req.params;
  try {
    const result = await db.pool.query(
      'SELECT * FROM public.audit_log WHERE user_id = $1 ORDER BY action_time DESC',
      [user_id]
    );
    if (result.rows.length > 0) {
      res.json(result.rows);
    } else {
      res.status(404).json({ message: 'No audit logs found for this user.' });
    }
  } catch (err) {
    console.error('❌ Error fetching audit logs:', err);
    res.status(500).json({ error: 'Error fetching audit logs' });
  }
});

// POST a new audit log (record an action)
router.post('/', async (req, res) => {
  const { user_id, action, details } = req.body;
  const audit_id = `audit_${Math.floor(Math.random() * 1000)}`; // Example audit_id generation, use your trigger to handle this automatically.
  try {
    const result = await db.pool.query(
      'INSERT INTO public.audit_log (audit_id, user_id, action, details) VALUES ($1, $2, $3, $4) RETURNING *',
      [audit_id, user_id, action, details]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('❌ Error recording audit log:', err);
    res.status(500).json({ error: 'Error recording audit log' });
  }
});

// PUT (update) an audit log by audit_id
router.put('/:audit_id', async (req, res) => {
  const { audit_id } = req.params;
  const { action, details } = req.body;
  try {
    const result = await db.pool.query(
      'UPDATE public.audit_log SET action = $1, details = $2, action_time = CURRENT_TIMESTAMP WHERE audit_id = $3 RETURNING *',
      [action, details, audit_id]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Audit log not found' });
    }
  } catch (err) {
    console.error('❌ Error updating audit log:', err);
    res.status(500).json({ error: 'Error updating audit log' });
  }
});

// DELETE an audit log by audit_id
router.delete('/:audit_id', async (req, res) => {
  const { audit_id } = req.params;
  try {
    const result = await db.pool.query(
      'DELETE FROM public.audit_log WHERE audit_id = $1 RETURNING *',
      [audit_id]
    );
    if (result.rows.length > 0) {
      res.json({ message: 'Audit log deleted successfully' });
    } else {
      res.status(404).json({ message: 'Audit log not found' });
    }
  } catch (err) {
    console.error('❌ Error deleting audit log:', err);
    res.status(500).json({ error: 'Error deleting audit log' });
  }
});

module.exports = router;
