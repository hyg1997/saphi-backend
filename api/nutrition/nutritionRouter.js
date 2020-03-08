const express = require('express');
const passport = require('passport');

const router = express.Router();
const secureRouter = express.Router();

const { authenticateMiddleware } = require('../middleware/auth');

router.use('/menus', require('./menu/menuRouter'));
router.use('/aliments', require('./aliment/alimentRouter'));

secureRouter.use('/', authenticateMiddleware('jwt'), router);

module.exports = secureRouter;
