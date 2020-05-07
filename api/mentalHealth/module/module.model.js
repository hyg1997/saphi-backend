const mongoose = require('mongoose');

const { Schema } = mongoose;
const moduleSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      name: {
        type: String,
        required: true,
      },
      displayOrder: {
        type: Number,
        required: true,
      },
    },
    mediumImage: {
      type: String,
      required: true,
    },
    largeImage: {
      type: String,
      required: true,
    },
    displayOrder: {
      type: Number,
      required: true,
    },
    activities: [
      {
        type: new Schema({
          name: {
            type: String,
            required: true,
          },
          type: {
            type: String,
            required: true,
          },
          duration: {
            type: String,
            required: true,
          },
          displayOrder: {
            type: Number,
            required: true,
          },
          content: {
            type: mongoose.Mixed,
          },
        }),
      },
      {
        timestamps: true,
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Module = mongoose.model('Module', moduleSchema);

module.exports = {
  moduleSchema,
  Module,
};
