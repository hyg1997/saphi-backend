const { Joi } = require('celebrate');

const { MENU_TYPE } = require('../../utils/constants');

const Bulk = {
  body: {
    data: Joi.array().items({
      name: Joi.string()
        .min(1)
        .max(255)
        .required(),
      type: Joi.string()
        .valid(MENU_TYPE.lunch, MENU_TYPE.dinner)
        .required(),
      date: Joi.date()
        .iso()
        .required(),
    }),
  },
};

module.exports = {
  Bulk,
};
