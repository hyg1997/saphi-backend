const Service = require('./menuService');

const createBulkMenu = async (req, res) => {
  const resp = await Service.createBulkMenu(req.body);

  return res.status(resp.status).send(resp);
};

const deleteMenu = async (req, res) => {
  const response = await Service.deleteMenu(req.params);

  return res.status(response.status).send(response);
};

const listAdminMenu = async (req, res) => {
  const menus = await Service.listAdminMenu(req.query);

  return res.status(menus.status).send(menus);
};

module.exports = {
  listAdminMenu,
  createBulkMenu,
  deleteMenu,
};
