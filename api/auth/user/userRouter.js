const express = require('express');
const { celebrate } = require('celebrate');

const router = express.Router();
const Controller = require('./userController');
const Validator = require('./userValidator');

const { authenticateMiddleware } = require('../../middleware/auth');

router.get('/me', authenticateMiddleware('jwt'), Controller.getUserMe);

router.put(
  // TODO: Revisar y agregar a swagger
  '/me',
  authenticateMiddleware('jwt'),
  celebrate(Validator.UpdateUser),
  Controller.updateUser,
);

router.put(
  // TODO: Revisar y agregar a swagger
  '/updatephoto',
  authenticateMiddleware('jwt'),
  Validator.validatePhoto,
  Controller.updatePhoto,
);

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
module.exports = router;
