const _ = require('lodash');
const { Company } = require('./companyModel');
const { User } = require('../user/userModel');
const { setResponse } = require('../../utils');

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

const updateCompany = async (reqParams, reqBody) => {
  const company = await Company.findById(reqParams.id);

  const newCompany = { name: company.name, users: company.users };

  if (reqBody.name) newCompany.name = reqBody.name;
  if (reqBody.users) {
    reqBody.users.forEach(userUpdate => {
      const userDB = newCompany.users.find(
        elem =>
          elem.idDocumentType === userUpdate.idDocumentType &&
          elem.idDocumentNumber === userUpdate.idDocumentNumber,
      );

      if (userDB) {
        Object.assign(userDB, userUpdate);
      } else {
        newCompany.users.push(userDB);
      }
    });
  }

  Company.findByIdAndUpdate(reqParams.id, newCompany);
  return setResponse(200, 'Company Updated.', company);
};

const listCompany = async reqQuery => {
  const companys = await Company.find(reqQuery);
  return setResponse(200, 'Companys Found.', companys);
};

const checkDocument = async reqBody => {
  const filter = _.pick(reqBody, [
    'idDocumentType',
    'idDocumentNumber',
    'email',
  ]);
  filter.deleted = false;

  const company = await Company.findOne({ users: { $elemMatch: filter } });
  if (!company) return setResponse(404, 'Document not found.', {});

  let user = await User.findOne(filter);
  if (user) return setResponse(400, 'User already exists.', {});

  user = company.users.find(obj => {
    return (
      obj.idDocumentType === filter.idDocumentType &&
      obj.idDocumentNumber === filter.idDocumentNumber &&
      obj.email === filter.email
    );
  });
  const data = {
    companyId: company.id,
    companyName: company.name,
    name: user.name,
    lastname: user.lastName,
    email: user.email,
  };
  return setResponse(200, 'Document Found.', data);
};

module.exports = {
  listCompany,
  getCompany,
  createCompany,
  updateCompany,
  checkDocument,
};
