const express = require('express');
const { celebrate } = require('celebrate');

const router = express.Router();
const Controller = require('./menuController');
const Validator = require('./menuValidator');

router.get('/admin', celebrate(Validator.Pagination), Controller.listAdminMenu);
router.post('/admin', celebrate(Validator.Bulk), Controller.createBulkMenu);
router.get('/', celebrate(Validator.List), Controller.listMenu);
router.get('/:id', celebrate(Validator.Get), Controller.getMenu);
router.post('/', celebrate(Validator.Post), Controller.postMenu);

module.exports = router;
