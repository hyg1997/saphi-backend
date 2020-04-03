const express = require('express');
const { celebrate } = require('celebrate');

const { authenticateMiddleware } = require('../../middleware/auth');
const Validator = require('./authenticationValidator');

const CompanyController = require('../company/companyController');

const router = express.Router();

const userController = (status, message) => (req, res) => {
  return res.status(status).send({
    data: {
      user: req.user,
      token: req.user.generateAuthToken(),
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
  '/checkdocument',
  celebrate(Validator.CheckDocument),
  CompanyController.checkDocument,
);

module.exports = router;
