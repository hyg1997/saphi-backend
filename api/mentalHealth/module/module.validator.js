const { Joi } = require('celebrate');

const Get = {
  params: {
    id: Joi.objectId(),
  },
};

const List = {
  query: {},
};

module.exports = {
  Get,
  List,
};
