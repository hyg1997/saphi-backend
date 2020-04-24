/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
const winston = require('winston');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const moment = require('moment');

require('../../../startup/config')();
require('../../../startup/logging')();

const config = require('config');
const userService = require('../../auth/user/userService');
const dietService = require('../../nutrition/diet/dietUtils');
const { User } = require('../../../api/auth/user/userModel');

const data = [
  {
    email: 'saphi_user1@gmail.com',
    password: 'pass123',
    birthDate: '2000-01-01',
    indicators: {
      idObjective: 0,
      sex: 'M',
      weight: 95,
      height: 170,
      bodyFatPercentage: 30,
      idPhysicalActivity: 1,
    },
  },
  {
    email: 'saphi_user2@gmail.com',
    password: 'pass123',
    birthDate: '1995-01-01',
    indicators: {
      idObjective: 1,
      sex: 'M',
      weight: 80,
      height: 180,
      bodyFatPercentage: 22,
      idPhysicalActivity: 1,
    },
  },
  {
    email: 'saphi_user3@gmail.com',
    password: 'pass123',
    birthDate: '1990-01-01',
    indicators: {
      idObjective: 2,
      sex: 'M',
      weight: 75,
      height: 180,
      bodyFatPercentage: 17,
      idPhysicalActivity: 2,
    },
  },
  {
    email: 'saphi_user4@gmail.com',
    password: 'pass123',
    birthDate: '1980-01-01',
    indicators: {
      idObjective: 3,
      sex: 'M',
      weight: 60,
      height: 170,
      bodyFatPercentage: 13,
      idPhysicalActivity: 2,
    },
  },
  {
    email: 'saphi_user5@gmail.com',
    password: 'pass123',
    birthDate: '1975-01-01',
    indicators: {
      idObjective: 0,
      sex: 'M',
      weight: 100,
      height: 175,
      bodyFatPercentage: 35,
      idPhysicalActivity: 1,
    },
  },
  {
    email: 'saphi_user6@gmail.com',
    password: 'pass123',
    birthDate: '1970-01-01',
    indicators: {
      idObjective: 1,
      sex: 'M',
      weight: 85,
      height: 185,
      bodyFatPercentage: 25,
      idPhysicalActivity: 1,
    },
  },
  {
    email: 'saphi_user7@gmail.com',
    password: 'pass123',
    birthDate: '1980-01-01',
    indicators: {
      idObjective: 2,
      sex: 'M',
      weight: 80,
      height: 185,
      bodyFatPercentage: 18,
      idPhysicalActivity: 3,
    },
  },
  {
    email: 'saphi_user8@gmail.com',
    password: 'pass123',
    birthDate: '2000-01-01',
    indicators: {
      idObjective: 0,
      sex: 'F',
      weight: 80,
      height: 160,
      bodyFatPercentage: 32,
      idPhysicalActivity: 2,
    },
  },
  {
    email: 'saphi_user9@gmail.com',
    password: 'pass123',
    birthDate: '1995-01-01',
    indicators: {
      idObjective: 1,
      sex: 'F',
      weight: 60,
      height: 160,
      bodyFatPercentage: 28,
      idPhysicalActivity: 2,
    },
  },
  {
    email: 'saphi_user10@gmail.com',
    password: 'pass123',
    birthDate: '1990-01-01',
    indicators: {
      idObjective: 2,
      sex: 'F',
      weight: 58,
      height: 165,
      bodyFatPercentage: 20,
      idPhysicalActivity: 3,
    },
  },
  {
    email: 'saphi_user11@gmail.com',
    password: 'pass123',
    birthDate: '1980-01-01',
    indicators: {
      idObjective: 3,
      sex: 'F',
      weight: 55,
      height: 165,
      bodyFatPercentage: 16,
      idPhysicalActivity: 2,
    },
  },
  {
    email: 'saphi_user12@gmail.com',
    password: 'pass123',
    birthDate: '1975-01-01',
    indicators: {
      idObjective: 0,
      sex: 'F',
      weight: 90,
      height: 163,
      bodyFatPercentage: 38,
      idPhysicalActivity: 1,
    },
  },
  {
    email: 'saphi_user13@gmail.com',
    password: 'pass123',
    birthDate: '1970-01-01',
    indicators: {
      idObjective: 1,
      sex: 'F',
      weight: 65,
      height: 160,
      bodyFatPercentage: 29,
      idPhysicalActivity: 1,
    },
  },
  {
    email: 'saphi_user14@gmail.com',
    password: 'pass123',
    birthDate: '1980-01-01',
    indicators: {
      idObjective: 2,
      sex: 'F',
      weight: 65,
      height: 170,
      bodyFatPercentage: 23,
      idPhysicalActivity: 2,
    },
  },
];

mongoose
  .connect(config.get('dbConfig'), {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(async () => {
    const dataPromise = data.map(async item => {
      item.pathologies = [];
      item.otherPathology = '';
      item.avoidedAliments = { carbohydrate: [], protein: [], fat: [] };
      item.onboardingFinished = true;

      item.planSubscription = {
        active: true,
        type: 'Company Plan',
        endDate: moment().add(1, 'months'),
      };
      item.name = item.email;
      item.lastName = 'Saphi';

      const updateUser = await userService.validateOnboarding(item);
      if (updateUser.status !== 200) return;

      const user = new User(updateUser.data);
      await user.save();
      console.log('Created', item.email);

      const macroContent = await dietService.calcDiet(user.toObject());
      await User.findByIdAndUpdate(user.id, { macroContent });
      console.log('Diet added', item.email);
    });

    await Promise.all(dataPromise);

    mongoose.connection.close();
  })
  .catch(err => console.log(`Failed to connect to MongoDB...${String(err)}`));
