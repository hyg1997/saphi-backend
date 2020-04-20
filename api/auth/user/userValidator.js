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
      height: Joi.number().required(),
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

const ForgotPassword = {
  body: {
    email: Joi.string()
      .lowercase()
      .trim()
      .min(5)
      .max(255)
      .email()
      .required(),
  },
};

const CheckCode = {
  body: {
    ...ForgotPassword.body,
    code: Joi.string()
      .trim()
      .min(4)
      .max(4)
      .required(),
  },
};

const ResetPassword = {
  body: {
    ...CheckCode.body,
    newPassword: Joi.string()
      .trim()
      .min(6)
      .max(255)
      .required(),
  },
};

module.exports = {
  UpdateOnBoarding,
  ForgotPassword,
  CheckCode,
  ResetPassword,
};
