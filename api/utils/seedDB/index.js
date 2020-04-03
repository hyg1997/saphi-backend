/* eslint-disable global-require */
const winston = require('winston');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const moment = require('moment');

require('../../../startup/config')();
require('../../../startup/logging')();

const config = require('config');
const { Menu } = require('../../nutrition/menu/menuModel');
const { Aliment } = require('../../nutrition/aliment/alimentModel');
const { Company } = require('../../auth/company/companyModel');
const { DishRecipe } = require('../../nutrition/dishRecipe/dishRecipeModel');
const {
  DeliveryPlan,
} = require('../../nutrition/deliveryPlan/deliveryPlanModel');

const { asyncForEach } = require('../../utils');

const seedModel = async (
  model,
  filename,
  clearCollection = true,
  filterFun = obj => {
    return true;
  },
) => {
  const rawdata = fs.readFileSync(path.join(__dirname, filename));
  if (clearCollection) {
    await model.deleteMany({});
  }
  await model.insertMany(JSON.parse(rawdata).filter(filterFun));
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
    // await seedModel(DeliveryPlan, 'deliveryPlan.json');
    // await seedModel(DishRecipe, 'dishRecipe.json');
    // await seedModel(Menu, 'menu.json', true, obj => {
    //   return moment(obj.date).isoWeekday() < 6;
    // });
    // await seedModel(Aliment, 'aliments.json');
    await seedModel(Company, 'company.json');
    mongoose.connection.close();
  })
  .catch(err => console.log(`Failed to connect to MongoDB...${String(err)}`));
