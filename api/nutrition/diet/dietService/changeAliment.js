/* eslint-disable no-param-reassign */

const { Diet } = require('../dietModel');
const { Aliment } = require('../../aliment/alimentModel');
const { setResponse } = require('../../../utils');
const {
  MEAL_NAME,
  ALIMENT_TYPE,
  ALIMENT_TAG_TITLE,
  AVENA_SPECIAL_CASE,
} = require('../../../utils/constants');

const { calcFormatDiet, allowFat } = require('../dietUtils');

const stepList = ['init', 'protein', 'carbohydrate', 'fat', 'end'];

const changeAliment = async (reqBody, reqQuery, reqUser) => {
  // ! Se sugiere incluir un flujo de validacion en un servicio aparte
  // ! en que tambien se valide que el usuario tiene dieta, que los alimenos
  // ! seleccionados existen o que corresponden a los grupos que dicen ser

  const { macroStep, past } = reqBody;
  const { meal } = reqQuery;

  let needFruitNext = null;
  if (
    macroStep === 'carbohydrate' ||
    macroStep === 'fat' ||
    macroStep === 'fruit' || // * Caso avena + fruta
    macroStep === 'all' // * Caso media mañana o media tarde
  ) {
    const diet = await Diet.findById(reqUser.diet);
    if (!diet) return setResponse(404, 'Diet not found', {});

    let { meals } = diet;
    let aliments = past.map(async function(item) {
      let aliment = await Aliment.findById(item.alimentId);
      aliment = aliment.toObject();
      aliment.aliment = item.alimentId;
      return aliment;
    });
    aliments = await Promise.all(aliments);

    needFruitNext = aliments.some(val => {
      return val.name === AVENA_SPECIAL_CASE;
    });

    aliments = aliments.map(item => {
      if (item.specialConfig) {
        item.name = item.specialConfig.name;
        item.quantity = item.specialConfig.quantity;
      }
      return item;
    });

    if (
      (((macroStep === 'carbohydrate' && !needFruitNext) ||
        macroStep === 'fruit') &&
        !allowFat(meal, aliments, diet.macroContent, diet.meals)) ||
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
  let tagAllow = null;

  // * Caso media mañana o media tarde
  if (meal === MEAL_NAME.beforeLunch || meal === MEAL_NAME.afterLunch) {
    nextStep = 'all';
    typeAllow = ['protein', 'carbohydrate', 'fat'];
  }

  // * Caso avena + fruta
  // * 1 Caso eligio avena especial (sigue)=> fruit
  if (
    meal === MEAL_NAME.breakfast &&
    macroStep === 'carbohydrate' &&
    needFruitNext
  ) {
    nextStep = 'fruit';
    typeAllow = ['protein', 'carbohydrate', 'fat'];
    tagAllow = ['fruit'];
  }
  // * 1 Caso ya eligio la fruta de avena especial (sigue)=> fat
  if (meal === MEAL_NAME.breakfast && macroStep === 'fruit' && needFruitNext) {
    nextStep = 'fat';
    typeAllow = ['fat'];
  }

  const title = ALIMENT_TAG_TITLE[nextStep];
  typeAllow = typeAllow.map(val => ALIMENT_TYPE[val]);

  const filterAliments = [
    { category: { $nin: reqUser.getAvoidedAliments() } },
    { type: { $in: typeAllow } },
    { meals: { $elemMatch: { name: meal, active: true } } },
  ];
  if (tagAllow) filterAliments.push({ tag: { $in: tagAllow } });

  const aliments = await Aliment.find({ $and: filterAliments }).sort(
    'displayOrder',
  );

  const data = {
    nextStep,
    title,
    allow: true,
    aliments,
  };
  return setResponse(200, 'Aliments found.', data);
};

module.exports = changeAliment;
