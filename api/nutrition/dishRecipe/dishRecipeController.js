const Service = require('./dishRecipeService');

const listDishRecipe = async (req, res) => {
  const dishRecipes = await Service.listDishRecipe(req.query);

  return res.status(dishRecipes.status).send(dishRecipes);
};

const getDishRecipe = async (req, res) => {
  const dishRecipe = await Service.getDishRecipe(req.params);

  return res.status(dishRecipe.status).send(dishRecipe);
};

const createDishRecipe = async (req, res) => {
  const dishRecipe = await Service.createDishRecipe(req.body);

  return res.status(dishRecipe.status).send(dishRecipe);
};

module.exports = {
  listDishRecipe,
  getDishRecipe,
  createDishRecipe,
};
