const express = require('express');
const { celebrate } = require('celebrate');

const router = express.Router();
const Controller = require('./userController');
const Validator = require('./userValidator');

const { authenticateMiddleware } = require('../../middleware/auth');

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
  // TODO: Revisar y agregar a swagger
  '/update',
  authenticateMiddleware('jwt'),
  celebrate(Validator.UpdateUser),
  Controller.updateUser,
);

router.put(
  // TODO: Revisar y agregar a swagger
  '/updatephoto',
  Validator.validatePhoto,
  authenticateMiddleware('jwt'),
  Controller.updatePhoto,
);
module.exports = router;
