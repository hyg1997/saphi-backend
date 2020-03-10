const express = require('express');

const router = express.Router();
const Controller = require('./deliveryPlanController');

router.get('/:id', Controller.getDeliveryPlan);
router.get('/', Controller.listDeliveryPlan);
router.post('/', Controller.createDeliveryPlan);

module.exports = router;
