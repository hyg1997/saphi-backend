const express = require('express');

const router = express.Router();
const Controller = require('./alimentController');

router.get('/aliments/:id', Controller.getAliment);
router.get('/myplan', Controller.listAlimentUser);

module.exports = router;
