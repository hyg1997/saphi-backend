const express = require('express');

const router = express.Router();
const Controller = require('./alimentController');

// ! Considerar incluir validadores para servicios

router.get('/:id', Controller.getAliment);
router.post('/', Controller.createAliment);
router.get('/', Controller.listAliment);

module.exports = router;
