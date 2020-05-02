const express = require('express');

const router = express.Router();
const Controller = require('./planController');

router.post('/:id([a-fA-F0-9]{24})/buy', Controller.buyPlan);
router.get('/:id([a-fA-F0-9]{24})', Controller.getPlan);
router.post('/', Controller.createPlan);
router.get('/', Controller.listPlan);

module.exports = router;
