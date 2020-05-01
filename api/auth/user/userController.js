const Service = require('./userService');
const { validatePagination } = require('../../utils');

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

const getAdminUser = async (req, res) => {
  const response = await Service.getAdminUser(req.params.id);

  return res.status(response.status).send(response);
};

const listAdminUsers = async (req, res) => {
  const resp = Service.generateQueryUsers(req.body);
  if (resp.status !== 200) {
    return res.status(resp.status).send(resp);
  }

  const listUsers = await Service.listAdminUsers(resp.data);
  if (listUsers.status !== 200) return listUsers;

  const total = listUsers.data.length;

  const pagination = validatePagination(total, req.query.page, req.query.size);
  if (pagination.status !== 200)
    return res.status(pagination.status).send(pagination);

  const { page } = req.query;
  const items = listUsers.data.slice(
    pagination.data.skip,
    pagination.data.skip + req.query.size,
  );

  listUsers.data = {
    numPages: pagination.data.numPages,
    total,
    page,
    items,
  };
  return res.status(listUsers.status).send(listUsers);
};

const setMacrosOnUser = async (req, res) => {
  const response = await Service.setMacrosOnUser(req.params.id, req.body);
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
  listPayments,
  // Admin
  listAdminUsers,
  getAdminUser,
  setMacrosOnUser,
  contactForm,
  updateUser,
};
