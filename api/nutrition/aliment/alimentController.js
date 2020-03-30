const Service = require('./alimentService');

const getAliment = async (req, res) => {
  const aliment = await Service.getAliment(req.params);

  return res.status(aliment.status).send(aliment);
};

const listAliment = async (req, res) => {
  const aliments = await Service.listAliment(req.query);

  return res.status(aliments.status).send(aliments);
};

const listCategories = async (req, res) => {
  const aliments = await Service.listCategories(req.query);

  return res.status(aliments.status).send(aliments);
};

const createAliment = async (req, res) => {
  const aliment = await Service.createAliment(req.body);

  return res.status(aliment.status).send(aliment);
};

module.exports = {
  listAliment,
  getAliment,
  createAliment,
  listCategories,
};
