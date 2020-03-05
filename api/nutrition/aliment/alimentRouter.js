const express = require('express');

const router = express.Router();
const Controller = require('./alimentController');

router.get('/:id', Controller.getAliment);
router.get('/user/:id', Controller.listAlimentUser);

module.exports = router;
