const mongoose = require('mongoose');

const { DOCUMENT_TYPE } = require('../../utils/constants');

const { Schema } = mongoose;
const companySchema = new Schema(
  {
    name: { type: String, required: true },
    users: [
      {
        idDocumentType: {
          type: String,
          enum: [DOCUMENT_TYPE.DNI, DOCUMENT_TYPE.CE, DOCUMENT_TYPE.PASSPORT],
        },
        idDocumentNumber: { type: String },

        name: { type: String },
        lastName: { type: String },
        email: { type: String },

        endDate: { type: Date },
        deleted: { type: Boolean, default: false },
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
