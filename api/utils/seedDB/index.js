/* eslint-disable no-unused-vars */
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
const { Company } = require('../../business/company/companyModel');
const { DishRecipe } = require('../../nutrition/dishRecipe/dishRecipeModel');
const {
  DeliveryPlan,
} = require('../../nutrition/deliveryPlan/deliveryPlanModel');
const { Plan } = require('../../payment/plan/planModel');
const { Pathology } = require('../../nutrition/pathology/pathologyModel');

const { Quiz } = require('../../wellness/quiz/quiz.model');
const { Chapter, Module } = require('../../wellness/chapter/chapter.model');

const { asyncForEach } = require('../../utils');

const seedModel = async (
  model,
  filename,
  clearCollection = true,
  filterFun = obj => {
    return true;
  },
  transformFun = obj => obj,
) => {
  const rawdata = fs.readFileSync(path.join(__dirname, filename));
  if (clearCollection) {
    try {
      await model.collection.drop();
    } catch (error) {}
  }
  await model.insertMany(
    JSON.parse(rawdata)
      .filter(filterFun)
      .map(transformFun),
  );
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
    // await seedModel(
    //   Company,
    //   'company.json',
    //   true,
    //   obj => true,
    //   obj => {
    //     obj.users = obj.users.map(u => {
    //       u.idDocumentNumber = u.idDocumentNumber.toString();
    //       return u;
    //     });
    //     return obj;
    //   },
    // );
    // await seedModel(Plan, 'plan.json');
    // await seedModel(Pathology, 'pathologies.json');

    // ? Mental Health

    // await seedModel(Quiz, 'quiz.json');
    // await seedModel(Module, 'modules.json');
    await seedModel(Chapter, 'chapters.json');

    mongoose.connection.close();
  })
  .catch(err => console.log(`Failed to connect to MongoDB...${String(err)}`));
