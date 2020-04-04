/* eslint-disable global-require */
const express = require('express');

const app = express();

require('./startup/config')();
require('./startup/logging')();
require('./startup/validation')();
require('./startup/middleware')(app);
require('./startup/db')();

if (process.env.NODE_ENV === 'production') {
  require('./startup/prod')(app);
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

module.exports = app;
