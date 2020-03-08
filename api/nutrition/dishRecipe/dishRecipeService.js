const { DishRecipe } = require('./dishRecipeModel');
const { setResponse } = require('../../utils');

const listDishRecipe = async reqQuery => {
  const DishRecipes = await DishRecipe.find(reqQuery);
  return setResponse(200, 'DishRecipe list.', DishRecipes);
};

const getDishRecipe = async reqParams => {
  const dishRecipe = await DishRecipe.findById(reqParams.id);
  return setResponse(200, 'DishRecipe Found.', dishRecipe);
};

module.exports = {
  listDishRecipe,
  getDishRecipe,
};
