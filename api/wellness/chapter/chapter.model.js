const mongoose = require('mongoose');
const { PROGESS_STATUS, getDictValues } = require('../../utils/constants');

const { Schema } = mongoose;

const moduleSchema = new Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true, default: 'general' },
    displayOrder: { type: Number, required: true },
  },
  { timestamps: true },
);

const Module = mongoose.model('Module', moduleSchema);

const chapterSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    module: moduleSchema,
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
          initialState: {
            type: String,
            enum: getDictValues(PROGESS_STATUS),
            default: PROGESS_STATUS.locked,
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

const Chapter = mongoose.model('Chapter', chapterSchema);

module.exports = {
  chapterSchema,
  Chapter,
  Module,
};
