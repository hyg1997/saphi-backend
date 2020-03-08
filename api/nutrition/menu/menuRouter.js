const express = require('express');
const passport = require('passport');

const router = express.Router();
const Controller = require('./menuController');

router.get('/', Controller.listMenu);
router.get('/:id', Controller.getMenu);
router.post('/', Controller.postMenu);

module.exports = router;
