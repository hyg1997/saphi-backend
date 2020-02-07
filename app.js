const express = require('express');

const app = express();

require('./startup/config')();
require('./startup/validation')();
require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/prod')(app);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


module.exports = app;
