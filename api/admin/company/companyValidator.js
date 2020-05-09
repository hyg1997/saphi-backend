const { Joi } = require('celebrate');
const {
  idDocumentValidator,
  emailValidator,
} = require('../../auth/authentication/authenticationValidator');

const companyUser = {
  ...idDocumentValidator,
  ...emailValidator,
  name: Joi.string()
    .min(1)
    .max(255)
    .required(),
  lastName: Joi.string()
    .min(1)
    .max(255)
    .required(),
  endDate: Joi.date()
    .iso()
    .required(),
  deleted: Joi.boolean().default(false),
};

const CreateCompany = {
  body: {
    name: Joi.string()
      .min(2)
      .max(255)
      .required(),
    users: Joi.array().items(companyUser),
  },
};

const UpdateCompanies = {
  body: {
    data: Joi.array().items({
      companyName: Joi.string()
        .min(1)
        .max(255)
        .required(),
      ...companyUser,
    }),
  },
};

module.exports = {
  CreateCompany,
  UpdateCompanies,
};
