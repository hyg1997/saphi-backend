const express = require('express');
const { celebrate } = require('celebrate');

const router = express.Router();
const Controller = require('./userController');
const Validator = require('./userValidator');

router.post(
  '/onboarding',
  celebrate(Validator.UpdateOnBoarding),
  Controller.onboarding,
);

router.post(
  '/contact',
  celebrate(Validator.ContactForm),
  Controller.contactForm,
);

// Profile
router.get('/payments', Controller.listPayments); // TODO: Remove url
router.get('/diets', Controller.listDiets); // TODO: Remove url
router.get('/mypayments', Controller.listPayments);
router.get('/mydiets', Controller.listDiets);
module.exports = router;
