const express = require('express');

const router = express.Router();

router.use('/', require('./authentication/authenticationRouter'));

module.exports = router;
