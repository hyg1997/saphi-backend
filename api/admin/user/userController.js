const Service = require('./userService');
const { User } = require('../../auth/user/userModel');

const { createDiet } = require('../../nutrition/diet/dietService');

const { validatePagination } = require('../../utils');

const getAdminUser = async (req, res) => {
  const response = await Service.getAdminUser(req.params.id);

  return res.status(response.status).send(response);
};

const listAdminUsers = async (req, res) => {
  const resp = Service.generateQueryUsers(req.body);
  if (resp.status !== 200) return res.status(resp.status).send(resp);

  const userQuery = resp.data;
  const total = await User.find(userQuery.filter).count();

  const pagination = validatePagination(total, req.query.page, req.query.size);
  if (pagination.status !== 200)
    return res.status(pagination.status).send(pagination);

  userQuery.limit = req.query.size;
  userQuery.skip = pagination.data.skip;

  const listUsers = await Service.listAdminUsers(userQuery);

  listUsers.data = {
    numPages: pagination.data.numPages,
    total,
    page: req.query.page,
    items: listUsers.data,
  };
  return res.status(listUsers.status).send(listUsers);
};

const setMacrosOnUser = async (req, res) => {
  const response = await Service.setMacrosOnUser(req.params.id, req.body);
  if (response.status !== 200)
    return res.status(response.status).send(response);
  const user = await User.findById(req.params.id);
  await createDiet(user);
  return res.status(response.status).send(response);
};

module.exports = {
  listAdminUsers,
  getAdminUser,
  setMacrosOnUser,
};
