const { Joi } = require('celebrate');

const { DISH_RECIPE_TYPE } = require('../../utils/constants');

const List = {
  query: {
    type: Joi.string()
      .valid(DISH_RECIPE_TYPE.sauce, DISH_RECIPE_TYPE.dressing)
      .required(),
  },
};

module.exports = {
  List,
};
