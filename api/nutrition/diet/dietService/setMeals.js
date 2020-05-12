/* eslint-disable no-param-reassign */
const _ = require('lodash');
const { Diet } = require('../dietModel');
const { Aliment } = require('../../aliment/alimentModel');
const { setResponse } = require('../../../utils');

const { calcFormatDiet } = require('../dietUtils');

const { MEAL_NAME } = require('../../../utils/constants');

// ? Se crea la dieta default
const setMeals = async (reqBody, reqUser) => {
  const diet = await Diet.findById(reqUser.diet); // ? Macronutrientes
  if (!diet) return setResponse(404, 'Diet not found.', {});

  // * Debe existir el almuerzo , y la cena o desayuno
  if (
    !_.get(reqBody, MEAL_NAME.lunch, false) ||
    !(
      _.get(reqBody, MEAL_NAME.dinner, false) ||
      _.get(reqBody, MEAL_NAME.breakfast, false)
    )
  ) {
    return setResponse(400, 'Combinación no posible', {});
  }

  let tmpAliments = [];
  // TODO: Depends on the seed
  tmpAliments = [
    'Pechuga de pollo sin piel',
    'Arroz blanco',
    'Aceite de oliva extra virgen',
  ].map(async function(name) {
    const aliment = await Aliment.findOne({ name });
    const data = { ...aliment.toObject(), aliment: aliment.id }; // TODO: refactor para retirar aliment
    return data;
  });
  tmpAliments = await Promise.all(tmpAliments);

  const lunch = { name: MEAL_NAME.lunch, aliments: tmpAliments };
  const dinner = { name: MEAL_NAME.dinner, aliments: tmpAliments };

  tmpAliments = ['Pechuga de pollo sin piel', 'Pan de molde', 'Linaza'].map(
    async function(name) {
      const aliment = await Aliment.findOne({ name });
      const data = { ...aliment.toObject(), aliment: aliment.id };
      return data;
    },
  );
  tmpAliments = await Promise.all(tmpAliments);
  const breakfast = { name: MEAL_NAME.breakfast, aliments: tmpAliments };

  tmpAliments = ['Manzana verde'].map(async function(name) {
    const aliment = await Aliment.findOne({ name });
    const data = { ...aliment.toObject(), aliment: aliment.id };
    return data;
  });
  tmpAliments = await Promise.all(tmpAliments);
  const beforeLunch = { name: MEAL_NAME.beforeLunch, aliments: tmpAliments };
  const afterLunch = { name: MEAL_NAME.afterLunch, aliments: tmpAliments };

  const meals = [];
  const mealsObject = { breakfast, beforeLunch, lunch, afterLunch, dinner };

  Object.keys(MEAL_NAME).forEach(mealName => {
    if (_.get(reqBody, MEAL_NAME[mealName], false))
      meals.push(mealsObject[mealName]);
  });

  diet.meals = meals;
  const auxDiet = calcFormatDiet(diet);
  diet.meals = auxDiet.meals;

  await diet.save();

  return setResponse(200, 'Diet updated.', diet);
};

module.exports = setMeals;
