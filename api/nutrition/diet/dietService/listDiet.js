/* eslint-disable no-param-reassign */
const { Diet } = require('../dietModel');
const { setResponse } = require('../../../utils');

const listDiets = async reqParams => {
  const diets = await Diet.find(
    reqParams,
    'macroContent indicators createdAt',
  ).sort({
    createdAt: -1,
  });

  return setResponse(200, 'Diets found.', diets);
};

module.exports = { listDiets };
