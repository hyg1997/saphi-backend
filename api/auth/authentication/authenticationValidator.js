const { Joi } = require('celebrate');

const Register = {
  body: {
    email: Joi.string()
      .min(5)
      .max(255)
      .email()
      .required(),
    password: Joi.string()
      .min(8)
      .max(255)
      .required(),
    name: Joi.string()
      .min(1)
      .max(255)
      .required(),
    lastName: Joi.string()
      .min(1)
      .max(255)
      .required(),
  },
};

const Login = {
  body: {
    email: Joi.string()
      .min(5)
      .max(255)
      .email()
      .required(),
    password: Joi.string()
      .min(8)
      .max(255)
      .required(),
  },
};

const CheckDocument = {
  body: {
    idDocumentType: Joi.string()
      .valid('DNI', 'Pasaporte', 'CE')
      .required(),
    idDocumentNumber: Joi.string()
      .min(5)
      .max(255)
      .when('idDocumentType', {
        is: 'DNI',
        then: Joi.string().regex(/^\d{8}$/),
      })
      .required(),
  },
};

module.exports = {
  Register,
  Login,
  CheckDocument,
};
