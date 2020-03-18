const mongoose = require('mongoose');
const { addBussinesDays } = require('../../utils');

const { Schema } = mongoose;
const deliveryOrderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  contactName: {
    type: String,
    required: true,
  },
  contactPhone: {
    type: String,
    required: true,
  },
  deliveryAddress: {
    type: String,
    required: true,
  },
  deliveryInstruction: {
    type: String,
    default: '',
  },
  deliveryPlan: {
    type: Schema.Types.Mixed,
    required: true,
  },
  culqiPayment: {
    type: Schema.Types.Mixed,
    required: true,
  },
});

deliveryOrderSchema.pre('validate', function() {
  this.endDate = addBussinesDays(
    this.startDate,
    this.deliveryPlan.planDuration - 1,
  );
});

const DeliveryOrder = mongoose.model('DeliveryOrder', deliveryOrderSchema);

module.exports = {
  deliveryOrderSchema,
  DeliveryOrder,
};
