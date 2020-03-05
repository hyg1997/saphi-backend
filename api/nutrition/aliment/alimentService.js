const { Aliment } = require('./alimentModel');
// const { User } = require('../'); // TODO
const { setResponse } = require('../../utils');

const listAlimentUser = async reqParams => {
  // const user = await User.findById(reqParams.id);
  const listAliment = await Aliment.find({});
  // Calculate user aliment math

  return setResponse(200, 'Aliments list.', listAliment);
};

const getAliment = async reqParams => {
  const aliment = await Aliment.findById(reqParams.id);

  return setResponse(200, 'Aliment found.', aliment);
};

module.exports = {
  listAlimentUser,
  getAliment,
};
