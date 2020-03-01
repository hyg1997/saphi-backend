const { Menu } = require('./menuModel');
const { setResponse } = require('../../utils');

const listMenu = async reqQuery => {
  const menus = await Menu.find();
  return setResponse(200, 'Menus found.', menus);
};

const readMenu = async reqParams => {
  const menu = await Menu.findById(reqParams.id);
  return setResponse(200, 'Menu found.', menu);
};

const createMenu = async reqBody => {
  const menu = new Menu(reqBody);
  await menu.save();

  return setResponse(201, 'Menu created.', menu);
};

module.exports = {
  listMenu,
  readMenu,
  createMenu,
};
