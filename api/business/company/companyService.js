/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const _ = require('lodash');
const { Company } = require('./companyModel');
const { User } = require('../../auth/user/userModel');
const { setResponse } = require('../../utils');

const checkDocument = async reqBody => {
  const filter = _.pick(reqBody, [
    'idDocumentType',
    'idDocumentNumber',
    'email',
  ]);
  filter.deleted = false;

  const company = await Company.findOne({ users: { $elemMatch: filter } });
  if (!company) return setResponse(404, 'Document not found.', {});

  let user = await User.findOne(
    _.pick(reqBody, ['idDocumentType', 'idDocumentNumber']),
  );
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
  checkDocument,
};
