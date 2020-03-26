/* eslint-disable no-param-reassign */

const { Diet } = require('../dietModel');
const { Aliment } = require('../../aliment/alimentModel');
const { setResponse } = require('../../../utils');
const {
  MEAL_NAME,
  ALIMENT_TYPE,
  ALIMENT_TAG_TITLE,
} = require('../../../utils/constants');

const { calcFormatDiet, allowFat } = require('../dietUtils');

const stepList = ['init', 'protein', 'carbohydrate', 'fat', 'end'];

const changeAliment = async (reqBody, reqQuery, reqUser) => {
  // ! Se sugiere incluir un flujo de validacion en un servicio aparte
  // ! en que tambien se valide que el usuario tiene dieta, que los alimenos
  // ! seleccionados existen o que corresponden a los grupos que dicen ser

  const { macroStep, past } = reqBody;
  const { meal } = reqQuery;

  if (
    macroStep === 'carbohydrate' ||
    macroStep === 'fat' ||
    macroStep === 'all'
  ) {
    const diet = await Diet.findOne({ user: reqUser.id });

    let { meals } = diet;
    let aliments = past.map(async function(item) {
      let aliment = await Aliment.findById(item.alimentId);
      aliment = aliment.toObject();
      aliment.aliment = item.alimentId;
      return aliment;
    });
    aliments = await Promise.all(aliments);

    if (
      (macroStep === 'carbohydrate' &&
        allowFat(meal, aliments, diet.macroContent, diet.meals)) ||
      macroStep === 'fat' ||
      macroStep === 'all'
    ) {
      const mealData = { name: meal, aliments };
      meals = meals.map(function(item) {
        return item.name === meal ? mealData : item;
      });

      diet.meals = meals;
      const auxDiet = calcFormatDiet(diet);
      diet.meals = auxDiet.meals;
      await diet.save();

      return setResponse(200, 'Diet updated.', {
        nextStep: 'end',
        allow: true,
      });
    }
  }

  const pos = stepList.findIndex(val => val === macroStep);

  let nextStep = stepList[pos + 1];
  let typeAllow = [nextStep];

  if (
    meal === MEAL_NAME.beforeLunch.toLowerCase() ||
    meal === MEAL_NAME.afterLunch.toLowerCase()
  ) {
    nextStep = 'all';
    typeAllow = ['protein', 'carbohydrate', 'fat'];
  }
  const title = ALIMENT_TAG_TITLE[nextStep];
  typeAllow = typeAllow.map(val => ALIMENT_TYPE[val]);

  const aliments = await Aliment.find({
    $and: [
      { type: { $in: typeAllow } },
      { meals: { $elemMatch: { name: meal, active: true } } },
    ],
  });

  const data = {
    nextStep,
    title,
    allow: true,
    aliments,
  };
  return setResponse(200, 'Aliments found.', data);
};

module.exports = changeAliment;
