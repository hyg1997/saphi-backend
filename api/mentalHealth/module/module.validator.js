const { Joi } = require('celebrate');

const Get = {
  params: {
    identifier: Joi.string().required(),
  },
};

const List = {
  query: {},
};

module.exports = {
  Get,
  List,
};
