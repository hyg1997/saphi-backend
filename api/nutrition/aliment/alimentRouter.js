const express = require('express');

const router = express.Router();
const Controller = require('./alimentController');

router.get('/:id', Controller.getAliment);
router.get('/myplan', Controller.listAlimentUser);
router.post('/', Controller.createAliment);
router.get('/', Controller.listAliment);

module.exports = router;
