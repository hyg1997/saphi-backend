const express = require('express');
const { celebrate } = require('celebrate');

const { authenticateMiddleware } = require('../../middleware/auth');
const Validator = require('./authenticationValidator');

const router = express.Router();

const userController = (status, message) => (req, res) => {
  return res.status(status).send({
    data: {
      user: req.user,
      // token: req.user.generateAuthToken(), // TODO: Uncomment
    },
    status,
    message,
  });
};

router.post(
  '/login',
  celebrate(Validator.Login),
  authenticateMiddleware('localLogin'),
  userController(200, 'User found'),
);

router.post(
  '/signup',
  celebrate(Validator.Register),
  authenticateMiddleware('localSignup'),
  userController(201, 'User created'),
);

router.post(
  '/google/signup',
  celebrate(Validator.RegisterGoogleFacebook),
  authenticateMiddleware('googleSignup'),
  userController(201, 'User created by Google account.'),
);

router.post(
  '/google/login',
  celebrate(Validator.LoginGoogleFacebook),
  authenticateMiddleware('googleLogin'),
  userController(201, 'User found.'),
);

router.post(
  '/facebook/signup',
  celebrate(Validator.RegisterGoogleFacebook),
  authenticateMiddleware('facebookSignup'),
  userController(201, 'User created by Facebook account.'),
);

router.post(
  '/facebook/login',
  celebrate(Validator.LoginGoogleFacebook),
  authenticateMiddleware('facebookLogin'),
  userController(201, 'User found.'),
);

module.exports = router;
