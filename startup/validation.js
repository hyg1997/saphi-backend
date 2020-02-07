/* eslint-disable global-require */
const { Joi } = require('celebrate');

module.exports = () => {
  Joi.objectId = require('joi-objectid')(Joi);
};
