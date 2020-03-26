const { DishRecipe } = require('./dishRecipeModel');
const { setResponse } = require('../../utils');

const listDishRecipe = async reqQuery => {
  const DishRecipes = await DishRecipe.find(reqQuery);
  return setResponse(200, 'DishRecipe list.', DishRecipes);
};

const getDishRecipe = async reqParams => {
  const dishRecipe = await DishRecipe.findById(reqParams.id);
  // ! Que pasa si no existe
  return setResponse(200, 'DishRecipe Found.', dishRecipe);
};

const createDishRecipe = async reqBody => {
  const dishRecipe = new DishRecipe(reqBody);
  // ! Que pasa si la estructura no es la correcta
  await dishRecipe.save();
  return setResponse(201, 'DishRecipe Created.', dishRecipe);
};

module.exports = {
  listDishRecipe,
  getDishRecipe,
  createDishRecipe,
};
