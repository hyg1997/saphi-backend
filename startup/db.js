// * Setup for mongoDB
const mongoose = require('mongoose');
const config = require('config');
const winston = require('winston');

module.exports = () => {
  //const db = config.get('dbConfig');
  const db =
    'mongodb+srv://dbUser:root@max-import-dev-uysel.mongodb.net/test?retryWrites=true&w=majority';
  mongoose
    .connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: true,
    })
    .then(() => winston.info(`2/6 Connected to ${db}...`));
};
