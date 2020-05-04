const mongoose = require('mongoose');
const { MEAL_NAME, getDictValues } = require('../../utils/constants');

const dietSchema = new mongoose.Schema(
  {
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
            type: mongoose.Schema.Types.Mixed,
          },
        ],
      },
    ],
    indicators: {
      age: { type: Number },
      idObjective: { type: String },
      sex: { type: String },
      weight: { type: Number },
      height: { type: Number },
      idBodyFat: { type: String },
      bodyFatPercentage: { type: Number },
      idPhysicalActivity: { type: String },
    },
  },
  {
    timestamps: true,
  },
);

const Diet = mongoose.model('Diet', dietSchema);

module.exports = {
  dietSchema,
  Diet,
};
