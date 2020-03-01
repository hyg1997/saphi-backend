const mongoose = require('mongoose');

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
  option: [
    {
      description: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
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
