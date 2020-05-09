const mongoose = require('mongoose');

const { Schema } = mongoose;
const schema = new Schema(
  {},
  {
    strict: false,
    timestamps: true,
  },
);

const ApiLog = mongoose.model('ApiLog', schema);

module.exports = {
  ApiLog,
};
