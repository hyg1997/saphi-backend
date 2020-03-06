const Service = require('./alimentService');

const listAlimentUser = async (req, res) => {
  const aliments = await Service.listAlimentUser(req.query);

  return res.status(aliments.status).send(aliments);
};

const getAliment = async (req, res) => {
  const aliment = await Service.getAliment(req.params);

  return res.status(aliment.status).send(aliment);
};

module.exports = {
  listAlimentUser,
  getAliment,
};
