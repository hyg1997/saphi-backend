const express = require('express');
const { celebrate } = require('celebrate');

const router = express.Router();
const Controller = require('./menuController');
const Validator = require('./menuValidator');

const utils = require('../../utils');

router.get('/admin', celebrate(utils.joi.Pagination), Controller.listAdminMenu);
router.post('/admin', celebrate(Validator.Bulk), Controller.createBulkMenu);
router.delete('/:id', Controller.deleteMenu);

router.get('/', celebrate(Validator.List), Controller.listMenu);
router.get('/:id', celebrate(Validator.Get), Controller.getMenu);
router.post('/', celebrate(Validator.Post), Controller.postMenu);

module.exports = router;
