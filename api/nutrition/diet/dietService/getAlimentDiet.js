/* eslint-disable no-param-reassign */

const { Diet } = require('../dietModel');
const { setResponse } = require('../../../utils');

const getAlimentDiet = async (reqParams, reqUser) => {
  let diet = await Diet.findOne({ user: reqUser.id });

  if (!diet) return setResponse(404, 'Diet not found.', {});

  diet = diet.toObject();

  const { meals } = diet;
  const meal = meals.find(val => val.name === reqParams.meal);

  if (!meal) return setResponse(404, 'Meal not found.', {});

  const { aliments } = meal;
  const aliment = aliments.find(a => a.aliment === reqParams.aliment);

  if (!aliment) return setResponse(404, 'Aliment not found.', {});

  aliment.finalMacroContent = {
    protein: (
      (aliment.macroContent.protein * aliment.quantity) /
      aliment.minQuantity
    ).toFixed(2),
    carbohydrate: (
      (aliment.macroContent.carbohydrate * aliment.quantity) /
      aliment.minQuantity
    ).toFixed(2),
    fat: (
      (aliment.macroContent.fat * aliment.quantity) /
      aliment.minQuantity
    ).toFixed(2),
  };

  return setResponse(200, 'Aliment found.', aliment);
};

module.exports = getAlimentDiet;
