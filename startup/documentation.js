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

// -- setup up swagger-jsdoc --
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Saphi API',
    version: '1.0.0',
    description:
      'API for development team\neyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwbGFuU3Vic2NyaXB0aW9uIjp7ImFjdGl2ZSI6ZmFsc2V9LCJwZXJtaXNzaW9ucyI6eyJpc0FkbWluIjp0cnVlLCJpc1BhdGllbnQiOnRydWUsImlzQ29tcGFueSI6ZmFsc2V9LCJwYXRob2xvZ2llcyI6W10sIm90aGVyUGF0aG9sb2d5IjoiIiwib25ib2FyZGluZ0ZpbmlzaGVkIjpmYWxzZSwiYWN0aXZlRGlldCI6ZmFsc2UsInNwZWNpYWxEaWV0IjpmYWxzZSwiX2lkIjoiNWViMGEyZDgzNjk0OTIwMDE4ZjUwMmRjIiwiaWREb2N1bWVudFR5cGUiOiJETkkiLCJpZERvY3VtZW50TnVtYmVyIjoiMDEwMTAxMDEiLCJlbWFpbCI6ImFkbWluQGNvcnJlby5jb20iLCJuYW1lIjoiaG9sYSIsImxhc3ROYW1lIjoidGVzdCIsInBob25lUHJlZml4IjoiKzUxIiwicGhvbmVOdW1iZXIiOiI5ODc2NTQzMjEiLCJjb21wYW55TmFtZSI6IkVtcHJlc2EgUHJ1ZWJhIiwiY3JlYXRlZEF0IjoiMjAyMC0wNS0wNFQyMzoxODo0OC4wNDBaIiwidXBkYXRlZEF0IjoiMjAyMC0wNS0wNFQyMzoxODo0OC4wNDBaIiwiX192IjowLCJpYXQiOjE1ODg4OTA5MTd9.8rOqv9azX7EmSPZ2F-ud4iZSBFvCCSIOFDq6xsugs8I',
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
