/* eslint-disable no-param-reassign */
const { Diet } = require('../dietModel');
const { setResponse } = require('../../../utils');

const { calcFormatDiet } = require('../dietUtils');

// * Servicio para obtener la dieta de un usuario

const getDiet = async reqUser => {
  let diet = await Diet.findById(reqUser.diet);

  if (!diet) {
    /* Past createDiet
    if (reqUser.activeDiet) {
      await Diet.create({
        user: reqUser.id,
        macroContent: reqUser.macroContent,
        meals: [],
      });

      const dataMeals = {};
      getDictValues(MEAL_NAME).forEach(val => {
        dataMeals[val] = true;
      });
      const response = setMeals(dataMeals, reqUser);
      return response;
    }
    */
    return setResponse(
      404,
      'Diet not found',
      {},
      'Pronto tendrás una dieta asignada.',
    );
  }

  diet = calcFormatDiet(diet);
  // TODO: Remove
  const aux = ['protein', 'carbohydrate', 'fat'];
  const tot = {};
  aux.forEach(v => {
    tot[v] = 0;
  });
  console.log(tot);
  diet.meals.forEach(meal => {
    console.log(meal.name);
    meal.aliments.forEach(al => {
      aux.forEach(v => {
        tot[v] += al.finalMacroContent[v];
      });
      console.log(
        `Prot: ${al.finalMacroContent.protein.toFixed(
          2,
        )} - Carb: ${al.finalMacroContent.carbohydrate.toFixed(
          2,
        )} - Gras: ${al.finalMacroContent.fat.toFixed(2)}`,
      );
    });
  });
  console.log(tot);
  console.log(diet.macroContent);
  // TODO: Remove
  return setResponse(200, 'Diet found.', diet);
};

module.exports = getDiet;
