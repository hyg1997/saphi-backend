const express = require('express');
// const { celebrate } = require('celebrate');

const router = express.Router();
const Controller = require('./culqiClientController');
// TODO:
// const Validator = require('./culqiClientValidator');

router.post('/', Controller.createCulqiClient);
router.get('/', Controller.listCulqiClient);

module.exports = router;
