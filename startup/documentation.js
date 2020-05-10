/* eslint-disable no-unused-vars */
/* eslint-disable func-names */
const express = require('express');
const cors = require('cors');
const path = require('path');
const winston = require('winston');
const passport = require('passport');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const celebrateError = require('../api/middleware/celebrateError');
const error = require('../api/middleware/error');

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZWIwYTJkODM2OTQ5MjAwMThmNTAyZGMiLCJpZERvY3VtZW50VHlwZSI6IkROSSIsImlkRG9jdW1lbnROdW1iZXIiOiIwMTAxMDEwMSIsImVtYWlsIjoiYWRtaW5AY29ycmVvLmNvbSIsIm5hbWUiOiJob2xhIiwibGFzdE5hbWUiOiJ0ZXN0IiwicGVybWlzc2lvbnMiOnsiaXNBZG1pbiI6dHJ1ZSwiaXNQYXRpZW50Ijp0cnVlLCJpc0NvbXBhbnkiOmZhbHNlfSwib25ib2FyZGluZ0ZpbmlzaGVkIjpmYWxzZSwiYWN0aXZlRGlldCI6ZmFsc2UsInNwZWNpYWxEaWV0IjpmYWxzZSwiaWF0IjoxNTg5MDczMjQxfQ.W8H_GYYRjQYKYrlYG2sAjIvjPDizJ7VrpBJzt-1sgyI';

// -- setup up swagger-jsdoc --
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Saphi API',
    version: '1.0.0',
    description: `API for development team\n${token}`,
    license: {
      name: 'MIT',
      url: 'https://choosealicense.com/licenses/mit/',
    },
    contact: {
      email: 'soluciones@papercube.pe',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local server',
    },
    {
      url: 'http://saphi-backend.eba-jdzyfpds.us-east-1.elasticbeanstalk.com',
      description: 'Development server',
    },
  ],
  tags: [
    {
      name: 'auth',
      description: 'Authentication services',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: [path.join(__dirname, '../api/**/*.openapi.yml')],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = app => {
  app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  app.use(
    '/apiDocs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      explorer: true,
    }),
  );

  winston.info('4/6 Documentation setted up');
};
