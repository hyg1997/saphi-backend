const mongoose = require('mongoose');

const { Schema } = mongoose;

const planSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    currency_code: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    discountText: {
      type: String,
      required: true,
    },
    perMonthText: {
      type: String,
      required: true,
    },
    months: {
      type: Number,
      required: true,
    },
    tag: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const Plan = mongoose.model('Plan', planSchema);

module.exports = {
  planSchema,
  Plan,
};
