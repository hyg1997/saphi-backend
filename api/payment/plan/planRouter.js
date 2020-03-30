const express = require('express');

const router = express.Router();
const Controller = require('./planController');

router.get('/:id', Controller.getPlan);
router.post('/', Controller.createPlan);
router.get('/', Controller.listPlan);

module.exports = router;
