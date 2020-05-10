const express = require('express');
// const { celebrate } = require('celebrate');

const router = express.Router();
const Controller = require('./culqiClientController');
// TODO:
// const Validator = require('./culqiClientValidator');

// ! Considerar incluir validadores para servicios

router.post('/', Controller.createCulqiClient);
router.get('/', Controller.listCulqiClientCards); // TODO: Remove url
router.get('/mycards', Controller.listCulqiClientCards);

module.exports = router;
