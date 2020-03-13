const express = require('express');

const router = express.Router();
const Controller = require('./alimentController');

router.get('/:id', Controller.getAliment);
// ! Evaluar si este servicio deberia ir en la carpeta diet
router.get('/myplan', Controller.listAlimentUser);
router.post('/', Controller.createAliment);
router.get('/', Controller.listAliment);

module.exports = router;
