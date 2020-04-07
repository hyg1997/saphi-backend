const { Joi } = require('celebrate');

const { DIET_FACTORS } = require('../../utils/constants');

const UpdateOnBoarding = {
  body: {
    pathologies: Joi.array()
      .items(Joi.objectId())
      .required(),

    otherPathology: Joi.string()
      .allow('')
      .default(''),

    avoidedAliments: Joi.object({
      carbohydrate: Joi.array()
        .items(Joi.string())
        .required(),
      protein: Joi.array()
        .items(Joi.string())
        .required(),
      fat: Joi.array()
        .items(Joi.string())
        .required(),
    }).required(),

    indicators: Joi.object({
      sex: Joi.string()
        .valid('M', 'F')
        .required(),
      weight: Joi.number().required(),
      heigth: Joi.number().required(),
      idBodyFat: Joi.valid(...Object.keys(DIET_FACTORS.fatFactor)),
      bodyFatPercentage: Joi.number()
        .min(1)
        .max(100),
      idPhysicalActivity: Joi.valid(
        ...Object.keys(DIET_FACTORS.exerciseFactor),
      ).required(),
      idObjective: Joi.valid(
        ...Object.keys(DIET_FACTORS.objectiveFactor),
      ).required(),
    })
      .or('idBodyFat', 'bodyFatPercentage')
      .required(),
  },
};

module.exports = {
  UpdateOnBoarding,
};
