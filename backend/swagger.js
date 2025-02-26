// Install required dependencies
// npm install swagger-ui-express swagger-jsdoc --save

// backend/swagger.js
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Items API Documentation',
      version: '1.0.0',
      description: 'API documentation for the Items CRUD operations',
    },
    servers: [
      {
        url: 'http://localhost:3006',
        description: 'Development server',
      },
    ],
  },
  apis: ['./routes/*.js', './server.js'], // Path to the API docs
};

const specs = swaggerJsdoc(options);

module.exports = specs;