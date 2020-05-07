const Service = require('./module.service');

const getModule = async (req, res) => {
  const response = await Service.getModule(req.params);
  return res.status(response.status).send(response);
};

const listModule = async (req, res) => {
  const response = await Service.listModule(req.query);
  return res.status(response.status).send(response);
};

module.exports = {
  getModule,
  listModule,
};
