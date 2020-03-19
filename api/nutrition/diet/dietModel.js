const mongoose = require('mongoose');
const { MEAL_NAME, getDictValues } = require('../../utils/constants');

const dietSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
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
      aliments: [
        {
          aliment: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Aliment',
          },
          name: {
            type: String,
            required: true,
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
        },
      ],
    },
  ],
});

const Diet = mongoose.model('Diet', dietSchema);

module.exports = {
  dietSchema,
  Diet,
};
