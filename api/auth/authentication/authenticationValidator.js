const { Joi } = require('celebrate');

const { DOCUMENT_TYPE } = require('../../utils/constants');

const registerPayload = {
  idDocumentType: Joi.string()
    .valid(DOCUMENT_TYPE.DNI, DOCUMENT_TYPE.CE, DOCUMENT_TYPE.PASSPORT)
    .required(),
  idDocumentNumber: Joi.string()
    .min(1)
    .required(),
  email: Joi.string()
    .min(5)
    .max(255)
    .email()
    .required(),
  name: Joi.string()
    .min(1)
    .max(255)
    .required(),
  lastName: Joi.string()
    .min(1)
    .max(255)
    .required(),
  phonePrefix: Joi.string()
    .min(1)
    .max(255),
  phoneNumber: Joi.string()
    .min(1)
    .max(255),
  companyName: Joi.string()
    .min(1)
    .max(255),
};

const Register = {
  body: {
    password: Joi.string()
      .min(6)
      .max(255)
      .required(),
    ...registerPayload,
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
      .min(6)
      .max(255)
      .required(),
  },
};

const RegisterGoogleFacebook = {
  body: {
    access_token: Joi.string().required(),
    ...registerPayload,
  },
};

const LoginGoogleFacebook = {
  body: {
    access_token: Joi.string().required(),
  },
};

module.exports = {
  Register,
  Login,
  RegisterGoogleFacebook,
  LoginGoogleFacebook,
};
