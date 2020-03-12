/* eslint-disable global-require */
const express = require('express');

const app = express();

require('./startup/config')();
require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/validation')();
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'production') {
  require('./startup/prod')(app);
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

module.exports = app;
