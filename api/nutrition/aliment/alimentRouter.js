const express = require('express');

const router = express.Router();
const Controller = require('./alimentController');

const { authenticateMiddleware } = require('../../middleware/auth');

// ! Considerar incluir validadores para servicios

router.get('/category', Controller.listCategories);
router.get(
  '/:id([a-fA-F0-9]{24})',
  authenticateMiddleware('jwt'),
  Controller.getAliment,
);
router.post('/', authenticateMiddleware('jwt'), Controller.createAliment);
router.get('/', authenticateMiddleware('jwt'), Controller.listAliment);

module.exports = router;
