const express = require('express');

const router = express.Router();
const Controller = require('./pathologyController');

const { authenticateMiddleware } = require('../../middleware/auth');

router.get('/:id', authenticateMiddleware('jwt'), Controller.getPathology);
router.post('/', authenticateMiddleware('jwt'), Controller.createPathology);
router.get('/', authenticateMiddleware('jwt'), Controller.listPathology);

module.exports = router;
