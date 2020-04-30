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

router.post(
  '/update',
  authenticateMiddleware('jwt'),
  celebrate(Validator.UpdateUser),
  Controller.updateUser,
);

// Admin
router.post(
  '/:id/updatemacros',
  authenticateMiddleware('jwt'),
  Controller.setMacrosOnUser,
);
router.get('/:id', authenticateMiddleware('jwt'), Controller.getAdminUser);
router.post(
  '/',
  authenticateMiddleware('jwt'),
  celebrate(utils.joi.Pagination),
  Controller.listAdminUsers,
);

module.exports = router;
