// config/db_conn.js

const { Pool } = require('pg');  // Import Pool from pg package
const dotenv = require('dotenv');  // Import dotenv to load environment variables

// Load environment variables from .env file
dotenv.config();

// Create a new pool instance using environment variables
const pool = new Pool({
  host: process.env.PGHOST,         // PostgreSQL host
  port: process.env.PGPORT,         // PostgreSQL port
  user: process.env.PGUSER,         // PostgreSQL user
  password: process.env.PGPASSWORD, // PostgreSQL password
  database: process.env.PGDATABASE, // PostgreSQL database name
});

// Function to check the connection
const connect = async () => {
  try {
    const result = await pool.query('SELECT NOW()');  // Simple query to test the connection
    console.log('✅ Database connected successfully at:', result.rows[0].now);
  } catch (err) {
    console.error('❌ Database connection failed:', err);
    throw err;  // Rethrow the error so the app can handle it
  }
};

// Export pool and connect function for use in other parts of the app
module.exports = { pool, connect };
