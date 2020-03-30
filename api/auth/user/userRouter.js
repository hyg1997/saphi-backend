const express = require('express');

const router = express.Router();
const Controller = require('./userController');

const { authenticateMiddleware } = require('../../middleware/auth');

router.post(
  '/user/onboarding',
  authenticateMiddleware('jwt'),
  Controller.onboarding,
);

router.post('/forgotpassword', Controller.forgotPassword);
router.post('/checkcode', Controller.checkCode);
router.post('/resetpassword', Controller.resetPassword);

module.exports = router;
