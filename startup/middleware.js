/* eslint-disable global-require */
/* eslint-disable no-unused-vars */
const express = require('express');
const cors = require('cors');
const path = require('path');
const winston = require('winston');
const passport = require('passport');

const celebrateError = require('../api/middleware/celebrateError');
const error = require('../api/middleware/error');

const { initialiseAuthentication } = require('../api/middleware/auth');

module.exports = app => {
  app.options('*', cors()); // Update according to project
  app.use(cors());

  app.use(
    express.urlencoded({
      extended: false,
    }),
  );
  app.use(express.static(path.join(__dirname, '../public')));

  app.use(
    express.json({
      verify(req, res, buf, encoding) {
        req.rawBody = buf.toString();
      },
    }),
  );

  app.use(passport.initialize());
  initialiseAuthentication(app);
  require('./documentation')(app);

  // * Include application routers

  require('./routes')(app);

  app.use(celebrateError);
  app.use(error);

  winston.info('4/6 Setup router and middlewares');
};
