const express = require('express');

const router = express.Router();
const Controller = require('./deliveryPlanController');

// ! Considerar incluir validadores para servicios

router.get('/:id', Controller.getDeliveryPlan);
router.get('/', Controller.listDeliveryPlan);
router.post('/', Controller.createDeliveryPlan);

module.exports = router;
