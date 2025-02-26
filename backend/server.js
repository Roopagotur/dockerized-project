const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swagger');
const path = require('path');
const Item = require('./models/Item');
const app = express();

// Environment variables
const PORT = process.env.PORT || 5000;
const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://admin:password@localhost:27017/myappdb?authSource=admin';

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Serve static files for API documentation
app.use(express.static(path.join(__dirname, 'public')));

// Swagger Documentation
/**
 * @swagger
 * components:
 *   schemas:
 *     Item:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ID
 *         name:
 *           type: string
 *           description: Name of the item
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date and time when the item was created
 *       example:
 *         _id: 60d21b4667d0d8992e610c85
 *         name: Sample Item
 *         createdAt: 2023-11-12T10:30:15.123Z
 */

// Setup Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "Items API Documentation",
}));

// Generate API documentation homepage
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Items API Backend</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f7f7f7;
            color: #333;
          }
          .container {
            max-width: 1000px;
            margin: 0 auto;
            padding: 20px;
          }
          header {
            background-color: #0078d4;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
          }
          .content {
            background-color: white;
            padding: 30px;
            border-radius: 0 0 5px 5px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }
          h1 {
            margin: 0;
            font-weight: 400;
          }
          h2 {
            color: #0078d4;
            margin-top: 20px;
          }
          .endpoint {
            margin: 15px 0;
            padding: 15px;
            border-radius: 5px;
            border-left: 5px solid #0078d4;
            background-color: #f5f5f5;
          }
          .get { border-left-color: #61affe; }
          .post { border-left-color: #49cc90; }
          .put { border-left-color: #fca130; }
          .delete { border-left-color: #f93e3e; }
          .method {
            display: inline-block;
            padding: 5px 10px;
            border-radius: 3px;
            color: white;
            font-weight: bold;
            min-width: 80px;
            text-align: center;
          }
          .get-method { background-color: #61affe; }
          .post-method { background-color: #49cc90; }
          .put-method { background-color: #fca130; }
          .delete-method { background-color: #f93e3e; }
          .path {
            font-family: monospace;
            font-size: 16px;
            margin-left: 10px;
          }
          .description {
            margin-top: 10px;
            color: #555;
          }
          .button {
            display: inline-block;
            background-color: #0078d4;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 4px;
            margin-top: 20px;
            font-weight: 500;
            transition: background-color 0.2s;
          }
          .button:hover {
            background-color: #005a9e;
          }
          .status {
            margin-top: 30px;
            padding: 15px;
            background-color: #e6f7ff;
            border-left: 4px solid #1890ff;
            border-radius: 3px;
          }
          .database-info {
            margin-top: 20px;
            background-color: #f0f0f0;
            padding: 15px;
            border-radius: 5px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <header>
            <h1>Items API Backend</h1>
          </header>
          <div class="content">
            <div class="status">
              <strong>Status:</strong> API is running on port ${PORT}
              <br>
              <strong>Database:</strong> Connected to MongoDB (${DATABASE_URL.replace(/:password@/, ':****@')})
            </div>
            
            <h2>Available Endpoints</h2>
            
            <div class="endpoint get">
              <span class="method get-method">GET</span>
              <span class="path">/api/items</span>
              <div class="description">Retrieve all items from the database</div>
            </div>
            
            <div class="endpoint get">
              <span class="method get-method">GET</span>
              <span class="path">/api/items/:id</span>
              <div class="description">Retrieve a specific item by ID</div>
            </div>
            
            <div class="endpoint post">
              <span class="method post-method">POST</span>
              <span class="path">/api/items</span>
              <div class="description">Create a new item</div>
            </div>
            
            <div class="endpoint put">
              <span class="method put-method">PUT</span>
              <span class="path">/api/items/:id</span>
              <div class="description">Update an existing item</div>
            </div>
            
            <div class="endpoint delete">
              <span class="method delete-method">DELETE</span>
              <span class="path">/api/items/:id</span>
              <div class="description">Delete an item</div>
            </div>
            
            <div class="endpoint get">
              <span class="method get-method">GET</span>
              <span class="path">/api/db-info</span>
              <div class="description">Get database connection information</div>
            </div>
            
            <div class="database-info">
              <h3>Database Admin Interface</h3>
              <p>Access MongoDB Express admin interface at: <a href="http://localhost:8080" target="_blank">http://localhost:8080</a></p>
            </div>
            
            <a href="/api-docs" class="button">Interactive API Documentation</a>
          </div>
        </div>
      </body>
    </html>
  `);
});

// Database connection with authentication
console.log('Attempting to connect to MongoDB at:', DATABASE_URL.replace(/:password@/, ':****@'));

// Connect to MongoDB with retry logic
const connectWithRetry = () => {
  mongoose.connect(DATABASE_URL)
    .then(() => {
      console.log('Connected to MongoDB successfully');
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err);
      console.log('Retrying connection in 5 seconds...');
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();

// API Routes with Swagger Documentation

/**
 * @swagger
 * /api/items:
 *   post:
 *     summary: Create a new item
 *     tags: [Items]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the item
 *     responses:
 *       201:
 *         description: The item was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       400:
 *         description: Invalid input data
 */
app.post('/api/items', async (req, res) => {
  console.log('Received request to add item:', req.body);
  
  const item = new Item({
    name: req.body.name
  });

  try {
    const newItem = await item.save();
    console.log('Item saved successfully:', newItem);
    res.status(201).json(newItem);
  } catch (err) {
    console.error('Error adding item:', err);
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/items:
 *   get:
 *     summary: Retrieve all items
 *     tags: [Items]
 *     responses:
 *       200:
 *         description: A list of items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Item'
 *       500:
 *         description: Server error
 */
app.get('/api/items', async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    console.log('Items retrieved:', items.length);
    res.json(items);
  } catch (err) {
    console.error('Error getting items:', err);
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/items/{id}:
 *   get:
 *     summary: Get a single item by ID
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The item ID
 *     responses:
 *       200:
 *         description: Item details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       404:
 *         description: Item not found
 *       500:
 *         description: Server error
 */
app.get('/api/items/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (err) {
    console.error('Error getting item:', err);
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/items/{id}:
 *   put:
 *     summary: Update an item
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: New name for the item
 *     responses:
 *       200:
 *         description: The item was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       404:
 *         description: Item not found
 *       400:
 *         description: Invalid input data
 */
app.put('/api/items/:id', async (req, res) => {
  try {
    console.log('Updating item:', req.params.id, req.body);
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id, 
      { name: req.body.name },
      { new: true }
    );
    
    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    console.log('Item updated successfully:', updatedItem);
    res.json(updatedItem);
  } catch (err) {
    console.error('Error updating item:', err);
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/items/{id}:
 *   delete:
 *     summary: Delete an item
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The item ID
 *     responses:
 *       200:
 *         description: Item was deleted successfully
 *       404:
 *         description: Item not found
 *       500:
 *         description: Server error
 */
app.delete('/api/items/:id', async (req, res) => {
  try {
    console.log('Deleting item:', req.params.id);
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    
    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    console.log('Item deleted successfully');
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    console.error('Error deleting item:', err);
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/db-info:
 *   get:
 *     summary: Get database connection information
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Database connection information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 databaseUrl:
 *                   type: string
 *                   description: The database connection URL (password hidden)
 *                 databaseName:
 *                   type: string
 *                   description: The database name
 *                 connected:
 *                   type: boolean
 *                   description: Connection status
 *                 authEnabled:
 *                   type: boolean
 *                   description: Whether authentication is enabled
 *                 adminInterface:
 *                   type: string
 *                   description: URL to the admin interface
 */
app.get('/api/db-info', (req, res) => {
  // Hide password in the response
  const dbUrlForDisplay = DATABASE_URL.replace(/:password@/, ':****@');
  const dbName = DATABASE_URL.split('/').pop().split('?')[0];
  
  res.json({
    databaseUrl: dbUrlForDisplay,
    databaseName: dbName,
    connected: mongoose.connection.readyState === 1,
    authEnabled: true,
    adminInterface: 'Available at http://localhost:8080'
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
  console.log(`Database URL: ${DATABASE_URL.replace(/:password@/, ':****@')}`);
});