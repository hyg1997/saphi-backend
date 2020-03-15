const mongoose = require('mongoose');

const { DELIVERY_ORDER_PLAN_TYPE } = require('../../utils/constants');

const { Schema } = mongoose;
const deliveryPlanSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  periodTime: {
    type: String,
    required: true,
  },
  discountText: {
    type: String,
    required: false,
  },
  planDuration: {
    type: Number,
    required: true,
  },
  option: [
    {
      planType: {
        type: String,
        required: true,
        enum: [
          DELIVERY_ORDER_PLAN_TYPE.lunch,
          DELIVERY_ORDER_PLAN_TYPE.complete,
        ],
      },
      description: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      currency_code: {
        type: String,
        required: true,
      },
    },
  ],
});

const DeliveryPlan = mongoose.model('DeliveryPlan', deliveryPlanSchema);

module.exports = {
  deliveryPlanSchema,
  DeliveryPlan,
};
