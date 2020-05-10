const Service = require('./culqiClientService');

const createCulqiClient = async (req, res) => {
  const client = await Service.createCulqiClient(req.body, req.user);

  return res.status(client.status).send(client);
};

const listCulqiClientCards = async (req, res) => {
  const clients = await Service.listCulqiClientCards(req.user);

  return res.status(clients.status).send(clients);
};

module.exports = {
  createCulqiClient,
  listCulqiClientCards,
};
