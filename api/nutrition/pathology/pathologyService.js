const { Pathology } = require('./pathologyModel');
const { setResponse } = require('../../utils');

const getPathology = async reqParams => {
  const pathology = await Pathology.findById(reqParams.id);
  if (!pathology) return setResponse(404, 'Pathology not found.', {});
  return setResponse(200, 'Pathology Found.', pathology);
};

const createPathology = async reqBody => {
  const pathology = new Pathology(reqBody);
  await pathology.save();
  return setResponse(201, 'Pathology Created.', pathology);
};

const listPathology = async reqQuery => {
  const pathologys = await Pathology.find(reqQuery).sort('displayOrder');
  return setResponse(200, 'Pathologies Found.', pathologys);
};

module.exports = {
  listPathology,
  getPathology,
  createPathology,
};
