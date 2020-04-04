/* eslint-disable no-param-reassign */
const { Diet } = require('../dietModel');
const { setResponse } = require('../../../utils');

const { calcFormatDiet } = require('../dietUtils');

// * Servicio para obtener la dieta de un usuario

const getDiet = async reqUser => {
  let diet = await Diet.findOne({ user: reqUser.id });

  if (!diet) {
    /*  Para inicializar dieta 
    
    await Diet.deleteMany({});
    await Diet.create({
      user: reqUser.id,
      macroContent: {
        protein: 160,
        carbohydrate: 169,
        fat: 37,
      },
      meals: [],
    });

    const dataMeals = {};
    getDictValues(MEAL_NAME).forEach(val => {
      dataMeals[val] = true;
    });
    const response = setMeals(dataMeals, reqUser);
    return response; */
    return setResponse(
      404,
      'No Diet',
      {},
      'Pronto tendrás una dieta asignada.',
    );
  }

  diet = calcFormatDiet(diet);
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
  return setResponse(200, 'Diet found.', diet);
};

module.exports = getDiet;
