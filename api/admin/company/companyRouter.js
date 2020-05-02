const express = require('express');
const { celebrate } = require('celebrate');

const router = express.Router();

const Controller = require('./companyController');
const Validator = require('./companyValidator');

const utils = require('../../utils');

router.put(
  '/update',
  celebrate(Validator.UpdateCompanies),
  Controller.updateCompanies,
);
router.get('/:id([a-fA-F0-9]{24})', Controller.getCompany);
router.post('/', celebrate(Validator.CreateCompany), Controller.createCompany);
router.get('/', celebrate(utils.joi.Pagination), Controller.listCompany);

module.exports = router;
