const express = require('express');

const router = express.Router();
const secureRouter = express.Router();

const { authenticateMiddleware } = require('../middleware/auth');

router.use('/company', require('./company/companyRouter'));
router.use('/deliveryOrder', require('./deliveryOrder/deliveryOrderRouter'));
router.use('/menus', require('./menu/menuRouter'));
router.use('/user', require('./user/userRouter'));

secureRouter.use('/', authenticateMiddleware('jwt'), router);

module.exports = secureRouter;
