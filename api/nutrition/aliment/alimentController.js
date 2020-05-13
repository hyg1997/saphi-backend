const Service = require('./alimentService');

const getAliment = async (req, res) => {
  const response = await Service.getAliment(req.params);

  return res.status(response.status).send(response);
};

const listAliment = async (req, res) => {
  const response = await Service.listAliment(req.query);

  return res.status(response.status).send(response);
};

const listCategories = async (req, res) => {
  const response = await Service.listCategories(req.query);

  return res.status(response.status).send(response);
};

const createAliment = async (req, res) => {
  const response = await Service.createAliment(req.body);

  return res.status(response.status).send(response);
};

module.exports = {
  listAliment,
  getAliment,
  createAliment,
  listCategories,
};
