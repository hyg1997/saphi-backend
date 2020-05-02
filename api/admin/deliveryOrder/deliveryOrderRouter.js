const express = require('express');
const { celebrate } = require('celebrate');

const router = express.Router();
const Controller = require('./deliveryOrderController');

const utils = require('../../utils');

router.post(
  '/admin',
  celebrate(utils.joi.Pagination),
  Controller.listAdminDeliveryOrder,
);
router.get('/:id([a-fA-F0-9]{24})', Controller.getDeliveryOrder);

module.exports = router;
