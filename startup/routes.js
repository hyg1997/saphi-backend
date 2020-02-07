/* eslint-disable func-names */
const express = require('express');
const cors = require('cors');
const path = require('path');

const indexRouter = require('../routes/index');
const usersRouter = require('../routes/users');

const celebrateError = require('../api/middleware/celebrateError');
const error = require('../api/middleware/error');

module.exports = app => {
  app.options('*', cors());
  app.use(cors());

  app.use(
    express.urlencoded({
      extended: false
    })
  );
  app.use(express.static(path.join(__dirname, '../public')));

  app.use(
    express.json({
      verify(req, res, buf, encoding) {
        req.rawBody = buf.toString();
      }
    })
  );

  app.use('/', indexRouter);
  app.use('/users', usersRouter);

  app.use(celebrateError);
  app.use(error);
};
