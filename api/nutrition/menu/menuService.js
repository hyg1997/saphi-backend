const moment = require('moment-timezone');

const { Menu } = require('./menuModel');
const {
  setResponse,
  addBussinesDays,
  validatePagination,
} = require('../../utils');

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

const listAdminMenu = async reqQuery => {
  const total = await Menu.countDocuments();
  const val = validatePagination(total, reqQuery.page, reqQuery.size);
  if (!val.ok) return setResponse(400, val.message, {});
  const items = await Menu.find({})
    .sort({ date: -1, type: 1 })
    .skip(val.skip)
    .limit(reqQuery.size)
    .exec('find');

  return setResponse(200, 'Menus found.', {
    total,
    numPages: val.numPages,
    page: reqQuery.page,
    items,
  });
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
  listAdminMenu,
  readMenu,
  createMenu,
};
