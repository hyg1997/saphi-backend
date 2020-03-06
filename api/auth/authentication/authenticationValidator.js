const { Joi } = require('celebrate');

const custom = {
  receiptSeries: Joi.array().items(Joi.string()),
  invoiceSeries: Joi.array().items(Joi.string()),
  secondReceiptSerie: Joi.string().default('-'),
  secondInvoiceSerie: Joi.string().default('-'),
};

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

module.exports = {
  Register,
  Login,
};
