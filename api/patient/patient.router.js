const express = require('express');

const router = express.Router();

const { authenticateMiddleware } = require('../middleware/auth');

router.use(
  '/user',
  authenticateMiddleware('jwt'),
  require('./user/userRouter'),
);

module.exports = router;
