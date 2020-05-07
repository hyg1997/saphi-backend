/* eslint-disable no-param-reassign */
const { Module } = require('./module.model');
const { setResponse } = require('../../utils');

const getModule = async reqParams => {
  const module = await Module.findById(reqParams.id);
  if (!module) return setResponse(404, 'Module not found');
  return setResponse(200, 'Module Found', module);
};

const listModule = async reqQuery => {
  const modules = await Module.find(reqQuery);

  modules.sort((a, b) =>
    a.category.displayOrder !== b.category.displayOrder
      ? a.category.displayOrder > b.category.displayOrder
      : a.displayOrder > b.displayOrder,
  );

  const sortedModules = modules.reduce((acc, val) => {
    if (acc.length === 0 || acc[acc.length - 1]) acc.push([]);
    acc[acc.length - 1].push(val);
    return acc;
  }, []);

  return setResponse(200, 'Modules Found', sortedModules);
};

module.exports = {
  getModule,
  listModule,
};
