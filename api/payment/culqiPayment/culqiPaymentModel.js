const mongoose = require('mongoose');

const { Schema } = mongoose;

const culqiPaymentSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    amount: { type: Number, required: true },
    culqiInfo: { type: Schema.Types.Mixed, required: true },
  },
  {
    timestamps: true,
  },
);

const CulqiPayment = mongoose.model('CulqiPayment', culqiPaymentSchema);

module.exports = {
  culqiPaymentSchema,
  CulqiPayment,
};
