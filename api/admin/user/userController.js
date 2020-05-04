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
  const user = User.findById(req.params.id);
  await createDiet(user);
  return res.status(response.status).send(response);
};

module.exports = {
  listAdminUsers,
  getAdminUser,
  setMacrosOnUser,
};
