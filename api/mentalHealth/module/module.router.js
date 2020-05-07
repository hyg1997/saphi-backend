const express = require('express');
const { celebrate } = require('celebrate');

const router = express.Router();
const Controller = require('./module.controller');
const Validator = require('./module.validator');

router.get('/', celebrate(Validator.List), Controller.listModule);

module.exports = router;
