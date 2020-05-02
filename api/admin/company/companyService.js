/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const _ = require('lodash');
const { Company } = require('../../business/company/companyModel');
const { setResponse, validatePagination } = require('../../utils');

const getCompany = async reqParams => {
  const company = await Company.findById(reqParams.id);
  if (!company) return setResponse(404, 'Company not found.', {});
  return setResponse(200, 'Company Found.', company);
};

const createCompany = async reqBody => {
  const company = new Company(reqBody);
  await company.save();
  return setResponse(201, 'Company Created.', company);
};

const updateCompanies = async (reqParams, reqBody) => {
  const companies = {};
  reqBody.data.forEach(item => {
    const users = _.get(companies, item.companyName, []);
    users.push(_.omit(item, ['nameCompany']));
    companies[item.companyName] = users;
  });

  for (const [companyName, newUsers] of Object.entries(companies)) {
    let company = await Company.findOne({ name: companyName });
    if (!company) {
      company = new Company({ name: companyName });
      await company.save();
    }

    newUsers.forEach(userUpdate => {
      const userDB = company.users.find(
        elem =>
          elem.idDocumentType === userUpdate.idDocumentType &&
          elem.idDocumentNumber === userUpdate.idDocumentNumber,
      );

      if (userDB) {
        Object.assign(userDB, userUpdate);
      } else {
        company.users.push(userUpdate);
      }
    });

    await company.save();
  }

  return setResponse(200, 'Companies Updated.', {});
};

const listCompany = async reqQuery => {
  const total = await Company.countDocuments();
  const resp = validatePagination(total, reqQuery.page, reqQuery.size);
  if (resp.status !== 200) return resp;
  const items = await Company.find({})
    .sort({ createdAt: -1 })
    .skip(resp.data.skip)
    .limit(reqQuery.size)
    .exec('find');

  return setResponse(200, 'Companies found.', {
    total,
    numPages: resp.data.numPages,
    page: reqQuery.page,
    items,
  });
};

module.exports = {
  listCompany,
  getCompany,
  createCompany,
  updateCompanies,
};
