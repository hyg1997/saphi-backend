const express = require('express');
const { celebrate } = require('celebrate');

const router = express.Router();
const Controller = require('./userController');
const Validator = require('./userValidator');

const { authenticateMiddleware } = require('../../middleware/auth');

const utils = require('../../utils');

router.post(
  '/onboarding',
  authenticateMiddleware('jwt'),
  celebrate(Validator.UpdateOnBoarding),
  Controller.onboarding,
);

router.post(
  '/contact',
  authenticateMiddleware('jwt'),
  celebrate(Validator.ContactForm),
  Controller.contactForm,
);

// Password recover
router.post(
  '/forgotpassword',
  celebrate(Validator.ForgotPassword),
  Controller.forgotPassword,
);
router.post('/checkcode', celebrate(Validator.CheckCode), Controller.checkCode);
router.post(
  '/resetpassword',
  celebrate(Validator.ResetPassword),
  Controller.resetPassword,
);

// Admin
router.post('/:id/updatemacros', Controller.setMacrosOnUser);
router.get('/:id', Controller.getAdminUser);
router.post('/', celebrate(utils.joi.Pagination), Controller.listAdminUsers);

module.exports = router;
