const mongoose = require('mongoose');

const { Schema } = mongoose;
const companySchema = new Schema(
  {
    name: { type: String, required: true },
    users: [
      {
        idDocumentType: { type: String },
        idDocumentNumber: { type: String },
        endDate: { type: Date },
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Company = mongoose.model('Company', companySchema);

module.exports = {
  companySchema,
  Company,
};
