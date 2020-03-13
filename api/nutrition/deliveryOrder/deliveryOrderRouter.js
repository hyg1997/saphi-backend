const express = require('express');
const { celebrate } = require('celebrate');

const router = express.Router();
const Controller = require('./deliveryOrderController');
const Validator = require('./deliveryOrderValidator');

router.post('/', celebrate(Validator.Post), Controller.createDeliveryOrder);
router.get('/mydeliveryorder', Controller.getUserDeliveryOrder);

module.exports = router;
