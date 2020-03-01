const mongoose = require('mongoose');

const { Schema } = mongoose;
const deliveryOrderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  orderDate: {
    type: Date,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  planDuration: {
    type: Number,
    required: true,
  },
  planType: {
    type: String,
    required: true,
    enum: ['almuerzo', 'cena', 'completo'],
  },
});

const DeliveryOrder = mongoose.model('DeliveryOrder', deliveryOrderSchema);

module.exports = {
  deliveryOrderSchema,
  DeliveryOrder,
};
