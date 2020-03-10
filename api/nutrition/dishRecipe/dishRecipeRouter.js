const express = require('express');

const router = express.Router();
const Controller = require('./dishRecipeController');

router.get('/:id', Controller.getDishRecipe);
router.get('/', Controller.listDishRecipe);
router.post('/', Controller.createDishRecipe);

module.exports = router;
