const Service = require('./userService');

const onboarding = async (req, res) => {
  const response = await Service.onboarding(req.body, req.user);

  return res.status(response.status).send(response);
};

const forgotPassword = async (req, res) => {
  const response = await Service.forgotPassword(req.body);

  return res.status(response.status).send(response);
};

const checkCode = async (req, res) => {
  const response = await Service.checkCode(req.body);

  return res.status(response.status).send(response);
};

const resetPassword = async (req, res) => {
  const response = await Service.resetPassword(req.body);

  return res.status(response.status).send(response);
};

const contactForm = async (req, res) => {
  const response = await Service.contactForm(req.body, req.user);
  return res.status(response.status).send(response);
};

const updateUser = async (req, res) => {
  const validate = await Service.validateUpdateUser(req.body, req.user);
  if (validate.status !== 200)
    return res.status(validate.status).send(validate);

  const response = await Service.updateUser(
    validate.data.reqBody,
    validate.data.user,
  );
  return res.status(response.status).send(response);
};

const listPayments = async (req, res) => {
  const payments = await Service.listPayments(req.user.id);
  return res.status(payments.status).send(payments);
};

module.exports = {
  onboarding,
  forgotPassword,
  checkCode,
  resetPassword,
  // Profile
  listPayments,
  updateUser,
  contactForm,
};
