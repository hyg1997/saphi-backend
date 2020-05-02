const express = require('express');
const { celebrate } = require('celebrate');

const router = express.Router();
const Controller = require('./dishRecipeController');
const Validator = require('./dishRecipeValidator');

// ! Considerar incluir validadores para servicios

router.get('/:id([a-fA-F0-9]{24})', Controller.getDishRecipe);
router.get('/', celebrate(Validator.List), Controller.listDishRecipe);
router.post('/', Controller.createDishRecipe);

module.exports = router;
