const { User } = require('../userModel');
const { Company } = require('../../../business/company/companyModel');
const { setResponse } = require('../../../utils');

const listUser = async reqQuery => {
  const users = await User.find(reqQuery);
  return setResponse(200, 'Users found.', users);
};

const readUser = async reqParams => {
  const user = await User.findById(reqParams.id);
  if (!user) return setResponse(404, 'User not found.');

  return setResponse(200, 'User found.', user);
};

const readUserByFieldIds = async reqBody => {
  const user = await User.findByIds(reqBody);
  if (!user) return setResponse(404, 'User not found.');

  return setResponse(200, 'User found.', user);
};

const createUser = async reqBody => {
  let user = await User.findByIds(reqBody);
  if (user) return setResponse(400, 'User already exists.');

  user = new User(reqBody);

  // ? En caso sea un usuario con una empresa
  if (reqBody.companyId) {
    const company = await Company.findById(reqBody.companyId);
    if (!company) return setResponse(400, 'Company not found.');
    const preRegistered = company.users.find(obj => {
      return (
        obj.idDocumentType === user.idDocumentType &&
        obj.idDocumentNumber === user.idDocumentNumber
      );
    });
    if (!preRegistered) return setResponse(400, 'User not found on company.');
    user.planSubscription = {
      active: true,
      type: 'Company Plan',
      endDate: preRegistered.endDate,
    };
    user.hasCompanyRegistration = true;
    preRegistered.registrationDate = new Date();
    await company.save();
  }

  await user.save();

  user = await User.findById(user.id, { password: 0 });

  return setResponse(201, 'User created.', user);
};

module.exports = {
  listUser,
  readUser,
  readUserByFieldIds,
  createUser,
};
