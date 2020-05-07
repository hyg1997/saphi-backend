const express = require('express');
const { celebrate } = require('celebrate');

const router = express.Router();
const Controller = require('./module.controller');
const Validator = require('./module.validator');

router.get('/', celebrate(Validator.List), Controller.listModule);
router.get('/:id', celebrate(Validator.Get), Controller.getModule);
router.get(
  '/:id/activity/:subId',
  celebrate(Validator.GetSub),
  Controller.getModuleActivity,
);

module.exports = router;
