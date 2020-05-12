const express = require('express');
const { celebrate } = require('celebrate');

const router = express.Router();
const Controller = require('./profile.controller');
const Validator = require('./profile.validator');

router.get('/myprofile', Controller.getProfileUser);
router.put(
  '/myprofile/activityStatus',
  celebrate(Validator.PutActivityStatus),
  Controller.updateProfileActivityStatus,
);

module.exports = router;
