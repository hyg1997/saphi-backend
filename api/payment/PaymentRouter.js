const express = require('express');

const router = express.Router();
const secureRouter = express.Router();

const { authenticateMiddleware } = require('../middleware/auth');

router.use('/culqiclient', require('./culqiClient/culqiClientRouter'));
router.use('/plan', require('./plan/planRouter'));

secureRouter.use('/', authenticateMiddleware('jwt'), router);

module.exports = secureRouter;
