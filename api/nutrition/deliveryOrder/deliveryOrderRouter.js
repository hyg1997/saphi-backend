const express = require('express');
const { celebrate } = require('celebrate');

const router = express.Router();
const Controller = require('./deliveryOrderController');
const Validator = require('./deliveryOrderValidator');

const utils = require('../../utils');

router.post('/', celebrate(Validator.Post), Controller.createDeliveryOrder);
router.get('/mydeliveryorder', Controller.getUserDeliveryOrder);

// admin
router.post(
  '/admin',
  celebrate(utils.joi.Pagination),
  Controller.listAdminDeliveryOrder,
);

module.exports = router;
