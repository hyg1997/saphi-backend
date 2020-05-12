const { Joi } = require('celebrate');

const setMacrosOnUser = {
  body: {
    carbohydrate: Joi.number()
      .min(0)
      .required(),
    protein: Joi.number()
      .min(0)
      .required(),
    fat: Joi.number()
      .min(0)
      .required(),
    message: Joi.string()
      .min(1)
      .max(1000)
      .default(''),
  },
};

module.exports = {
  setMacrosOnUser,
};
