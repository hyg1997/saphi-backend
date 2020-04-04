const { Joi } = require('celebrate');
const {
  documentPayload,
} = require('../authentication/authenticationValidator');

const CreateCompany = {
  body: {
    name: Joi.string()
      .min(2)
      .max(255)
      .required(),
    users: Joi.array().items({
      ...documentPayload,
      endDate: Joi.date()
        .iso()
        .required(),
    }),
  },
};

const UpdateCompany = {
  body: {
    name: Joi.string()
      .min(2)
      .max(255),
    users: Joi.array().items({
      ...documentPayload,
      endDate: Joi.date().iso(),
      deleted: Joi.boolean(),
    }),
  },
};

module.exports = {
  CreateCompany,
  UpdateCompany,
};
