/* eslint-disable global-require */
const winston = require('winston');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

require('../../../startup/config')();
require('../../../startup/logging')();

const config = require('config');
const { Menu } = require('../../nutrition/menu/menuModel');

const { asyncForEach } = require('../../utils');

const seedModel = async (model, filename) => {
  const rawdata = fs.readFileSync(path.join(__dirname, filename));
  await model.insertMany(JSON.parse(rawdata));
  winston.info(`${model.collection.collectionName} seeded!`);
  return 1;
};

const seedModelOneByOne = async (model, filename, clearCollection = true) => {
  if (clearCollection) {
    await model.deleteMany({});
  }
  const rawdata = fs.readFileSync(path.join(__dirname, filename));

  await asyncForEach(JSON.parse(rawdata), async data => model.create(data));
  winston.info(`${model.collection.collectionName} seeded!`);
  return 1;
};

const seedModelByService = async (model, filename, service) => {
  const rawData = fs.readFileSync(path.join(__dirname, filename));

  await asyncForEach(JSON.parse(rawData), async data => service(data));
  winston.info(`${model.collection.collectionName} seeded!`);
  return 1;
};

mongoose
  .connect(config.get('dbConfig'), {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(async () => {
    await seedModelOneByOne(Menu, 'menu.json');
    mongoose.connection.close();
  })
  .catch(err => console.log('Failed to connect to MongoDB...'));
