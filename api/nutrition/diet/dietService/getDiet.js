/* eslint-disable no-param-reassign */
const { Diet } = require('../dietModel');
const { setResponse } = require('../../../utils');

const { calcFormatDiet } = require('../dietUtils');

// * Servicio para obtener la dieta de un usuario

const getDiet = async reqUser => {
  let diet = await Diet.findOne({ user: reqUser.id });

  // ! Nunca se deberia hacer comparaciones con solo dos igual (==)
  // ! Siempre deberia usarse la comparacion fuerte q es con 3 (===)
  // ! En este caso para evaluar si el objeto diet existe
  // ! basta evaluar el nulo if (!diet)
  if (diet == null) {
    // ! Si este bloque de comentarios no va a ser usado borrarlo
    // ! en caso vaya a ser usado indicarlo dentro del comentario
    /*
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
  return setResponse(200, 'Diet found.', diet);
};

module.exports = getDiet;
