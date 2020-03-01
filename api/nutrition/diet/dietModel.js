const mongoose = require('mongoose');

const dietSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
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

const Diet = mongoose.model('Diet', dietSchema);

module.exports = {
  dietSchema,
  Diet,
};
