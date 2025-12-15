const { Pool } = require('pg');  // Import Pool from pg package
const dotenv = require('dotenv');  // Import dotenv to load environment variables

// Load environment variables from .env file (if you are using one)
dotenv.config();

// Create a new pool instance using environment variables
const pool = new Pool({
  host: process.env.PGHOST || 'hill-muskox-19491.j77.aws-ap-south-1.cockroachlabs.cloud', // Default host if not in .env
  port: process.env.PGPORT || 26257,  // Default port
  user: process.env.PGUSER || 'rajpiy',  // Default user
  password: process.env.PGPASSWORD || 'CkB0V1etSNaMYUmw-emD7w', // Default password
  database: process.env.PGDATABASE || 'defaultdb', // Default database
  ssl: {
    rejectUnauthorized: false,  // Ensure SSL is enabled for CockroachDB
    ca: process.env.PGSSLROOTCERT || '/path/to/cockroach-ca.crt',  // Optional: if using custom certificate
  },
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
