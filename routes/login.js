const express = require('express');
const router = express.Router();
const db = require('../config/db_conn');

// POST: Login API (Create User if not exists and Login)
router.post('/', async (req, res) => {
  const { email, password, ip_address, user_agent } = req.body;

  try {
    // Step 1: Check if the user exists in the master_user table
    let userResult = await db.pool.query('SELECT * FROM public.master_user WHERE email = $1', [email]);
    let user = userResult.rows[0];

    if (!user) {
      // Step 2: User doesn't exist, create a new user
      const user_id = `user_${Math.floor(Math.random() * 1000)}`; // Generate a unique user_id
      
      // Insert new user into master_user table
      const createUser = await db.pool.query(
        'INSERT INTO public.master_user (user_id, username, email, password, role, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *',
        [user_id, 'New User', email, password, 'user'] // Default role: 'user'
      );
      user = createUser.rows[0];
    }

    // Step 3: Compare the provided password with the stored password (plain text comparison)
    if (password !== user.password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Step 4: Log the login attempt in the master_login table
    const login_id = `login_${Math.floor(Math.random() * 1000)}`;  // Generate login ID
    await db.pool.query(
      'INSERT INTO public.master_login (login_id, user_id, ip_address, user_agent, login_status) VALUES ($1, $2, $3, $4, $5)',
      [login_id, user.user_id, ip_address, user_agent, 'success']
    );

    // Step 5: Return success response with user details (excluding password)
    res.json({
      user_id: user.user_id,
      email: user.email,
      role: user.role,
    });
    
  } catch (err) {
    console.error('❌ Error during login or user creation:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
