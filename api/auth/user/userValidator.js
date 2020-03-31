const { Joi } = require('celebrate');

const { DIET_FACTORS } = require('../../utils/constants');

const Post = {
  body: {
    pathologies: Joi.array()
      .items(Joi.string())
      .required(),

    otherPathology: Joi.array().items(Joi.string().allow('')),

    avoidedAliments: Joi.object({
      carbohydrate: Joi.array()
        .items(Joi.objectId())
        .required(),
      protein: Joi.array()
        .items(Joi.objectId())
        .required(),
      fat: Joi.array()
        .items(Joi.objectId())
        .required(),
    }).required(),

    indicators: Joi.object({
      idObjective: Joi.number()
        .integer()
        .valid(...Object.keys(DIET_FACTORS.objectiveFactor))
        .required(),
      sex: Joi.string()
        .valid('M', 'F')
        .required(),
      weight: Joi.number().required(),
      heigth: Joi.number().required(),
      idBodyFat: Joi.number()
        .integer()
        .valid(...Object.keys(DIET_FACTORS.fatFactor)),
      bodyFatPercentage: Joi.number(),
      idPhysicalActivity: Joi.number()
        .integer()
        .valid(...Object.keys(DIET_FACTORS.exerciseFactor))
        .required(),
    }).required(),
  },
};

module.exports = {
  Post,
};
