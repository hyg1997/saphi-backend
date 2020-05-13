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
router.get(
  '/:id([a-fA-F0-9]{24})',
  celebrate(Validator.Get),
  Controller.getChapter,
);
router.get(
  '/:id([a-fA-F0-9]{24})/activity/:subId([a-fA-F0-9]{24})',
  celebrate(Validator.GetSub),
  Controller.getChapterActivity,
);

module.exports = router;
