/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
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
  const resp = validatePagination(total, reqQuery.page, reqQuery.size);
  if (resp.status !== 200) return resp;

  const items = await Menu.find({})
    .sort({ date: -1, type: 1 })
    .skip(resp.data.skip)
    .limit(reqQuery.size)
    .exec('find');

  return setResponse(200, 'Menus found.', {
    total,
    numPages: resp.data.numPages,
    page: reqQuery.page,
    items,
  });
};

const createBulkMenu = async reqBody => {
  await Menu.collection.insert(reqBody.data);
  return setResponse(201, 'Menus created.', {});
};

const deleteMenu = async reqParams => {
  const response = await Menu.deleteOne({ _id: reqParams.id });
  if (!response || !response.deletedCount) {
    return setResponse(404, 'Menu not found.', {});
  }
  return setResponse(200, 'Menu deleted.', {});
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
  createBulkMenu,
  deleteMenu,
};
