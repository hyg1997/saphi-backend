const express = require('express');
const { celebrate } = require('celebrate');

const router = express.Router();
const Controller = require('./companyController');
const Validator = require('./companyValidator');

router.put(
  '/:id',
  celebrate(Validator.UpdateCompany),
  Controller.updateCompany,
);
router.get('/:id', Controller.getCompany);
router.post('/', celebrate(Validator.CreateCompany), Controller.createCompany);
router.get('/', Controller.listCompany);

module.exports = router;
