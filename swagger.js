// swagger.js (CommonJS version)

const swaggerAutogen = require('swagger-autogen')();  // Import swagger-autogen using require

// Define the output file for Swagger documentation
const outputFile = './swagger-output.json'; // Path to the output file

// Define the endpoint files (your routes)
const endpointFiles = ['./index.js']; // Make sure this points to your route definitions

// Define the Swagger documentation configuration
const doc = {
  info: {
    title: 'Mamma\'s Kitchen API', // API title
    description: 'API documentation for Mamma\'s Kitchen', // API description
    version: '1.0.0', // API version
  },
  host: 'localhost:9090', // API host
  basePath: '/', // Base path
  schemes: ['http'], // Supported protocols (http or https)
  consumes: ['application/json'],
  produces: ['application/json'],
};

// Generate Swagger documentation
swaggerAutogen(outputFile, endpointFiles, doc).then(() => {
  console.log('Swagger documentation has been generated successfully!');
});
