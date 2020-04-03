const { Joi } = require('celebrate');
const { CheckDocument } = require('../authentication/authenticationValidator');

const CreateCompany = {
  body: {
    name: Joi.string()
      .min(2)
      .max(255)
      .required(),
    users: Joi.array().items({
      ...CheckDocument.body,
      endDate: Joi.date()
        .iso()
        .required(),
    }),
  },
};

const AddUser = {
  body: {
    company: Joi.objectId().required(),
    users: CreateCompany.body.users,
  },
};

module.exports = {
  CreateCompany,
  AddUser,
};
