const express = require('express');

const router = express.Router();
const Controller = require('./companyController');

// router.get('/:id', Controller.getCompany);
// router.post('/', Controller.createCompany);
// router.get('/', Controller.listCompany);

router.post('/checkDocument', Controller.checkDocument);

module.exports = router;