const { Aliment } = require('./alimentModel');
const { setResponse } = require('../../utils');

const getAliment = async reqParams => {
  const aliment = await Aliment.findById(reqParams.id);
  // ! Que ocurre si el alimento no existe?
  return setResponse(200, 'Aliment Found.', aliment);
};

const createAliment = async reqBody => {
  const aliment = new Aliment(reqBody);
  await aliment.save();
  // ! Que ocurre si el body no es correcto?
  // ! Se puede solicionar al incluir un validator y garantizar que el
  // ! body del request tiene el formato deseado
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
