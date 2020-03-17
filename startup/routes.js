/* eslint-disable no-unused-vars */
/* eslint-disable func-names */
const express = require('express');
const cors = require('cors');
const path = require('path');
const winston = require('winston');
const passport = require('passport');

const celebrateError = require('../api/middleware/celebrateError');
const error = require('../api/middleware/error');

// Routers for applications
// const menuRouter = require('../api/nutrition/menu/menuRouter');
// const alimentRouter = require('../api/nutrition/aliment/alimentRouter');
const nutritionRouter = require('../api/nutrition/nutritionRouter');
const paymentRouter = require('../api/payment/PaymentRouter');
const authRouter = require('../api/auth/authRouter');
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
      verify (req, res, buf, encoding) {
        req.rawBody = buf.toString();
      },
    }),
  );

  app.use(passport.initialize());
  initialiseAuthentication(app);

  // app.use('/menus', menuRouter);
  // app.use('/aliments', alimentRouter);

  app.use('/auth', authRouter);
  app.use('/', nutritionRouter);
  app.use('/payment', paymentRouter);

  app.use(celebrateError);
  app.use(error);

  winston.info('4/6 Setup router and middlewares');
};
