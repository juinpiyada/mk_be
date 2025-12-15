const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express'); // Swagger UI to serve the docs
const swaggerDocument = require('./swagger-output.json'); // Correct path to Swagger generated output.json

// Import the database connection
const db = require('./config/db_conn');

// Import route files
const usersRouter = require('./routes/users');
const loginRouter = require('./routes/login');
const auditlogRouter = require('./routes/auditlog');  // Add the audit log routes here
const appOrderItemsRouter = require('./routes/appOrderItems'); // Import appOrderItems routes
const appOrderActionsRouter = require('./routes/appOrderActions'); // Import appOrderActions routes
const appOrdersRouter = require('./routes/appOrders'); // Import appOrders routes
const mealsRouter = require('./routes/meals'); // Import meals routes
const menuItemsRouter = require('./routes/menuItems'); // Import menuItems routes
const sustainabilityTagsRouter = require('./routes/sustainabilityTags'); // Import sustainabilityTags routes

// Load environment variables from .env file
dotenv.config();

// Initialize the Express app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Serve Swagger documentation at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  swaggerOptions: {
    url: 'https://mk-be.vercel.app/swagger-output.json', // Use your deployed Swagger JSON path here
  }
}));

// Routes
app.use('/api/users', usersRouter);        // Use users routes here
app.use('/api/login', loginRouter);        // Use login routes here
app.use('/api/auditlog', auditlogRouter);  // Use audit log routes here
app.use('/api/order-items', appOrderItemsRouter); // Use appOrderItems routes here
app.use('/api/order-actions', appOrderActionsRouter); // Use appOrderActions routes here
app.use('/api/orders', appOrdersRouter); // Use appOrders routes here
app.use('/api/meals', mealsRouter); // Use meals routes here
app.use('/api/menu-items', menuItemsRouter); // Use menuItems routes here
app.use('/api/sustainability-tags', sustainabilityTagsRouter); // Use sustainabilityTags routes here

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
