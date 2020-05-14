const { Joi } = require('celebrate');

const { DOCUMENT_TYPE, getDictValues } = require('../../utils/constants');

const idDocumentValidator = {
  idDocumentType: Joi.string()
    .valid(...getDictValues(DOCUMENT_TYPE))
    .required(),
  idDocumentNumber: Joi.string()
    .trim()
    .max(255)
    .when('idDocumentType', {
      is: DOCUMENT_TYPE.DNI,
      then: Joi.string().regex(/^\d{8}$/),
    })
    .required(),
};
const emailValidator = {
  email: Joi.string()
    .lowercase()
    .trim()
    .min(5)
    .max(255)
    .email()
    .required(),
};

const passwordValidator = {
  password: Joi.string()
    .min(8)
    .max(255)
    .required(),
};

const registerPayload = {
  ...idDocumentValidator,
  ...emailValidator,
  name: Joi.string()
    .trim()
    .min(1)
    .max(255)
    .required(),
  lastName: Joi.string()
    .trim()
    .min(1)
    .max(255)
    .required(),
  phonePrefix: Joi.string()
    .min(1)
    .max(255),
  phoneNumber: Joi.string()
    .trim()
    .min(1)
    .max(255),
  companyName: Joi.string()
    .trim()
    .min(1)
    .max(255)
    .allow(''),
  companyId: Joi.objectId(),
};

const Register = {
  body: {
    ...passwordValidator,
    ...registerPayload,
  },
};

const Login = {
  body: Joi.object({
    email: emailValidator.email.optional().default('empty@email.com'),
    idDocumentType: idDocumentValidator.idDocumentType.optional(),
    idDocumentNumber: idDocumentValidator.idDocumentNumber.optional(),
    ...passwordValidator,
  })
    // .xor('email', 'idDocumentType')
    .and('idDocumentType', 'idDocumentNumber'),
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

const CheckDocument = {
  body: {
    ...idDocumentValidator,
    ...emailValidator,
  },
};

module.exports = {
  Register,
  Login,
  CheckDocument,
  RegisterGoogleFacebook,
  LoginGoogleFacebook,

  idDocumentValidator,
  emailValidator,
  passwordValidator,
};
