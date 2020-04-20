const { Joi } = require('celebrate');
const moment = require('moment-timezone');

const { MENU_TYPE } = require('../../utils/constants');

const List = {
  query: {
    businessdays: Joi.number()
      .integer()
      .min(1)
      .max(60)
      .default(30),
    startdate: Joi.date()
      .iso()
      .default(moment.tz('America/Lima').format('YYYY-MM-DD')),
  },
};

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

const Get = {
  params: {
    id: Joi.string().required(),
  },
};

const Post = {
  body: {
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
  },
};

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
  List,
  Pagination,
  Get,
  Post,
  Bulk,
};
