const mongoose = require('mongoose');
const {
  ALIMENT_TYPE,
  MEAL_NAME,
  getDictValues,
} = require('../../utils/constants');

const { Schema } = mongoose;

const alimentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: getDictValues(ALIMENT_TYPE),
  },
  thumbnailImagePath: {
    type: String,
  },
  minQuantity: {
    type: Number,
    required: true,
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
  meals: [
    {
      name: {
        type: String,
        required: true,
        enum: getDictValues(MEAL_NAME),
      },
      active: {
        type: Boolean,
        required: true,
      },
    },
  ],
});

const Aliment = mongoose.model('Aliment', alimentSchema);

module.exports = {
  alimentSchema,
  Aliment,
};
