/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const { Menu } = require('../../nutrition/menu/menuModel');
const { setResponse, validatePagination } = require('../../utils');

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

module.exports = {
  listAdminMenu,
  createBulkMenu,
  deleteMenu,
};
