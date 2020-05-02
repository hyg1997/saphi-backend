/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const moment = require('moment-timezone');

const { Menu } = require('./menuModel');
const { setResponse, addBussinesDays } = require('../../utils');

const listMenu = async reqQuery => {
  const menus = await Menu.find({
    date: {
      $gte: moment(reqQuery.startdate).toDate(),
      $lt: moment(addBussinesDays(reqQuery.startdate, reqQuery.businessdays))
        .add()
        .toDate(),
    },
  }).sort({ date: 1 });
  return setResponse(200, 'Menus found.', menus);
};

const readMenu = async reqParams => {
  const menu = await Menu.findById(reqParams.id);
  if (!menu) return setResponse(404, 'Menu not found.', {});
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
