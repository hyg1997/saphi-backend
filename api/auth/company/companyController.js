const Service = require('./companyService');

const getCompany = async (req, res) => {
  const company = await Service.getCompany(req.params);

  return res.status(company.status).send(company);
};

const listCompany = async (req, res) => {
  const companys = await Service.listCompany(req.query);

  return res.status(companys.status).send(companys);
};

const createCompany = async (req, res) => {
  const company = await Service.createCompany(req.body);

  return res.status(company.status).send(company);
};

const checkDocument = async (req, res) => {
  const company = await Service.checkDocument(req.body);

  return res.status(company.status).send(company);
};

module.exports = {
  listCompany,
  getCompany,
  createCompany,
  checkDocument,
};
