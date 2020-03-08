const { Aliment } = require('./alimentModel');
// const { User } = require('../'); // TODO
const { setResponse } = require('../../utils');

const formatAliment = async (diet, aliment) => {
  // TODO: Calculate
  return aliment;
};

const listAlimentUser = async reqQuery => {
  // const user = await User.findById(?);
  let listAliment = await Aliment.find(reqQuery);
  // TODO: Get diet
  const diet = {};

  listAliment = listAliment.map(value => formatAliment(diet, value));
  return setResponse(200, 'Aliments list.', listAliment);
};

const getAliment = async reqParams => {
  const aliment = await Aliment.findById(reqParams.id);
  // TODO: Get Diet
  const diet = {};
  const alimentData = formatAliment(diet, aliment);
  return setResponse(200, 'Aliments Found.', alimentData);
};

module.exports = {
  listAlimentUser,
  getAliment,
};
