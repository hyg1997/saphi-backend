const express = require('express');

const router = express.Router();

router.use('/auth', require('./authentication/authenticationRouter'));
router.use('/user', require('../auth/user/userRouter'));

module.exports = router;
