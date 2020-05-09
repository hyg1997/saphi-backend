/* eslint-disable no-param-reassign */
const { Diet } = require('../dietModel');
const { setResponse } = require('../../../utils');

const listDiets = async reqParams => {
  const diets = await Diet.find(reqParams, 'macroContent indicators')
    .sort({ createdAt: -1 })
    .exec('find'); // TODO: Revisar si se puede retirar

  return setResponse(200, 'Diets found.', diets);
};

module.exports = { listDiets };
