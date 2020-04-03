const express = require('express');

const router = express.Router();
const Controller = require('./companyController');

router.put('/:id/adduser', Controller.addUser);
router.get('/:id', Controller.getCompany);
router.post('/', Controller.createCompany);
router.get('/', Controller.listCompany);

module.exports = router;
