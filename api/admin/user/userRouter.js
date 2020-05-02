const express = require('express');
const { celebrate } = require('celebrate');

const router = express.Router();
const Controller = require('./userController');
const Validator = require('./userValidator');

const utils = require('../../utils');

router.post(
  '/:id([a-fA-F0-9]{24})/updatemacros',
  celebrate(Validator.setMacrosOnUser),
  Controller.setMacrosOnUser,
);
router.get('/:id([a-fA-F0-9]{24})', Controller.getAdminUser);
router.post('/', celebrate(utils.joi.Pagination), Controller.listAdminUsers);

module.exports = router;
