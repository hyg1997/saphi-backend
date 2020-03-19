const express = require('express');

const router = express.Router();
const Controller = require('./dietController');

router.get('/:meal/:id', Controller.getAliment);
router.post('/:meal', Controller.changeAliment);
router.get('/', Controller.getDiet);
router.post('/', Controller.setMeals);

module.exports = router;
