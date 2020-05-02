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

const updateCompanies = async (req, res) => {
  const response = await Service.updateCompanies(req.params, req.body);

  return res.status(response.status).send(response);
};

module.exports = {
  listCompany,
  getCompany,
  createCompany,
  updateCompanies,
};
