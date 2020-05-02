const Service = require('./companyService');

const checkDocument = async (req, res) => {
  const company = await Service.checkDocument(req.body);

  return res.status(company.status).send(company);
};

module.exports = {
  checkDocument,
};
