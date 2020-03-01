const Service = require('./menuService');

const postMenu = async (req, res) => {
  const menu = await Service.createMenu(req.body);

  return res.status(menu.status).send(menu);
};

const getMenu = async (req, res) => {
  const menu = await Service.readMenu(req.params);

  return res.status(menu.status).send(menu);
};

const listMenu = async (req, res) => {
  const menus = await Service.listMenu(req.query);

  return res.status(menus.status).send(menus);
};

module.exports = {
  listMenu,
  getMenu,
  postMenu,
};
