const mongoose = require('mongoose');

const { Schema } = mongoose;

// ! Añadir timestamps a todos los modelos

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

const CulqiClient = mongoose.model('CulqiClient', culqiClientSchema);

module.exports = {
  culqiClientSchema,
  CulqiClient,
};
