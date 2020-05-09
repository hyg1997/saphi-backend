const Service = require('./userService');
const PaymentService = require('../../payment/culqiPayment/culqiPaymentService');
const DietService = require('../../nutrition/diet/dietService');

const onboarding = async (req, res) => {
  const response = await Service.onboarding(req.body, req.user);
  return res.status(response.status).send(response);
};

const contactForm = async (req, res) => {
  const response = await Service.contactForm(req.body, req.user);
  return res.status(response.status).send(response);
};

const listPayments = async (req, res) => {
  const response = await PaymentService.listPayments({ user: req.user.id });
  return res.status(response.status).send(response);
};

const listDiets = async (req, res) => {
  const response = await DietService.listDiets({ user: req.user.id });
  return res.status(response.status).send(response);
};

module.exports = {
  onboarding,
  listPayments,
  listDiets,
  contactForm,
};
