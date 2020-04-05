const mongoose = require('mongoose');
// const {} = require('../../utils/constants');

const { Schema } = mongoose;

const pathologySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Pathology = mongoose.model('Pathology', pathologySchema);

module.exports = {
  pathologySchema,
  Pathology,
};
