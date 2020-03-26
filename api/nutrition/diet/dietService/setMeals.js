/* eslint-disable no-param-reassign */
const { Diet } = require('../dietModel');
const { Aliment } = require('../../aliment/alimentModel');
const { setResponse } = require('../../../utils');

const { calcFormatDiet } = require('../dietUtils');

const { MEAL_NAME } = require('../../../utils/constants');

const setMeals = async (reqBody, reqUser) => {
  const diet = await Diet.findOne({ user: reqUser.id });

  // ! El array deberia ser global/constantes
  if (
    ['desayuno', 'almuerzo', 'cena'].some(function(mealName) {
      return !(mealName in reqBody && reqBody[mealName]);
    })
  ) {
    return setResponse(
      400,
      'Desayuno, Almuerzo y Cena deben estar seleccionados',
      {},
    );
  }

  let tmpAliments = [];
  // TODO: Depends on the seed
  tmpAliments = [
    'Pechuga de pollo sin piel',
    'Arroz blanco',
    'Aceite de oliva extra virgen',
  ].map(async function(name) {
    const aliment = await Aliment.findOne({ name });
    const data = { ...aliment.toObject(), aliment: aliment.id };
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

  const meals = [breakfast, lunch, dinner]; // Init with base meals

  if (MEAL_NAME.beforeLunch in reqBody && reqBody[MEAL_NAME.beforeLunch]) {
    meals.push(beforeLunch);
  }
  if (MEAL_NAME.afterLunch in reqBody && reqBody[MEAL_NAME.afterLunch]) {
    meals.push(afterLunch);
  }

  diet.meals = meals;
  const auxDiet = calcFormatDiet(diet);
  diet.meals = auxDiet.meals;

  await diet.save();

  return setResponse(200, 'Diet updated.', diet);
};

module.exports = setMeals;
