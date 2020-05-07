const { Joi } = require('celebrate');

const Get = {
  params: {
    id: Joi.objectId(),
  },
};

const GetSub = {
  params: {
    id: Joi.objectId(),
    subId: Joi.objectId(),
  },
};

const List = {
  query: {},
};

module.exports = {
  Get,
  GetSub,
  List,
};
