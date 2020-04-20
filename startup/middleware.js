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
  app.use('/static', express.static(path.join(__dirname, '../static')));

  app.use(
    express.json({
      verify(req, res, buf, encoding) {
        req.rawBody = buf.toString();
      },
    }),
  );

  app.use(passport.initialize());

  app.use(function(req, res, next) {
    if ((req.baseUrl + req.path).startsWith('/apiDocs')) return next();
    // TODO: Remove
    const defaultWrite = res.write;
    const defaultEnd = res.end;
    const chunks = [];

    res.write = (...restArgs) => {
      chunks.push(new Buffer(restArgs[0]));
      defaultWrite.apply(res, restArgs);
    };

    res.end = (...restArgs) => {
      if (restArgs[0]) {
        chunks.push(new Buffer(restArgs[0]));
      }
      const body = Buffer.concat(chunks).toString('utf8');

      let response;
      try {
        response = JSON.parse(body);
      } catch (error) {
        response = body;
      }

      winston.error(
        JSON.stringify({
          url: req.baseUrl + req.path,
          method: req.method,
          body: req.body,
          params: req.params,
          query: req.query,
          status: res.statusCode,
          response,
        }),
      );
      defaultEnd.apply(res, restArgs);
    };
    next();
  });
  initialiseAuthentication(app);
  require('./documentation')(app);

  // * Include application routers

  require('./routes')(app);

  app.use(celebrateError);
  app.use(error);

  winston.info('4/6 Setup router and middlewares');
};
