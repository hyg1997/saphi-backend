const Service = require('./pathologyService');

const getPathology = async (req, res) => {
  const pathology = await Service.getPathology(req.params);

  return res.status(pathology.status).send(pathology);
};

const listPathology = async (req, res) => {
  const pathologys = await Service.listPathology(req.query);

  return res.status(pathologys.status).send(pathologys);
};

const createPathology = async (req, res) => {
  const pathology = await Service.createPathology(req.body);

  return res.status(pathology.status).send(pathology);
};

module.exports = {
  listPathology,
  getPathology,
  createPathology,
};
