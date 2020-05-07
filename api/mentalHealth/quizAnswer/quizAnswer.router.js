const express = require('express');
const { celebrate } = require('celebrate');

const router = express.Router();
const Controller = require('./quizAnswer.controller');
const Validator = require('./quizAnswer.validator');

router.post(
  '/:identifier',
  celebrate(Validator.Post),
  Controller.postQuizAnswer,
);

module.exports = router;
