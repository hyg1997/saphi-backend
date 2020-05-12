const { Joi } = require('celebrate');
const { MEAL_NAME } = require('../../utils/constants');

const SetMeals = {
  body: {},
};

Object.values(MEAL_NAME).forEach(tag => {
  SetMeals.body[tag] = Joi.bool();
});

module.exports = {
  SetMeals,
};
