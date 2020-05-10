const mongoose = require('mongoose');

const { Schema } = mongoose;

const culqiClientSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    token: {
      type: Schema.Types.String,
      required: true,
    },
    culqiInfo: {
      type: Schema.Types.Mixed,
      required: true,
    },
    cards: [
      {
        token: {
          type: Schema.Types.String,
          required: true,
        },
        culqiInfo: {
          type: Schema.Types.Mixed,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

culqiClientSchema.statics.findByCardToken = async token => {
  return this.findOne({ 'cards.token': token });
};

const CulqiClient = mongoose.model('CulqiClient', culqiClientSchema);

module.exports = {
  culqiClientSchema,
  CulqiClient,
};
