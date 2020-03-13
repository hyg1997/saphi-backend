const { Joi } = require('celebrate');

const { DELIVERY_ORDER_PLAN_TYPE } = require('../../utils/constants');

const Post = {
  body: {
    deliveryPlan: Joi.objectId().required(),
    deliveryPlanType: Joi.string()
      .valid(DELIVERY_ORDER_PLAN_TYPE.lunch, DELIVERY_ORDER_PLAN_TYPE.complete)
      .required(),
    startDate: Joi.date()
      .iso()
      .required(),
    contactName: Joi.string().required(),
    contactPhone: Joi.string().required(),
    deliveryAddress: Joi.string().required(),
    deliveryInstruction: Joi.string()
      .allow('')
      .default(''),
    payment: Joi.object({
      culqiToken: Joi.string().required(),
    }).required(),
  },
};

module.exports = {
  Post,
};
