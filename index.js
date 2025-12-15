const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express'); // Swagger UI to serve the docs
const path = require('path');
const swaggerDocument = require('./swagger-output.json'); // Correct path to Swagger generated output.json

// Import the database connection
const db = require('./config/db_conn');

// Import route files
const usersRouter = require('./routes/users');
const loginRouter = require('./routes/login');
const auditlogRouter = require('./routes/auditlog');
const appOrderItemsRouter = require('./routes/appOrderItems');
const appOrderActionsRouter = require('./routes/appOrderActions');
const appOrdersRouter = require('./routes/appOrders');
const mealsRouter = require('./routes/meals');
const menuItemsRouter = require('./routes/menuItems');
const sustainabilityTagsRouter = require('./routes/sustainabilityTags');

// Load environment variables from .env file
dotenv.config();

// Initialize the Express app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Serve static files (like index.html) from the "public" directory
app.use(express.static('public'));  // This will serve the public/index.html file

// Serve Swagger documentation at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  swaggerOptions: {
    url: '/swagger-output.json',  // Serve the Swagger JSON file from the public directory
  }
}));

// Serve Swagger JSON from the public folder
app.get('/swagger-output.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'swagger-output.json'));  // Ensure the correct path to swagger-output.json
});

// Serve index.html at /api/leo route
app.get('/api/leo', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));  // Ensure the correct path to index.html
});

// Routes for API
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use('/api/auditlog', auditlogRouter);
app.use('/api/order-items', appOrderItemsRouter);
app.use('/api/order-actions', appOrderActionsRouter);
app.use('/api/orders', appOrdersRouter);
app.use('/api/meals', mealsRouter);
app.use('/api/menu-items', menuItemsRouter);
app.use('/api/sustainability-tags', sustainabilityTagsRouter);

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'Mamma\'s Kitchen API is running 🚀' });
});

// Establish database connection and start the server
async function startServer() {
  try {
    // Test the database connection
    await db.connect();
    console.log('✅ Database connected successfully');

    // Start the server after successful database connection
    const PORT = process.env.PORT || 9090;
    app.listen(PORT, () => {
      console.log(`✅ Server listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Database connection failed. Server not started.');
  }
}

startServer();
