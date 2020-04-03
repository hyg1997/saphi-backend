const express = require('express');

const router = express.Router();

router.use('/', require('./authentication/authenticationRouter'));
router.use('/', require('../auth/user/userRouter'));

module.exports = router;
