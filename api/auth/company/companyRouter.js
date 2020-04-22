const express = require('express');
const { celebrate } = require('celebrate');

const router = express.Router();
const secureRouter = express.Router();

const Controller = require('./companyController');
const Validator = require('./companyValidator');

const { authenticateMiddleware } = require('../../middleware/auth');

const utils = require('../../utils');

router.put(
  '/update',
  celebrate(Validator.UpdateCompanies),
  Controller.updateCompanies,
);

router.get('/:id', Controller.getCompany);
router.post('/', celebrate(Validator.CreateCompany), Controller.createCompany);
router.get('/', celebrate(utils.joi.Pagination), Controller.listCompany);

secureRouter.use('/', authenticateMiddleware('jwt'), router);

module.exports = secureRouter;
