/* eslint-disable no-param-reassign */

const { Diet } = require('../dietModel');
const { setResponse } = require('../../../utils');

// ! Creo que el nombre deberia ser distinto, get aliment da a entender
// ! Que es el caso basico q leer un alimento por id
const getAliment = async (reqParams, reqUser) => {
  let diet = await Diet.findOne({ user: reqUser.id });
  // ! Considerar !diet o tres ===
  if (diet == null) {
    return setResponse(404, 'No Diet found.', {});
  }
  diet = diet.toObject();

  const { meals } = diet;
  const meal = meals.find(val => val.name === reqParams.meal);

  // ! Considerar !meal o tres ===
  if (meal == null) {
    return setResponse(404, 'No Meal found.', {});
  }

  const { aliments } = meal;
  // eslint-disable-next-line eqeqeq
  const aliment = aliments.find(a => a.aliment == reqParams.aliment);

  // ! Considerar !aliment o tres ===
  if (aliment == null) {
    return setResponse(404, 'No Aliment found.', {});
  }

  aliment.finalMacroContent = {
    protein: (aliment.macroContent.protein * aliment.quantity).toFixed(2),
    carbohydrate: (
      aliment.macroContent.carbohydrate * aliment.quantity
    ).toFixed(2),
    fat: (aliment.macroContent.fat * aliment.quantity).toFixed(2),
  };

  return setResponse(200, 'Aliment found.', aliment);
};

module.exports = getAliment;
