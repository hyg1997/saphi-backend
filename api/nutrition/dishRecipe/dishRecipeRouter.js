const express = require('express');

const router = express.Router();
const Controller = require('./dishRecipeController');

router.get('/dishrecipes/:id', Controller.getDishRecipe);
router.get('/dishrecipes', Controller.listDishRecipe);

module.exports = router;
