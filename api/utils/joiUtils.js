const { Joi } = require('celebrate');

const Pagination = {
  query: {
    size: Joi.number()
      .integer()
      .min(1)
      .required(),
    page: Joi.number()
      .integer()
      .min(1)
      .default(1),
  },
};

module.exports = {
  Pagination,
};
