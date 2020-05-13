const express = require('express');

const router = express.Router();
const { celebrate } = require('celebrate');

const Controller = require('./dietController');

const Validator = require('./dietValidator');

// ! Considerar incluir validadores para servicios

router.get('/myplan', Controller.getDiet);
router.get('/meals/:meal/aliments/:aliment', Controller.getAlimentDiet);
router.post('/meals/:meal', Controller.changeAliment);
router.put('/meals', celebrate(Validator.SetMeals), Controller.setMeals);

module.exports = router;
