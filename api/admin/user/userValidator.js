const { Joi } = require('celebrate');

const setMacrosOnUser = {
  body: {
    carbohydrate: Joi.number()
      .integer()
      .required(),
    protein: Joi.number()
      .integer()
      .required(),
    fat: Joi.number()
      .integer()
      .required(),
    message: Joi.string()
      .min(1)
      .max(1000)
      .required(),
  },
};

module.exports = {
  setMacrosOnUser,
};
