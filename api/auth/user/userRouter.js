const express = require('express');
const { celebrate } = require('celebrate');

const router = express.Router();
const Controller = require('./userController');
const Validator = require('./userValidator');

const { authenticateMiddleware } = require('../../middleware/auth');

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

// Profile
router.post(
  '/update',
  authenticateMiddleware('jwt'),
  celebrate(Validator.UpdateUser),
  Controller.updateUser,
);
router.get('/payments', authenticateMiddleware('jwt'), Controller.listPayments);
router.get('/diets', authenticateMiddleware('jwt'), Controller.listDiets);
router.put(
  '/updatephoto',
  Validator.validatePhoto,
  authenticateMiddleware('jwt'),
  Controller.updatePhoto,
);
module.exports = router;
