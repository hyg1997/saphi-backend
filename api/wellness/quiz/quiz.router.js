const express = require('express');
const { celebrate } = require('celebrate');

const router = express.Router();
const Controller = require('./quiz.controller');
const Validator = require('./quiz.validator');

router.get('/:identifier', celebrate(Validator.Get), Controller.getQuiz);

module.exports = router;
