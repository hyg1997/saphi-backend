const express = require('express');

const router = express.Router();
const Controller = require('./profile.controller');

router.get('/myprofile', Controller.getProfileUser);

module.exports = router;
