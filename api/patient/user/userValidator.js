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

const ContactForm = {
  body: {
    name: Joi.string().max(255),
    lastName: Joi.string().max(255),
    email: Joi.string()
      .lowercase()
      .trim()
      .min(5)
      .max(255)
      .email(),
    rating: Joi.number().integer(),
    subject: Joi.string()
      .max(255)
      .default('Contacto SaphiApp'),
    message: Joi.string()
      .max(5000)
      .required(),
  },
};

module.exports = {
  UpdateOnBoarding,
  ContactForm,
};
