const express = require('express');

const router = express.Router();
const Controller = require('./dietController');

// ! Considerar incluir validadores para servicios

router.get('/meals/:meal/aliments/:aliment', Controller.getAlimentDiet);
router.post('/meals/:meal', Controller.changeAliment);
router.get('/myplan', Controller.getDiet);
router.put('/meals', Controller.setMeals);

module.exports = router;
