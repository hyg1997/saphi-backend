const mongoose = require('mongoose');

const { Schema } = mongoose;

const alimentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['carbohidrato', 'proteína'],
  },
  thumbnailImagePath: {
    type: String,
  },
  units: {
    type: String,
    required: true,
  },
  macroContent: {
    carbohydrate: {
      type: Number,
      required: true,
    },
    protein: {
      type: Number,
      required: true,
    },
    fat: {
      type: Number,
      required: true,
    },
  },
});

const Aliment = mongoose.model('Aliment', alimentSchema);

module.exports = {
  alimentSchema,
  Aliment,
};
