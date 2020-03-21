const { Aliment } = require('./alimentModel');
const { setResponse } = require('../../utils');

const getAliment = async reqParams => {
  const aliment = await Aliment.findById(reqParams.id);
  return setResponse(200, 'Aliment Found.', aliment);
};

const createAliment = async reqBody => {
  const aliment = new Aliment(reqBody);
  await aliment.save();
  return setResponse(201, 'Aliment Created.', aliment);
};

const listAliment = async reqQuery => {
  const aliments = await Aliment.find(reqQuery);
  return setResponse(200, 'Aliments Found.', aliments);
};

module.exports = {
  listAliment,
  getAliment,
  createAliment,
};
