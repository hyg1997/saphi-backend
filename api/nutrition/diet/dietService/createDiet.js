/* eslint-disable no-param-reassign */
const { Diet } = require('../dietModel');
const setMeals = require('./setMeals');
const { calcDiet } = require('../dietUtils');
const { MEAL_NAME, getDictValues } = require('../../../utils/constants');

const createDiet = async user => {
  const userData = user.toObject();

  const { indicators } = userData;
  indicators.age = user.age;

  const macroContent = calcDiet(userData);

  // *Create Diet object
  const diet = new Diet({
    user: user.id,
    macroContent,
    meals: [],
    indicators,
  });
  await diet.save();

  // * Update user
  user.macroContent = macroContent;
  user.diet = diet.id;
  await user.save();

  const dataMeals = {};
  getDictValues(MEAL_NAME).forEach(val => {
    dataMeals[val] = true;
  });
  await setMeals(dataMeals, user);
};

module.exports = createDiet;
