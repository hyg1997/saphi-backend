const express = require('express');
const { celebrate } = require('celebrate');

const router = express.Router();
const Controller = require('./chapter.controller');
const Validator = require('./chapter.validator');

router.get(
  '/modules',
  celebrate(Validator.List),
  Controller.listChapterByModule,
);
router.get('/:id', celebrate(Validator.Get), Controller.getChapter);
router.get(
  '/:id/activity/:subId',
  celebrate(Validator.GetSub),
  Controller.getChapterActivity,
);

module.exports = router;
