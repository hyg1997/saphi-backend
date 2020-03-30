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

module.exports = {
  onboarding,
  forgotPassword,
  checkCode,
  resetPassword,
};
