const express = require('express');
const { celebrate } = require('celebrate');

const router = express.Router();
const Controller = require('./userController');
const Validator = require('./userValidator');

const { authenticateMiddleware } = require('../../middleware/auth');

router.post(
  '/user/onboarding',
  authenticateMiddleware('jwt'),
  celebrate(Validator.Post),
  Controller.onboarding,
);

router.post('/forgotpassword', Controller.forgotPassword);
router.post('/checkcode', Controller.checkCode);
router.post('/resetpassword', Controller.resetPassword);

module.exports = router;
