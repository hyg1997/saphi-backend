const express = require('express');

const router = express.Router();
const Controller = require('./deliveryPlanController');

router.get('/deliveryplans', Controller.listDeliveryPlan);

module.exports = router;
