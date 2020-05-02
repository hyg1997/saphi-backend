const express = require('express');
const { celebrate } = require('celebrate');

const router = express.Router();
const Controller = require('./menuController');
const Validator = require('./menuValidator');

const utils = require('../../utils');

router.get('/admin', celebrate(utils.joi.Pagination), Controller.listAdminMenu);
router.post('/admin', celebrate(Validator.Bulk), Controller.createBulkMenu);
router.delete('/:id([a-fA-F0-9]{24})', Controller.deleteMenu);

module.exports = router;
